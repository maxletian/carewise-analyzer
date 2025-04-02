
# CareWise - Health Analytics Platform

## Overview

CareWise is a comprehensive health analytics platform designed to help users track, analyze, and improve their health. The application allows users to submit health data through assessment forms and view personalized health insights and recommendations.

## Features

- **User Authentication**: Secure login and signup system with role-based access control
- **Health Assessment**: Comprehensive health form for data collection
- **Health Analysis**: Data visualization and personalized health insights
- **Admin Dashboard**: Administrative tools for user management and platform oversight
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing

## Technical Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router
- **State Management**: Context API, React Query
- **Charts and Visualizations**: Recharts
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── layout/        # Layout components (Navbar, Sidebar, Footer)
│   └── ui/            # UI components from shadcn
├── contexts/          # React contexts for state management
│   ├── AuthContext.tsx  # Authentication state and logic
│   ├── HealthContext.tsx # Health data state and logic
│   └── ThemeContext.tsx  # Theme (dark/light) state
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── pages/             # Page components
└── main.tsx           # Application entry point
```

## Authentication

CareWise implements a role-based authentication system:

- **Regular Users**: Can access health assessment forms and personal analytics
- **Admin Users**: Have additional access to the admin dashboard and user management tools

### Admin Access
- Username: admin
- Password: pass123

The system is configured to allow up to 20 concurrent users.

## Pages

### Home Page
The landing page providing an overview of the application and its features.

### Login/Signup
Authentication pages for user login and account creation.

### Dashboard
The main user interface showing health summary and quick access to key features.

### Health Assessment
Form for users to submit health data including:
- Personal information
- Health metrics
- Lifestyle habits
- Medical history

### Analysis
Visualization of health data with personalized insights and recommendations.

### Profile
User profile management and settings.

### Admin Dashboard
Administrative interface for user management and platform metrics (admin access only).

## Responsive Design

CareWise is built with a mobile-first approach:
- On mobile devices: Navigation is provided through a bottom bar
- On tablets: Collapsible sidebar navigation
- On desktops: Full sidebar navigation with additional content space

## Theme Support

The application supports both light and dark modes:
- Theme preferences are stored locally
- Theme automatically adapts to system preferences
- Users can manually toggle between themes

## Future Enhancements

- Health data import/export
- Goal setting and tracking
- Community features
- Integration with wearable devices

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## License

© 2024 CareWise. All rights reserved.
