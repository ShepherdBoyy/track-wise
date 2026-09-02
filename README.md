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

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| PHP | Backend language | 8.2 |
| Laravel | Backend framework | 12.0 |
| Inertia.js | Connects Laravel backend to React frontend (no separate API) | 2.0 |
| React | Frontend UI library | 19.2.0 |
| Tailwind CSS | Styling | 4.0.0 |
| DaisyUI | UI component library for Tailwind | 5.5.0 |
| MySQL | Database | 15 |
| Recharts | Dashboard charts & analytics visualizations | 3.7.0 |
| barryvdh/laravel-dompdf | PDF invoice export | 3.1 |
| maatwebsite/excel | Bulk Excel import/export | 3.1 |
| Vite | Frontend build tool | 7.0.7 |

## Installation

1. Clone the repository
```bash
    git clone https://github.com/ShepherdBoyy/track-wise.git
    cd track-wise
```

2. Install PHP dependencies
```bash
    composer install
```

3. Copy the environment file and generate an app key
```bash
    cp .env.example .env
    php artisan key:generate
```

4. Configure your database in `.env`
```bash
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=track_wise
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
```

5. Run database migrations and seed the database with sample data
```bash
    php artisan migrate --seed
```

6. Install frontend dependencies
```bash
    npm install
```

7. Start the development environment (server, queue listener, and Vite)
```bash
    composer run dev
```

8. Open your browser and go to `http://localhost:8000`

## Project Structure

```
track-wise/
├── app/
│   ├── Exports/              # Excel/PDF export logic
│   ├── Http/
│   │   ├── Controllers/      # Auth, Export, Home, Hospital, Import, Invoice, Updates, User
│   │   ├── Middleware/        # Permission checks, Inertia request handling
│   │   └── Requests/          # Form validation (Store/Update requests)
│   ├── Imports/                # Excel import & validation logic
│   ├── Models/                  # Area, Hospital, Invoice, InvoiceHistory, Permission, User, ImportHistory
│   ├── Policies/                 # Authorization policies (Hospital, Invoice, User)
│   └── Providers/
│
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/               # DatabaseSeeder — sample/demo data
│
├── resources/
│   ├── css/
│   ├── fonts/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Authentication/  # Login
│   │   │   ├── Export/           # Invoice & aging report exports
│   │   │   ├── Home/               # Dashboard (KPIs, charts, summaries)
│   │   │   ├── Hospitals/           # CRUD views
│   │   │   ├── ImportData/          # Bulk Excel import UI
│   │   │   ├── Invoices/             # CRUD views
│   │   │   ├── Updates/               # Invoice history
│   │   │   ├── UserManagement/         # User & permission management
│   │   │   ├── components/              # Shared UI (Navbar, Sidebar, Pagination, etc.)
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── app.jsx
│   └── views/
│       ├── app.blade.php
│       └── pdf/                # Invoice & aging report PDF templates
│
├── routes/
│   └── web.php
│
├── tests/
│   ├── Feature/
│   └── Unit/
│
├── composer.json
├── package.json
├── vite.config.js
└── README.md
```