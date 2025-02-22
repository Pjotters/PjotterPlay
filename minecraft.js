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
        
        // Inventory toevoegen
        this.inventory = {
            dirt: 0,
            stone: 0,
            wood: 0,
            leaves: 0,
            gold: 0,
            diamond: 0,
            iron: 0
        };
        
        // Wereld grootte aanpassen
        this.worldSize = 64; // 2x zo groot
        
        // Speler fysica verbeteren
        this.player = {
            velocity: 0,
            gravity: -0.015,
            jumpForce: 0.25,
            canJump: false,
            position: new THREE.Vector3(8, 10, 8),
            selectedBlock: 'dirt',
            model: this.createPlayerModel(),
            thirdPerson: false
        };
        
        // Camera correcties
        this.camera.position.copy(this.player.position);
        this.camera.rotation.order = 'YXZ'; // Voorkomt camera roll
        
        // Skybox toevoegen
        const skyboxGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
        const skyboxMaterial = new THREE.MeshBasicMaterial({
            color: 0x87CEEB,
            side: THREE.BackSide
        });
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
        this.scene.add(skybox);
        
        // Eerst texturen laden, dan pas de wereld maken
        this.loadTextures().then(() => {
            this.createWorld();
            this.animate();
        });
        
        // UI en controls wel direct instellen
        this.createUI();
        this.setupControls();
        
        // Blok plaatsing toevoegen
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.blocks = new Map(); // Voor het bijhouden van alle blokken
        
        // Uitgebreide controls setup
        this.setupControls();
        
        // Extra materialen voor ores
        this.oreTypes = {
            GOLD: { color: 0xFFD700, rarity: 0.02 },
            DIAMOND: { color: 0x00FFFF, rarity: 0.01 },
            IRON: { color: 0xC0C0C0, rarity: 0.03 }
        };
        
        // Crafting en inventory systeem
        this.craftingRecipes = {
            FURNACE: { iron: 8 },
            CRAFTING_TABLE: { wood: 4 },
            CHEST: { wood: 8 }
        };
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
                    (error) => {
                        console.error(`Error loading texture ${url}:`, error);
                        reject(error);
                    }
                );
            });
        };

        // Return de Promise zodat we kunnen wachten
        return Promise.all([
            loadTexture('Images/minecraft/grass.png'),
            loadTexture('Images/minecraft/dirt.png'),
            loadTexture('Images/minecraft/stone.png'),
            loadTexture('Images/minecraft/hout.png'),
            loadTexture('Images/minecraft/leaf.png')
        ]).then(([grassTex, dirtTex, stoneTex, woodTex, leafTex]) => {
            this.materials = {
                grass: new THREE.MeshLambertMaterial({ map: grassTex }),
                dirt: new THREE.MeshLambertMaterial({ map: dirtTex }),
                stone: new THREE.MeshLambertMaterial({ map: stoneTex }),
                wood: new THREE.MeshLambertMaterial({ map: woodTex }),
                leaves: new THREE.MeshLambertMaterial({ map: leafTex, transparent: true, opacity: 0.8 })
            };
        });
    }
    
    createWorld() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        
        for (let x = -this.worldSize/2; x < this.worldSize/2; x++) {
            for (let z = -this.worldSize/2; z < this.worldSize/2; z++) {
                // Verbeterde hoogte generatie met Perlin noise
                const height = Math.floor(
                    (Math.sin(x/20) + Math.cos(z/20)) * 4 + 
                    Math.random() * 3
                );
                
                for (let y = -5; y < height; y++) {
                    let material;
                    
                    // Ondergrondse ores genereren
                    if (y < 0 && Math.random() < 0.1) {
                        for (const [oreName, ore] of Object.entries(this.oreTypes)) {
                            if (Math.random() < ore.rarity) {
                                material = new THREE.MeshLambertMaterial({ color: ore.color });
                                break;
                            }
                        }
                    }
                    
                    if (!material) {
                        material = y < height-1 ? this.materials.stone : this.materials.grass;
                    }
                    
                    const block = new THREE.Mesh(geometry, material);
                    block.position.set(x, y, z);
                    this.scene.add(block);
                    this.blocks.set(`${x},${y},${z}`, block);
                }
            }
        }
    }
    
    createPlayerModel() {
        const group = new THREE.Group();
        
        // Lichaam
        const bodyGeometry = new THREE.BoxGeometry(0.6, 1.8, 0.3);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0000FF });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        group.add(body);
        
        // Hoofd
        const headGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFC0CB });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.1;
        group.add(head);
        
        return group;
    }
    
    updateCamera() {
        if (this.player.thirdPerson) {
            // Derde persoons camera
            const cameraOffset = new THREE.Vector3(
                -Math.sin(this.camera.rotation.y) * 4,
                2,
                -Math.cos(this.camera.rotation.y) * 4
            );
            this.camera.position.copy(this.player.position).add(cameraOffset);
            this.camera.lookAt(this.player.position);
        } else {
            // Eerste persoons camera
            this.camera.position.copy(this.player.position);
            this.camera.position.y += 1.6; // Ooghoogte
        }
    }
    
    createUI() {
        const ui = document.createElement('div');
        ui.className = 'minecraft-ui';
        ui.innerHTML = `
            <div class="inventory">
                <div class="inventory-slot" data-block="dirt">Aarde: 0</div>
                <div class="inventory-slot" data-block="stone">Steen: 0</div>
                <div class="inventory-slot" data-block="wood">Hout: 0</div>
                <div class="inventory-slot" data-block="leaves">Bladeren: 0</div>
                <div class="inventory-slot" data-block="gold">Goud: 0</div>
                <div class="inventory-slot" data-block="diamond">Diamond: 0</div>
                <div class="inventory-slot" data-block="iron">IJzer: 0</div>
            </div>
        `;
        document.body.appendChild(ui);
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
        
        // Blok plaatsing/verwijdering toevoegen
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            if (!document.pointerLockElement) return;
            
            const isLeftClick = e.button === 0;
            const isRightClick = e.button === 2;
            
            if (isLeftClick || isRightClick) {
                this.handleBlockInteraction(isLeftClick);
            }
        });
        
        // Voorkom rechtermuisklik menu
        this.renderer.domElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Inventory selectie
        document.querySelectorAll('.inventory-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const blockType = slot.dataset.block;
                this.player.selectedBlock = blockType;
                
                // Update UI
                document.querySelectorAll('.inventory-slot').forEach(s => 
                    s.classList.remove('selected'));
                slot.classList.add('selected');
            });
        });
    }
    
    handleBlockInteraction(isPlacing) {
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            const intersection = intersects[0];
            const position = intersection.point.clone();
            
            if (isPlacing) {
                // Plaats blok naast het geraakte blok
                position.add(intersection.face.normal);
                this.placeBlock(position, this.player.selectedBlock);
            } else {
                // Verwijder geraakte blok
                position.sub(intersection.face.normal.multiplyScalar(0.5));
                this.removeBlock(position);
            }
        }
    }
    
    placeBlock(position, type) {
        const roundedPos = position.clone().round();
        const key = `${roundedPos.x},${roundedPos.y},${roundedPos.z}`;
        
        // Check of er al een blok is
        if (this.blocks.has(key)) return;
        
        // Check of we genoeg blokken hebben
        if (this.inventory[type] <= 0) return;
        
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = this.materials[type];
        const block = new THREE.Mesh(geometry, material);
        
        block.position.copy(roundedPos);
        this.scene.add(block);
        this.blocks.set(key, block);
        
        // Update inventory
        this.inventory[type]--;
        this.updateInventoryUI();
    }
    
    removeBlock(position) {
        const roundedPos = position.clone().round();
        const key = `${roundedPos.x},${roundedPos.y},${roundedPos.z}`;
        
        const block = this.blocks.get(key);
        if (block) {
            // Bepaal type en update inventory
            const type = this.getBlockType(block);
            this.inventory[type]++;
            
            // Verwijder blok
            this.scene.remove(block);
            this.blocks.delete(key);
            
            this.updateInventoryUI();
        }
    }
    
    getBlockType(block) {
        // Bepaal type op basis van materiaal
        for (const [type, material] of Object.entries(this.materials)) {
            if (block.material === material) return type;
        }
        return 'dirt'; // Fallback
    }
    
    updateInventoryUI() {
        Object.entries(this.inventory).forEach(([type, count]) => {
            const slot = document.querySelector(`.inventory-slot[data-block="${type}"]`);
            if (slot) {
                slot.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${count}`;
            }
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
        this.updateCamera();
        
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