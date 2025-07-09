import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users, plants, categories, orders, orderItems, wishlistItems, reviews, newsletterSubscribers, siteContent } from "../shared/schema";
import { eq, desc, sql } from "drizzle-orm";

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

  // Admin authentication
  app.post("/api/admin/authenticate", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (password !== 'verde-luxe-admin-2025') {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is admin
      const adminUser = await db.select().from(users).where(eq(users.isAdmin, true)).limit(1);
      if (!adminUser.length) {
        return res.status(403).json({ error: 'No admin user found' });
      }

      res.json({ success: true, user: adminUser[0] });
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
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

  const httpServer = createServer(app);

  return httpServer;
}
