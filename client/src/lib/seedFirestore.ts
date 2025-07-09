import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from './firebase';

const sampleCategories = [
  {
    name: 'Indoor Plants',
    slug: 'indoor-plants',
    description: 'Beautiful plants perfect for indoor spaces',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'
  },
  {
    name: 'Outdoor Plants',
    slug: 'outdoor-plants', 
    description: 'Hardy plants for gardens and outdoor spaces',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400'
  },
  {
    name: 'Succulents',
    slug: 'succulents',
    description: 'Low maintenance succulents and cacti',
    imageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400'
  },
  {
    name: 'Air Plants',
    slug: 'air-plants',
    description: 'Unique air plants that require minimal care',
    imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400'
  }
];

const samplePlants = [
  {
    name: 'Monstera Deliciosa',
    slug: 'monstera-deliciosa',
    description: 'A stunning tropical plant with large, perforated leaves perfect for bright, indirect light.',
    price: 45.99,
    categoryId: 'indoor-plants',
    imageUrls: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'],
    stock: 15,
    featured: true,
    tags: ['tropical', 'large', 'statement'],
    careInstructions: 'Water when top inch of soil feels dry. Provide bright, indirect light.',
    lightRequirement: 'Bright, indirect light',
    wateringFrequency: 'Once per week',
    difficultyLevel: 'Easy',
    isActive: true
  },
  {
    name: 'Snake Plant',
    slug: 'snake-plant',
    description: 'A hardy, low-maintenance plant perfect for beginners with striking upright leaves.',
    price: 29.99,
    categoryId: 'indoor-plants',
    imageUrls: ['https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=500'],
    stock: 20,
    featured: true,
    tags: ['low-maintenance', 'air-purifying', 'beginners'],
    careInstructions: 'Water sparingly, allow soil to dry completely between waterings.',
    lightRequirement: 'Low to bright indirect light',
    wateringFrequency: 'Every 2-3 weeks',
    difficultyLevel: 'Very Easy',
    isActive: true
  },
  {
    name: 'Fiddle Leaf Fig',
    slug: 'fiddle-leaf-fig',
    description: 'An elegant indoor tree with large, violin-shaped leaves that make a bold statement.',
    price: 89.99,
    categoryId: 'indoor-plants',
    imageUrls: ['https://images.unsplash.com/photo-1545239705-1564e58b9e4a?w=500'],
    stock: 8,
    featured: true,
    tags: ['tree', 'statement', 'large'],
    careInstructions: 'Consistent watering and bright, indirect light. Rotate regularly.',
    lightRequirement: 'Bright, indirect light',
    wateringFrequency: 'Once per week',
    difficultyLevel: 'Moderate',
    isActive: true
  },
  {
    name: 'Jade Plant',
    slug: 'jade-plant',
    description: 'A beautiful succulent with thick, glossy leaves that brings good luck and fortune.',
    price: 19.99,
    categoryId: 'succulents',
    imageUrls: ['https://images.unsplash.com/photo-1519336056116-bc0f1771dec8?w=500'],
    stock: 25,
    featured: false,
    tags: ['succulent', 'good-luck', 'easy'],
    careInstructions: 'Water when soil is completely dry. Provide bright light.',
    lightRequirement: 'Bright, direct light',
    wateringFrequency: 'Every 2-3 weeks',
    difficultyLevel: 'Easy',
    isActive: true
  }
];

export const seedFirestoreSimple = async () => {
  try {
    console.log('Starting simple Firestore seeding...');
    
    // First, seed categories
    const categoriesRef = collection(db, 'categories');
    const existingCategories = await getDocs(categoriesRef);
    
    if (existingCategories.empty) {
      console.log('Seeding categories...');
      for (const category of sampleCategories) {
        await addDoc(categoriesRef, {
          ...category,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Categories seeded successfully');
    }
    
    // Then, seed plants
    const plantsRef = collection(db, 'plants');
    const existingPlants = await getDocs(plantsRef);
    
    if (existingPlants.empty) {
      console.log('Seeding plants...');
      for (const plant of samplePlants) {
        await addDoc(plantsRef, {
          ...plant,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Plants seeded successfully');
    }
    
    // Finally, seed admin credentials
    const adminRef = collection(db, 'adminCredentials');
    const existingAdmin = await getDocs(query(adminRef, where('email', '==', 'admin@verdeluxe.com')));
    
    if (existingAdmin.empty) {
      console.log('Seeding admin credentials...');
      await addDoc(adminRef, {
        email: 'admin@verdeluxe.com',
        password: 'admin123',
        createdAt: new Date().toISOString(),
        isActive: true
      });
      console.log('Admin credentials seeded successfully');
    }
    
    console.log('✅ All seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };
    
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
};