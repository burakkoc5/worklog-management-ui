# Worklog Management UI

A modern web application for managing work logs, built with React, TypeScript, and Vite. This application provides an intuitive interface for tracking and managing work activities, time entries, and project progress.

## ✨ Features

- 📊 Interactive Dashboard
- ⏱️ Time Tracking
- 📝 Work Log Management
- 👥 User Management
- 📈 Project Progress Tracking
- 🔍 Advanced Search and Filtering

## 🛠️ Tech Stack

- React 18+
- TypeScript
- Vite
- Modern UI Components
- Responsive Design

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd worklog-management-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
worklog-management-ui/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── tests/            # Test files
```

## 🔍 Features in Detail

### Dashboard
- Overview of daily/weekly/monthly work logs
- Quick access to recent activities
- Performance metrics and statistics

### Time Tracking
- Start/stop timer functionality
- Manual time entry
- Time categorization by project/task

### Work Log Management
- Create, edit, and delete work logs
- Add detailed descriptions
- Attach files and links

### Settings Management
The application includes a comprehensive settings management system that allows administrators to manage:

#### Employee Management
- Create, edit, and delete employee records
- Assign grades and roles to employees
- Manage employee details and permissions

#### Worklog Types
- Define different types of work activities
- Customize worklog categories
- Set up worklog templates

#### Grade Management
- Create and manage employee grades
- Set up grade hierarchies
- Configure grade-specific settings

The settings interface is implemented as a modal dialog with tabbed navigation, providing an intuitive way to manage all system configurations in one place.

## 💻 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run linter

### Code Style

This project uses ESLint and Prettier for code formatting. The configuration is set up to enforce consistent code style across the project.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For support, please open an issue in the GitHub repository or contact the development team.
