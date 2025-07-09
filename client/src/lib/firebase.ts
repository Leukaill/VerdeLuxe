import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCcNFwX5pGlz2nRJXYlbc3_Pz4R0k6s8Xs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mvp-db-21c9b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mvp-db-21c9b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mvp-db-21c9b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "198610566372",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:198610566372:web:df58c6fa2207facdd400f1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JWHP8XDN85"
};

// Initialize Firebase only once
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  // If app already exists, get the existing one
  if (error.code === 'app/duplicate-app') {
    app = initializeApp(firebaseConfig, 'verde-luxe-app');
  } else {
    throw error;
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Simple Auth functions
export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(result.user, name);
    return result;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const logout = () => signOut(auth);

// Social Auth Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserDocument(result.user);
    return result;
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
};

// GitHub Sign In
export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await createUserDocument(result.user);
    return result;
  } catch (error) {
    console.error('GitHub sign in error:', error);
    throw error;
  }
};

// User functions
export const createUserDocument = async (user: User, displayName?: string) => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      firebaseUid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || user.email,
      photoURL: user.photoURL,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    });
  }
};

// Categories functions
export const getCategories = async () => {
  try {
    console.log('Fetching categories from Firestore...');
    console.log('Firebase config check:', {
      projectId: db.app.options.projectId,
      authDomain: db.app.options.authDomain
    });
    
    const categoriesRef = collection(db, 'categories');
    console.log('Categories collection reference:', categoriesRef);
    
    const snapshot = await getDocs(categoriesRef);
    console.log('Categories snapshot:', snapshot);
    console.log('Categories docs count:', snapshot.docs.length);
    console.log('Categories empty?:', snapshot.empty);
    
    if (snapshot.empty) {
      console.log('No categories found in Firestore');
      return [];
    }
    
    const categories = snapshot.docs.map(doc => {
      const data = { id: doc.id, ...doc.data() };
      console.log('Category data:', data);
      return data;
    });
    
    console.log('Final categories result:', categories);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

export const createCategory = async (categoryData: any) => {
  const categoriesRef = collection(db, 'categories');
  return await addDoc(categoriesRef, {
    ...categoryData,
    createdAt: new Date().toISOString(),
  });
};

// Plants functions
export const getPlants = async (categoryId?: string, featured?: boolean) => {
  try {
    console.log('Fetching plants from Firestore...');
    console.log('Parameters:', { categoryId, featured });
    
    const plantsRef = collection(db, 'plants');
    console.log('Plants collection reference:', plantsRef);
    
    // Start with a basic query to check if there are any plants at all
    console.log('Fetching all plants first...');
    const allPlantsSnapshot = await getDocs(plantsRef);
    console.log('All plants count:', allPlantsSnapshot.docs.length);
    
    if (allPlantsSnapshot.empty) {
      console.log('No plants found in Firestore at all');
      return [];
    }
    
    // Log all plants for debugging
    allPlantsSnapshot.docs.forEach(doc => {
      console.log('Plant found:', doc.id, doc.data());
    });
    
    // Simplified approach - get all plants and filter in JavaScript to avoid index requirements
    console.log('Getting all plants and filtering client-side...');
    
    let filteredPlants = allPlantsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(plant => plant.isActive === true);
    
    console.log('Active plants count:', filteredPlants.length);
    
    if (categoryId) {
      filteredPlants = filteredPlants.filter(plant => plant.categoryId === categoryId);
      console.log('After category filter:', filteredPlants.length);
    }
    
    if (featured) {
      filteredPlants = filteredPlants.filter(plant => plant.featured === true);
      console.log('After featured filter:', filteredPlants.length);
    }
    
    // Sort by creation date (newest first)
    filteredPlants.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Fetch photos for each plant from PostgreSQL
    console.log('Fetching photos for plants...');
    const plantsWithPhotos = await Promise.all(
      filteredPlants.map(async (plant) => {
        try {
          const photosResponse = await fetch(`/api/plants/${plant.id}/photos`);
          const photos = photosResponse.ok ? await photosResponse.json() : [];
          
          // Convert PostgreSQL photos to imageUrls format for compatibility
          const imageUrls = photos.map((photo: any) => photo.url);
          
          return {
            ...plant,
            imageUrls,
            photos // Keep the full photo objects for admin use
          };
        } catch (error) {
          console.error(`Error fetching photos for plant ${plant.id}:`, error);
          return {
            ...plant,
            imageUrls: [],
            photos: []
          };
        }
      })
    );
    
    console.log('Final plants result with photos:', plantsWithPhotos);
    return plantsWithPhotos;
  } catch (error) {
    console.error('Error fetching plants:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

export const getPlantById = async (plantId: string) => {
  const plantRef = doc(db, 'plants', plantId);
  const plantSnap = await getDoc(plantRef);
  
  if (plantSnap.exists()) {
    return { id: plantSnap.id, ...plantSnap.data() };
  }
  
  return null;
};

export const createPlant = async (plantData: any) => {
  try {
    console.log('Creating plant with data:', plantData);
    const plantsRef = collection(db, 'plants');
    console.log('Plants collection reference:', plantsRef);
    
    const plantToCreate = {
      ...plantData,
      createdAt: new Date().toISOString(),
      isActive: true,
      slug: plantData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      // Remove imageUrls from Firestore - photos will be stored in PostgreSQL
      imageUrls: [],
    };
    
    console.log('Final plant data to create:', plantToCreate);
    
    const docRef = await addDoc(plantsRef, plantToCreate);
    console.log('Plant created successfully with ID:', docRef.id);
    
    return docRef;
  } catch (error) {
    console.error('Error creating plant:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

export const updatePlant = async (plantId: string, plantData: any) => {
  const plantRef = doc(db, 'plants', plantId);
  return await updateDoc(plantRef, plantData);
};

export const deletePlant = async (plantId: string) => {
  const plantRef = doc(db, 'plants', plantId);
  return await updateDoc(plantRef, { isActive: false });
};

// Cart functions
export const getCartItems = async (userId: string) => {
  const cartRef = collection(db, 'cartItems');
  const q = query(cartRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addToCart = async (userId: string, plantId: string, quantity: number = 1) => {
  const cartRef = collection(db, 'cartItems');
  
  // Check if item already exists in cart
  const q = query(cartRef, where('userId', '==', userId), where('plantId', '==', plantId));
  const snapshot = await getDocs(q);
  
  if (!snapshot.empty) {
    // Update existing item
    const existingItem = snapshot.docs[0];
    const currentQuantity = existingItem.data().quantity || 0;
    await updateDoc(existingItem.ref, { quantity: currentQuantity + quantity });
    return existingItem.ref;
  } else {
    // Add new item
    return await addDoc(cartRef, {
      userId,
      plantId,
      quantity,
      createdAt: new Date().toISOString(),
    });
  }
};

export const updateCartItem = async (cartItemId: string, quantity: number) => {
  const cartItemRef = doc(db, 'cartItems', cartItemId);
  return await updateDoc(cartItemRef, { quantity });
};

export const removeFromCart = async (cartItemId: string) => {
  const cartItemRef = doc(db, 'cartItems', cartItemId);
  return await deleteDoc(cartItemRef);
};

export const clearCart = async (userId: string) => {
  const cartRef = collection(db, 'cartItems');
  const q = query(cartRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  return await Promise.all(deletePromises);
};

// Orders functions
export const createOrder = async (orderData: any) => {
  const ordersRef = collection(db, 'orders');
  return await addDoc(ordersRef, {
    ...orderData,
    createdAt: new Date().toISOString(),
  });
};

export const getOrders = async (userId?: string) => {
  const ordersRef = collection(db, 'orders');
  let q = query(ordersRef, orderBy('createdAt', 'desc'));
  
  if (userId) {
    q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, 'orders', orderId);
  return await updateDoc(orderRef, { status });
};

// Wishlist functions
export const getWishlistItems = async (userId: string) => {
  const wishlistRef = collection(db, 'wishlistItems');
  const q = query(wishlistRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addToWishlist = async (userId: string, plantId: string) => {
  const wishlistRef = collection(db, 'wishlistItems');
  return await addDoc(wishlistRef, {
    userId,
    plantId,
    createdAt: new Date().toISOString(),
  });
};

export const removeFromWishlist = async (wishlistItemId: string) => {
  const wishlistItemRef = doc(db, 'wishlistItems', wishlistItemId);
  return await deleteDoc(wishlistItemRef);
};

// File upload function
export const uploadFile = async (file: File, path: string) => {
  try {
    console.log('Uploading file:', file.name, 'to path:', path);
    const fileRef = ref(storage, path);
    console.log('File reference created:', fileRef);
    
    const snapshot = await uploadBytes(fileRef, file);
    console.log('File uploaded successfully, snapshot:', snapshot);
    
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadUrl);
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// =============== FIRESTORE-BASED ADMIN CREDENTIAL SYSTEM ===============

// Admin credentials collection in Firestore
export const createAdminCredentials = async (email: string, password: string) => {
  try {
    const credentialsRef = collection(db, 'adminCredentials');
    
    // Check if admin already exists
    const q = query(credentialsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      throw new Error('Admin credentials already exist');
    }
    
    // Create new admin credentials
    const docRef = await addDoc(credentialsRef, {
      email,
      password, // In production, this should be hashed
      createdAt: new Date().toISOString(),
      isActive: true,
    });
    
    console.log('Admin credentials created with ID:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error creating admin credentials:', error);
    throw error;
  }
};

export const verifyAdminCredentials = async (email: string, password: string) => {
  try {
    console.log('Verifying admin credentials for:', email);
    const credentialsRef = collection(db, 'adminCredentials');
    
    // First, let's check what's in the collection
    const allSnapshot = await getDocs(credentialsRef);
    console.log('All admin credentials in collection:', allSnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      hasPassword: !!doc.data().password,
      isActive: doc.data().isActive
    })));
    
    const q = query(
      credentialsRef, 
      where('email', '==', email),
      where('password', '==', password),
      where('isActive', '==', true)
    );
    
    const snapshot = await getDocs(q);
    console.log('Query result snapshot empty:', snapshot.empty);
    
    if (snapshot.empty) {
      // Let's also check if the email exists but with wrong password
      const emailQuery = query(credentialsRef, where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);
      console.log('Email exists in collection:', !emailSnapshot.empty);
      if (!emailSnapshot.empty) {
        console.log('Existing email data:', emailSnapshot.docs[0].data());
      }
      return null;
    }
    
    const adminDoc = snapshot.docs[0];
    console.log('Admin login successful for:', email);
    return {
      id: adminDoc.id,
      ...adminDoc.data()
    };
  } catch (error) {
    console.error('Error verifying admin credentials:', error);
    throw error;
  }
};

export const checkAdminExists = async () => {
  try {
    const credentialsRef = collection(db, 'adminCredentials');
    const q = query(credentialsRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    console.log('Admin exists check - found', snapshot.docs.length, 'active admin(s)');
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking admin existence:', error);
    return false;
  }
};

export const getAllAdminCredentials = async () => {
  try {
    const credentialsRef = collection(db, 'adminCredentials');
    const q = query(credentialsRef, where('isActive', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting admin credentials:', error);
    return [];
  }
};

export const deleteAdminCredentials = async (adminId: string) => {
  try {
    const adminRef = doc(db, 'adminCredentials', adminId);
    await updateDoc(adminRef, { isActive: false });
    console.log('Admin credentials deactivated');
    return true;
  } catch (error) {
    console.error('Error deleting admin credentials:', error);
    throw error;
  }
};

// =============== FIRESTORE SEEDING FUNCTIONS ===============

export const seedFirestoreData = async () => {
  try {
    console.log('Starting Firestore database seeding...');
    
    // Update Firestore rules to allow seeding temporarily
    console.log('Note: Make sure Firestore rules allow write access for seeding');

    // Categories data
    const categoriesData = [
      { 
        name: 'Indoor Plants', 
        slug: 'indoor-plants', 
        description: 'Perfect plants for indoor spaces', 
        imageUrl: '/images/indoor-plants.jpg',
        createdAt: new Date().toISOString()
      },
      { 
        name: 'Outdoor Plants', 
        slug: 'outdoor-plants', 
        description: 'Beautiful plants for your garden', 
        imageUrl: '/images/outdoor-plants.jpg',
        createdAt: new Date().toISOString()
      },
      { 
        name: 'Succulents', 
        slug: 'succulents', 
        description: 'Low-maintenance desert plants', 
        imageUrl: '/images/succulents.jpg',
        createdAt: new Date().toISOString()
      },
      { 
        name: 'Air Plants', 
        slug: 'air-plants', 
        description: 'Unique plants that grow without soil', 
        imageUrl: '/images/air-plants.jpg',
        createdAt: new Date().toISOString()
      }
    ];

    // Seed categories
    const categoriesRef = collection(db, 'categories');
    const existingCategories = await getDocs(categoriesRef);
    
    if (existingCategories.empty) {
      for (const category of categoriesData) {
        await addDoc(categoriesRef, category);
      }
      console.log('✓ Categories seeded to Firestore');
    } else {
      console.log('Categories already exist in Firestore (' + existingCategories.size + ' found)');
    }

    // Plants data
    const plantsData = [
      {
        name: 'Monstera Deliciosa',
        slug: 'monstera-deliciosa',
        description: 'A stunning tropical plant with split leaves that brings a jungle vibe to any space.',
        price: 89.99,
        categoryId: 'indoor-plants',
        imageUrls: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500',
          'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500'
        ],
        stock: 15,
        featured: true,
        tags: ['tropical', 'indoor', 'large'],
        careInstructions: 'Water weekly, bright indirect light',
        lightRequirement: 'Bright indirect light',
        wateringFrequency: 'Weekly',
        difficultyLevel: 'Easy',
        rating: 4.8,
        reviewCount: 24,
        threeDModelUrl: '/models/monstera.glb',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        name: 'Fiddle Leaf Fig',
        slug: 'fiddle-leaf-fig',
        description: 'An elegant statement plant with large, violin-shaped leaves.',
        price: 125.00,
        categoryId: 'indoor-plants',
        imageUrls: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
          'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500'
        ],
        stock: 8,
        featured: true,
        tags: ['statement', 'indoor', 'large'],
        careInstructions: 'Water when top soil is dry, bright light',
        lightRequirement: 'Bright light',
        wateringFrequency: 'Bi-weekly',
        difficultyLevel: 'Intermediate',
        rating: 4.5,
        reviewCount: 18,
        threeDModelUrl: '/models/fiddle-leaf.glb',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        name: 'Snake Plant',
        slug: 'snake-plant',
        description: 'A hardy, low-maintenance plant perfect for beginners.',
        price: 45.00,
        categoryId: 'indoor-plants',
        imageUrls: [
          'https://images.unsplash.com/photo-1509423350716-97f2360af2e4?w=500',
          'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?w=500'
        ],
        stock: 25,
        featured: false,
        tags: ['easy-care', 'indoor', 'air-purifying'],
        careInstructions: 'Water monthly, tolerates low light',
        lightRequirement: 'Low to bright light',
        wateringFrequency: 'Monthly',
        difficultyLevel: 'Easy',
        rating: 4.9,
        reviewCount: 45,
        threeDModelUrl: '/models/snake-plant.glb',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        name: 'Peace Lily',
        slug: 'peace-lily',
        description: 'Beautiful white flowers and glossy green leaves make this an elegant choice.',
        price: 65.00,
        categoryId: 'indoor-plants',
        imageUrls: [
          'https://images.unsplash.com/photo-1508502726440-477c94bc369e?w=500',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'
        ],
        stock: 12,
        featured: true,
        tags: ['flowering', 'indoor', 'air-purifying'],
        careInstructions: 'Keep soil moist, indirect light',
        lightRequirement: 'Bright indirect light',
        wateringFrequency: 'Twice weekly',
        difficultyLevel: 'Easy',
        rating: 4.6,
        reviewCount: 32,
        threeDModelUrl: '/models/peace-lily.glb',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        name: 'Rubber Tree',
        slug: 'rubber-tree',
        description: 'Glossy, dark green leaves on a sturdy trunk make this a classic houseplant.',
        price: 75.00,
        categoryId: 'indoor-plants',
        imageUrls: [
          'https://images.unsplash.com/photo-1565011523534-747a8601c0e3?w=500',
          'https://images.unsplash.com/photo-1509423350716-97f2360af2e4?w=500'
        ],
        stock: 18,
        featured: false,
        tags: ['classic', 'indoor', 'low-maintenance'],
        careInstructions: 'Water when topsoil is dry, bright light',
        lightRequirement: 'Bright indirect light',
        wateringFrequency: 'Weekly',
        difficultyLevel: 'Easy',
        rating: 4.7,
        reviewCount: 28,
        threeDModelUrl: '/models/rubber-tree.glb',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        name: 'Jade Plant',
        slug: 'jade-plant',
        description: 'A succulent with thick, fleshy leaves that symbolizes good luck and prosperity.',
        price: 35.00,
        categoryId: 'succulents',
        imageUrls: [
          'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500',
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500'
        ],
        stock: 30,
        featured: false,
        tags: ['succulent', 'lucky', 'easy-care'],
        careInstructions: 'Water sparingly, bright light',
        lightRequirement: 'Bright light',
        wateringFrequency: 'Every 2-3 weeks',
        difficultyLevel: 'Easy',
        rating: 4.8,
        reviewCount: 56,
        threeDModelUrl: '/models/jade-plant.glb',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    // Seed plants
    const plantsRef = collection(db, 'plants');
    const existingPlants = await getDocs(plantsRef);
    
    if (existingPlants.empty) {
      for (const plant of plantsData) {
        await addDoc(plantsRef, plant);
      }
      console.log('✓ Plants seeded to Firestore');
    } else {
      console.log('Plants already exist in Firestore (' + existingPlants.size + ' found)');
    }

    // Site content data
    const siteContentData = [
      {
        key: 'about_content',
        title: 'About Verde Luxe',
        content: `Verde Luxe is your premier destination for luxury plants and botanical experiences. We curate the finest selection of indoor and outdoor plants, bringing nature's beauty directly to your space.

Our mission is to create lasting connections between people and plants through our carefully selected collection of premium botanicals. Each plant in our store is chosen for its exceptional quality, unique characteristics, and ability to transform any environment.

Founded by plant enthusiasts, for plant enthusiasts, Verde Luxe combines traditional botanical knowledge with modern cultivation techniques to offer you the healthiest, most vibrant plants available.

Whether you're a seasoned plant parent or just beginning your green journey, our team of experts is here to help you find the perfect botanical companions for your lifestyle and space.`,
        updatedAt: new Date().toISOString()
      },
      {
        key: 'contact_info',
        title: 'Get in Touch',
        content: `We'd love to hear from you! Contact our team for any questions about our plants, care instructions, or special requests.

**Store Location:**
Verde Luxe Botanical Gallery
123 Green Street, Plant District
Garden City, GC 12345

**Hours:**
Monday - Friday: 9:00 AM - 7:00 PM
Saturday: 9:00 AM - 6:00 PM
Sunday: 11:00 AM - 5:00 PM

**Contact Information:**
Phone: (555) 123-VERDE
Email: hello@verdeluxe.com
Support: support@verdeluxe.com

**Follow Us:**
Instagram: @verdeluxe
Facebook: Verde Luxe Plants
Twitter: @verdeluxeplants

For plant care emergencies or urgent questions, our expert botanists are available 24/7 via our support email.`,
        updatedAt: new Date().toISOString()
      },
      {
        key: 'vanessa_bagenzi',
        title: 'Meet Vanessa Bagenzi',
        content: `It all started with a young lady named Vanessa Bagenzi, who discovered her love for plants during her computer science studies. While debugging code late into the night, she found solace in the small succulent on her desk—a gift from her grandmother.

As her plant collection grew, so did her programming skills. Vanessa realized that many people struggled to find the right plants for their homes and lacked proper care guidance. She envisioned a digital platform that could bridge this gap, combining her technical expertise with her botanical passion.

After graduating, Vanessa spent months researching plant care, interviewing botanists, and designing user-friendly interfaces. She wanted to create more than just an online store—she aimed to build a community where plant lovers could thrive together.

Today, Verde Luxe reflects Vanessa's vision: a place where technology meets nature, where every plant finds the right home, and where both beginners and experts can discover the joy of plant parenthood.

**Vanessa's Expertise:**
- Computer Science Degree with focus on User Experience
- Certified Horticulturist and Plant Care Specialist  
- 5+ years experience in e-commerce and digital platform development
- Passionate advocate for sustainable gardening practices`,
        updatedAt: new Date().toISOString()
      }
    ];

    // Seed site content
    const contentRef = collection(db, 'site_content');
    const existingContent = await getDocs(contentRef);
    
    if (existingContent.empty) {
      for (const content of siteContentData) {
        await addDoc(contentRef, content);
      }
      console.log('✓ Site content seeded to Firestore');
    } else {
      console.log('Site content already exists in Firestore (' + existingContent.size + ' found)');
    }

    console.log('🎉 Firestore database seeding completed successfully!');
    return true;
    
  } catch (error) {
    console.error('Error seeding Firestore database:', error);
    throw error;
  }
};
