import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SimpleUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthContextType {
  user: SimpleUser | null;
  loading: boolean;
  signIn: (email: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<SimpleUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, name: string) => {
    try {
      // Check if user already exists
      const usersQuery = query(
        collection(db, 'users'),
        where('email', '==', email.toLowerCase())
      );
      const existingUsers = await getDocs(usersQuery);
      
      let userData: SimpleUser;
      
      if (!existingUsers.empty) {
        // User exists, sign them in
        const existingUser = existingUsers.docs[0];
        userData = {
          id: existingUser.id,
          email: existingUser.data().email,
          name: existingUser.data().name,
          createdAt: existingUser.data().createdAt
        };
      } else {
        // Create new user
        const docRef = await addDoc(collection(db, 'users'), {
          email: email.toLowerCase(),
          name: name.trim(),
          createdAt: new Date().toISOString()
        });
        
        userData = {
          id: docRef.id,
          email: email.toLowerCase(),
          name: name.trim(),
          createdAt: new Date().toISOString()
        };
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
