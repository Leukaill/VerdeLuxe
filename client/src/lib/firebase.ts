import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAqxMS295v7XBtFrwZKtrEgb_b_hxzy77Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mydb-47035.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mydb-47035",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mydb-47035.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "816767003162",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:816767003162:web:8530107cd5baadc9167fa3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QRH3R4MTEC"
};

const app = initializeApp(firebaseConfig);
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
  
  return userSnap.data();
};

// Categories functions
export const getCategories = async () => {
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
  const plantsRef = collection(db, 'plants');
  let q = query(plantsRef, where('isActive', '==', true));
  
  if (categoryId) {
    q = query(q, where('categoryId', '==', categoryId));
  }
  
  if (featured) {
    q = query(q, where('featured', '==', true));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
  const plantsRef = collection(db, 'plants');
  return await addDoc(plantsRef, {
    ...plantData,
    createdAt: new Date().toISOString(),
  });
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
  const fileRef = ref(storage, path);
  const snapshot = await uploadBytes(fileRef, file);
  return await getDownloadURL(snapshot.ref);
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
