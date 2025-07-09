import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createPlant, uploadFile } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const plantSchema = z.object({
  name: z.string().min(1, 'Plant name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  featured: z.boolean(),
  tags: z.array(z.string()),
  careInstructions: z.string().optional(),
  lightRequirement: z.string().optional(),
  wateringFrequency: z.string().optional(),
  difficultyLevel: z.string().optional(),
});

type PlantForm = z.infer<typeof plantSchema>;

interface PlantFormProps {
  onClose: () => void;
  onSubmit: () => void;
  categories: Array<{ id: string; name: string }>;
  plant?: any;
}

const PlantFormComponent = ({ onClose, onSubmit, categories, plant }: PlantFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(plant?.imageUrls || []);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(plant?.tags || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<PlantForm>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: plant?.name || '',
      description: plant?.description || '',
      price: plant?.price || 0,
      categoryId: plant?.categoryId || '',
      stock: plant?.stock || 0,
      featured: plant?.featured || false,
      tags: plant?.tags || [],
      careInstructions: plant?.careInstructions || '',
      lightRequirement: plant?.lightRequirement || '',
      wateringFrequency: plant?.wateringFrequency || '',
      difficultyLevel: plant?.difficultyLevel || '',
    },
  });

  const selectedCategory = watch('categoryId');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags);
  };

  const onFormSubmit = async (data: PlantForm) => {
    setIsSubmitting(true);
    
    try {
      // Upload images
      const uploadedImageUrls = [];
      
      for (const image of images) {
        const imagePath = `plants/${Date.now()}-${image.name}`;
        const imageUrl = await uploadFile(image, imagePath);
        uploadedImageUrls.push(imageUrl);
      }

      // Create plant data
      const plantData = {
        ...data,
        imageUrls: [...imageUrls, ...uploadedImageUrls],
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        tags,
        isActive: true,
      };

      await createPlant(plantData);
      
      toast({
        title: "Plant added successfully!",
        description: `${data.name} has been added to the inventory.`,
      });
      
      onSubmit();
    } catch (error) {
      console.error('Failed to create plant:', error);
      toast({
        title: "Error",
        description: "Failed to create plant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
      >
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-forest-600">
              {plant ? 'Edit Plant' : 'Add New Plant'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Plant Name</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      className={errors.description ? 'border-red-500' : ''}
                      rows={3}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register('price', { valueAsNumber: true })}
                        className={errors.price ? 'border-red-500' : ''}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        {...register('stock', { valueAsNumber: true })}
                        className={errors.stock ? 'border-red-500' : ''}
                      />
                      {errors.stock && (
                        <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="categoryId">Category</Label>
                    <Select 
                      value={selectedCategory} 
                      onValueChange={(value) => setValue('categoryId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryId && (
                      <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={watch('featured')}
                      onCheckedChange={(checked) => setValue('featured', checked)}
                    />
                    <Label htmlFor="featured">Featured Plant</Label>
                  </div>
                </div>

                {/* Care Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lightRequirement">Light Requirement</Label>
                    <Select onValueChange={(value) => setValue('lightRequirement', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select light requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Light</SelectItem>
                        <SelectItem value="medium">Medium Light</SelectItem>
                        <SelectItem value="bright">Bright Light</SelectItem>
                        <SelectItem value="direct">Direct Sunlight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wateringFrequency">Watering Frequency</Label>
                    <Select onValueChange={(value) => setValue('wateringFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select watering frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                    <Select onValueChange={(value) => setValue('difficultyLevel', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="careInstructions">Care Instructions</Label>
                    <Textarea
                      id="careInstructions"
                      {...register('careInstructions')}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-forest-100 text-forest-800 px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-forest-600 hover:text-forest-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Plant Images</Label>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload plant images</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-forest-500 hover:bg-forest-600 text-white"
                >
                  {isSubmitting ? 'Saving...' : plant ? 'Update Plant' : 'Add Plant'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PlantFormComponent;
