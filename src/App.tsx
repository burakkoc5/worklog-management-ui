import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WorklogForm } from './pages/WorklogForm';
import { Analytics } from './pages/Analytics';
import { NotFound } from './pages/NotFound';
import { WorklogEntries } from './pages/WorklogEntries';
import { MonthProvider } from './contexts/MonthContext';
import { Settings } from './components/Settings';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const queryClient = new QueryClient();

function Navigation() {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
              <Link
                to="/worklog/entries"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === '/worklog/entries'
                    ? 'border-indigo-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Worklog Entries
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
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/analytics'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Analytics
            </Link>
            <Link
              to="/worklog/new"
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/worklog/new'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              New Worklog
            </Link>
            <Link
              to="/worklog/entries"
              onClick={toggleMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/worklog/entries'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              Worklog Entries
            </Link>
          </div>
        </div>
      )}
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
                <Route path="/worklog/entries" element={<WorklogEntries />} />
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
