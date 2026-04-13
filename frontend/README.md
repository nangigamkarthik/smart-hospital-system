# 🏥 Smart Hospital Management System - Frontend

## ✨ Complete Frontend Package

This is the complete, ready-to-use frontend for your hospital management system.

---

## 📦 What's Included

### Pages (All Working):
- ✅ **Dashboard** - Overview with charts and statistics
- ✅ **Patients** - Full CRUD (Create, Read, Update, Delete)
- ✅ **Doctors** - Full CRUD with specialization filters
- ✅ **Appointments** - View, filter, status updates
- ✅ **Departments** - Full CRUD with bed management
- ✅ **Medical Records** - View records with full details
- ✅ **Advanced Analytics** - Multiple charts and insights
- ⏳ **ML Predictions** - Placeholder (coming soon)

### Features:
- ✅ User authentication (login/logout)
- ✅ View patient details modal
- ✅ Add/Edit patient modal
- ✅ Add/Edit doctor modal
- ✅ Add/Edit department modal
- ✅ Search and filtering
- ✅ Pagination
- ✅ Real-time toast notifications
- ✅ Responsive design
- ✅ Professional UI with Tailwind CSS

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Extract the Frontend

Extract this zip to replace your current frontend folder:

```bash
# Your project structure should be:
smart-hospital-system/
├── backend/          (Your running backend)
└── frontend/         (Replace with this package)
```

### Step 2: Install Dependencies

```bash
cd frontend
npm install
```

This installs:
- React 18
- React Router
- Axios (API calls)
- Tailwind CSS
- Recharts (for charts)
- Lucide React (icons)
- React Hot Toast (notifications)

### Step 3: Start the Development Server

```bash
npm run dev
```

The frontend will start on: **http://localhost:3000**

---

## ✅ Verification

After starting, you should see:

```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

Open http://localhost:3000 in your browser.

---

## 🔐 Login

**Default Credentials:**
- **Username:** admin
- **Password:** admin123

*(These should match the credentials in your backend database)*

---

## 🎯 Backend Connection

The frontend is configured to connect to:
- **Backend URL:** http://localhost:5000
- **API Proxy:** Configured in `vite.config.js`

All API calls go to `/api/*` which proxies to `http://localhost:5000/api/*`

---

## 📂 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── common/        # Shared components
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatCard.jsx
│   │   ├── patients/      # Patient components
│   │   │   ├── AddPatientModal.jsx
│   │   │   └── ViewPatientModal.jsx
│   │   ├── doctors/       # Doctor components
│   │   │   └── AddDoctorModal.jsx
│   │   └── departments/   # Department components
│   │       └── AddDepartmentModal.jsx
│   │
│   ├── pages/             # Page components
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── PatientsPage.jsx
│   │   ├── DoctorsPage.jsx
│   │   ├── AppointmentsPage.jsx
│   │   ├── DepartmentsPage.jsx
│   │   ├── MedicalRecordsPage.jsx
│   │   └── AdvancedAnalyticsPage.jsx
│   │
│   ├── services/          # API and auth services
│   │   ├── api.js         # API configuration
│   │   └── AuthContext.jsx # Auth state management
│   │
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

---

## 🔧 Configuration Files

### `vite.config.js`
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

If your backend runs on a different port, update the `target` here.

### `src/services/api.js`
All API endpoints are configured here:
- authAPI
- patientAPI
- doctorAPI
- appointmentAPI
- departmentAPI
- medicalRecordsAPI
- analyticsAPI
- mlAPI

---

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling with a custom blue color palette.

### Custom Classes (in `index.css`):
- `.btn-primary` - Primary buttons
- `.btn-secondary` - Secondary buttons
- `.input-field` - Form inputs
- `.card` - Card containers

---

## 🧪 Testing the Features

### 1. Test Patients Page:
- Click "Patients" in sidebar
- Click eye icon → View patient details
- Click edit icon → Edit patient
- Click delete icon → Delete patient
- Click "Add Patient" → Create new patient

### 2. Test Doctors Page:
- Click "Doctors" in sidebar
- Click "Add Doctor" → Create new doctor
- Click edit icon → Edit doctor
- Click delete icon → Delete doctor
- Use filters (specialization, status)

### 3. Test Departments Page:
- Click "Departments" in sidebar
- See bed occupancy statistics
- Click "Add Department" → Create new
- Edit and delete departments

### 4. Test Medical Records:
- Click "Medical Records" in sidebar
- View all patient records
- Search for specific records
- See vitals and diagnoses

### 5. Test Analytics:
- Click "Analytics" in sidebar
- View 90-day appointment trends
- See revenue charts
- Check doctor performance
- View department occupancy

---

## 🐛 Troubleshooting

### Issue: Can't connect to backend

**Check:**
1. Backend is running on port 5000
2. No CORS errors in console
3. API calls show in Network tab

**Fix:**
Update `vite.config.js` proxy target if backend uses different port.

### Issue: Login fails

**Check:**
1. Backend database has users
2. Credentials are correct (admin/admin123)
3. Check backend console for errors

**Fix:**
Run backend data generator to create sample users.

### Issue: npm install fails

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Issue: Port 3000 already in use

**Fix:**
Change port in `vite.config.js`:
```javascript
server: {
  port: 3001,  // Change to any available port
  // ...
}
```

---

## 📱 Responsive Design

The UI is fully responsive and works on:
- ✅ Desktop (1920x1080 and above)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667 and above)

---

## 🔄 Development Workflow

### Making Changes:
1. Edit files in `src/`
2. Save → Hot reload happens automatically
3. Check browser for changes

### Adding New Page:
1. Create page in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`
3. Add link in `src/components/common/Sidebar.jsx`

### Adding New API Endpoint:
1. Add to appropriate API in `src/services/api.js`
2. Use in your component: `await patientAPI.newMethod()`

---

## 🏗️ Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

To preview the production build:
```bash
npm run preview
```

---

## ✅ What Works Out of the Box

| Feature | Status |
|---------|--------|
| Login/Logout | ✅ Working |
| Dashboard | ✅ Working |
| Patients CRUD | ✅ Working |
| Doctors CRUD | ✅ Working |
| Appointments View | ✅ Working |
| Departments CRUD | ✅ Working |
| Medical Records View | ✅ Working |
| Analytics Charts | ✅ Working |
| Search & Filter | ✅ Working |
| Pagination | ✅ Working |
| Responsive UI | ✅ Working |

---

## 🎯 Next Steps (Optional Enhancements)

1. **Add Appointment Booking Modal**
   - Select doctor and patient
   - Pick date and time
   - Book appointment

2. **Add Medical Record Creation**
   - Form to create new records
   - Link to appointments
   - Add vitals

3. **Add User Management**
   - Admin can create users
   - Role management
   - Permissions

4. **Add Reports**
   - Generate PDF reports
   - Export to Excel
   - Print functionality

---

## 🆘 Need Help?

### Common Commands:
```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Quick Fixes:
```bash
# Reset everything
rm -rf node_modules package-lock.json
npm install
npm run dev

# Clear cache
npm cache clean --force
```

---

## 🎉 You're All Set!

Your frontend is ready to use. Just:
1. `npm install`
2. `npm run dev`
3. Open http://localhost:3000
4. Login with admin/admin123

**Enjoy your fully functional hospital management system!** 🏥✨
