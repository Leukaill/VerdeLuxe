import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, RotateCcw, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';
import { ARPlantVisualization } from '@/lib/mindAR';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ARViewerProps {
  selectedPlant?: any;
  onClose: () => void;
}

export interface ARViewerRef {
  scalePlant: (scale: number) => void;
  rotatePlant: (rotation: number) => void;
}

const ARViewer = forwardRef<ARViewerRef, ARViewerProps>(
  ({ selectedPlant, onClose }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const arVisualizationRef = useRef<ARPlantVisualization | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    useImperativeHandle(ref, () => ({
      scalePlant: (newScale: number) => {
        setScale(newScale);
        arVisualizationRef.current?.scalePlant(newScale);
      },
      rotatePlant: (newRotation: number) => {
        setRotation(newRotation);
        arVisualizationRef.current?.rotatePlant(newRotation);
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const initAR = async () => {
        try {
          setIsLoading(true);
          setError(null);

          // Check if AR is supported
          arVisualizationRef.current = new ARPlantVisualization(containerRef.current!);
          
          if (!arVisualizationRef.current.isARSupported()) {
            throw new Error('AR is not supported on this device. Please use a device with camera access.');
          }

          await arVisualizationRef.current.init();
          
          if (selectedPlant) {
            await arVisualizationRef.current.loadPlantModel(selectedPlant.threeDModelUrl);
          }

          await arVisualizationRef.current.start();
          setIsLoading(false);
        } catch (err) {
          console.error('AR initialization failed:', err);
          setError(err instanceof Error ? err.message : 'Failed to initialize AR view');
          setIsLoading(false);
        }
      };

      initAR();

      return () => {
        if (arVisualizationRef.current) {
          arVisualizationRef.current.dispose();
        }
      };
    }, []);

    useEffect(() => {
      if (selectedPlant && arVisualizationRef.current && !isLoading) {
        arVisualizationRef.current.loadPlantModel(selectedPlant.threeDModelUrl);
      }
    }, [selectedPlant, isLoading]);

    const handleScaleChange = (delta: number) => {
      const newScale = Math.max(0.1, Math.min(3, scale + delta));
      setScale(newScale);
      arVisualizationRef.current?.scalePlant(newScale);
    };

    const handleRotationChange = () => {
      const newRotation = rotation + Math.PI / 4;
      setRotation(newRotation);
      arVisualizationRef.current?.rotatePlant(newRotation);
    };

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">AR Not Available</h3>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>

            <div className="mt-4 text-sm text-gray-600">
              <p className="mb-2">To use AR features, you need:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>A device with camera access</li>
                <li>A modern web browser (Chrome, Firefox, Safari)</li>
                <li>Camera permissions enabled</li>
              </ul>
            </div>

            <Button onClick={onClose} className="w-full mt-4">
              Close
            </Button>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50"
      >
        {/* AR Container */}
        <div ref={containerRef} className="w-full h-full" />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg font-semibold mb-2">Initializing AR...</p>
              <p className="text-sm opacity-75">Please allow camera access when prompted</p>
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {!isLoading && !error && (
          <>
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <div className="glass rounded-lg px-3 py-2">
                <h3 className="text-white font-semibold">
                  {selectedPlant?.name || 'Plant Preview'}
                </h3>
              </div>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
                className="glass text-white border-white/20 hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="glass rounded-lg p-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleScaleChange(-0.1)}
                    className="text-white border-white/20 hover:bg-white/20"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-white text-sm font-medium min-w-[60px] text-center">
                    {Math.round(scale * 100)}%
                  </span>
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleScaleChange(0.1)}
                    className="text-white border-white/20 hover:bg-white/20"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-px h-6 bg-white/20 mx-2" />
                  
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleRotationChange}
                    className="text-white border-white/20 hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-20 left-4 right-4">
              <div className="glass rounded-lg p-3">
                <div className="flex items-center space-x-2 text-white text-sm">
                  <Camera className="h-4 w-4" />
                  <span>Point your camera at a flat surface to place the plant</span>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    );
  }
);

ARViewer.displayName = 'ARViewer';

export default ARViewer;