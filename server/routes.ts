import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users, plants, categories, orders, orderItems, wishlistItems, reviews, newsletterSubscribers, siteContent } from "../shared/schema";
import { eq, desc, sql, and, ne } from "drizzle-orm";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const uploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadType = req.body.type || 'plant';
      const uploadDir = `client/public/uploads/${uploadType}s`;
      
      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: uploadStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });

  // Admin authentication middleware - now checks client session
  const verifyAdmin = async (req: any, res: any, next: any) => {
    try {
      // Check if client has valid admin session
      const adminAuth = req.headers['x-admin-auth'];
      if (!adminAuth) {
        return res.status(401).json({ error: 'Admin authentication required' });
      }

      // In a real implementation, you would verify the admin token here
      // For now, we trust the client-side admin authentication
      next();
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  // Note: Admin authentication is now handled entirely through Firestore
  // No server-side admin endpoints needed - all handled client-side with Firebase

  // Check admin status
  app.get("/api/admin/check-status", async (req, res) => {
    try {
      // Check if user is admin
      const adminUser = await db.select().from(users).where(eq(users.isAdmin, true)).limit(1);
      
      res.json({ 
        isAdmin: adminUser.length > 0
      });
    } catch (error) {
      res.status(500).json({ error: 'Status check failed' });
    }
  });

  // Get all users
  app.get("/api/admin/users", verifyAdmin, async (req, res) => {
    try {
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Toggle user admin status
  app.patch("/api/admin/users/:id/toggle-admin", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { isAdmin } = req.body;

      await db.update(users).set({ isAdmin }).where(eq(users.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  // Update user
  app.put("/api/admin/users/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { displayName, password } = req.body;
      
      const updateData: any = {};
      if (displayName) updateData.displayName = displayName;
      if (password) {
        // In a real app, you'd hash the password here
        updateData.password = password;
      }

      await db.update(users).set(updateData).where(eq(users.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  // Delete user
  app.delete("/api/admin/users/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Delete related data first
      await db.delete(cartItems).where(eq(cartItems.userId, parseInt(id)));
      await db.delete(wishlistItems).where(eq(wishlistItems.userId, parseInt(id)));
      await db.delete(orders).where(eq(orders.userId, parseInt(id)));
      await db.delete(reviews).where(eq(reviews.userId, parseInt(id)));
      
      // Delete user
      await db.delete(users).where(eq(users.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  // Get all plants
  app.get("/api/admin/plants", verifyAdmin, async (req, res) => {
    try {
      const allPlants = await db.select().from(plants).orderBy(desc(plants.createdAt));
      res.json(allPlants);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plants' });
    }
  });

  // Create plant
  app.post("/api/admin/plants", verifyAdmin, async (req, res) => {
    try {
      const plantData = req.body;
      // Generate slug from name
      const slug = plantData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const plantToInsert = {
        ...plantData,
        slug,
        isActive: true,
        tags: plantData.tags || [],
        imageUrls: plantData.imageUrls || [],
        createdAt: new Date()
      };
      const [newPlant] = await db.insert(plants).values(plantToInsert).returning();
      res.json(newPlant);
    } catch (error) {
      console.error('Error creating plant:', error);
      res.status(500).json({ error: 'Failed to create plant' });
    }
  });

  // Update plant
  app.put("/api/admin/plants/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const plantData = req.body;
      
      // Generate slug from name if name is provided
      if (plantData.name) {
        plantData.slug = plantData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      
      await db.update(plants).set(plantData).where(eq(plants.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating plant:', error);
      res.status(500).json({ error: 'Failed to update plant' });
    }
  });

  // Delete plant
  app.delete("/api/admin/plants/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(plants).where(eq(plants.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting plant:', error);
      res.status(500).json({ error: 'Failed to delete plant' });
    }
  });

  // Update plant
  app.put("/api/admin/plants/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const plantData = req.body;

      await db.update(plants).set(plantData).where(eq(plants.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update plant' });
    }
  });

  // Delete plant
  app.delete("/api/admin/plants/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(plants).where(eq(plants.id, parseInt(id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete plant' });
    }
  });

  // Get newsletter subscribers
  app.get("/api/admin/newsletters", verifyAdmin, async (req, res) => {
    try {
      const subscribers = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch newsletter subscribers' });
    }
  });

  // Get site content
  app.get("/api/admin/content", verifyAdmin, async (req, res) => {
    try {
      const content = await db.select().from(siteContent).orderBy(siteContent.key);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch site content' });
    }
  });

  // Update site content
  app.put("/api/admin/content/:id", verifyAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      await db.update(siteContent)
        .set({ 
          title, 
          content, 
          updatedAt: new Date() 
        })
        .where(eq(siteContent.id, parseInt(id)));

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update content' });
    }
  });

  // Public content endpoint for About page
  app.get("/api/content", async (req, res) => {
    try {
      const content = await db.select().from(siteContent).orderBy(siteContent.key);
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch content' });
    }
  });

  // Image upload endpoint
  app.post("/api/admin/upload-image", verifyAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const uploadType = req.body.type || 'plant';
      const imageUrl = `/uploads/${uploadType}s/${req.file.filename}`;
      
      res.json({ 
        success: true, 
        imageUrl,
        filename: req.file.filename 
      });
    } catch (error) {
      console.error('Image upload error:', error);
      res.status(500).json({ error: 'Image upload failed' });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email, name } = req.body;
      
      const [subscriber] = await db.insert(newsletterSubscribers)
        .values({ email, name })
        .onConflictDoUpdate({
          target: newsletterSubscribers.email,
          set: { subscribed: true }
        })
        .returning();

      res.json(subscriber);
    } catch (error) {
      res.status(500).json({ error: 'Subscription failed' });
    }
  });

  // Regular user routes (existing functionality)
  app.get("/api/plants", async (req, res) => {
    try {
      const allPlants = await db.select().from(plants).where(eq(plants.isActive, true));
      res.json(allPlants);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch plants' });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const allCategories = await db.select().from(categories);
      res.json(allCategories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Admin routes
  app.get('/api/admin/check-exists', async (req, res) => {
    try {
      // Check if any admin credentials exist
      const adminCreds = await db.select().from(adminCredentials);
      const hasAdmin = adminCreds.length > 0;
      res.json({ hasAdmin });
    } catch (error) {
      console.error('Error checking admin existence:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/create', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check if real admin already exists (not seeded admin)
      const existingAdmins = await db.select().from(adminCredentials);
      if (existingAdmins.length > 0) {
        return res.status(400).json({ message: 'Admin account already exists' });
      }

      // Generate a unique admin ID
      const adminId = `admin-${Date.now()}`;

      // Create admin credentials
      await db.insert(adminCredentials)
        .values({
          userId: adminId,
          email,
          passwordHash: password // In production, hash the password
        });

      // Create admin user record
      await db.insert(users)
        .values({
          firebaseUid: adminId,
          email,
          displayName: 'Admin',
          isAdmin: true
        });

      res.json({ success: true, message: 'Admin account created successfully' });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ error: 'Failed to create admin account' });
    }
  });

  app.post('/api/admin/authenticate', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check admin credentials by email
      const adminCred = await db.select()
        .from(adminCredentials)
        .where(eq(adminCredentials.email, email))
        .limit(1);

      if (adminCred.length === 0 || adminCred[0].passwordHash !== password) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      res.json({ success: true, message: 'Admin authenticated successfully' });
    } catch (error) {
      console.error('Error authenticating admin:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
