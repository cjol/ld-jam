import { Bar } from "./Bar";
import { CollisionCategories } from "./CollisionCategories";
import { gameManager } from "./GameManager";
import { MechanicalArm } from "./MechanicalHook";

type Key = "up" | "down" | "left" | "right";
const OXYGEN_BAR_OFFSET_Y = -80;
const HULL_BAR_OFFSET_Y = -100;
const OXYGEN_CONSUMPTION_RATE = 0.05;
const HULL_DAMAGE_RATE = 1;
const OXYGEN_REFUEL_RATE = 1;
const CARGO_BAR_OFFSET_Y = -60;
export const WATER_LEVEL = 220;
// make it so we go up faster than down
const BUOYANCY = 1.8;

export default class Submarine extends Phaser.Physics.Matter.Image {
	keys: Record<Key, Phaser.Input.Keyboard.Key>;
	hook: MechanicalArm;
	hullBar: Bar;
	oxygenBar: Bar;
	cargoBar: Bar;

	// Constructor for submarine
	constructor(scene: Phaser.Scene, x: number, y: number = WATER_LEVEL - 20) {
		// Create submarine
		super(scene.matter.world, x, y, "submarine", undefined, {
			frictionAir: 0.05,
			mass: 500,
		});

		scene.add.existing(this);
		this.setupKeys();

		this.setCollisionCategory(CollisionCategories.SUBMARINE);
		this.setCollidesWith(
			CollisionCategories.WALLS | CollisionCategories.MECHANICAL_HOOK
		);

		this.hook = new MechanicalArm(
			scene,
			this,
			gameManager.getUpgradeValue("chain")
		);
		this.hullBar = new Bar(scene, 50, 50, 100, 100, "hull");
		this.oxygenBar = new Bar(scene, 50, 50, 100, 100, "oxygen");
		this.cargoBar = new Bar(scene, 50, 50, 100, 100, "cargo");

		this.displayWidth = this.width * 0.25;
		this.displayHeight = this.height * 0.25;
		this.setIgnoreGravity(true);
	}

	setupKeys() {
		this.keys = this.scene.input.keyboard.addKeys(
			{
				up: "W",
				down: "S",
				left: "A",
				right: "D",
			},
			true,
			true
		) as Record<string, Phaser.Input.Keyboard.Key>;
	}

	// Update loop - game physics based on acceleration
	update() {
		this.updateKeys();
		this.updateArm();
		this.updateHull();
		this.updateOxygen();
		this.updateCargo();
		this.updateDepth();
	}

	updateDepth() {

		// Update the max depth if it needs it
		var depth = (this.y - WATER_LEVEL) / 10;
		gameManager.currentDepth = depth
		if (depth > gameManager.maxDepthReached) {
			gameManager.maxDepthReached = depth
		}
	}

	updateArm() {
		this.hook.update();
	}

	updateKeys() {
		if (gameManager.submarine.isDead)
			return;

		const speed = gameManager.getUpgradeValue("shipSpeed");
		// X direction - assume no key pressed
		// Check for left and right keys
		let flipX = this.flipX;
		if (this.keys.left.isDown) {
			this.setVelocityX(-speed);
			flipX = true;
		} else if (this.keys.right.isDown) {
			this.setVelocityX(speed);
			flipX = false;
		}

		// Force the sub not to rotate
		this.setFlip(flipX, false);
		this.setRotation(0);

		// Y direction - assume no key pressed
		// Check for up and down keys
		if (this.keys.up.isDown) {
			this.setVelocityY(-speed * BUOYANCY);
			this.setRotation(flipX ? 0.1 : -0.1);
		} else if (this.keys.down.isDown) {
			this.setVelocityY(speed);
			this.setRotation(flipX ? -0.1 : 0.1);
		}

		// stop moving up past the water level
		if (this.y < WATER_LEVEL) {
			this.y = WATER_LEVEL;
		}
		if (this.y < WATER_LEVEL + 20) {
			gameManager.submarine.isAtSurface = true;
		} else {
			if (gameManager.submarine.isAtSurface) {
				gameManager.submarine.isAtSurface = false;
			}
		}
	}

	updateOxygen() {
		const maxOxygen = gameManager.getUpgradeValue("tank");
		if (gameManager.submarine.isAtSurface) {
			gameManager.submarine.oxygen += OXYGEN_REFUEL_RATE;
			gameManager.submarine.oxygenLow = false;
		} else {
			gameManager.submarine.oxygen -= OXYGEN_CONSUMPTION_RATE;
		}
		gameManager.submarine.oxygen = Math.max(
			0,
			Math.min(gameManager.submarine.oxygen, maxOxygen)
		);
		this.oxygenBar.update(
			this.x,
			this.y + OXYGEN_BAR_OFFSET_Y,
			gameManager.submarine.oxygen,
			maxOxygen
		);

		// Set the warning if the bar is nearly empty
		if (gameManager.submarine.oxygen / maxOxygen <= 0.3) {
			gameManager.submarine.oxygenLow = true;
		}

		// End the game
		if (gameManager.submarine.oxygen <= 0) {
			this.killSubmarine();
		}
	}

	updateHull() {
		const maxHull = gameManager.getUpgradeValue("depthLimit");
		// calculate how much past the maxHull we are
		const depthExceeded = Math.max(0, (gameManager.currentDepth / maxHull) - 1)
			gameManager.submarine.hull -= HULL_DAMAGE_RATE * depthExceeded;
		// clamp to 0-maxHull range
		gameManager.submarine.hull = Math.max(
			0,
			Math.min(gameManager.submarine.hull, maxHull)
		);
		this.hullBar.update(
			this.x,
			this.y + HULL_BAR_OFFSET_Y,
			gameManager.submarine.hull,
			maxHull
		);

		// Set the warning if the bar is nearly empty
		if (gameManager.submarine.hull / maxHull < 0.3) {
			gameManager.submarine.pressureWarning = 2;
		} else if (depthExceeded > 0) {
			gameManager.submarine.pressureWarning = 1;
		} else {
			gameManager.submarine.pressureWarning = 0;

		}

		// End the game
		if (gameManager.submarine.hull <= 0) {
			this.killSubmarine();
		}
	}

	updateCargo() {
		// Calculate the total amount in the hold
		var totalCargo =
			gameManager.submarine.cargo.fishWeight +
			gameManager.submarine.cargo.oreWeight +
			gameManager.submarine.cargo.researchWeight;
		this.cargoBar.update(
			this.x,
			this.y + CARGO_BAR_OFFSET_Y,
			totalCargo,
			gameManager.getUpgradeValue("capacity")
		);
	}

	// Function to run if you kill the submarine
	killSubmarine() {
		gameManager.submarine.isDead = true;
		this.setFrictionAir(0.5);
		this.setAngularVelocity(0.1);
		this.setIgnoreGravity(false);
	}

	checkUpgrades() {
		if (gameManager.getUpgradeValue("chain") !== this.hook.getLength()) {
			this.upgradeArm();
		}
	}
	upgradeArm() {
		this.hook.destroy();
		this.hook = new MechanicalArm(
			this.scene,
			this,
			gameManager.getUpgradeValue("chain")
		);
	}

}
