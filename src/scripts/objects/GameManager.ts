import { Fish } from "./Fishes";
import { MechanicalHook } from "./MechanicalHook";
import Submarine from "./Submarine";

interface Upgrade {
    totalUpgrades: number[];
    upgradesBought: number;
    price: number[];
}

// Class to manage the game by keeping track of upgrades and money earned
export default class GameManager {

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
    submarine: {
        oxygen: number;
        cargo: { fishWeight: number, fishValue: number, oreWeight: number, oreValue: number, researchWeight: number, researchValue: number };
        isAtSurface: boolean;
        isDead: boolean;
        holdFull: boolean;
        oxygenLow: boolean;
        pressureWarning: number;
    }
    totalWealth: number;
    currentWealth: number;
    maxDepthReached: number;
    currentDepth: number;
    upgradeMenuOpen: boolean;

    // Initialise the game
    constructor() {

        // Initialise the trackers
        this.totalWealth = 0;
        this.currentWealth = 1000;
        this.maxDepthReached = 0;
        this.currentDepth = 0;
        this.upgradeMenuOpen = false;

        // At the start of the game, set all upgrades to 0
        this.upgrades = {
            // Capacity (units are pseudo-kg)
            capacity: {
                totalUpgrades: [50, 150, 300, 500, 750, 1000],
                upgradesBought: 0,
                price: [0, 10, 20, 30, 40, 50]
            },
            // Pressure hull
            depthLimit: {
                totalUpgrades: [100, 300, 1000, 2000, 3000, 10000],
                upgradesBought: 0,
                price: [0, 10, 20, 30, 40, 50]
            },
            // Armour (units are collisions allowed)
            armour: {
                totalUpgrades: [2, 3, 4, 5, 6],
                upgradesBought: 0,
                price: [0, 10, 20, 30, 40]
            },
            // Chain length
            chain: {
                totalUpgrades: [1, 2, 3, 4],
                upgradesBought: 0,
                price: [0, 10, 20]
            },
            // O2 tank (units are seconds underwater)
            tank: {
                totalUpgrades: [45, 90, 135, 180, 225, 270, 305],
                upgradesBought: 0,
                price: [0, 10, 20, 30, 40, 50, 60]
            },
            // Ship speed
            shipSpeed: {
                totalUpgrades: [5, 6, 7],
                upgradesBought: 0,
                price: [0, 10, 20]
            },
            // Claw speed
            clawSpeed: {
                totalUpgrades: [5, 6, 7],
                upgradesBought: 0,
                price: [0, 10, 20]
            },
            // Claw size (units are 'scale')
            clawSize: {
                totalUpgrades: [0.25, 0.3, 0.35, 0.4],
                upgradesBought: 0,
                price: [0, 10, 20, 30]
            },
            // Location
            location: {
                totalUpgrades: [0, 1, 2],
                upgradesBought: 0,
                price: [0, 10, 20]
            },
            // Collectables - can collect fish (level 10, ore (level 21, research (level 32
            collectable: {
                totalUpgrades: [0, 1, 2],
                upgradesBought: 0,
                price: [0, 10, 20]
            }
        }

        // Set the starting parameters for the submarine
        this.initSub();
    }

    initSub() {
        this.submarine = {
            oxygen: this.upgrades.tank.totalUpgrades[this.upgrades.tank.upgradesBought],
            cargo: { fishWeight: 0, fishValue: 0, oreWeight: 0, oreValue: 0, researchWeight: 0, researchValue: 0 },
            isAtSurface: true,
            isDead: false,
            holdFull: false,
            oxygenLow: false,
            pressureWarning: 0
        }
    }


    getUpgradeValue(upgradeType: keyof GameManager["upgrades"]) {
        var upgradeData = this.upgrades[upgradeType];
        return upgradeData.totalUpgrades[upgradeData.upgradesBought];
    }

    // Called on clicking on an upgrade
    purchaseUpgrade(upgradeType: keyof GameManager["upgrades"]) {
        
        var upgradeData = this.upgrades[upgradeType]
        // First check whether there's an upgrade to be bought
        if (upgradeData.upgradesBought < upgradeData.totalUpgrades.length - 1) {
            // If there is an upgrade, check how much it costs
            var upgradeCost = upgradeData.price[upgradeData.upgradesBought + 1];
            // If we can afford it, increment the upgrade, and take the money
            if (upgradeCost <= this.currentWealth) {
                console.log("Upgrading: " + upgradeType)
                upgradeData.upgradesBought += 1;
                this.currentWealth -= upgradeCost;
            } else {
                console.log("Insufficient funds")
            }

        }
    }

    // Called when the submarine tries to sell all its fish
    sellFish() {
        console.log("I'm selling all my fish!");
        // Get the current fish value in the sub and add it to the wealth scores
        var cargoFishValue = this.submarine.cargo.fishValue;
        this.totalWealth += cargoFishValue;
        this.currentWealth += cargoFishValue;

        // Empty the hold (weight and value)
        this.submarine.cargo.fishValue = 0;
        this.submarine.cargo.fishWeight = 0;
        this.submarine.holdFull = false;
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
        this.submarine.holdFull = false;
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
        this.submarine.holdFull = false;
    }

    // Add the weight to be added to the cargo total weight, and check it doesn't exceed the total capacity
    checkHoldCapacity(newWeight: number) {
        // Get what the new total would be if we allowed it
        var newTotal = this.submarine.cargo.fishWeight + this.submarine.cargo.oreWeight + this.submarine.cargo.researchWeight + newWeight
        // If it's greater than the capacity, don't allow the catch
        if (newTotal <= this.getUpgradeValue('capacity')) {
            return true
        } else {
            // Mark the hold as full so we can show the UI warning
            this.submarine.holdFull = true;
            return false
        }

    }

    // Called when the submarine catches a fish. It needs to get the fish that was caught, and add its weight to the sub's cargo
    catchFish(fish: Fish) {

        if (this.checkHoldCapacity(fish.weight)) {
            // Add the fish's weight to the hold
            this.submarine.cargo.fishWeight += fish.weight;
            // Add its value to the hold
            this.submarine.cargo.fishValue += fish.worth;
            // Destroy the fish
        }

    }

    // Called when the submarine picks up some ore. Get the weight and value and add it to the hold
    collectOre() {

        // Will need to write this once we have created the Ore class (as for fish)

    }

    // Called when the submarine picks up some research. Get the weight and value and add it to the hold
    collectResearch() {

        // Will need to write this once we have created the Research class (as for fish)

    }

}

export const gameManager = new GameManager();