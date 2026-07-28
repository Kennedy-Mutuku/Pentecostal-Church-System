const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const AdmissionAdmin = require('../models/admissionAdmin');
const Family = require('../models/family');

// Attach a user to a family's members list (idempotent) and stamp their family/relation fields.
// Does not save() the user - caller is responsible for persisting both docs.
async function attachMemberToFamily(family, user, relationToHead) {
  const alreadyMember = family.members.some((m) => m.toString() === user._id.toString());
  if (!alreadyMember) {
    family.members.push(user._id);
  }
  user.family = family._id;
  user.relationToHead = relationToHead || null;
}

// Admin login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const admin = await AdmissionAdmin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_ADMISSION_ADMIN_SECRET, { expiresIn: '2h' });

        // Clear user session cookies to avoid conflicts
        res.clearCookie('user_s');
        res.clearCookie('socket_token');

        res.cookie('admission_admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error logging in', error });
    }
};

// Admin logout
exports.logout = (req, res) => {
    res.clearCookie('admission_admin_token', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
    });
    res.status(200).json({ message: 'Logout successful' });
};

// Admit new user (equivalent to the old signup functionality)
exports.admitUser = async (req, res) => {
    try {
        const {
            username, email, idNumber, gender, ageGroup, yearJoined, residence, phone,
            familyRole, familyName, familyId, relationToHead,
        } = req.body;

        const role = familyRole || 'independent';

        if (role === 'joinFamily') {
            // Minimal-fields path for dependents/spouses joining an existing family.
            if (!username || !ageGroup || !familyId || !relationToHead) {
                return res.status(400).json({ message: 'Name, Age Group, Family and Relationship are required' });
            }

            if (phone && !/^0\d{9}$/.test(phone)) {
                return res.status(400).json({ message: 'Invalid phone number format', field: 'phone' });
            }

            const family = await Family.findById(familyId);
            if (!family) {
                return res.status(404).json({ message: 'Selected family not found', field: 'familyId' });
            }

            if (email) {
                const emailExists = await User.findOne({ email: email.toLowerCase() });
                if (emailExists) return res.status(400).json({ message: 'Email already exists', field: 'email' });
            }
            if (phone) {
                const phoneExists = await User.findOne({ phone });
                if (phoneExists) return res.status(400).json({ message: 'Phone number already exists', field: 'phone' });
            }
            if (idNumber) {
                const idExists = await User.findOne({ idNumber });
                if (idExists) return res.status(400).json({ message: 'ID Number already exists', field: 'idNumber' });
            }

            const hashedPassword = phone ? await bcrypt.hash(phone, 10) : undefined;

            const newUser = new User({
                username,
                ageGroup,
                gender: gender || undefined,
                yearJoined: yearJoined || undefined,
                residence: residence || undefined,
                email: email ? email.toLowerCase() : undefined,
                phone: phone || undefined,
                idNumber: idNumber || undefined,
                password: hashedPassword,
            });

            await attachMemberToFamily(family, newUser, relationToHead);
            await newUser.save();
            await family.save();

            return res.status(201).json({ message: 'Family member admitted successfully!' });
        }

        // independent / newFamily: today's full-fields flow, unchanged validation.
        if (!username || !email || !phone || !idNumber || !gender || !ageGroup || !yearJoined || !residence) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (role === 'newFamily' && !familyName) {
            return res.status(400).json({ message: 'Family name is required', field: 'familyName' });
        }

        // Check each unique field individually to give a precise conflict message
        const emailExists = await User.findOne({ email: email.toLowerCase() });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists', field: 'email' });
        }
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            return res.status(400).json({ message: 'Phone number already exists', field: 'phone' });
        }
        const idExists = await User.findOne({ idNumber });
        if (idExists) {
            return res.status(400).json({ message: 'ID Number already exists', field: 'idNumber' });
        }

        console.log('Admitting new user:', {
            username,
            phone,
            yearJoined,
            idNumber,
            gender,
            ageGroup,
            residence,
            email
        });

        // Use phone number as default password and hash it
        const hashedPassword = await bcrypt.hash(phone, 10);

        // Create new user directly (no email verification needed for admin admission)
        const newUser = new User({
            username,
            password: hashedPassword,
            email: email.toLowerCase(),
            residence,
            phone,
            idNumber,
            gender,
            ageGroup,
            yearJoined,
        });

        if (role === 'newFamily') {
            const family = new Family({
                familyName,
                headOfFamily: newUser._id,
                members: [newUser._id],
                residence: residence || null,
            });
            newUser.family = family._id;
            newUser.relationToHead = 'Head';
            await newUser.save();
            await family.save();
        } else {
            await newUser.save();
        }

        res.status(201).json({ message: 'User admitted successfully!' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error admitting user', error });
    }
};

