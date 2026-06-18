# Polling System Tests

## Quick Start

### 1. Update Test Credentials

Edit `tests/config.js` and update the super admin credentials:

```javascript
SUPER_ADMIN_EMAIL: 'your_actual_admin@email.com',
SUPER_ADMIN_PASSWORD: 'your_actual_password',
```

### 2. Ensure Prerequisites

✅ MongoDB is running
✅ Backend server is running (`npm run dev`)
✅ Super admin account exists in database

### 3. Run Tests

```bash
npm run test:polling
```

## Alternative: Use Environment Variables

Instead of editing `config.js`, you can set environment variables:

### Windows (CMD)
```cmd
set TEST_SUPER_ADMIN_EMAIL=your_admin@email.com
set TEST_SUPER_ADMIN_PASSWORD=your_password
npm run test:polling
```

### Windows (PowerShell)
```powershell
$env:TEST_SUPER_ADMIN_EMAIL="your_admin@email.com"
$env:TEST_SUPER_ADMIN_PASSWORD="your_password"
npm run test:polling
```

### Linux/Mac
```bash
TEST_SUPER_ADMIN_EMAIL=your_admin@email.com TEST_SUPER_ADMIN_PASSWORD=your_password npm run test:polling
```

## What Gets Tested?

The test suite performs 14 comprehensive tests:

### Authentication & Authorization
- ✅ Super Admin can log in
- ✅ Polling Officer can log in
- ✅ Suspended officer cannot log in
- ✅ Officers can log out

### Officer Management (Super Admin)
- ✅ Create new polling officer
- ✅ List all polling officers
- ✅ Suspend officer
- ✅ Reactivate officer
- ✅ View all voted users

### Voting Operations (Polling Officer)
- ✅ Get list of unvoted users
- ✅ Register new user and mark as voted
- ✅ Mark existing user as voted
- ✅ Search for users
- ✅ Get real-time polling statistics

## Expected Output

```
============================================================
🧪 POLLING SYSTEM - AUTOMATED TEST SUITE
============================================================

📡 Testing against: http://localhost:3000
⏰ Started at: [timestamp]

🔐 Testing Super Admin Login...
✅ Super Admin Login
   Logged in as admin@rpc.com

👤 Testing Create Polling Officer...
✅ Create Polling Officer
   Officer created: test.officer.123@rpc.com

📋 Testing Get All Polling Officers...
✅ Get All Officers
   Found 5 officer(s)

🔑 Testing Polling Officer Login...
✅ Polling Officer Login
   Logged in as test.officer.123@rpc.com

📊 Testing Get Unvoted Users...
✅ Get Unvoted Users
   Found 150 unvoted user(s)

➕ Testing Register New User & Mark as Voted...
✅ Register & Vote New User
   User created and voted: testuser.123@example.com

✓ Testing Mark Existing User as Voted...
✅ Mark Existing User as Voted
   User marked as voted: 67890abcdef

🔍 Testing Search User...
✅ Search User
   Found 3 user(s) matching "Test"

📈 Testing Get Polling Statistics...
✅ Get Polling Statistics
   Total: 200, Voted: 51, Not Voted: 149, Completion: 25.50%

🚪 Testing Polling Officer Logout...
✅ Polling Officer Logout
   Officer logged out successfully

🔒 Testing Suspend Polling Officer...
✅ Suspend Officer
   Officer suspended successfully

🚫 Testing Suspended Officer Cannot Login...
✅ Suspended Officer Login Block
   Suspended officer correctly blocked from login

✅ Testing Reactivate Polling Officer...
✅ Activate Officer
   Officer reactivated successfully

👥 Testing Get All Voted Users (Super Admin)...
✅ Get All Voted Users
   Found 51 voted user(s)

============================================================
📊 TEST SUMMARY
============================================================

✅ Tests Passed: 14/14
❌ Tests Failed: 0/14
📈 Success Rate: 100.00%

⏰ Completed at: [timestamp]
============================================================
```

## Troubleshooting

### ❌ Super Admin Login Failed

**Error:** `Status: 401, Message: Invalid username or password`

**Solutions:**
1. Verify credentials in `tests/config.js`
2. Check if super admin exists:
   ```bash
   npm run create-super-admin
   ```
3. Verify MongoDB connection

### ❌ Connection Refused

**Error:** `ECONNREFUSED`

**Solutions:**
1. Ensure backend is running: `npm run dev`
2. Check if port 3000 is available
3. Verify BASE_URL in config.js

### ❌ Tests Timeout

**Solutions:**
1. Increase timeout in config.js
2. Check server performance
3. Verify MongoDB is responding

## Manual Testing

If you prefer to test manually, you can use the polling system via:

1. **Super Admin Dashboard**
   http://localhost:5173/admin

2. **Polling Officer Management**
   http://localhost:5173/polling-officer-management

3. **Polling Officer Dashboard**
   http://localhost:5173/polling-officer-dashboard

## Test Data Cleanup

The tests create temporary data:
- Test polling officers (email: `test.officer.*@rpc.com`)
- Test users (email: `testuser.*@example.com`)

To clean up test data, you can manually delete from MongoDB:

```javascript
// Delete test officers
db.pollingofficers.deleteMany({
  email: /test\.officer\..*@rpc\.com/
})

// Delete test users
db.users.deleteMany({
  email: /testuser\..*@example\.com/
})
```

## CI/CD Integration

To integrate with CI/CD pipelines:

```yaml
# Example for GitHub Actions
- name: Run Polling System Tests
  env:
    TEST_SUPER_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
    TEST_SUPER_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}
  run: npm run test:polling
```

## Support

For issues or questions about the tests:
1. Check backend console logs
2. Verify MongoDB collections exist
3. Review test output for specific error messages
4. Check `POLLING_SYSTEM_GUIDE.md` for system documentation
