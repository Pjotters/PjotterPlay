import * as THREE from 'three';

class MinecraftGame {
    constructor() {
        this.init();
    }

    init() {
        // Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        
        // World settings
        this.worldSize = 16;
        this.blockSize = 1;
        
        // Generate world
        this.generateWorld();
        
        // Player controls
        this.setupControls();
    }

    generateWorld() {
        // Create blocks
        const geometry = new THREE.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
        
        // Different textures for different blocks
        const textureLoader = new THREE.TextureLoader();
        const grassTexture = textureLoader.load('textures/grass.png');
        const dirtTexture = textureLoader.load('textures/dirt.png');
        
        // Generate terrain
        for(let x = 0; x < this.worldSize; x++) {
            for(let z = 0; z < this.worldSize; z++) {
                const height = Math.floor(Math.random() * 3);
                for(let y = 0; y < height; y++) {
                    const material = y === height - 1 ? 
                        new THREE.MeshBasicMaterial({map: grassTexture}) : 
                        new THREE.MeshBasicMaterial({map: dirtTexture});
                    
                    const cube = new THREE.Mesh(geometry, material);
                    cube.position.set(x * this.blockSize, y * this.blockSize, z * this.blockSize);
                    this.scene.add(cube);
                }
            }
        }
    }

    setupControls() {
        // Basic WASD controls
        document.addEventListener('keydown', (e) => {
            const speed = 0.1;
            switch(e.key.toLowerCase()) {
                case 'w': this.camera.position.z -= speed; break;
                case 's': this.camera.position.z += speed; break;
                case 'a': this.camera.position.x -= speed; break;
                case 'd': this.camera.position.x += speed; break;
                case ' ': this.camera.position.y += speed; break;
                case 'shift': this.camera.position.y -= speed; break;
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
} 