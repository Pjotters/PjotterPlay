class FactoryGame {
    constructor() {
        this.worldWidth = 20;
        this.worldHeight = 15;
        this.gridSize = 32;
        this.selectedBuilding = null;
        
        // Resources initialiseren
        this.resources = {
            money: 1000,
            wood: 0,
            sand: 0,
            glass: 0,
            fuel: 0
        };

        // Workers initialiseren
        this.workers = {
            woodcutters: 0,
            miners: 0,
            glassmakers: 0
        };

        // Ores genereren
        this.ores = this.generateOres();
        
        // Gebouw types definiëren
        this.buildingTypes = {
            delver: {
                name: 'Delver',
                cost: 200,
                texture: 'Images/delver.png',
                production: 1
            },
            conveyor: {
                name: 'Lopende Band',
                cost: 50,
                texture: 'Images/Band-Factory.png'
            },
            transporter: {
                name: 'Transporteur',
                cost: 300,
                texture: 'Images/transporter.png'
            }
        };
        
        // Game starten
        this.init();
    }

    init() {
        // PixiJS applicatie maken
        this.app = new PIXI.Application({
            width: this.worldWidth * this.gridSize,
            height: this.worldHeight * this.gridSize,
            backgroundColor: 0x7cba3d,
            antialias: true
        });

        // World container maken
        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);

        // Canvas toevoegen
        const container = document.getElementById('gameCanvasContainer');
        if (container) {
            container.appendChild(this.app.view);
        }

        // Wereld maken
        this.createWorld();
        this.setupEventListeners();
        this.setupUI();
    }

    generateOres() {
        const ores = [];
        const oreTypes = ['iron', 'coal', 'gold'];
        
        // Genereer 20 willekeurige ores
        for (let i = 0; i < 20; i++) {
            ores.push({
                type: oreTypes[Math.floor(Math.random() * oreTypes.length)],
                x: Math.floor(Math.random() * this.worldWidth),
                y: Math.floor(Math.random() * this.worldHeight)
            });
        }
        return ores;
    }

    getOreColor(type) {
        const colors = {
            iron: 0x808080,
            coal: 0x333333,
            gold: 0xFFD700
        };
        return colors[type] || 0x000000;
    }

    createWorld() {
        // Grid tekenen
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(1, 0x333333, 0.3);
        
        for (let x = 0; x <= this.worldWidth; x++) {
            graphics.moveTo(x * this.gridSize, 0);
            graphics.lineTo(x * this.gridSize, this.worldHeight * this.gridSize);
        }
        
        for (let y = 0; y <= this.worldHeight; y++) {
            graphics.moveTo(0, y * this.gridSize);
            graphics.lineTo(this.worldWidth * this.gridSize, y * this.gridSize);
        }
        
        this.worldContainer.addChild(graphics);
        
        // Ores tekenen
        this.ores.forEach(ore => {
            const oreSprite = new PIXI.Graphics();
            oreSprite.beginFill(this.getOreColor(ore.type));
            oreSprite.drawCircle(0, 0, this.gridSize / 3);
            oreSprite.endFill();
            oreSprite.x = ore.x * this.gridSize + this.gridSize / 2;
            oreSprite.y = ore.y * this.gridSize + this.gridSize / 2;
            this.worldContainer.addChild(oreSprite);
        });
    }

    buildStructure(type) {
        if (this.selectedBuilding) {
            this.selectedBuilding = null;
        }
        
        const costs = {
            delver: 200,
            conveyor: 50,
            transporter: 300
        };

        if (this.resources.money >= costs[type]) {
            this.selectedBuilding = {
                type: type,
                cost: costs[type]
            };
            
            // Maak de cursor een gebouw-plaatsing cursor
            this.app.view.style.cursor = 'crosshair';
        } else {
            alert('Niet genoeg geld om dit gebouw te bouwen!');
        }
    }

    hireWorker(type) {
        const costs = {
            woodcutter: 50,
            miner: 75,
            glassmaker: 100
        };

        if (this.resources.money >= costs[type]) {
            this.resources.money -= costs[type];
            this.workers[type + 's']++;
            this.updateResourceDisplay();
        } else {
            alert('Niet genoeg geld om deze werknemer in te huren!');
        }
    }

    updateResourceDisplay() {
        document.getElementById('money').textContent = this.resources.money;
        document.getElementById('resources').textContent = 
            this.resources.wood + this.resources.sand + this.resources.glass;
        document.getElementById('workers').textContent = 
            this.workers.woodcutters + this.workers.miners + this.workers.glassmakers;
    }

    setupEventListeners() {
        this.app.view.addEventListener('click', (e) => {
            if (this.selectedBuilding) {
                const rect = this.app.view.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / this.gridSize);
                const y = Math.floor((e.clientY - rect.top) / this.gridSize);
                
                this.placeBuilding(x, y);
            }
        });
    }

    placeBuilding(x, y) {
        if (!this.selectedBuilding) return;
        
        const buildingType = this.buildingTypes[this.selectedBuilding.type];
        if (!buildingType || this.resources.money < buildingType.cost) return;

        // Gebouw sprite maken
        const texture = PIXI.Texture.from(buildingType.texture);
        const building = new PIXI.Sprite(texture);
        
        building.width = this.gridSize;
        building.height = this.gridSize;
        building.x = x * this.gridSize;
        building.y = y * this.gridSize;
        
        this.worldContainer.addChild(building);
        
        // Resources updaten
        this.resources.money -= buildingType.cost;
        this.updateResourceDisplay();
        
        // Reset selectie
        this.selectedBuilding = null;
        this.app.view.style.cursor = 'default';
    }

    setupUI() {
        // Gebouwen menu maken
        const buildingsDiv = document.createElement('div');
        buildingsDiv.className = 'buildings-menu';
        
        Object.entries(this.buildingTypes).forEach(([type, building]) => {
            const button = document.createElement('button');
            button.textContent = `${building.name} (${building.cost})`;
            button.onclick = () => {
                this.selectedBuilding = { type };
                this.app.view.style.cursor = 'pointer';
            };
            buildingsDiv.appendChild(button);
        });
        
        document.querySelector('.game-container').appendChild(buildingsDiv);
    }

    setupAchievements() {
        return {
            firstFactory: {
                name: "Eerste Fabriek",
                description: "Bouw je eerste fabriek",
                achieved: false
            },
            massProduction: {
                name: "Massaproductie",
                description: "Produceer 1000 items in totaal",
                achieved: false
            },
            automation: {
                name: "Automatisering Meester",
                description: "Heb 10 volledig geautomatiseerde productielijnen",
                achieved: false
            }
        };
    }

    // Voeg nieuwe game mechanics toe
    addProductionChain(input, process, output) {
        return new ProductionChain(input, process, output, this.resources);
    }

    setupMinimap() {
        // Maak een minimap container
        this.minimap = new PIXI.Container();
        this.minimap.position.set(10, this.app.screen.height - 110);
        
        // Achtergrond voor minimap
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.5);
        background.drawRect(0, 0, 100, 100);
        background.endFill();
        this.minimap.addChild(background);
        
        // Teken ores op minimap
        this.ores.forEach(ore => {
            const dot = new PIXI.Graphics();
            dot.beginFill(this.getOreColor(ore.type));
            dot.drawCircle(0, 0, 2);
            dot.endFill();
            dot.x = (ore.x / this.worldWidth) * 100;
            dot.y = (ore.y / this.worldHeight) * 100;
            this.minimap.addChild(dot);
        });
        
        this.app.stage.addChild(this.minimap);
    }

    setupStatistics() {
        // Maak statistieken venster
        this.stats = new PIXI.Container();
        this.stats.position.set(this.app.screen.width - 110, 10);
        
        // Achtergrond voor stats
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.5);
        background.drawRect(0, 0, 100, 100);
        background.endFill();
        this.stats.addChild(background);
        
        // Voeg statistieken tekst toe
        this.statsText = new PIXI.Text('Stats:\n', {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 0xFFFFFF
        });
        this.statsText.position.set(5, 5);
        this.stats.addChild(this.statsText);
        
        this.app.stage.addChild(this.stats);
        this.updateStats();
    }

    updateStats() {
        this.statsText.text = `Stats:\nGeld: ${this.resources.money}\nGrondstoffen: ${
            this.resources.wood + this.resources.sand + this.resources.glass
        }\nWerknemers: ${
            this.workers.woodcutters + this.workers.miners + this.workers.glassmakers
        }`;
    }

    createLegend() {
        const legend = document.createElement('div');
        legend.className = 'game-legend';
        legend.innerHTML = `
            <h3>Legenda</h3>
            <div class="legend-item">
                <span class="legend-color" style="background: #FFD700"></span>
                <span>Goud (50 per stuk)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: #808080"></span>
                <span>IJzer (30 per stuk)</span>
            </div>
            <div class="legend-item">
                <span class="legend-color" style="background: #333333"></span>
                <span>Kolen (20 per stuk)</span>
            </div>
            <div class="legend-item">
                <img src="Images/factory/miner.png" alt="Delver">
                <span>Delver (verzamelt grondstoffen)</span>
            </div>
            <div class="legend-item">
                <img src="Images/factory/conveyor.png" alt="Lopende Band">
                <span>Lopende Band (transporteert grondstoffen)</span>
            </div>
        `;
        
        document.querySelector('.game-container').appendChild(legend);
    }

    placeBuilding(type, x, y) {
        if (this.resources.money >= this.buildingTypes[type].cost) {
            const building = {
                type: type,
                x: x,
                y: y,
                resources: 0,
                lastUpdate: Date.now()
            };
            
            this.buildings.push(building);
            this.resources.money -= this.buildingTypes[type].cost;
            this.updateUI();
            
            if (type === 'MINER') {
                this.workers.miners++;
            }
        }
    }

    update() {
        const now = Date.now();
        this.buildings.forEach(building => {
            if (building.type === 'MINER') {
                // Update elke seconde
                if (now - building.lastUpdate >= 1000) {
                    this.resources.wood += this.buildingTypes.MINER.production;
                    building.lastUpdate = now;
                }
            }
        });
        
        this.updateUI();
    }
}

