import * as THREE from 'three';

declare global {
  interface Window {
    MINDAR: {
      IMAGE: {
        MindARThree: any;
      };
    };
  }
}

export class ARPlantVisualization {
  private mindarThree: any;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private plantModel: THREE.Group | null = null;
  private anchor: any;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  }

  async init(): Promise<void> {
    try {
      // Load MindAR script dynamically
      await this.loadMindARScript();
      
      // Initialize MindAR
      this.mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: this.container,
        imageTargetSrc: '/mind-ar-target.mind', // You'll need to create this target image
      });

      const { renderer, scene, camera } = this.mindarThree;
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;

      // Setup lighting
      this.setupLighting();

      // Create anchor for placing plants
      this.anchor = this.mindarThree.addAnchor(0);
    } catch (error) {
      console.error('Failed to initialize AR:', error);
      throw error;
    }
  }

  private async loadMindARScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.MINDAR) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load MindAR script'));
      document.head.appendChild(script);
    });
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
  }

  async loadPlantModel(modelUrl?: string): Promise<void> {
    if (this.plantModel) {
      this.anchor.group.remove(this.plantModel);
    }

    if (modelUrl) {
      try {
        // For now, create a simple plant representation
        // In a real implementation, you'd use GLTFLoader to load the 3D model
        this.plantModel = this.createSimplePlant();
      } catch (error) {
        console.error('Failed to load plant model:', error);
        this.plantModel = this.createSimplePlant();
      }
    } else {
      this.plantModel = this.createSimplePlant();
    }

    if (this.plantModel && this.anchor) {
      this.anchor.group.add(this.plantModel);
    }
  }

  private createSimplePlant(): THREE.Group {
    const plantGroup = new THREE.Group();

    // Create pot
    const potGeometry = new THREE.CylinderGeometry(0.8, 1, 1, 8);
    const potMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = 0.5;
    plantGroup.add(pot);

    // Create plant stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 1.75;
    plantGroup.add(stem);

    // Create leaves
    const leafGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
    
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      const angle = (i / 5) * Math.PI * 2;
      leaf.position.x = Math.cos(angle) * 0.4;
      leaf.position.z = Math.sin(angle) * 0.4;
      leaf.position.y = 2 + Math.random() * 0.5;
      leaf.scale.set(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4);
      plantGroup.add(leaf);
    }

    // Scale the entire plant
    plantGroup.scale.set(0.5, 0.5, 0.5);
    
    return plantGroup;
  }

  scalePlant(scale: number): void {
    if (this.plantModel) {
      this.plantModel.scale.set(scale, scale, scale);
    }
  }

  rotatePlant(rotation: number): void {
    if (this.plantModel) {
      this.plantModel.rotation.y = rotation;
    }
  }

  async start(): Promise<void> {
    try {
      await this.mindarThree.start();
    } catch (error) {
      console.error('Failed to start AR:', error);
      throw error;
    }
  }

  stop(): void {
    if (this.mindarThree) {
      this.mindarThree.stop();
    }
  }

  dispose(): void {
    this.stop();
    if (this.plantModel) {
      this.anchor?.group.remove(this.plantModel);
    }
  }

  isARSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}