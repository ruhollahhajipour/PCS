# PCS Domain Model

## Level 1

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

---

## Organization

Represents the customer.

Owns:

- Plants
- Projects
- Users
- Departments
- Settings

---

## Plant

Represents an operational facility.

Examples

- Refinery

- Petrochemical

- Power Plant

---

## Project

Every business transaction belongs to exactly one Project.

Project owns

- WBS

- Cost Control

- Procurement

- Warehouse

- Finance

- Documents

- Reports

---

## Phase

Examples

Engineering

Procurement

Construction

Commissioning

Operation

---

## Area

Examples

Area 100

Area 200

Tank Farm

Utility

Offsite

---

## Discipline

Civil

Mechanical

Piping

Electrical

Instrument

Process

HSE

---

## WBS

Lowest management level.

Everything should be traceable to WBS whenever applicable.

---

## Users

Belong to Organization.

May have access to one or more Projects.

---

## Roles

Platform Admin

Company Admin

Project Manager

Department Manager

Engineer

Viewer

---

## Transactions

Cost

Warehouse

Procurement

Finance

Documents

Letters

Progress

Daily Reports

Photos

---

## Rule 1

Every Transaction belongs to exactly one Project.

---

## Rule 2

Transactions may belong to one WBS.

---

## Rule 3

Users never select Organization.

Organization is detected automatically after Login.

---

## Rule 4

Soft Delete only.

No Physical Delete.

---

## Rule 5

Every Update is audited.

Audit Trail is mandatory.