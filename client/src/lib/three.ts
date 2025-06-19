import * as THREE from 'three';

export class PlantVisualization {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private plantModel: THREE.Group | null = null;
  private roomModel: THREE.Group | null = null;
  private controls: any = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.init();
  }

  private init() {
    // Setup renderer
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Setup camera
    this.camera.position.set(0, 2, 5);
    this.camera.lookAt(0, 0, 0);

    // Add lights
    this.setupLighting();

    // Add default room environment
    this.createDefaultRoom();

    // Start render loop
    this.animate();

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Point light for warmth
    const pointLight = new THREE.PointLight(0xffcc88, 0.4, 100);
    pointLight.position.set(2, 3, 2);
    this.scene.add(pointLight);
  }

  private createDefaultRoom() {
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(10, 10);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(10, 5);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 2.5, -5);
    this.scene.add(backWall);

    // Side wall
    const sideWallGeometry = new THREE.PlaneGeometry(10, 5);
    const sideWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    sideWall.position.set(-5, 2.5, 0);
    sideWall.rotation.y = Math.PI / 2;
    this.scene.add(sideWall);
  }

  public loadPlantModel(modelUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // For demo, create a simple plant model
      this.createSimplePlant();
      resolve();
    });
  }

  private createSimplePlant() {
    if (this.plantModel) {
      this.scene.remove(this.plantModel);
    }

    this.plantModel = new THREE.Group();

    // Pot
    const potGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1, 16);
    const potMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = 0.5;
    pot.castShadow = true;
    this.plantModel.add(pot);

    // Plant stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const stemMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 2;
    this.plantModel.add(stem);

    // Leaves
    const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
    for (let i = 0; i < 8; i++) {
      const leafGeometry = new THREE.SphereGeometry(0.3, 8, 6);
      const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
      const angle = (i / 8) * Math.PI * 2;
      leaf.position.set(
        Math.cos(angle) * 0.5,
        2.5 + Math.random() * 0.5,
        Math.sin(angle) * 0.5
      );
      leaf.scale.y = 0.3;
      leaf.castShadow = true;
      this.plantModel.add(leaf);
    }

    this.scene.add(this.plantModel);
  }

  public scalePlant(scale: number) {
    if (this.plantModel) {
      this.plantModel.scale.setScalar(scale);
    }
  }

  public movePlant(x: number, z: number) {
    if (this.plantModel) {
      this.plantModel.position.x = x;
      this.plantModel.position.z = z;
    }
  }

  public rotatePlant(rotation: number) {
    if (this.plantModel) {
      this.plantModel.rotation.y = rotation;
    }
  }

  private animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.container.removeChild(this.renderer.domElement);
    this.renderer.dispose();
  }
}
