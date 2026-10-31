# PCS Core Entities

Version: 1.0

---

# Design Principle

Every entity has a single responsibility.

Entities are connected through clear relationships.

No duplicated information.

Every transaction must be traceable.

---

# 1. Organization

Purpose

Represents the owner of the system.

Examples

- Adish Gas Condensate Refinery
- MAPNA
- Petropars

Owns

- Plants
- Projects
- Users
- Departments
- Licenses
- Settings

---

# 2. Plant

Purpose

Represents an operational site.

Examples

- Refinery

- Petrochemical

- Power Plant

- Offshore Platform

Plant belongs to one Organization.

Plant owns multiple Projects.

---

# 3. Project

Purpose

Represents one EPC project.

Examples

- SRU Unit

- Utility Upgrade

- Tank Farm

Project belongs to one Plant.

Project owns

- WBS

- Cost Control

- Warehouse

- Procurement

- Finance

- Documents

- Reports

---

# 4. Phase

Represents project lifecycle.

Engineering

Procurement

Construction

Commissioning

Operation

---

# 5. Area

Represents physical location.

Examples

Area 100

Area 200

Tank Farm

Utility

Offsite

---

# 6. Discipline

Civil

Mechanical

Electrical

Instrument

Process

Piping

HSE

Planning

---

# 7. WBS

Represents project breakdown.

Every cost should be assigned to a WBS whenever applicable.

---

# 8. Activity

Represents executable work.

Examples

Excavation

Foundation

Concrete

Pipe Installation

Cable Pulling

Painting

Inspection

Activities belong to one WBS.

---

# 9. User

Belongs to Organization.

May access multiple Projects.

Has one or more Roles.

---

# 10. Role

Examples

Platform Admin

Company Admin

Project Manager

Department Manager

Engineer

Viewer

---

# Design Rules

Organization

↓

Plant

↓

Project

↓

Phase

↓

Area

↓

Discipline

↓

WBS

↓

Activity

Everything should finally be connected to Project.
# Organization Entity

## Purpose

Represents the owner of the PCS platform.

---

## Business Rules

- Organization Code must be unique.
- Organization Name must be unique.
- Organization cannot be deleted.
- Organization can only be archived.
- Every User belongs to exactly one Organization.
- Every Plant belongs to exactly one Organization.
- Every Project belongs to exactly one Organization.

---

## Validation Rules

Organization Name

Required

Minimum Length = 3

Maximum Length = 200

---

Organization Code

Required

Uppercase

No Space

Unique

Example

ADISH

MAPNA

PETROPARS

---

Email

Must be valid.

---

Phone

International format.

---

Website

Must start with https://

---

## UI Rules

Company Logo

Supported formats

PNG

SVG

JPG

Maximum Size

2 MB

---

Status

Active

Inactive

Archived

---

## Security Rules

Only Platform Admin can create Organization.

Company Admin cannot create Organization.

Company Admin can edit only his Organization.

Users cannot see other Organizations.

---

## Audit Rules

Create User

Create Date

Last Modified User

Last Modified Date

Archive User

Archive Date

---

## Relationships

Organization

1

↓

Plants

N

Organization

1

↓

Projects

N

Organization

1

↓

Users

N

Organization

1

↓

Departments

N