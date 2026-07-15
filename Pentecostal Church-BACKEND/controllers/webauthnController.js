const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const User = require('../models/user');

const rpName = 'RPC Nyamira Portal';

// Helper to determine RP ID and Origin based on environment
const getWebAuthnConfig = (req) => {
    const isDev = (process.env.NODE_ENV || '').trim() !== 'production';
    // For localhost development
    const origin = req.headers.origin || (isDev ? 'http://localhost:5173' : 'https://rpc-nyamira.co.ke');
    let rpID = 'rpc-nyamira.co.ke';
    
    if (isDev) {
        if (origin.includes('localhost')) rpID = 'localhost';
        else if (origin.includes('192.168.')) rpID = origin.split('://')[1].split(':')[0];
    }
    
    return { rpID, origin };
};

exports.generateRegistration = async (req, res) => {
    try {
        const userId = req.userId; // from auth middleware
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { rpID } = getWebAuthnConfig(req);

        const userCredentials = user.webAuthnCredentials || [];

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: user._id.toString(),
            userName: user.email || user.phone,
            attestationType: 'none',
            excludeCredentials: userCredentials.map(cred => ({
                id: cred.credentialID,
                type: 'public-key',
                transports: cred.transports,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform', // Enforce device biometric/pin
            },
        });

        // Save challenge to user document
        user.currentChallenge = options.challenge;
        await user.save();

        res.json(options);
    } catch (error) {
        console.error('generateRegistration Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.verifyRegistration = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user || !user.currentChallenge) {
            return res.status(400).json({ message: 'Invalid state or user not found' });
        }

        const { body } = req;
        const expectedChallenge = user.currentChallenge;
        const { rpID, origin } = getWebAuthnConfig(req);

        const verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });

        const { verified, registrationInfo } = verification;

        if (verified && registrationInfo) {
            const { credentialPublicKey, credentialID, counter } = registrationInfo;

            if (!user.webAuthnCredentials) user.webAuthnCredentials = [];

            user.webAuthnCredentials.push({
                credentialID: Buffer.from(credentialID).toString('base64'),
                credentialPublicKey: Buffer.from(credentialPublicKey),
                counter,
                transports: body.response.transports || [],
            });

            user.currentChallenge = null;
            await user.save();

            return res.json({ verified: true });
        }

        return res.status(400).json({ verified: false, message: 'Verification failed' });
    } catch (error) {
        console.error('verifyRegistration Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.generateAuthentication = async (req, res) => {
    try {
        const { idNumber, phone } = req.body;
        
        // Find user by idNumber or phone
        const query = [];
        if (idNumber) query.push({ idNumber: idNumber.trim().toUpperCase() });
        if (phone) query.push({ phone: phone.trim() });
        
        if (query.length === 0) {
             return res.status(400).json({ message: 'ID Number or phone is required' });
        }

        const user = await User.findOne({ $or: query });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const userCredentials = user.webAuthnCredentials || [];
        if (userCredentials.length === 0) {
            return res.status(400).json({ message: 'No fingerprints registered for this user' });
        }

        const { rpID } = getWebAuthnConfig(req);

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials: userCredentials.map(cred => ({
                id: Buffer.from(cred.credentialID, 'base64'),
                type: 'public-key',
                transports: cred.transports,
            })),
            userVerification: 'preferred',
        });

        user.currentChallenge = options.challenge;
        await user.save();

        res.json({ options, userId: user._id });
    } catch (error) {
        console.error('generateAuthentication Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.verifyAuthentication = async (req, res) => {
    try {
        const { userId, response } = req.body;
        const user = await User.findById(userId);

        if (!user || !user.currentChallenge) {
            return res.status(400).json({ message: 'Invalid state or user not found' });
        }

        const expectedChallenge = user.currentChallenge;
        const { rpID, origin } = getWebAuthnConfig(req);

        // Find the specific credential
        const credential = user.webAuthnCredentials.find(
            cred => cred.credentialID === response.id
        );

        if (!credential) {
            return res.status(400).json({ message: 'Credential not found' });
        }

        const verification = await verifyAuthenticationResponse({
            response,
            expectedChallenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
            authenticator: {
                credentialPublicKey: credential.credentialPublicKey,
                credentialID: Buffer.from(credential.credentialID, 'base64'),
                counter: credential.counter,
            },
        });

        const { verified, authenticationInfo } = verification;

        if (verified) {
            credential.counter = authenticationInfo.newCounter;
            user.currentChallenge = null;
            await user.save();
            return res.json({ verified: true });
        }

        return res.status(400).json({ verified: false, message: 'Verification failed' });
    } catch (error) {
        console.error('verifyAuthentication Error:', error);
        res.status(500).json({ error: error.message });
    }
};