// Get all users for management
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(
            {},
            'username email phone idNumber gender ageGroup yearJoined residence profilePhoto family relationToHead'
        )
            .populate('family', 'familyName residence')
            .sort({ username: 1 });
        res.status(200).json(users);
    } catch (error) {
        console.log('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Reset user password to their phone number
exports.resetUserPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;
        
        if (!userId || !newPassword) {
            return res.status(400).json({ message: 'User ID and new password are required' });
        }

        // Hash the new password (phone number)
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User found' });
        }

        console.log(`Password reset for user ${updatedUser.username} (${updatedUser.email}) to: ${newPassword}`);
        
        res.status(200).json({ 
            message: 'Password reset successfully',
            newPassword: newPassword
        });
    } catch (error) {
        console.log('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password', error });
    }
};

// Update user details (Admission Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, phone, idNumber, gender, ageGroup, yearJoined, residence, relationToHead } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!username) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Check if email/phone/idNumber already exists for another user (only for provided, non-empty fields)
        const orConditions = [];
        if (email) orConditions.push({ email: email.toLowerCase() });
        if (phone) orConditions.push({ phone });
        if (idNumber) orConditions.push({ idNumber });

        if (orConditions.length) {
            const existingUser = await User.findOne({ _id: { $ne: userId }, $or: orConditions });
            if (existingUser) {
                let conflictField = '';
                if (email && existingUser.email === email.toLowerCase()) conflictField = 'Email';
                else if (phone && existingUser.phone === phone) conflictField = 'Phone';
                else if (idNumber && existingUser.idNumber === idNumber) conflictField = 'ID number';

                return res.status(400).json({ message: `${conflictField} already exists for another user` });
            }
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const update = { username };
        if (email !== undefined) update.email = email ? email.toLowerCase() : undefined;
        if (phone !== undefined) update.phone = phone || undefined;
        if (idNumber !== undefined) update.idNumber = idNumber || undefined;
        if (gender !== undefined) update.gender = gender || undefined;
        if (ageGroup !== undefined) update.ageGroup = ageGroup || undefined;
        if (yearJoined !== undefined) update.yearJoined = yearJoined || undefined;
        if (residence !== undefined) update.residence = residence || undefined;
        if (relationToHead !== undefined) update.relationToHead = relationToHead || null;

        // Graduation: a dependent gaining their first phone number becomes login-capable.
        // Only fires on the no-password -> has-phone transition, never overwrites an existing password.
        if (phone && !targetUser.password) {
            update.password = await bcrypt.hash(phone, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            update,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`User details updated by admin: ${updatedUser.username} (${updatedUser.email})`);

        res.status(200).json({
            message: 'User details updated successfully!',
            user: updatedUser
        });
    } catch (error) {
        console.log('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user details', error: error.message });
    }
};

// List all families with members populated (used by the "Join Existing Family" picker)
exports.getAllFamilies = async (req, res) => {
    try {
        const families = await Family.find()
            .populate('headOfFamily', 'username')
            .populate('members', 'username relationToHead gender ageGroup phone email idNumber profilePhoto')
            .sort({ familyName: 1 });
        res.status(200).json(families);
    } catch (error) {
        console.log('Error fetching families:', error);
        res.status(500).json({ message: 'Error fetching families', error });
    }
};

