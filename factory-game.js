class FactoryGame {
    constructor() {
        this.app = new PIXI.Application({
            width: window.innerWidth - 250,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        });
        document.getElementById('gameCanvas').appendChild(this.app.view);

        this.resources = {
            money: 1000,
            wood: 0,
            sand: 0,
            glass: 0,
            fuel: 0,
            electronics: 0,
            computers: 0,
            phones: 0
        };

        this.workers = {
            woodcutters: 0,
            miners: 0,
            glassmakers: 0
        };

        this.buildings = {
            woodcutter_hut: { 
                cost: 100, 
                name: "Houthakkershut",
                production: {
                    wood: 1
                },
                workers_needed: 1
            },
            sand_mine: { 
                cost: 150, 
                name: "Zandmijn",
                production: {
                    sand: 1
                },
                workers_needed: 2
            },
            furnace: { 
                cost: 300, 
                name: "Oven",
                production: {
                    glass: 1
                },
                requires: {
                    sand: 2,
                    fuel: 1
                },
                workers_needed: 1
            },
            conveyor: {
                cost: 50,
                name: "Lopende Band",
                transport_speed: 1
            }
        };

        this.currentWorld = 'forest'; // 'forest', 'desert', 'industrial'

        // Grid instellingen
        this.gridSize = 32; // pixels per cel
        this.worldWidth = 200; // aantal cellen
        this.worldHeight = 200;
        
        // Container voor de game wereld
        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);
        
        // Camera controls
        this.dragStart = null;
        this.isDragging = false;
        
        // Ores genereren
        this.ores = this.generateOres();
        
        // Gebouwen plaatsing mode
        this.currentBuildingType = null;

        this.init();
    }

    init() {
        this.setupWorldSwitcher();
        this.setupBuildingPanel();
        this.setupResourcesDisplay();
        this.startGameLoop();
    }

    setupWorldSwitcher() {
        document.getElementById('switchWorld').addEventListener('click', () => {
            this.currentWorld = this.currentWorld === 'factory' ? 'mining' : 'factory';
            this.updateWorld();
        });
    }

    setupBuildingPanel() {
        const buildingOptions = document.getElementById('buildingOptions');
        Object.entries(this.buildings).forEach(([type, building]) => {
            const div = document.createElement('div');
            div.className = 'building-option';
            div.innerHTML = `
                <span>${building.name}</span>
                <span>Kosten: ${building.cost}</span>
            `;
            div.onclick = () => this.buildStructure(type);
            buildingOptions.appendChild(div);
        });
    }

    setupResourcesDisplay() {
        this.updateResourcesDisplay();
    }

    updateResourcesDisplay() {
        const resourcesList = document.getElementById('resourcesList');
        resourcesList.innerHTML = Object.entries(this.resources)
            .map(([resource, amount]) => `
                <div class="resource-item">
                    <span>${resource}: ${amount}</span>
                </div>
            `).join('');
    }

    buildStructure(type) {
        // Implementeer gebouw plaatsing logica
        console.log(`Building ${type}`);
    }

    updateWorld() {
        // Wissel tussen fabrieks- en mijnbouwwereld
        console.log(`Switching to ${this.currentWorld} world`);
    }

    startGameLoop() {
        this.app.ticker.add(() => {
            this.gameLoop();
        });
    }

    gameLoop() {
        this.produceResources();
        this.updateResourcesDisplay();
    }

    hireWorker(type) {
        const costs = {
            woodcutters: 50,
            miners: 75,
            glassmakers: 100
        };

        if (this.resources.money >= costs[type]) {
            this.resources.money -= costs[type];
            this.workers[type]++;
            this.updateResourcesDisplay();
        }
    }

    produceResources() {
        // Hout productie
        if (this.workers.woodcutters > 0) {
            this.resources.wood += this.workers.woodcutters * 1;
            this.resources.fuel += Math.floor(this.workers.woodcutters * 0.5); // Deel van hout wordt brandstof
        }

        // Zand productie
        if (this.workers.miners > 0) {
            this.resources.sand += this.workers.miners * 1;
        }

        // Glas productie
        if (this.workers.glassmakers > 0 && this.resources.sand >= 2 && this.resources.fuel >= 1) {
            const maxProduction = Math.min(
                Math.floor(this.resources.sand / 2),
                this.resources.fuel,
                this.workers.glassmakers
            );
            
            this.resources.glass += maxProduction;
            this.resources.sand -= maxProduction * 2;
            this.resources.fuel -= maxProduction;
        }
    }

    generateOres() {
        const ores = [];
        // Genereer 50 random ore deposits
        for (let i = 0; i < 50; i++) {
            ores.push({
                x: Math.floor(Math.random() * this.worldWidth),
                y: Math.floor(Math.random() * this.worldHeight),
                type: ['iron', 'copper', 'coal'][Math.floor(Math.random() * 3)]
            });
        }
        return ores;
    }

    createWorld() {
        // Maak grid
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0x333333, 0.5);
        
        for (let x = 0; x <= this.worldWidth; x++) {
            graphics.moveTo(x * this.gridSize, 0);
            graphics.lineTo(x * this.gridSize, this.worldHeight * this.gridSize);
        }
        
        for (let y = 0; y <= this.worldHeight; y++) {
            graphics.moveTo(0, y * this.gridSize);
            graphics.lineTo(this.worldWidth * this.gridSize, y * this.gridSize);
        }
        
        this.worldContainer.addChild(graphics);
        
        // Teken ores
        this.ores.forEach(ore => {
            const oreSprite = new PIXI.Graphics();
            oreSprite.beginFill(this.getOreColor(ore.type));
            oreSprite.drawCircle(0, 0, this.gridSize / 2);
            oreSprite.endFill();
            oreSprite.x = ore.x * this.gridSize + this.gridSize / 2;
            oreSprite.y = ore.y * this.gridSize + this.gridSize / 2;
            this.worldContainer.addChild(oreSprite);
        });
    }

    getOreColor(type) {
        switch(type) {
            case 'iron': return 0x8b8b8b;
            case 'copper': return 0xb87333;
            case 'coal': return 0x2f2f2f;
            default: return 0xffffff;
        }
    }

    setupControls() {
        this.app.view.addEventListener('mousedown', this.onDragStart.bind(this));
        this.app.view.addEventListener('mousemove', this.onDragMove.bind(this));
        this.app.view.addEventListener('mouseup', this.onDragEnd.bind(this));
        this.app.view.addEventListener('click', this.onWorldClick.bind(this));
    }

    onWorldClick(event) {
        if (!this.isDragging && this.currentBuildingType) {
            const worldPos = this.app.renderer.plugins.interaction.mouse.getLocalPosition(this.worldContainer);
            const gridX = Math.floor(worldPos.x / this.gridSize);
            const gridY = Math.floor(worldPos.y / this.gridSize);
            this.placeBuilding(this.currentBuildingType, gridX, gridY);
        }
    }

    placeBuilding(type, gridX, gridY) {
        const building = new PIXI.Graphics();
        building.beginFill(0x666666);
        building.drawRect(0, 0, this.gridSize, this.gridSize);
        building.endFill();
        building.x = gridX * this.gridSize;
        building.y = gridY * this.gridSize;
        this.worldContainer.addChild(building);
    }
}

// Start de game wanneer het document geladen is
document.addEventListener('DOMContentLoaded', () => {
    const game = new FactoryGame();
}); 