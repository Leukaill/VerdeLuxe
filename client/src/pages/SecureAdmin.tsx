import { useEffect } from 'react';
import { useLocation } from 'wouter';
import Admin from './Admin';

const SecureAdmin = () => {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if admin is authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    
    if (adminAuth !== 'true') {
      // Redirect to home if not authenticated
      setLocation('/');
      return;
    }
  }, [setLocation]);

  // Check authentication status
  const adminAuth = localStorage.getItem('adminAuthenticated');
  
  if (adminAuth !== 'true') {
    return null; // Will redirect in useEffect
  }

  return <Admin />;
};

export default SecureAdmin;