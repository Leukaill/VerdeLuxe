import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { samplePlants, sampleCategories } from './sampleData';

// Function to seed the Firebase database with sample data
export const seedFirebaseDatabase = async () => {
  try {
    console.log('Seeding Firebase database...');

    // Add categories first
    for (const category of sampleCategories) {
      await setDoc(doc(db, 'categories', category.id), category);
      console.log(`Added category: ${category.name}`);
    }

    // Add plants
    for (const plant of samplePlants) {
      await setDoc(doc(db, 'plants', plant.id), plant);
      console.log(`Added plant: ${plant.name}`);
    }

    console.log('Firebase database seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding Firebase database:', error);
    return false;
  }
};

// Function to check if database has data
export const checkDatabaseStatus = async () => {
  try {
    const plantsRef = collection(db, 'plants');
    const categoriesRef = collection(db, 'categories');
    
    // In a real implementation, you'd query the collections
    // For now, we'll return false to trigger seeding
    return false;
  } catch (error) {
    console.error('Error checking database status:', error);
    return false;
  }
};