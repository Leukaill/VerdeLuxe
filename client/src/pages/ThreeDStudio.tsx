import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, RotateCcw, ZoomIn, ZoomOut, Download, Eye, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ThreeDViewer from '@/components/ThreeDViewer';
import ARViewer from '@/components/ARViewer';
import { getPlants } from '@/lib/firebase';
import { samplePlants } from '@/lib/sampleData';
import { seedFirebaseDatabase } from '@/lib/seedFirebase';

interface Plant {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  threeDModelUrl?: string;
}

const ThreeDStudio = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [plantScale, setPlantScale] = useState([1]);
  const [plantRotation, setPlantRotation] = useState([0]);
  const [plantPosition, setPlantPosition] = useState({ x: 0, z: 0 });
  const [showAR, setShowAR] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<any>(null);
  const arViewerRef = useRef<any>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // First try to get plants from Firebase
        const plantsData = await getPlants();
        if (plantsData && plantsData.length > 0) {
          setPlants(plantsData as Plant[]);
          setSelectedPlant(plantsData[0] as Plant);
        } else {
          // If no data in Firebase, seed it with sample data
          console.log('No plants found in Firebase, seeding database...');
          await seedFirebaseDatabase();
          
          // Use sample data immediately for better UX
          setPlants(samplePlants);
          setSelectedPlant(samplePlants[0]);
        }
      } catch (error) {
        console.error('Failed to initialize data:', error);
        // Fallback to sample data
        setPlants(samplePlants);
        setSelectedPlant(samplePlants[0]);
      }
    };

    initializeData();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRoomImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlantChange = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    setSelectedPlant(plant || null);
  };

  const handleScaleChange = (value: number[]) => {
    setPlantScale(value);
    if (viewerRef.current) {
      viewerRef.current.scalePlant(value[0]);
    }
    if (arViewerRef.current) {
      arViewerRef.current.scalePlant(value[0]);
    }
  };

  const handleRotationChange = (value: number[]) => {
    setPlantRotation(value);
    if (viewerRef.current) {
      viewerRef.current.rotatePlant((value[0] * Math.PI) / 180);
    }
    if (arViewerRef.current) {
      arViewerRef.current.rotatePlant((value[0] * Math.PI) / 180);
    }
  };

  const resetView = () => {
    setPlantScale([1]);
    setPlantRotation([0]);
    setPlantPosition({ x: 0, z: 0 });
    if (viewerRef.current) {
      viewerRef.current.scalePlant(1);
      viewerRef.current.rotatePlant(0);
      viewerRef.current.movePlant(0, 0);
    }
  };

  const saveConfiguration = () => {
    const config = {
      plant: selectedPlant,
      scale: plantScale[0],
      rotation: plantRotation[0],
      position: plantPosition,
      roomImage,
    };
    
    // In a real app, this would save to Firebase
    localStorage.setItem('plantConfiguration', JSON.stringify(config));
    alert('Configuration saved!');
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-500 to-forest-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="font-sf text-4xl font-bold mb-4">3D Plant Studio</h1>
            <p className="text-xl text-gray-200">
              Visualize plants in your space before you buy
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Room Upload */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-forest-600 text-lg">Room Background</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Room Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {roomImage && (
                    <img
                      src={roomImage}
                      alt="Room"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Plant Selection */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-forest-600 text-lg">Select Plant</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedPlant?.id} onValueChange={handlePlantChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a plant" />
                    </SelectTrigger>
                    <SelectContent>
                      {plants.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedPlant && (
                    <div className="mt-4">
                      <img
                        src={selectedPlant.imageUrls?.[0] || '/placeholder-plant.jpg'}
                        alt={selectedPlant.name}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-600 mt-2">{selectedPlant.name}</p>
                      <p className="text-forest-600 font-bold">${selectedPlant.price}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* AR Mode Button */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-forest-600 text-lg">AR Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setShowAR(true)}
                    className="w-full bg-gradient-to-r from-forest-600 to-sage-600 hover:from-forest-700 hover:to-sage-700 text-white"
                    disabled={!selectedPlant}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    View in AR
                  </Button>
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Place plants in your real environment using your camera
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Plant Controls */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-forest-600 text-lg">Plant Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Scale: {plantScale[0].toFixed(1)}x
                    </label>
                    <Slider
                      value={plantScale}
                      onValueChange={handleScaleChange}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Rotation: {plantRotation[0]}°
                    </label>
                    <Slider
                      value={plantRotation}
                      onValueChange={handleRotationChange}
                      min={0}
                      max={360}
                      step={15}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={resetView}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      onClick={saveConfiguration}
                      size="sm"
                      className="flex-1 bg-forest-500 hover:bg-forest-600 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-forest-600 text-lg">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <p>1. Upload a photo of your room</p>
                  <p>2. Select a plant from the dropdown</p>
                  <p>3. Use controls to adjust size and rotation</p>
                  <p>4. Click and drag in the 3D view to move the plant</p>
                  <p>5. Save your configuration when happy</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* 3D Viewer */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-forest-600">3D Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                  <ThreeDViewer
                    ref={viewerRef}
                    selectedPlant={selectedPlant}
                    roomBackground={roomImage || undefined}
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Use mouse to rotate view, scroll to zoom
                    </span>
                  </div>
                  
                  {selectedPlant && (
                    <Button
                      variant="outline"
                      className="border-forest-500 text-forest-500 hover:bg-forest-500 hover:text-white"
                    >
                      Add to Cart - ${selectedPlant.price}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AR Viewer Modal */}
        {showAR && (
          <ARViewer
            ref={arViewerRef}
            selectedPlant={selectedPlant}
            onClose={() => setShowAR(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ThreeDStudio;
