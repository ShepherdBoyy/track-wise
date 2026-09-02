<div align="center">

# Track Wise

A hospital invoice tracking and management system built for a medical supply company, designed to help employees manage and monitor invoices efficiently.

![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.0-9553E9?logo=inertia&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)

</div>

## Preview

![Track Wise dashboard screenshot](.github/preview.png)

## About

Track Wise is a hospital invoice tracking and management system built for Progressive Medical Corporation, a medical supply company. Before Track Wise, employees tracked invoices manually using spreadsheets — a process that was slow and prone to errors as the company grew.

Track Wise replaces that process with a centralized system for managing and monitoring invoices, and is actively used by the company's employees today.

Built with Laravel and React (via Inertia.js), it was developed as a real, production-level solution to an operational need — not just a practice project.

## Features

- Bulk import of outstanding invoices via Excel, including areas, hospitals, and invoice data
- Manual CRUD for managing hospitals and invoices, with full invoice history tracking
- Search and filtering across all data views
- Export invoices as PDF files
- Analytics dashboard with key metrics:
  - Total Outstanding & Total Overdue
  - Average Invoice Amount & Total Invoices
  - Invoice Aging Summary
  - Top 5 High-Volume Areas
  - Monthly Outstanding Trend & Invoice Volume
  - Top 10 Hospitals by Outstanding Amount
- Role-based permission system with 13 granular permissions, allowing admins to assign access based on each employee's responsibilities