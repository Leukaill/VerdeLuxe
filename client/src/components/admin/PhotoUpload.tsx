import React, { useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Upload, X, Camera, AlertCircle } from 'lucide-react';
import { uploadPlantPhotos, deletePlantPhoto, setPrimaryPlantPhoto } from '../../lib/firebase';
import { useToast } from '../../hooks/use-toast';

interface PhotoUploadProps {
  plantId: string;
  photos: any[];
  onPhotosUpdate: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  plantId, 
  photos, 
  onPhotosUpdate 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid Files",
        description: `${invalidFiles.length} non-image files were skipped.`,
        variant: "destructive"
      });
    }
    
    setSelectedFiles(validFiles);
  }, [toast]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !plantId) return;

    setIsUploading(true);
    try {
      const result = await uploadPlantPhotos(plantId, selectedFiles);
      
      toast({
        title: "Success",
        description: result.message || "Photos uploaded successfully"
      });
      
      setSelectedFiles([]);
      onPhotosUpdate();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photos",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      await deletePlantPhoto(photoId);
      toast({
        title: "Success",
        description: "Photo deleted successfully"
      });
      onPhotosUpdate();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete photo",
        variant: "destructive"
      });
    }
  };

  const handleSetPrimary = async (photoId: number) => {
    try {
      await setPrimaryPlantPhoto(plantId, photoId);
      toast({
        title: "Success",
        description: "Primary photo updated"
      });
      onPhotosUpdate();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to set primary photo",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Plant Photos
        </CardTitle>
        <CardDescription>
          Upload and manage photos for this plant. Photos are stored locally to avoid Firebase Storage costs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* File Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Add Photos</label>
          <div className="flex gap-2">
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="flex-1"
            />
            <Button 
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          {selectedFiles.length > 0 && (
            <p className="text-sm text-gray-600">
              {selectedFiles.length} file(s) selected
            </p>
          )}
        </div>

        {/* Existing Photos */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Photos ({photos.length})</label>
          {photos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No photos uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img 
                    src={photo.url} 
                    alt={photo.originalName}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  
                  {/* Primary Badge */}
                  {photo.isPrimary && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                      Primary
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      {!photo.isPrimary && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSetPrimary(photo.id)}
                          className="text-xs"
                        >
                          Set Primary
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* File Info */}
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    {photo.originalName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p><strong>Cost-Effective Storage:</strong> Photos are stored locally in PostgreSQL instead of Firebase Storage, saving on cloud storage costs.</p>
            <p className="mt-1"><strong>Usage:</strong> The first photo will be set as primary automatically. You can change the primary photo anytime.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};