class ProductionLine {
    constructor(type, inputResources, outputResource, productionTime) {
        this.type = type;
        this.inputResources = inputResources;
        this.outputResource = outputResource;
        this.productionTime = productionTime;
        this.progress = 0;
        this.isActive = false;
    }

    update() {
        if (this.isActive) {
            this.progress += 1;
            if (this.progress >= this.productionTime) {
                this.progress = 0;
                return true; // Productie voltooid
            }
        }
        return false;
    }
}

class Research {
    constructor() {
        this.technologies = {
            automation: {
                name: "Automatisering",
                cost: 1000,
                requirements: [],
                effects: {
                    production_speed: 1.5
                },
                completed: false
            },
            advanced_logistics: {
                name: "Geavanceerde Logistiek",
                cost: 2000,
                requirements: ["automation"],
                effects: {
                    transport_speed: 2
                },
                completed: false
            },
            smart_manufacturing: {
                name: "Slimme Productie",
                cost: 3000,
                requirements: ["automation", "advanced_logistics"],
                effects: {
                    resource_efficiency: 1.25
                },
                completed: false
            }
        };
    }

    canResearch(techId) {
        const tech = this.technologies[techId];
        return tech.requirements.every(req => this.technologies[req].completed);
    }

    research(techId) {
        const tech = this.technologies[techId];
        if (this.canResearch(techId)) {
            tech.completed = true;
            return true;
        }
        return false;
    }
}

class Market {
    constructor() {
        this.prices = {
            wood: 10,
            glass: 25,
            electronics: 100,
            computer: 500,
            phone: 1000
        };
        this.demandMultipliers = {
            wood: 1,
            glass: 1,
            electronics: 1,
            computer: 1,
            phone: 1
        };
    }

    updatePrices() {
        // Prijzen fluctueren gebaseerd op vraag en aanbod
        Object.keys(this.prices).forEach(resource => {
            const randomFactor = 0.9 + Math.random() * 0.2;
            this.prices[resource] *= randomFactor;
        });
    }

    sellResource(resource, amount) {
        return this.prices[resource] * amount * this.demandMultipliers[resource];
    }
}

// Nieuwe klasse voor productieketens
class ProductionChain {
    constructor(input, process, output, resources) {
        this.input = input;
        this.process = process;
        this.output = output;
        this.resources = resources;
        this.efficiency = 1.0;
        this.level = 1;
    }

    upgrade() {
        this.level++;
        this.efficiency *= 1.1;
    }

    process() {
        if (this.hasRequiredResources()) {
            this.consumeResources();
            this.produceOutput();
        }
    }
}

// Game instance maken en globaal beschikbaar maken
window.game = new FactoryGame(); 