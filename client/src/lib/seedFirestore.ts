import { db } from './firebase';
import { collection, addDoc, doc, setDoc, getDocs, query, where } from 'firebase/firestore';

export const seedFirestoreDatabase = async () => {
  try {
    console.log('Starting Firestore database seeding...');

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

    // Check if categories already exist
    const categoriesRef = collection(db, 'categories');
    const existingCategories = await getDocs(categoriesRef);
    
    if (existingCategories.empty) {
      for (const category of categoriesData) {
        await addDoc(categoriesRef, category);
      }
      console.log('✓ Categories seeded to Firestore');
    } else {
      console.log('Categories already exist in Firestore');
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

    // Check if plants already exist
    const plantsRef = collection(db, 'plants');
    const existingPlants = await getDocs(plantsRef);
    
    if (existingPlants.empty) {
      for (const plant of plantsData) {
        await addDoc(plantsRef, plant);
      }
      console.log('✓ Plants seeded to Firestore');
    } else {
      console.log('Plants already exist in Firestore');
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

    // Check if site content already exists
    const contentRef = collection(db, 'site_content');
    const existingContent = await getDocs(contentRef);
    
    if (existingContent.empty) {
      for (const content of siteContentData) {
        await addDoc(contentRef, content);
      }
      console.log('✓ Site content seeded to Firestore');
    } else {
      console.log('Site content already exists in Firestore');
    }

    // Newsletter subscribers
    const newsletterData = [
      { 
        email: 'plant.lover@example.com', 
        name: 'Plant Lover',
        subscribedAt: new Date().toISOString()
      },
      { 
        email: 'green.thumb@example.com', 
        name: 'Green Thumb',
        subscribedAt: new Date().toISOString()
      },
      { 
        email: 'botanical.fan@example.com', 
        name: 'Botanical Fan',
        subscribedAt: new Date().toISOString()
      }
    ];

    // Check if newsletter subscribers already exist
    const newsletterRef = collection(db, 'newsletter_subscribers');
    const existingNewsletter = await getDocs(newsletterRef);
    
    if (existingNewsletter.empty) {
      for (const subscriber of newsletterData) {
        await addDoc(newsletterRef, subscriber);
      }
      console.log('✓ Newsletter subscribers seeded to Firestore');
    } else {
      console.log('Newsletter subscribers already exist in Firestore');
    }

    // Create admin credentials if they don't exist
    const adminCredentialsRef = collection(db, 'admin_credentials');
    const existingAdmins = await getDocs(adminCredentialsRef);
    
    if (existingAdmins.empty) {
      await addDoc(adminCredentialsRef, {
        email: 'admin@verdeluxe.com',
        password: 'admin123', // In production, this should be hashed
        createdAt: new Date().toISOString(),
        isActive: true
      });
      console.log('✓ Admin credentials seeded to Firestore');
    } else {
      console.log('Admin credentials already exist in Firestore');
    }

    console.log('🎉 Firestore database seeding completed successfully!');
    return true;
    
  } catch (error) {
    console.error('Error seeding Firestore database:', error);
    throw error;
  }
};

export const checkFirestoreStatus = async () => {
  try {
    const categoriesRef = collection(db, 'categories');
    const plantsRef = collection(db, 'plants');
    const contentRef = collection(db, 'site_content');
    
    const [categoriesSnap, plantsSnap, contentSnap] = await Promise.all([
      getDocs(categoriesRef),
      getDocs(plantsRef),
      getDocs(contentRef)
    ]);
    
    return {
      categories: categoriesSnap.size,
      plants: plantsSnap.size,
      content: contentSnap.size,
      isSeeded: categoriesSnap.size > 0 && plantsSnap.size > 0 && contentSnap.size > 0
    };
  } catch (error) {
    console.error('Error checking Firestore status:', error);
    return { categories: 0, plants: 0, content: 0, isSeeded: false };
  }
};