import { Fish } from "./Fishes";
import { MechanicalHook } from "./MechanicalHook";
import Submarine from "./Submarine";

interface Upgrade {
    current: number;
    totalUpgrades: number[];
    upgradesBrought: number;
}


// Class to manage the game by keeping track of upgrades and money earned
export default class GameManager {

    scene: Phaser.Scene;
    submarine: Submarine;
    upgrades: {
        capacity: Upgrade;
        depthLimit: Upgrade;
        armour: Upgrade;
        chain: Upgrade;
        tank: Upgrade;
        shipSpeed: Upgrade;
        clawSpeed: Upgrade;
        clawSize: Upgrade;
        location: Upgrade;
        collectable: Upgrade;
    };
    totalWealth: number;
    currentWealth: number;
    maxDepthReached: number;
    currentDepth: number;

    // Initialise the game
    constructor(scene: Phaser.Scene, submarine: Submarine) {

        // Let us access the important stuff later
        this.scene = scene;
        this.submarine = submarine;

        // Initialise the trackers
        this.totalWealth = 0;
        this.currentWealth = 0;
        this.maxDepthReached = 0;
        this.currentDepth = 0;

        // At the start of the game, set all upgrades to 0
        this.upgrades = {
            // Capacity (units are pseudo-kg)
            capacity: {
                current: 10,
                totalUpgrades: [10, 20, 30, 50, 75, 100],
                upgradesBrought: 0
            },
            // Pressure hull
            depthLimit: {
                current: 250,
                totalUpgrades: [250, 500, 1000, 2000, 3000, 10000],
                upgradesBrought: 0
            },
            // Armour (units are collisions allowed)
            armour: {
                current: 2,
                totalUpgrades: [2, 3, 4, 5, 6],
                upgradesBrought: 0
            },
            // Chain length
            chain: {
                current: 2,
                totalUpgrades: [2, 3, 4],
                upgradesBrought: 0
            },
            // O2 tank (units are seconds underwater)
            tank: {
                current: 45,
                totalUpgrades: [45, 90, 135, 180, 225, 270, 305],
                upgradesBrought: 0
            },
            // Ship speed
            shipSpeed: {
                current: 5,
                totalUpgrades: [5, 6, 7],
                upgradesBrought: 0
            },
            // Claw speed
            clawSpeed: {
                current: 5,
                totalUpgrades: [5, 6, 7],
                upgradesBrought: 0
            },
            // Claw size (units are 'scale')
            clawSize: {
                current: 0.25,
                totalUpgrades: [0.25, 0.3, 0.35, 0.4],
                upgradesBrought: 0
            },
            // Location
            location: {
                current: 0,
                totalUpgrades: [0, 1, 2],
                upgradesBrought: 0
            },
            // Collectables - can collect fish (level 10, ore (level 21, research (level 32
            collectable: {
                current: 0,
                totalUpgrades: [0, 1, 2],
                upgradesBrought: 0
            }
        }

        // Set the starting parameters for the submarine
        this.updateSub();

        // start watching for interesting collisions in our world
        this.scene.matter.world.on('collisionstart', this.watchCollisions.bind(this));
    }

    updateSub() {
        this.submarine.maxOxygen = this.upgrades.tank.totalUpgrades[this.upgrades.tank.upgradesBrought];
        this.submarine.oxygen = this.submarine.maxOxygen;
        this.submarine.maxCapacity = this.upgrades.capacity[this.upgrades.capacity.upgradesBrought];
    }

    // Called on clicking on an upgrade
    purchaseUpgrade(upgradeType: keyof GameManager["upgrades"]) {

        var upgradeData = this.upgrades[upgradeType]

        if (upgradeData.upgradesBrought < upgradeData.totalUpgrades.length) {
            upgradeData.upgradesBrought += 1;
        }

    }

    // Called when the submarine tries to sell all its fish
    sellFish() {
        console.log("I'm selling all my fish!");
        console.log("My new current worth is... " + this.currentWealth);
        // Get the current fish value in the sub and add it to the wealth scores
        var cargoFishValue = this.submarine.cargo.fishValue;
        this.totalWealth += cargoFishValue;
        this.currentWealth += cargoFishValue;

        // Empty the hold (weight and value)
        this.submarine.cargo.fishValue = 0;
        this.submarine.cargo.fishWeight = 0;

    }
    // Called when the submarine tries to sell all its ore
    sellOre() {
        console.log("I'm selling all my ore!")
        // Get the current fish value in the sub and add it to the wealth scores
        var cargoOreValue = this.submarine.cargo.oreValue;
        this.totalWealth += cargoOreValue;
        this.currentWealth += cargoOreValue;

        // Empty the hold (weight and value)
        this.submarine.cargo.oreValue = 0;
        this.submarine.cargo.oreWeight = 0;

    }
    // Called when the submarine tries to sell all its research
    sellResearch() {
        console.log("I'm selling all my research!")
        // Get the current fish value in the sub and add it to the wealth scores
        var cargoResearchValue = this.submarine.cargo.researchValue;
        this.totalWealth += cargoResearchValue;
        this.currentWealth += cargoResearchValue;

        // Empty the hold (weight and value)
        this.submarine.cargo.researchValue = 0;
        this.submarine.cargo.researchWeight = 0;

    }

    watchCollisions(event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
        event.pairs
            .map(detectObjs)
            .filter((x): x is MatchedPair => x !== null)
            .forEach(pair => {
                const hook = pair.hook;
                const item = pair.item;
                console.log("Caught something!", item)
                if (item instanceof Fish) {
                    hook.catchFish(item);
                }
            });
    }
}
type MatchedPair = { hook: MechanicalHook, item: Phaser.GameObjects.GameObject };

function detectObjs(pair: Phaser.Types.Physics.Matter.MatterCollisionData): null | MatchedPair  {
    let hook: MechanicalHook | undefined;
    if (pair.bodyA.gameObject instanceof MechanicalHook) {
        return { hook: pair.bodyA.gameObject, item: pair.bodyB.gameObject };
    } else if (pair.bodyB.gameObject instanceof MechanicalHook) {
        return { hook: pair.bodyB.gameObject, item: pair.bodyA.gameObject };
    }
    return null

}