# Polling System Test Configuration

## Prerequisites

Before running the tests, ensure:

1. **MongoDB is running** on `mongodb://127.0.0.1:27017/rpc-nyamira`
2. **Backend server is running** on `http://localhost:3000`
3. **You have a Super Admin account** created

## Setup Super Admin

If you don't have a super admin account, create one using:

```bash
npm run create-super-admin
```

Or manually create one in MongoDB:

```javascript
db.superadmins.insertOne({
  email: "admin@rpc.com",
  password: "$2a$10$...", // bcrypt hash of your password
  phone: "+254712345678"
})
```

## Update Test Credentials

Open `tests/testPollingSystem.js` and update lines 6-7:

```javascript
const SUPER_ADMIN_EMAIL = 'your_admin@email.com';
const SUPER_ADMIN_PASSWORD = 'your_password';
```

## Run Tests

```bash
npm run test:polling
```

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

... [more tests]

============================================================
📊 TEST SUMMARY
============================================================

✅ Tests Passed: 14/14
❌ Tests Failed: 0/14
📈 Success Rate: 100.00%

⏰ Completed at: [timestamp]
============================================================
```

## Test Coverage

The automated test suite covers:

1. ✅ Super Admin Login
2. ✅ Create Polling Officer
3. ✅ Get All Polling Officers
4. ✅ Polling Officer Login
5. ✅ Get Unvoted Users
6. ✅ Register New User & Vote
7. ✅ Mark Existing User as Voted
8. ✅ Search User
9. ✅ Get Polling Statistics
10. ✅ Suspend Officer
11. ✅ Verify Suspended Officer Can't Login
12. ✅ Reactivate Officer
13. ✅ Get All Voted Users
14. ✅ Polling Officer Logout

## Troubleshooting

### Test Fails: Super Admin Login
- Verify super admin credentials in the test file
- Check if super admin exists in database
- Verify MongoDB connection

### Test Fails: Create Polling Officer
- Check if super admin is properly authenticated
- Verify all required fields are provided
- Check backend console for errors

### Connection Errors
- Ensure backend server is running
- Verify the BASE_URL in test file matches your backend
- Check firewall/antivirus settings
