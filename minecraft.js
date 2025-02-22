import * as THREE from 'https://unpkg.com/three@0.132.2/build/three.module.js';

class MinecraftGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(800, 600);
        document.getElementById('gameCanvas').appendChild(this.renderer.domElement);
        
        // Basis wereldgeneratie
        this.createWorld();
        
        // Camera positie
        this.camera.position.z = 5;
        this.camera.position.y = 2;
        
        // Controls setup
        this.setupControls();
        
        // Start de render loop
        this.animate();
    }
    
    createWorld() {
        // Maak een grondvlak
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x567d46,
            side: THREE.DoubleSide 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = Math.PI / 2;
        this.scene.add(ground);
        
        // Voeg wat basis blokken toe
        this.addBlock(0, 0, 0);
        this.addBlock(1, 0, 0);
        this.addBlock(0, 0, 1);
    }
    
    addBlock(x, y, z) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        this.scene.add(cube);
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            const speed = 0.1;
            switch(e.key) {
                case 'w': this.camera.position.z -= speed; break;
                case 's': this.camera.position.z += speed; break;
                case 'a': this.camera.position.x -= speed; break;
                case 'd': this.camera.position.x += speed; break;
                case ' ': this.camera.position.y += speed; break;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}

// Start het spel wanneer de pagina is geladen
document.addEventListener('DOMContentLoaded', () => {
    new MinecraftGame();
});