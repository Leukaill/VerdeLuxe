// Simple local authentication system
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

class LocalAuth {
  private listeners: ((user: User | null) => void)[] = [];
  private currentUser: User | null = null;

  constructor() {
    // Load user from localStorage on init
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser));
  }

  private saveUser(user: User | null) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
    this.currentUser = user;
    this.notifyListeners();
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
    // Check if user already exists
    const existingUsers = this.getStoredUsers();
    if (existingUsers.find(u => u.email === email)) {
      throw new Error('Email already in use');
    }

    if (password.length < 6) {
      throw new Error('Password should be at least 6 characters');
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    // Store user credentials
    const users = existingUsers;
    users.push({ ...user, password });
    localStorage.setItem('users', JSON.stringify(users));

    this.saveUser(user);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    this.saveUser(userWithoutPassword);
    return userWithoutPassword;
  }

  async signOut(): Promise<void> {
    this.saveUser(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private getStoredUsers(): any[] {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  }
}

export const localAuth = new LocalAuth();