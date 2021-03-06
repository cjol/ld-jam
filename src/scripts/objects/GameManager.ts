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
const priceScale = [...Array(10)].map((_, i) => 10 * (Math.pow(3, i) - 1))
// const priceScale = [0, 20, 60, 80, 160, 320, 500]
const LOCALSTORAGE_MAX_DEPTH_KEY = "hms-max-depth";
const COST_OF_FIXING = 0.5;

// Class to manage the game by keeping track of upgrades and money earned
export default class GameManager {
	private currentWealth: number;

	public readonly upgrades: Upgrades = {
		// Capacity (units are pseudo-kg)
		capacity: {
			totalUpgrades: [20, 50, 80, 110, 150, 200],
			upgradesBought: 0,
			price: priceScale.slice(0, 6)
		},
		// Pressure hull
		depthLimit: {
			totalUpgrades: [150, 300, 450, 600, 750, 1000],
			upgradesBought: 0,
			price: priceScale.slice(0, 6)
		},
		// Armour (units are collisions allowed)
		armour: {
			totalUpgrades: [2, 3, 4, 5, 6],
			upgradesBought: 0,
			price: priceScale.slice(0, 5)
		},
		// Chain length
		chain: {
			totalUpgrades: [2, 3, 4, 5],
			upgradesBought: 0,
			price: priceScale.slice(1, 5)
		},
		// O2 tank (units are seconds underwater)
		tank: {
			totalUpgrades: [45, 90, 135, 180, 225, 270, 305],
			upgradesBought: 0,
			price: priceScale.slice(0, 7)
		},
		// Ship speed
		shipSpeed: {
			totalUpgrades: [5, 6, 7],
			upgradesBought: 0,
			price: priceScale.slice(0, 3)
		},
		// Claw speed
		clawSpeed: {
			totalUpgrades: [5, 6, 7],
			upgradesBought: 0,
			price: priceScale.slice(0, 3)
		},
		// Claw size (units are 'scale')
		clawSize: {
			totalUpgrades: [0.25, 0.3, 0.35, 0.4],
			upgradesBought: 0,
			price: priceScale.slice(0, 4)
		},
		// Location
		location: {
			totalUpgrades: [0, 1, 2],
			upgradesBought: 0,
			price: priceScale.slice(0, 3)
		},
		// Collectables - can collect fish (level 10, ore (level 21, research (level 32
		collectable: {
			totalUpgrades: [0, 1, 2],
			upgradesBought: 0,
			price: priceScale.slice(0, 3)
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
	maxDepthReached: number = 0;
	bestMaxDepthReached: number;
	currentDepth: number;
	upgradeMenuOpen: boolean;

	public constructor() {
		this.maxDepthReached = 0;
		this.bestMaxDepthReached = this.getBestMaxDepth();
	}

	public initialise() {
		// Initialise the trackers
		this.totalWealth = 0;
		this.CurrentWealth = 0;
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
			if (upgradeCost <= this.CurrentWealth) {
				console.log("Upgrading: " + upgradeType);
				upgradeData.upgradesBought += 1;
				this.CurrentWealth -= upgradeCost;
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
		this.CurrentWealth += cargoFishValue;

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
		this.CurrentWealth += cargoOreValue;

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
		this.CurrentWealth += cargoResearchValue;

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

		// Max damage that could be fixed for current wealth
		const costLimit = Math.floor(this.CurrentWealth / COST_OF_FIXING);

		// We will fix up to the total damage, or until we run out of money
		const damageToFix = Math.min(damage, costLimit);

		// Update the hull score, and the currentWealth
		this.submarine.hull += damageToFix;
		this.CurrentWealth -= Math.floor(damageToFix * COST_OF_FIXING);
	}

	markSubmarineDestroyed() {
		this.submarine.isDead = true;
	}

	updateMaxDepth(depth: number): void {
		if (this.submarine.isDead)
			return;

		depth = Math.floor(depth);
		if (depth > gameManager.maxDepthReached)
			gameManager.maxDepthReached = depth;
		if (depth > gameManager.bestMaxDepthReached) {
			gameManager.bestMaxDepthReached = depth;
			this.setBestMaxDepth(depth);
		}
	}

	getBestMaxDepth(): number {
		const value: string = localStorage.getItem(LOCALSTORAGE_MAX_DEPTH_KEY) || "0";
		let numeric: number = parseInt(value, 10);
		if (isNaN(numeric) || numeric < 0)
			numeric = 0;
		return numeric;
	}

	setBestMaxDepth(value: number): void {
		localStorage.setItem(LOCALSTORAGE_MAX_DEPTH_KEY, value.toString());
	}

	public get CurrentWealth(): number {
		return this.currentWealth;
	}

	public set CurrentWealth(value: number) {
		if (isNaN(value))
			return;

		this.currentWealth = value;
	}
}

export const gameManager = new GameManager();
