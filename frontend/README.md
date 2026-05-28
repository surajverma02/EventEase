# EventEase — Online Event Management System

A modern, premium SaaS-style event management platform built with React, featuring a beautiful, minimal design and comprehensive event management capabilities.

## 🎨 Design Features

- **Modern SaaS Dashboard** - Clean, minimal, and premium interface
- **Spacious Layout** - Generous whitespace and comfortable spacing
- **Dark Sidebar** - Professional dark navigation with orange accents
- **Responsive Design** - Desktop-first with mobile adaptability
- **Inter Font** - Consistent typography throughout
- **Smooth Animations** - Elegant transitions and hover effects
- **Card-Based UI** - Clean, organized content presentation

## 🎯 Key Features

### Authentication
- JWT-based authentication
- Login & Registration
- Role-based access (Admin, Organizer, User)
- Protected routes

### Dashboard
- Real-time statistics
- Recent events overview
- Quick action cards
- Admin metrics (for admin users)

### Event Management
- Create, read, update, delete events
- Event categories (Technology, Music, Sports, etc.)
- Event status tracking (Upcoming, Ongoing, Completed, Cancelled)
- Banner image upload
- Search and filtering
- Category and status filters

### Booking System
- Book event tickets
- View my bookings
- Cancel bookings
- Booking history

### Notifications
- Real-time notifications
- Read/unread status
- Mark as read functionality
- Notification dropdown in navbar

### User Management (Admin Only)
- View all users
- User roles and permissions
- Search users

### Analytics (Admin Only)
- Event statistics
- Booking trends
- Category distribution
- Interactive charts
- Top performing events

### Settings
- Profile management
- Password change
- Notification preferences
- User preferences

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **React Router** - Routing
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **Sonner** - Toast notifications

### Backend Integration
- Spring Boot REST APIs
- MongoDB Atlas database
- JWT authentication
- Cloudinary image upload

## 🎨 Color System

```css
Primary Accent: #EA580C
Primary Hover: #C2410C
Background: #F8FAFC
Card: #FFFFFF
Primary Text: #0F172A
Secondary Text: #64748B
Border: #E2E8F0
Sidebar: #111827
Sidebar Text: #CBD5E1
Success: #16A34A
Error: #DC2626
Warning: #D97706
```

## 📁 Project Structure

```
src/
├── app/
│   └── App.tsx                 # Main app component with routing
├── layouts/
│   ├── AuthLayout.tsx          # Authentication layout
│   └── DashboardLayout.tsx     # Dashboard layout with sidebar
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
├── store/
│   ├── authStore.ts            # Authentication state
│   └── notificationStore.ts    # Notifications state
├── services/
│   └── api.ts                  # API service layer
└── styles/
    ├── fonts.css               # Google Fonts import
    ├── theme.css               # Design tokens
    └── index.css               # Global styles
```

## 🚀 Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Backend URL**
Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080';
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
```

## 🔐 Authentication

The app uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests via Axios interceptors.

### Default Routes
- `/login` - Login page
- `/register` - Registration page
- `/` or `/dashboard` - Dashboard (protected)
- `/events` - Events listing (protected)
- `/bookings` - My bookings (protected)
- `/settings` - User settings (protected)

### Admin-Only Routes
- `/users` - User management
- `/analytics` - Analytics dashboard

## 📡 API Integration

All API endpoints are configured in `src/services/api.ts`:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`

### Events
- `GET /api/events`
- `GET /api/events/{id}`
- `POST /api/events`
- `PUT /api/events/{id}`
- `DELETE /api/events/{id}`
- `GET /api/events/search?keyword=`
- `GET /api/events/category?category=`
- `GET /api/events/status?status=`

### Tickets
- `POST /api/tickets/book/{eventId}`
- `DELETE /api/tickets/cancel/{ticketId}`
- `GET /api/tickets/my-tickets`

### Notifications
- `GET /api/notifications`
- `PUT /api/notifications/{id}/read`

### Dashboard
- `GET /api/dashboard/admin`

## 🎭 User Roles

### User
- Browse events
- Book tickets
- View own bookings
- Manage profile

### Organizer
- All User permissions
- Create events
- Edit own events
- Delete own events

### Admin
- All Organizer permissions
- View all users
- Access analytics
- Manage all events
- System-wide permissions

## 🎨 Design Principles

1. **Spacious & Clean** - Generous padding and margins
2. **Consistent Spacing** - 4px/8px base unit system
3. **Subtle Shadows** - Soft elevation for depth
4. **Rounded Corners** - 8px default border radius
5. **Minimal Color** - Orange accent on neutral palette
6. **Professional Typography** - Inter font family
7. **Smooth Interactions** - Gentle transitions
8. **Clear Hierarchy** - Well-structured information

## 📱 Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🌟 Key Components

### Sidebar Navigation
- Fixed left sidebar (256px width)
- Dark theme (#111827)
- Active orange indicator
- Icon + label navigation
- User profile section

### Top Navbar
- Search bar
- Notification bell with badge
- User profile dropdown
- Breadcrumb support

### Cards
- White background
- Border: #E2E8F0
- Rounded corners (12px)
- Hover shadow effect
- Consistent padding

### Buttons
- Primary: Orange (#EA580C)
- Hover: Darker orange (#C2410C)
- Secondary: Gray background
- Rounded (8px)
- Medium font weight

### Forms
- Clean input fields
- Focus ring (orange)
- Validation states
- Helper text support
- Label + input structure

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Advanced search with filters
- [ ] Event calendar view
- [ ] QR code tickets
- [ ] Payment integration
- [ ] Social sharing
- [ ] Event ratings and reviews
- [ ] Email notifications
- [ ] Dark mode support
- [ ] Multi-language support

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using React, Tailwind CSS, and modern web technologies.
