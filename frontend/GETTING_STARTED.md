# Getting Started with EventEase

## 🚀 Quick Start

This is a complete, production-ready frontend for the EventEase event management system. The application works in **demo mode** without a backend, allowing you to explore the full UI/UX immediately.

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

## 🔐 Demo Login

Enter **any email and password** to login and explore the dashboard. The app will automatically run in demo mode with mock data.

Example credentials:
- Email: `admin@eventease.com`
- Password: `anything`

## 🎯 What's Included

### ✅ Complete Pages
1. **Authentication**
   - Login page with form validation
   - Registration page with role selection
   - Protected route handling

2. **Dashboard**
   - Statistics cards (Users, Events, Bookings, Notifications)
   - Recent events overview
   - Quick action cards
   - Admin-specific metrics

3. **Events Management**
   - Events listing with grid layout
   - Event detail page
   - Create event form
   - Edit event form
   - Search and filter functionality
   - Category and status filters

4. **Bookings**
   - My bookings page
   - Booking cards with event details
   - Cancel booking functionality
   - Booking history

5. **Notifications**
   - Notifications page
   - Notification dropdown in navbar
   - Read/unread status
   - Mark as read functionality

6. **User Management** (Admin only)
   - Users table
   - User roles display
   - Search users

7. **Analytics** (Admin only)
   - Statistics overview
   - Interactive charts (Bar, Line, Pie)
   - Event trends
   - Category distribution
   - Top performing events table

8. **Settings**
   - Profile settings tab
   - Password change tab
   - Notification preferences tab
   - Toggle switches for preferences

## 🎨 Design System

### Colors
- **Primary**: #EA580C (Orange)
- **Background**: #F8FAFC (Light Gray)
- **Card**: #FFFFFF (White)
- **Text Primary**: #0F172A (Dark)
- **Text Secondary**: #64748B (Gray)
- **Border**: #E2E8F0 (Light Border)
- **Sidebar**: #111827 (Dark Gray)
- **Success**: #16A34A (Green)
- **Error**: #DC2626 (Red)

### Typography
- **Font Family**: Inter
- **Headings**: Inter Semibold (600)
- **Labels**: Inter Medium (500)
- **Body**: Inter Regular (400)

### Layout
- **Sidebar Width**: 256px (fixed)
- **Border Radius**: 8px-12px
- **Spacing Scale**: 4px, 8px, 12px, 16px, 24px, 32px
- **Card Padding**: 24px (1.5rem)
- **Button Padding**: 10px 16px

## 🏗️ Project Structure

```
src/
├── app/
│   └── App.tsx                 # Main app with routing
├── components/
│   └── DemoCredentials.tsx     # Demo info banner
├── layouts/
│   ├── AuthLayout.tsx          # Auth pages layout
│   └── DashboardLayout.tsx     # Dashboard with sidebar
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── dashboard/
│   │   └── Dashboard.tsx
│   ├── events/
│   │   ├── Events.tsx
│   │   ├── EventDetails.tsx
│   │   ├── CreateEvent.tsx
│   │   └── EditEvent.tsx
│   ├── bookings/
│   │   └── MyBookings.tsx
│   ├── notifications/
│   │   └── Notifications.tsx
│   ├── users/
│   │   └── Users.tsx
│   ├── analytics/
│   │   └── Analytics.tsx
│   └── settings/
│       └── Settings.tsx
├── services/
│   └── api.ts                  # API layer with Axios
├── store/
│   ├── authStore.ts            # Zustand auth store
│   └── notificationStore.ts    # Zustand notification store
└── styles/
    ├── fonts.css               # Google Fonts
    ├── theme.css               # Design tokens
    └── index.css               # Global styles
```

## 🔌 Connecting to Backend

To connect to your Spring Boot backend:

1. Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://eventease-20lv.onrender.com'; // Your backend URL
```

2. Ensure your backend is running and CORS is configured

3. The app will automatically switch from demo mode to real API calls

### API Endpoints Expected

```
POST   /api/auth/login
POST   /api/auth/register

GET    /api/events
GET    /api/events/{id}
POST   /api/events
PUT    /api/events/{id}
DELETE /api/events/{id}
POST   /api/events/{id}/banner

POST   /api/tickets/book/{eventId}
DELETE /api/tickets/cancel/{ticketId}
GET    /api/tickets/my-tickets

GET    /api/notifications
PUT    /api/notifications/{id}/read

GET    /api/dashboard/admin
```

## 🎭 User Roles

The app supports three user roles:

### 1. **USER** (Default)
- Browse events
- Book tickets
- View own bookings
- Manage profile

### 2. **ORGANIZER**
- All User permissions
- Create events
- Edit own events
- Delete own events

### 3. **ADMIN**
- All Organizer permissions
- View all users
- Access analytics
- System-wide permissions

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Recharts** - Charts
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **Sonner** - Toast notifications

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🌟 Key Features

### Navigation
- Fixed dark sidebar with active indicators
- Top navbar with search and notifications
- User profile dropdown
- Breadcrumb support

### Components
- Clean card-based layouts
- Smooth hover effects
- Loading skeletons
- Empty states
- Modal dialogs
- Toast notifications
- Form validation
- Search and filters
- Pagination ready

### State Management
- Zustand for global state
- LocalStorage persistence
- JWT token handling
- Automatic auth sync

## 🎨 Customization

### Colors
Edit `src/styles/theme.css`:
```css
:root {
  --primary: #EA580C;
  --background: #F8FAFC;
  /* ... more variables */
}
```

### Typography
Update `src/styles/fonts.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Your-Font');
```

### Layout
Modify sidebar width in `src/layouts/DashboardLayout.tsx`:
```tsx
<aside className="w-64 ...">
```

## 🐛 Troubleshooting

### Issue: Can't login
**Solution**: Demo mode accepts any credentials. Just enter any email/password.

### Issue: API calls failing
**Solution**: Check if backend URL is correct in `src/services/api.ts`

### Issue: Build errors
**Solution**: Delete `node_modules` and run `npm install` again

## 📝 Best Practices

1. **Keep components small** - Each component should do one thing
2. **Use TypeScript** - Type your props and state
3. **Follow naming conventions** - PascalCase for components
4. **Keep API calls in services** - Don't call Axios directly in components
5. **Use Zustand for global state** - Avoid prop drilling
6. **Mobile-first responsive** - Design for mobile, enhance for desktop

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

The `dist` folder will contain your production-ready files.

### Deploy to:
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `dist` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist` folder to S3 bucket

## 📄 License

MIT License - Free to use for any purpose

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🎯 Next Steps

1. **Connect Backend**: Update API URLs and test real endpoints
2. **Add More Features**: Implement payment, QR codes, etc.
3. **Customize Design**: Update colors and branding
4. **Add Tests**: Write unit and integration tests
5. **Deploy**: Host on your preferred platform

---

**Need Help?** Check the README.md for more detailed documentation.

**Happy Coding! 🎉**
