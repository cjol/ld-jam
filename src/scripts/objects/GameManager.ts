import { Fish } from "./fish/Fish";
import { Hazard } from "./hazard/Hazard";

interface Upgrade {
	totalUpgrades: number[];
	upgradesBought: number;
	price: number[];
}

interface Upgrades {
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
}

// Class to manage the game by keeping track of upgrades and money earned
export default class GameManager {
	public readonly upgrades: Upgrades = {
		// Capacity (units are pseudo-kg)
		capacity: {
			totalUpgrades: [50, 150, 300, 500, 750, 1000],
			upgradesBought: 0,
			price: [0, 10, 20, 30, 40, 50]
		},
		// Pressure hull
		depthLimit: {
			totalUpgrades: [150, 300, 450, 600, 750, 1000],
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
			totalUpgrades: [2, 3, 4],
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
	};
	submarine: {
		oxygen: number;
		hull: number;
		cargo: {
			fishWeight: number;
			fishValue: number;
			oreWeight: number;
			oreValue: number;
			researchWeight: number;
			researchValue: number;
		};
		isAtSurface: boolean;
		isDead: boolean;
		diedAt: number;
		holdFull: boolean;
		oxygenLow: boolean;
		pressureWarning: number;
	};
	totalWealth: number;
	currentWealth: number;
	maxDepthReached: number;
	currentDepth: number;
	upgradeMenuOpen: boolean;

	public initialise() {
		// Initialise the trackers
		this.totalWealth = 0;
		this.currentWealth = 0;
		this.maxDepthReached = 0;
		this.currentDepth = 0;
		this.upgradeMenuOpen = false;

		this.upgrades.armour.upgradesBought = 0;
		this.upgrades.capacity.upgradesBought = 0;
		this.upgrades.chain.upgradesBought = 0;
		this.upgrades.clawSize.upgradesBought = 0;
		this.upgrades.clawSpeed.upgradesBought = 0;
		this.upgrades.collectable.upgradesBought = 0;
		this.upgrades.depthLimit.upgradesBought = 0;
		this.upgrades.location.upgradesBought = 0;
		this.upgrades.shipSpeed.upgradesBought = 0;
		this.upgrades.tank.upgradesBought = 0;

		this.submarine = {
			oxygen: this.upgrades.tank.totalUpgrades[
				this.upgrades.tank.upgradesBought
			],
			hull: this.getUpgradeValue("depthLimit"),
			cargo: {
				fishWeight: 0,
				fishValue: 0,
				oreWeight: 0,
				oreValue: 0,
				researchWeight: 0,
				researchValue: 0
			},
			isAtSurface: true,
			isDead: false,
			diedAt: 0,
			holdFull: false,
			oxygenLow: false,
			pressureWarning: 0
		};
	}

	getUpgradeValue(upgradeType: keyof GameManager["upgrades"]) {
		const upgradeData = this.upgrades[upgradeType];
		return upgradeData.totalUpgrades[upgradeData.upgradesBought];
	}

	// Called on clicking on an upgrade (returns true or false for whether it successfully upgraded or not)
	purchaseUpgrade(upgradeType: keyof GameManager["upgrades"]) {
		const upgradeData = this.upgrades[upgradeType];
		// First check whether there's an upgrade to be bought
		if (upgradeData.upgradesBought < upgradeData.totalUpgrades.length - 1) {
			// If there is an upgrade, check how much it costs
			const upgradeCost =
				upgradeData.price[upgradeData.upgradesBought + 1];
			// If we can afford it, increment the upgrade, and take the money
			if (upgradeCost <= this.currentWealth) {
				console.log("Upgrading: " + upgradeType);
				upgradeData.upgradesBought += 1;
				this.currentWealth -= upgradeCost;
				return true;
			} else {
				console.log("Insufficient funds");
				return false;
			}
		}
		return false;
	}

	// Called when the submarine tries to sell all its fish
	sellFish() {
		console.log("I'm selling all my fish!");
		// Get the current fish value in the sub and add it to the wealth scores
		const cargoFishValue = this.submarine.cargo.fishValue;
		this.totalWealth += cargoFishValue;
		this.currentWealth += cargoFishValue;

		// Empty the hold (weight and value)
		this.submarine.cargo.fishValue = 0;
		this.submarine.cargo.fishWeight = 0;
		this.submarine.holdFull = false;
	}

	// Called when the submarine tries to sell all its ore
	sellOre() {
		console.log("I'm selling all my ore!");
		// Get the current fish value in the sub and add it to the wealth scores
		const cargoOreValue = this.submarine.cargo.oreValue;
		this.totalWealth += cargoOreValue;
		this.currentWealth += cargoOreValue;

		// Empty the hold (weight and value)
		this.submarine.cargo.oreValue = 0;
		this.submarine.cargo.oreWeight = 0;
		this.submarine.holdFull = false;
	}

	// Called when the submarine tries to sell all its research
	sellResearch() {
		console.log("I'm selling all my research!");
		// Get the current fish value in the sub and add it to the wealth scores
		const cargoResearchValue = this.submarine.cargo.researchValue;
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
		const newTotal =
			this.submarine.cargo.fishWeight +
			this.submarine.cargo.oreWeight +
			this.submarine.cargo.researchWeight +
			newWeight;
		// If it's greater than the capacity, don't allow the catch
		if (newTotal <= this.getUpgradeValue("capacity"))
			return true;
		else {
			// Mark the hold as full so we can show the UI warning
			this.submarine.holdFull = true;
			return false;
		}
	}

	// Called when the submarine catches a fish. It needs to get the fish that was caught, and add its weight to the sub's cargo
	catchFish(fish: Fish) {
		if (
			!this.checkHoldCapacity(fish.weight) ||
			this.submarine.isAtSurface ||
			this.submarine.isDead
		)
			return;

		// Add the fish's weight to the hold
		this.submarine.cargo.fishWeight += fish.weight;
		// Add its value to the hold
		this.submarine.cargo.fishValue += fish.worth;
		// Destroy the fish
		fish.catch();
	}

	hitHazard(hazard: Hazard) {
		if (this.submarine.isDead)
			return;

		// Add the fish's weight to the hold
		this.submarine.hull -= hazard.damage;
		// Destroy the fish
		hazard.hit();
	}

	// Called when the submarine picks up some ore. Get the weight and value and add it to the hold
	collectOre() {
		// Will need to write this once we have created the Ore class (as for fish)
	}

	// Called when the submarine picks up some research. Get the weight and value and add it to the hold
	collectResearch() {
		// Will need to write this once we have created the Research class (as for fish)
	}

	// Fix the submarine by as much money as you can
	fixSub() {
		// How much is the sub damaged?
		const damage = this.getUpgradeValue("depthLimit") - this.submarine.hull;

		// Cost of fixing - units are 'pounds per point of damage'
		const costOfFixing = 0.5;

		// Max damage that could be fixed for current wealth
		const costLimit = Math.floor(this.currentWealth / costOfFixing);

		// We will fix up to the total damage, or until we run out of money
		const damageToFix = Math.min(damage, costLimit);

		// Update the hull score, and the currentWealth
		this.submarine.hull += damageToFix;
		this.currentWealth -= Math.floor(damageToFix * costOfFixing);
	}

	markSubmarineDestroyed() {
		this.submarine.isDead = true;
	}
}

export const gameManager = new GameManager();
