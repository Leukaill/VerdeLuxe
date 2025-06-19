import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { PlantVisualization } from '@/lib/three';

interface ThreeDViewerProps {
  selectedPlant?: any;
  roomBackground?: string;
}

export interface ThreeDViewerRef {
  scalePlant: (scale: number) => void;
  rotatePlant: (rotation: number) => void;
  movePlant: (x: number, z: number) => void;
}

const ThreeDViewer = forwardRef<ThreeDViewerRef, ThreeDViewerProps>(
  ({ selectedPlant, roomBackground }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const visualizationRef = useRef<PlantVisualization | null>(null);

    useImperativeHandle(ref, () => ({
      scalePlant: (scale: number) => {
        visualizationRef.current?.scalePlant(scale);
      },
      rotatePlant: (rotation: number) => {
        visualizationRef.current?.rotatePlant(rotation);
      },
      movePlant: (x: number, z: number) => {
        visualizationRef.current?.movePlant(x, z);
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      // Initialize Three.js visualization
      visualizationRef.current = new PlantVisualization(containerRef.current);

      return () => {
        if (visualizationRef.current) {
          visualizationRef.current.dispose();
        }
      };
    }, []);

    useEffect(() => {
      if (selectedPlant && visualizationRef.current) {
        // Load the selected plant model
        const modelUrl = selectedPlant.threeDModelUrl || '';
        visualizationRef.current.loadPlantModel(modelUrl);
      }
    }, [selectedPlant]);

    return (
      <div 
        ref={containerRef} 
        className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden"
        style={{
          backgroundImage: roomBackground ? `url(${roomBackground})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    );
  }
);

ThreeDViewer.displayName = 'ThreeDViewer';

export default ThreeDViewer;
