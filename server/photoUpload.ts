import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from './db';
import { plantPhotos, insertPlantPhotoSchema } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'client/public/uploads/plants');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const filename = `plant-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Accept images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Store photo information in PostgreSQL
export async function savePhotoToDatabase(
  firestorePlantId: string,
  file: Express.Multer.File,
  isPrimary: boolean = false
) {
  try {
    const photoData = {
      firestorePlantId,
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/plants/${file.filename}`,
      isPrimary,
    };

    const result = await db.insert(plantPhotos).values(photoData).returning();
    return result[0];
  } catch (error) {
    console.error('Error saving photo to database:', error);
    throw error;
  }
}

// Get photos for a plant from PostgreSQL
export async function getPlantPhotos(firestorePlantId: string) {
  try {
    const photos = await db
      .select()
      .from(plantPhotos)
      .where(eq(plantPhotos.firestorePlantId, firestorePlantId))
      .orderBy(plantPhotos.isPrimary, plantPhotos.createdAt);
    
    return photos;
  } catch (error) {
    console.error('Error getting plant photos:', error);
    throw error;
  }
}

// Delete a photo from both filesystem and database
export async function deletePhoto(photoId: number) {
  try {
    // Get photo info first
    const photo = await db
      .select()
      .from(plantPhotos)
      .where(eq(plantPhotos.id, photoId))
      .limit(1);
    
    if (photo.length === 0) {
      throw new Error('Photo not found');
    }
    
    // Delete from filesystem
    const filePath = path.join(process.cwd(), 'client/public', photo[0].url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Delete from database
    await db.delete(plantPhotos).where(eq(plantPhotos.id, photoId));
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error;
  }
}

// Set primary photo for a plant
export async function setPrimaryPhoto(firestorePlantId: string, photoId: number) {
  try {
    // First, remove primary status from all photos for this plant
    await db
      .update(plantPhotos)
      .set({ isPrimary: false })
      .where(eq(plantPhotos.firestorePlantId, firestorePlantId));
    
    // Then set the specified photo as primary
    await db
      .update(plantPhotos)
      .set({ isPrimary: true })
      .where(eq(plantPhotos.id, photoId));
    
    return { success: true };
  } catch (error) {
    console.error('Error setting primary photo:', error);
    throw error;
  }
}