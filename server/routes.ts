import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users, plants, categories, orders, orderItems, wishlistItems, reviews, newsletterSubscribers, siteContent, adminCredentials } from "../shared/schema";
import { eq, desc, sql, and, ne } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication middleware
  const verifyAdmin = async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Here you would verify the Firebase token
      // For now, we'll check if user exists and is admin
      const user = await db.select().from(users).where(eq(users.isAdmin, true)).limit(1);
      if (!user.length) {
        return res.status(403).json({ error: 'Admin access required' });
      }

      req.user = user[0];
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Admin login with email/password
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Use raw SQL to avoid Drizzle syntax issues
      const result = await db.execute(sql`SELECT * FROM admin_credentials WHERE email = ${email}`);
      const admin = result.rows[0];

      if (!admin || admin.password_hash !== password) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
      }

      res.json({ success: true, admin });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  // Check if admin exists
  app.get("/api/admin/check-exists", async (req, res) => {
    try {
      const admin = await db.select().from(adminCredentials).limit(1);
      res.json({ hasAdmin: admin.length > 0 });
    } catch (error) {
      console.error('Check admin exists error:', error);
      res.status(500).json({ error: 'Failed to check admin status' });
    }
  });

  // Create admin
  app.post("/api/admin/create", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Check if admin already exists
      const existingAdmin = await db.select().from(adminCredentials).limit(1);
      if (existingAdmin.length > 0) {
        return res.status(400).json({ error: 'Admin already exists' });
      }

      // Create admin
      await db.insert(adminCredentials).values({
        userId: `admin-${Date.now()}`,
        email,
        passwordHash: password, // In production, this should be hashed
      });

      res.json({ success: true, message: 'Admin account created successfully' });
    } catch (error) {
      console.error('Create admin error:', error);
      res.status(500).json({ error: 'Failed to create admin account' });
    }
  });

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
      const [newPlant] = await db.insert(plants).values(plantData).returning();
      res.json(newPlant);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create plant' });
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
