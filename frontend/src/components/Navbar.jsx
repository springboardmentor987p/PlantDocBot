import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Leaf, LogOut, User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // Check authentication status when the component loads
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus) {
      setIsAuthenticated(true);
      setUserName(localStorage.getItem('userName') || 'User');
    }
  }, []);

  const handleLogout = () => {
    // Clear all user-related data from local storage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');

    // Update the component's state
    setIsAuthenticated(false);

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    // Navigate to the main dashboard page after logout
    navigate('/');
  };


  return (
    <nav className="sticky top-0 z-50 py-3">
        <div className="container max-w-6xl mx-auto px-6 py-2 flex items-center justify-between bg-white/80 backdrop-blur-md shadow-lg rounded-xl border border-green-100">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PLANT DOC</h1>
              <p className="text-xs text-gray-600">Disease Detection System</p>
            </div>
          </div>

          {/* User Section: Conditionally render based on authentication status */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              // If user IS Logged In
            <>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{userName}</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            </>
            ) : (
              // If user is not Logged In
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-green-700 bg-transparent hover:bg-green-100 shadow-none px-4 py-2 rounded-lg">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-4 py-2 rounded-lg">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
    </nav>
  );
};

export default Navbar;