// Get a single family with members populated
exports.getFamily = async (req, res) => {
    try {
        const { familyId } = req.params;
        const family = await Family.findById(familyId)
            .populate('headOfFamily', 'username')
            .populate('members', 'username relationToHead gender ageGroup phone email idNumber profilePhoto');

        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }

        res.status(200).json(family);
    } catch (error) {
        console.log('Error fetching family:', error);
        res.status(500).json({ message: 'Error fetching family', error });
    }
};

// Retroactively link two existing members into a family (creating one if the head has none yet)
exports.linkFamilyMembers = async (req, res) => {
    try {
        const { headUserId, memberUserId, relationToHead, familyName } = req.body;

        if (!headUserId || !memberUserId || !relationToHead) {
            return res.status(400).json({ message: 'Head member, member to link, and relationship are required' });
        }
        if (headUserId === memberUserId) {
            return res.status(400).json({ message: 'Cannot link a member to themselves.' });
        }

        const headUser = await User.findById(headUserId);
        const memberUser = await User.findById(memberUserId);
        if (!headUser || !memberUser) {
            return res.status(404).json({ message: 'One or both users were not found' });
        }

        let family;
        if (headUser.family) {
            family = await Family.findById(headUser.family);
            if (!family) {
                return res.status(404).json({ message: "Head member's family could not be found" });
            }
        } else {
            if (!familyName) {
                return res.status(400).json({ message: 'Family name is required to start a new family', field: 'familyName' });
            }
            family = new Family({ familyName, headOfFamily: headUser._id, members: [] });
            await attachMemberToFamily(family, headUser, 'Head');
        }

        if (memberUser.family && memberUser.family.toString() === family._id.toString()) {
            return res.status(400).json({ message: 'These members are already in the same family.' });
        }
        if (memberUser.family && memberUser.family.toString() !== family._id.toString()) {
            const existingFamily = await Family.findById(memberUser.family);
            return res.status(409).json({
                message: 'This member already belongs to another family. Unlink them first before joining a new family.',
                existingFamilyId: memberUser.family,
                existingFamilyName: existingFamily ? existingFamily.familyName : undefined,
            });
        }

        await attachMemberToFamily(family, memberUser, relationToHead);

        await family.save();
        await headUser.save();
        await memberUser.save();

        const populatedFamily = await Family.findById(family._id)
            .populate('headOfFamily', 'username')
            .populate('members', 'username relationToHead gender ageGroup phone email idNumber profilePhoto');

        res.status(200).json({ message: 'Members linked successfully', family: populatedFamily });
    } catch (error) {
        console.log('Error linking family members:', error);
        res.status(500).json({ message: 'Error linking family members', error: error.message });
    }
};

// Remove a member from their family, deleting the family if it becomes empty
exports.unlinkFamilyMember = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.family) {
            return res.status(400).json({ message: 'This member is not part of a family' });
        }

        const family = await Family.findById(user.family);
        if (family) {
            family.members = family.members.filter((m) => m.toString() !== userId.toString());
            if (family.headOfFamily && family.headOfFamily.toString() === userId.toString()) {
                family.headOfFamily = null;
            }

            if (family.members.length === 0) {
                await Family.findByIdAndDelete(family._id);
            } else {
                await family.save();
            }
        }

        user.family = null;
        user.relationToHead = null;
        await user.save();

        res.status(200).json({ message: 'Member unlinked from family successfully' });
    } catch (error) {
        console.log('Error unlinking family member:', error);
        res.status(500).json({ message: 'Error unlinking family member', error: error.message });
    }
};

// Create admission admin (for initial setup)
exports.createAdmin = async (req, res) => {
    try {
        const { email, password, phone } = req.body;
        
        if (!email || !password || !phone) {
            return res.status(400).json({ message: 'Email, password, and phone are required' });
        }

        // Check if admin already exists
        const existingAdmin = await AdmissionAdmin.findOne({ $or: [{ email }, { phone }] });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin with this email or phone already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new admin
        const newAdmin = new AdmissionAdmin({
            email,
            password: hashedPassword,
            phone
        });

        await newAdmin.save();
        
        res.status(201).json({ message: 'Admission admin created successfully' });
        
    } catch (error) {
        console.log('Error creating admin:', error);
        res.status(500).json({ message: 'Error creating admin', error });
    }
};