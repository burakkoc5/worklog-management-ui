import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WorklogForm } from './pages/WorklogForm';
import { Analytics } from './pages/Analytics';
import { NotFound } from './pages/NotFound';
import { MonthProvider } from './contexts/MonthContext';
import { Settings } from './components/Settings';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

function Navigation() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <img src="/src/assets/logo.svg" alt="Worklog Management Logo" className="h-16 w-auto" />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/analytics"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/analytics'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Analytics
              </Link>
              <Link
                to="/worklog/new"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/worklog/new'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                New Worklog
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Cog6ToothIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </nav>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MonthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/worklog/new" element={<WorklogForm />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </Router>
      </MonthProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
