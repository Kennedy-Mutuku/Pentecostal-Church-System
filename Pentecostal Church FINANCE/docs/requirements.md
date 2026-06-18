# System Requirements

## Functional Requirements

### 1. Authentication & User Management
- Users log in with email and password
- Only the System Admin can register new users and assign roles
- Admin can reset passwords for any user
- Admin can view, update, and delete user accounts
- JWT-based session with role-based access control
- 7 roles: admin, treasurer, auditor, chair_accounts, chairperson, patron, member

### 2. Cash Management (Treasurer)
- Record cash-in transactions with:
  - Category: offering, tithe, thanksgiving, AOB
  - Source: M-Pesa or cash
  - Phone number (for M-Pesa)
  - Amount
  - Description
  - Receipt upload (image)
- Record cash-out transactions with receipt upload
- View current balance (total cash in minus total cash out)
- Chairperson and Patron authorize/approve transactions

### 3. Requisition Book (Treasurer)
- Create a requisition: reason + exact amount requested
- Chairperson or Patron approves or rejects
- On completion: record exact amount spent + attach voucher
- Status flow: Pending -> Approved -> Completed (or Rejected)

### 4. Ledger
- Track all incomes and expenses
- Filter by type (cash_in/cash_out), category, and date range
- Populated with the name of who recorded each entry

### 5. Asset Management
- Treasurer registers assets: name, description, valuation, condition (good/fair/poor)
- Treasurer can update asset records
- Admin can delete assets
- Chair Accounts monitors asset condition and status

### 6. Reports & Financial Statements
- Generate financial statements filtered by date range
- Income vs expense summary with net balance
- Category breakdown: total and count per category (offering/tithe/thanksgiving/AOB)
- Accessible to: admin, treasurer, auditor, chair_accounts, chairperson, patron

### 7. Audit Trail
- Every create, update, delete, approve, reject, and password reset is logged
- Logs capture: who (user), what (action), which record (entity + ID), and details
- Visible only to the System Admin

### 8. Member View
- Members can view their own recorded contributions
- Data shown: phone number, amount, category

---

## Role Access Matrix

| Endpoint / Action | Admin | Treasurer | Auditor | Chair Accounts | Chairperson | Patron | Member |
|-------------------|:-----:|:---------:|:-------:|:--------------:|:-----------:|:------:|:------:|
| Register users | X | | | | | | |
| Reset passwords | X | | | | | | |
| Manage users | X | | | | | | |
| View audit logs | X | | | | | | |
| Record transactions | | X | | | | | |
| View transactions | X | X | X | X | X | X | |
| View balance | X | X | | X | X | | |
| Approve transactions | | | | | X | X | |
| Create requisitions | | X | | | | | |
| View requisitions | X | X | X | X | X | X | |
| Approve/reject requisitions | | | | | X | X | |
| Complete requisitions | | X | | | | | |
| Manage assets | | X | | | | | |
| View assets | X | X | X | X | X | | |
| Delete assets | X | | | | | | |
| View reports/statements | X | X | X | X | X | X | |
| View own contributions | | | | | | | X |

---

## Non-Functional Requirements

- **Security:** Passwords hashed with bcrypt, JWT authentication, role-based endpoint protection
- **Audit:** Every financial action logged with user, action, entity, and timestamp
- **Responsive:** Mobile and desktop friendly (React.js frontend)
- **File Uploads:** Receipts and vouchers stored securely with file type and size validation
- **Payments:** M-Pesa integration via Daraja API for mobile money contributions
- **Performance:** Paginated list endpoints for large datasets

---

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
