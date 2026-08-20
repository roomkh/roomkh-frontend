# RoomKh — Real Estate & Property Portal (Frontend)

RoomKh is a multi-role property rental and listing management platform designed for the Cambodian real estate market. Built with React, Vite, and Tailwind CSS, the platform connects Buyers/Renters, Property Sellers/Landlords, and Super Admins through a unified, responsive interface aligned with the project's Figma specification.

---

## 🛠️ Tech Stack & Dependencies

* **Core Framework:** React (v18+) + Vite
* **Styling & System UI:** Tailwind CSS + PostCSS
* **Iconography:** Lucide Icons (`lucide-react`)
* **Routing & Security:** React Router DOM (v6+) with Role-Based Guarding
* **HTTP Client:** Axios (with pre-configured interceptors)
* **Form State & Validation:** React Hook Form + Zod
* **State Management:** React Context API (Auth & Session State)

---

## 👥 Roles & Access Control Matrix (RBAC)

| Role | Access Level | Permitted Actions & Pages |
| :--- | :--- | :--- |
| **Public / Buyer** | Client Portal | Browse listings, search & filter properties, detail view, landlord contacts, About Us, Help page. |
| **Seller / Owner** | Workspace Portal | "Sell Page", multi-step property submission form, manage owned property listings, track statuses. |
| **Super Admin** | Management Portal | Platform analytics overview, user management, owner approval, listing moderation table. |

---

## 📂 Full Directory Structure

```text
roomkh-frontend/
├── public/                     # Static assets (favicons, public assets)
├── src/
│   ├── assets/                 # Brand assets, static vectors, placeholder images
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Input, Select, Badge, Table, Modal)
│   │   ├── common/             # Layout primitives (Navbar, AdminSidebar, Footer, StatCard, Pagination)
│   │   └── property/           # Business domain components (PropertyCard, PropertyGrid, FilterBar)
│   ├── config/                 # Axios instance, API endpoints, navigation configs
│   ├── context/                # AuthContext (user session, role evaluation, tokens)
│   ├── features/               # Feature-first modular domain slices
│   │   ├── auth/               # Login & Register forms, auth service
│   │   ├── public/             # Home, Property Search, Detail View, About, Help
│   │   ├── seller/             # Sell Page, Add Property form, Seller Listing Table
│   │   └── admin/              # Dashboard metrics, User, Owner, and Listing management
│   ├── hooks/                  # Custom hooks (useAuth, useDebounce, useFetch)
│   ├── layouts/                # Wrapper layouts (MainLayout, AdminLayout, AuthLayout)
│   ├── routes/                 # Central Router (AppRoutes) & Protection Guard (ProtectedRoute)
│   └── utils/                  # Utility helpers (formatCurrency, formatDate, validation)
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js          # Design system tokens (colors, typography, radii)
├── README.md
└── vite.config.js
```

<<<<<<< HEAD
---
=======
```

## Quick Start & Setup
1. Prerequisites
Node.js: v18.x or higher
>>>>>>> a508777cca7bc10f5caf3f58b4cd8bc1b9012f71

## 🚀 Quick Start & Setup

### 1. Prerequisites

- **Node.js:** v18.x or higher
- **npm:** v9.x or higher

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/your-org/roomkh-frontend.git

# Navigate into project root
cd roomkh-frontend

# Install dependencies
npm install
<<<<<<< HEAD
```
=======

3. Environment Setup
Create a .env file in the project root:
>>>>>>> a508777cca7bc10f5caf3f58b4cd8bc1b9012f71

### 3. Environment Setup

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Configure environment variables inside `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_APP_NAME=RoomKh
```

### 4. Running Locally

Start the development server:

```bash
npm run dev
```

Open `http://localhost:5173` to view the application in your browser.

---

## 🤝 Collaboration & Git Workflow

<<<<<<< HEAD
To maintain code quality and prevent merge conflicts across team members:

### Branch Standards

Create feature branches off `dev`:

- `feature/auth-login`
- `feature/admin-dashboard`
- `feature/seller-add-property`
- `fix/responsive-navbar`

### Pull Requests (PRs)

- Do not commit directly to `main` or `dev`.
- Open PRs targeting the `dev` branch.
- Require at least 1 peer code review before merging into `dev`.

---

## 🎨 UI Standards & Figma Compliance

- UI implementation adheres to the provided Figma Specification.
- Colors, typography, and layout rules are central to `tailwind.config.js`.
- Form inputs are validated via JSON schema rules prior to API interaction.
=======
## Collaboration & Git Workflow
To maintain code quality and prevent merge conflicts across team members:


## UI Standards & Figma Compliance
UI implementation adheres to the provided Figma Specification.

Colors, typography, and layout rules are central to tailwind.config.js.

Form inputs are validated via JSON schema rules prior to API interaction.
>>>>>>> a508777cca7bc10f5caf3f58b4cd8bc1b9012f71
