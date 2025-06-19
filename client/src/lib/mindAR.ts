import * as THREE from 'three';

// Removed MindAR dependency for simpler AR simulation

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
      // For now, create a simple Three.js scene without MindAR
      // This avoids the complex MindAR setup while providing AR-like functionality
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);

      // Setup camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        this.container.clientWidth / this.container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 1, 3);

      // Setup lighting
      this.setupLighting();

      // Create a simple anchor point
      this.anchor = { group: new THREE.Group() };
      this.scene.add(this.anchor.group);

      // Add video background simulation
      this.addVideoBackground();
      
      // Handle window resize
      window.addEventListener('resize', this.onWindowResize.bind(this));
    } catch (error) {
      console.error('Failed to initialize AR:', error);
      throw error;
    }
  }

  private addVideoBackground(): void {
    // Create a simulated camera background
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3
    });
    const background = new THREE.Mesh(geometry, material);
    background.position.z = -10;
    this.scene.add(background);

    // Add some ambient elements to simulate a room
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    this.scene.add(floor);
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
      // Start the animation loop
      this.animate();
    } catch (error) {
      console.error('Failed to start AR:', error);
      throw error;
    }
  }

  stop(): void {
    // Stop the animation loop
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
    }
  }

  private animate(): void {
    this.renderer.setAnimationLoop(() => {
      // Simple rotation for demo purposes
      if (this.plantModel) {
        this.plantModel.rotation.y += 0.01;
      }
      this.renderer.render(this.scene, this.camera);
    });
  }

  private onWindowResize(): void {
    if (this.camera && this.renderer) {
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
  }

  dispose(): void {
    this.stop();
    if (this.plantModel && this.anchor) {
      this.anchor.group.remove(this.plantModel);
    }
    if (this.renderer && this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  isARSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}