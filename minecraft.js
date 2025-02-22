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
        
        // Speler fysica toevoegen
        this.player = {
            velocity: 0,
            gravity: -0.01,
            jumpForce: 0.2,
            canJump: false,
            position: new THREE.Vector3(8, 5, 8)
        };
        
        // Camera aan speler koppelen
        this.camera.position.copy(this.player.position);
        
        // Skybox toevoegen
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const skyboxMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.scene.add(skybox);
        
        // Verbeterde texture loading
        this.loadTextures();
        
        // Licht toevoegen
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(100, 100, 0);
        this.scene.add(sunLight);
        
        // Speler beweging
        this.moveSpeed = 0.1;
        this.rotateSpeed = 0.02;
        this.keys = {};
        
        this.setupControls();
        this.createWorld();
        this.animate();
    }
    
    loadTextures() {
        const textureLoader = new THREE.TextureLoader();
        const loadTexture = (url) => {
            return new Promise((resolve, reject) => {
                textureLoader.load(
                    url,
                    (texture) => {
                        texture.magFilter = THREE.NearestFilter;
                        texture.minFilter = THREE.NearestFilter;
                        resolve(texture);
                    },
                    undefined,
                    reject
                );
            });
        };

        // Wacht tot alle texturen zijn geladen
        Promise.all([
            loadTexture('Images/minecraft/grass.png'),
            loadTexture('Images/minecraft/dirt.png'),
            loadTexture('Images/minecraft/stone.png'),
            loadTexture('Images/minecraft/wood.png')
        ]).then(([grassTex, dirtTex, stoneTex, woodTex]) => {
            this.materials = {
                grass: new THREE.MeshLambertMaterial({ map: grassTex }),
                dirt: new THREE.MeshLambertMaterial({ map: dirtTex }),
                stone: new THREE.MeshLambertMaterial({ map: stoneTex }),
                wood: new THREE.MeshLambertMaterial({ map: woodTex })
            };
        });
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
        // Zwaartekracht toepassen
        if (!this.player.canJump) {
            this.player.velocity += this.player.gravity;
            this.player.position.y += this.player.velocity;
        }

        // Grond detectie
        if (this.player.position.y < 2) {
            this.player.position.y = 2;
            this.player.velocity = 0;
            this.player.canJump = true;
        }

        // Camera updaten
        this.camera.position.copy(this.player.position);
        
        // Beweging verwerken
        if (this.keys['w']) {
            this.player.position.x += Math.sin(this.camera.rotation.y) * this.moveSpeed;
            this.player.position.z += Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keys['s']) {
            this.player.position.x -= Math.sin(this.camera.rotation.y) * this.moveSpeed;
            this.player.position.z -= Math.cos(this.camera.rotation.y) * this.moveSpeed;
        }
        if (this.keys['a']) {
            this.player.position.x += Math.sin(this.camera.rotation.y + Math.PI/2) * this.moveSpeed;
            this.player.position.z += Math.cos(this.camera.rotation.y + Math.PI/2) * this.moveSpeed;
        }
        if (this.keys['d']) {
            this.player.position.x += Math.sin(this.camera.rotation.y - Math.PI/2) * this.moveSpeed;
            this.player.position.z += Math.cos(this.camera.rotation.y - Math.PI/2) * this.moveSpeed;
        }
        if (this.keys[' '] && this.player.canJump) {
            this.player.velocity = this.player.jumpForce;
            this.player.canJump = false;
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