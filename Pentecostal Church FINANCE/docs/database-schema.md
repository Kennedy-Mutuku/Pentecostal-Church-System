# Database Schema (MongoDB)

The system uses MongoDB with Mongoose ODM. There are 5 collections that map to the core modules: users, transactions, requisitions, assets, and audit logs.

---

## Collections

### users

Stores all system users. Each user has exactly one role that determines what they can access.

```json
{
  "name": "String (required)",
  "email": "String (required, unique)",
  "phone": "String",
  "password": "String (required, hashed with bcrypt)",
  "role": "Enum: admin | treasurer | auditor | chair_accounts | chairperson | patron | member",
  "createdAt": "Date (auto)",
  "updatedAt": "Date (auto)"
}
```

- Default role: `member`
- Password is never returned in API responses
- Email is used for login

---

### transactions

Records all cash-in and cash-out entries. This is the ledger — every shilling coming in or going out is a transaction.

```json
{
  "type": "Enum: cash_in | cash_out",
  "category": "Enum: offering | tithe | thanksgiving | aob",
  "amount": "Number (required, positive)",
  "source": "Enum: mpesa | cash",
  "phone": "String (for M-Pesa transactions)",
  "description": "String",
  "receipt_url": "String (path to uploaded receipt image)",
  "recorded_by": "ObjectId (ref: users) - the treasurer who entered it",
  "approved_by": "ObjectId (ref: users) - chairperson/patron who approved",
  "createdAt": "Date (auto)",
  "updatedAt": "Date (auto)"
}
```

- Only the treasurer creates transactions
- `receipt_url` points to a file in `uploads/receipts/`
- Balance = sum of all `cash_in` amounts minus sum of all `cash_out` amounts

---

### requisitions

Tracks the requisition book — requests for money, their approval, and final spending.

```json
{
  "requested_by": "ObjectId (ref: users, required) - treasurer who made the request",
  "reason": "String (required) - why the money is needed",
  "amount_requested": "Number (required) - exact amount requested",
  "amount_spent": "Number - exact amount actually spent (filled on completion)",
  "voucher_url": "String (path to uploaded voucher image)",
  "status": "Enum: pending | approved | rejected | completed",
  "approved_by": "ObjectId (ref: users) - chairperson/patron who approved or rejected",
  "createdAt": "Date (auto)",
  "updatedAt": "Date (auto)"
}
```

**Status flow:**
```
pending --> approved --> completed
    \
     --> rejected
```

- Treasurer creates (status: pending)
- Chairperson or Patron approves or rejects
- Treasurer completes by recording amount_spent and attaching a voucher
- `voucher_url` points to a file in `uploads/vouchers/`

---

### assets

Registers and tracks CU property and assets.

```json
{
  "name": "String (required) - asset name",
  "description": "String - details about the asset",
  "valuation": "Number (required) - current value",
  "condition": "Enum: good | fair | poor",
  "recorded_by": "ObjectId (ref: users) - treasurer who recorded it",
  "createdAt": "Date (auto)",
  "updatedAt": "Date (auto)"
}
```

- Default condition: `good`
- Chair Accounts monitors asset status
- Only admin can delete assets

---

### auditlogs

Automatically logs every action in the system for accountability.

```json
{
  "user_id": "ObjectId (ref: users) - who performed the action",
  "action": "Enum: create | update | delete | approve | reject | reset_password",
  "entity": "Enum: users | transactions | requisitions | assets",
  "entity_id": "ObjectId - the specific record affected",
  "details": "Mixed (any JSON) - additional context about what changed",
  "createdAt": "Date (auto)",
  "updatedAt": "Date (auto)"
}
```

- Created automatically by the audit middleware in controllers
- Only the admin can view audit logs
- Cannot be edited or deleted through the API

---

## Relationships

```
users
  |
  |-- recorded_by --> transactions
  |-- approved_by --> transactions
  |-- requested_by --> requisitions
  |-- approved_by --> requisitions
  |-- recorded_by --> assets
  |-- user_id --> auditlogs
```

All references use MongoDB ObjectId and are populated with the user's name when queried.
