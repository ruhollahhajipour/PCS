# PCS Enterprise Platform Architecture

Version: 1.0

---

# Goal

Develop an Enterprise Multi-Tenant Project Control System.

---

# System Architecture

PCS

├── frontend
├── backend
├── database
├── docs
├── scripts
└── docker

---

# Frontend

src/

app/
core/
modules/
shared/

---

# Core

Authentication

Authorization

API

Configuration

Store

Utilities

---

# Modules

Company

Plant

Project

WBS

Cost Control

Warehouse

Procurement

Finance

Documents

Reports

Administration

---

# Multi Tenant

Every record belongs to exactly one Company (Tenant).

Users never select Company.

Company is detected automatically after login.

---

# Security

Authentication

↓

Company Detection

↓

Role Detection

↓

Permission Detection

↓

Application

---

# User Levels

Platform Super Admin

Company Admin

Project Manager

User

---

# Rules

No page accesses database directly.

All requests pass through Service Layer.

Every module owns its own:

- Components
- Pages
- Services
- Types
- Mock Data

---

# Naming

PascalCase

CompanyCard.tsx

ProjectService.ts

UserType.ts

camelCase

Variables

Functions

UPPER_CASE

Constants

---

# Git Flow

main

↓

develop

↓

feature/*