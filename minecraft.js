import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';

class MinecraftGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
        
        // Renderer setup met betere graphics
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(800, 600);
        this.renderer.setClearColor(0x87CEEB); // Minecraft-achtige blauwe lucht
        document.getElementById('gameCanvas').appendChild(this.renderer.domElement);
        
        // Texturen laden
        this.textureLoader = new THREE.TextureLoader();
        this.textures = {
            grass: this.textureLoader.load('Images/minecraft/grass.png'),
            dirt: this.textureLoader.load('Images/minecraft/dirt.png'),
            stone: this.textureLoader.load('Images/minecraft/stone.png'),
            wood: this.textureLoader.load('Images/minecraft/wood.png')
        };
        
        // Materialen maken
        this.materials = {
            grass: new THREE.MeshLambertMaterial({ map: this.textures.grass }),
            dirt: new THREE.MeshLambertMaterial({ map: this.textures.dirt }),
            stone: new THREE.MeshLambertMaterial({ map: this.textures.stone }),
            wood: new THREE.MeshLambertMaterial({ map: this.textures.wood })
        };
        
        // Licht toevoegen
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(100, 100, 0);
        this.scene.add(sunLight);
        
        // Camera positie
        this.camera.position.set(8, 3, 8);
        this.camera.lookAt(0, 0, 0);
        
        // Speler beweging
        this.moveSpeed = 0.1;
        this.rotateSpeed = 0.02;
        this.keys = {};
        
        this.setupControls();
        this.createWorld();
        this.animate();
    }
    
    createWorld() {
        // Maak een grotere wereld
        const worldSize = 16;
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        // Genereer terrein
        for (let x = -worldSize/2; x < worldSize/2; x++) {
            for (let z = -worldSize/2; z < worldSize/2; z++) {
                // Basis grond laag
                const block = new THREE.Mesh(geometry, this.materials.grass);
                block.position.set(x, -1, z);
                this.scene.add(block);
                
                // Voeg wat willekeurige hoogteverschillen toe
                if (Math.random() < 0.2) {
                    const height = Math.floor(Math.random() * 3);
                    for (let y = 0; y < height; y++) {
                        const elevated = new THREE.Mesh(geometry, 
                            y === height-1 ? this.materials.grass : this.materials.dirt);
                        elevated.position.set(x, y-1, z);
                        this.scene.add(elevated);
                    }
                }
                
                // Voeg wat bomen toe
                if (Math.random() < 0.05) {
                    this.createTree(x, 0, z);
                }
            }
        }
    }
    
    createTree(x, y, z) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        // Stam
        for (let i = 0; i < 4; i++) {
            const trunk = new THREE.Mesh(geometry, this.materials.wood);
            trunk.position.set(x, y + i, z);
            this.scene.add(trunk);
        }
        
        // Bladeren
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                for (let dy = 3; dy <= 5; dy++) {
                    const leaves = new THREE.Mesh(geometry, this.materials.grass);
                    leaves.position.set(x + dx, y + dy, z + dz);
                    this.scene.add(leaves);
                }
            }
        }
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === this.renderer.domElement) {
                this.camera.rotation.y -= e.movementX * this.rotateSpeed;
            }
        });
        
        this.renderer.domElement.addEventListener('click', () => {
            this.renderer.domElement.requestPointerLock();
        });
    }
    
    update() {
        if (this.keys['w']) {
            this.camera.position.x += Math.sin(this.camera.rotation.y) * this.moveSpeed;
            this.camera.position.z += Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keys['s']) {
            this.camera.position.x -= Math.sin(this.camera.rotation.y) * this.moveSpeed;
            this.camera.position.z -= Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keys['a']) {
            this.camera.position.x += Math.sin(this.camera.rotation.y + Math.PI/2) * this.moveSpeed;
            this.camera.position.z += Math.cos(this.camera.rotation.y + Math.PI/2) * this.moveSpeed;
        }
        if (this.keys['d']) {
            this.camera.position.x += Math.sin(this.camera.rotation.y - Math.PI/2) * this.moveSpeed;
            this.camera.position.z += Math.cos(this.camera.rotation.y - Math.PI/2) * this.moveSpeed;
        }
        if (this.keys[' ']) {
            this.camera.position.y += this.moveSpeed;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Start het spel wanneer de pagina is geladen
window.onload = () => {
    new MinecraftGame();
};