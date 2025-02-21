class FactoryGame {
    constructor() {
        // PIXI setup
        this.app = new PIXI.Application({
            width: window.innerWidth - 250,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
            resolution: window.devicePixelRatio || 1
        });
        document.getElementById('gameCanvas').appendChild(this.app.view);

        // Grid en wereld setup
        this.gridSize = 32;
        this.worldWidth = 200;
        this.worldHeight = 200;
        this.worldContainer = new PIXI.Container();
        this.app.stage.addChild(this.worldContainer);

        // Game state
        this.resources = {
            money: 1000,
            iron_ore: 0,
            copper_ore: 0,
            coal: 0,
            iron_plates: 0,
            copper_plates: 0,
            electronics: 0
        };

        // Gebouwen en transport systeem
        this.placedBuildings = [];
        this.conveyorBelts = [];
        this.currentBuildingType = null;

        this.init();
    }

    init() {
        this.createWorld();
        this.setupControls();
        this.startGameLoop();
    }

    createWorld() {
        // Grid tekenen
        const grid = new PIXI.Graphics();
        grid.lineStyle(1, 0x333333, 0.3);
        
        // Genereer random ores
        for (let i = 0; i < 50; i++) {
            const ore = {
                type: ['iron', 'copper', 'coal'][Math.floor(Math.random() * 3)],
                x: Math.floor(Math.random() * this.worldWidth),
                y: Math.floor(Math.random() * this.worldHeight),
                amount: 1000
            };
            this.createOreSprite(ore);
        }
    }

    createOreSprite(ore) {
        const sprite = new PIXI.Graphics();
        const color = ore.type === 'iron' ? 0x8b8b8b : 
                     ore.type === 'copper' ? 0xb87333 : 0x2f2f2f;
        
        sprite.beginFill(color);
        sprite.drawCircle(0, 0, this.gridSize / 2);
        sprite.endFill();
        sprite.x = ore.x * this.gridSize + this.gridSize / 2;
        sprite.y = ore.y * this.gridSize + this.gridSize / 2;
        
        this.worldContainer.addChild(sprite);
    }

    placeBuilding(type, x, y) {
        const building = {
            type: type,
            x: x,
            y: y,
            sprite: new PIXI.Graphics(),
            storage: 0,
            maxStorage: 100
        };

        // Visuele representatie
        building.sprite.beginFill(type === 'miner' ? 0x666666 : 0x444444);
        building.sprite.drawRect(0, 0, this.gridSize, this.gridSize);
        building.sprite.endFill();
        building.sprite.x = x * this.gridSize;
        building.sprite.y = y * this.gridSize;

        this.worldContainer.addChild(building.sprite);
        this.placedBuildings.push(building);
    }

    createConveyorBelt(startX, startY, endX, endY) {
        const belt = {
            start: { x: startX, y: startY },
            end: { x: endX, y: endY },
            items: [],
            speed: 1
        };
        this.conveyorBelts.push(belt);
        this.drawConveyorBelt(belt);
    }

    gameLoop() {
        // Update miners
        this.placedBuildings.forEach(building => {
            if (building.type === 'miner') {
                this.updateMiner(building);
            }
        });

        // Update conveyor belts
        this.conveyorBelts.forEach(belt => {
            this.updateConveyorBelt(belt);
        });
    }
} 