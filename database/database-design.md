# PCS Database Design

## Core Tables

1. Companies
2. Plants
3. Projects
4. Users
5. Roles
6. Departments
7. WBS
8. CostCodes
9. CostTransactions
10. Documents

---

## Companies

| Field | Type | Description |
|-------|------|-------------|
| Id | Guid | Primary Key |
| CompanyCode | nvarchar(20) | Company Code |
| CompanyName | nvarchar(200) | Company Name |
| LegalName | nvarchar(300) | Legal Name |
| RegistrationNo | nvarchar(50) | Registration Number |
| NationalId | nvarchar(50) | National ID |
| EconomicCode | nvarchar(50) | Economic Code |
| Address | nvarchar(max) | Address |
| Phone | nvarchar(50) | Phone |
| Email | nvarchar(100) | Email |
| Website | nvarchar(200) | Website |
| IsActive | bit | Active |
| CreatedAt | datetime | Create Date |
| UpdatedAt | datetime | Update Date |