import { db } from "./db";
import { users, categories, plants, siteContent, newsletterSubscribers } from "../shared/schema";

export async function seedDatabase() {
  try {
    // Admin users will be managed through Firestore, not seeded

    // Create categories
    const categoryData = [
      { name: 'Indoor Plants', slug: 'indoor-plants', description: 'Perfect plants for indoor spaces', imageUrl: '/images/indoor-plants.jpg' },
      { name: 'Outdoor Plants', slug: 'outdoor-plants', description: 'Beautiful plants for your garden', imageUrl: '/images/outdoor-plants.jpg' },
      { name: 'Succulents', slug: 'succulents', description: 'Low-maintenance desert plants', imageUrl: '/images/succulents.jpg' },
      { name: 'Air Plants', slug: 'air-plants', description: 'Unique plants that grow without soil', imageUrl: '/images/air-plants.jpg' }
    ];

    for (const category of categoryData) {
      await db.insert(categories).values(category).onConflictDoNothing();
    }

    console.log('Categories seeded');

    // Create site content
    const siteContentData = [
      {
        key: 'about_content',
        title: 'About Verde Luxe',
        content: `Verde Luxe is your premier destination for luxury plants and botanical experiences. We curate the finest selection of indoor and outdoor plants, bringing nature's beauty directly to your space.

Our mission is to create lasting connections between people and plants through our carefully selected collection of premium botanicals. Each plant in our store is chosen for its exceptional quality, unique characteristics, and ability to transform any environment.

Founded by plant enthusiasts, for plant enthusiasts, Verde Luxe combines traditional botanical knowledge with modern cultivation techniques to offer you the healthiest, most vibrant plants available.

Whether you're a seasoned plant parent or just beginning your green journey, our team of experts is here to help you find the perfect botanical companions for your lifestyle and space.`
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

For plant care emergencies or urgent questions, our expert botanists are available 24/7 via our support email.`
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
- Passionate advocate for sustainable gardening practices

**Image:** /images/vanessa-bagenzi.jpg`
      }
    ];

    for (const content of siteContentData) {
      await db.insert(siteContent).values(content).onConflictDoNothing();
    }

    console.log('Site content seeded');

    // Add sample newsletter subscribers
    const newsletterData = [
      { email: 'plant.lover@example.com', name: 'Plant Lover' },
      { email: 'green.thumb@example.com', name: 'Green Thumb' },
      { email: 'botanical.fan@example.com', name: 'Botanical Fan' }
    ];

    for (const subscriber of newsletterData) {
      await db.insert(newsletterSubscribers).values(subscriber).onConflictDoNothing();
    }

    console.log('Newsletter subscribers seeded');

    // Add sample plants
    const plantData = [
      {
        name: 'Monstera Deliciosa',
        slug: 'monstera-deliciosa',
        description: 'A stunning tropical plant with split leaves that brings a jungle vibe to any space.',
        price: '89.99',
        categoryId: 1,
        imageUrls: ['/images/monstera.jpg'],
        stock: 15,
        featured: true,
        tags: ['tropical', 'indoor', 'large'],
        careInstructions: 'Water weekly, bright indirect light',
        lightRequirement: 'Bright indirect light',
        wateringFrequency: 'Weekly',
        difficultyLevel: 'Easy',
        rating: '4.8',
        reviewCount: 24,
        isActive: true
      },
      {
        name: 'Fiddle Leaf Fig',
        slug: 'fiddle-leaf-fig',
        description: 'An elegant statement plant with large, violin-shaped leaves.',
        price: '125.00',
        categoryId: 1,
        imageUrls: ['/images/fiddle-leaf.jpg'],
        stock: 8,
        featured: true,
        tags: ['statement', 'indoor', 'large'],
        careInstructions: 'Water when top soil is dry, bright light',
        lightRequirement: 'Bright light',
        wateringFrequency: 'Bi-weekly',
        difficultyLevel: 'Intermediate',
        rating: '4.5',
        reviewCount: 18,
        isActive: true
      },
      {
        name: 'Snake Plant',
        slug: 'snake-plant',
        description: 'A hardy, low-maintenance plant perfect for beginners.',
        price: '45.00',
        categoryId: 1,
        imageUrls: ['/images/snake-plant.jpg'],
        stock: 25,
        featured: false,
        tags: ['easy-care', 'indoor', 'air-purifying'],
        careInstructions: 'Water monthly, tolerates low light',
        lightRequirement: 'Low to bright light',
        wateringFrequency: 'Monthly',
        difficultyLevel: 'Easy',
        rating: '4.9',
        reviewCount: 45,
        isActive: true
      }
    ];

    for (const plant of plantData) {
      await db.insert(plants).values(plant).onConflictDoNothing();
    }

    console.log('Plants seeded');
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => {
    console.log('Seeding complete');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}