import { CollisionCategories } from "./CollisionCategories";
import { gameManager } from "./GameManager";
import { MechanicalArm } from "./MechanicalHook";

type Key = "up" | "down" | "left" | "right";
export const WATER_LEVEL = 220;
// make it so we go up faster than down
const BUOYANCY = 1.8;
const SCALE = 0.25;

export default class Submarine extends Phaser.Physics.Matter.Image {
	private readonly collisionData: any;
	keys: Record<Key, Phaser.Input.Keyboard.Key>;
	hook: MechanicalArm;
	// TODO: yes this is hacky
	wasDeadLastTimeIChecked: boolean;

	// Constructor for submarine
	constructor(scene: Phaser.Scene, x: number, y: number = WATER_LEVEL - 20) {
		// Create submarine
		super(scene.matter.world, x, y, "submarine", undefined, Submarine.getMatterBodyConfig());

		scene.add.existing(this);
		this.setupKeys();

		this.collisionData = scene.cache.json.get("collision-data");
		this.displayWidth = this.width * SCALE;
		this.displayHeight = this.height * SCALE;
		this.setupPhysics();

		this.hook = new MechanicalArm(
			scene,
			this,
			gameManager.getUpgradeValue("chain")
		);
	}

	private setupPhysics() {
		const vertices = this.collisionData[`submarine-${this.flipX ? "right" : "left"}`].fixtures[0].vertices.map((x) =>
			x.map((y) => ({ x: y.x || 0, y: y.y || 0 }))
		);
		const verticies1D = vertices.reduce((prev, next) =>
			prev.concat(next)
		);
		this.scene.matter.vertices.scale(
			verticies1D,
			SCALE,
			SCALE,
			{ x: 0, y: 0 }
		);

		const x = this.x;
		const y = this.y;
		const config: Phaser.Types.Physics.Matter.MatterBodyConfig = Submarine.getMatterBodyConfig(vertices);
		this.setBody((<any>config).shape, config);
		this.setIgnoreGravity(true);
		this.setCollisionCategory(CollisionCategories.SUBMARINE);
		this.setCollidesWith(
			CollisionCategories.WALLS |
			CollisionCategories.MECHANICAL_HOOK |
			CollisionCategories.HAZARD
		);
		this.x = x;
		this.y = y;
		if (this.hook)
			this.hook.changeSub(this);
	}

	private static getMatterBodyConfig(
		vertices?: Phaser.Types.Math.Vector2Like[][]
	): Phaser.Types.Physics.Matter.MatterBodyConfig {
		const config: Phaser.Types.Physics.Matter.MatterBodyConfig = {
			frictionAir: 0.05,
			mass: 500
		};
		if (vertices) {
			config["shape"] = {
				type: "fromPhysicsEditor",
				isStatic: false,
				fixtures: [
					{
						isSensor: true,
						vertices: vertices
					}
				]
			};
		}
		return config;
	}

	setupKeys() {
		this.keys = this.scene.input.keyboard.addKeys(
			{
				up: "W",
				down: "S",
				left: "A",
				right: "D"
			},
			true,
			true
		) as Record<string, Phaser.Input.Keyboard.Key>;
	}

	// Update loop - game physics based on acceleration
	update() {
		this.updateKeys();
		this.updateArm();
		this.updateDepth();
		if (gameManager.submarine.isDead && !this.wasDeadLastTimeIChecked)
			this.killSubmarine();
	}

	updateDepth() {
		// Update the max depth if it needs it
		const depth = (this.y - WATER_LEVEL) / 10;
		gameManager.currentDepth = depth;
		gameManager.updateMaxDepth(depth);
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
		if (flipX !== this.flipX)
			this.setupPhysics();
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
		if (this.y < WATER_LEVEL)
			this.y = WATER_LEVEL;

		if (this.y < WATER_LEVEL + 20)
			gameManager.submarine.isAtSurface = true;
		else {
			if (gameManager.submarine.isAtSurface)
				gameManager.submarine.isAtSurface = false;
		}
	}

	// Function to run if you kill the submarine
	killSubmarine() {
		this.wasDeadLastTimeIChecked = true;
		const callback = (_, progress: number) => {
			if (progress < 1)
				return;

			this.scene.scene.stop("UIScene");
			this.scene.scene.stop("MainScene");
			this.scene.scene.start("MenuScene");
		};
		this.scene.cameras.main.fadeOut(5000, 50, 0, 0, callback);
		this.setFrictionAir(0.5);
		this.setIgnoreGravity(false);
	}

	takeDamage(intensity: number) {
		this.setColor(0xff1111);
		const callback = (_, progress: number) => {
			if (progress >= 1)
				this.setColor();
		};
		this.scene.cameras.main.shake(150, 0.03, false, callback);
	}

	setColor(t?: number) {
		if (t)
			this.tint = t;
		else
			this.clearTint();

		this.hook.setTint(t);
	}

	checkUpgrades() {
		if (gameManager.getUpgradeValue("chain") !== this.hook.getLength())
			this.upgradeArm();
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
