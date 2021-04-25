import { CollisionCategories } from "./CollisionCategories";
import { gameManager } from "./GameManager";
import Submarine, { WATER_LEVEL } from "./Submarine";

const SEGMENT_LENGTH = 80;
const CONSTRAINT_LENGTH = 0;
const SEGMENT_STIFFNESS = 1;

export class MechanicalArm {
	private readonly segments: MechanicalArmSegment[];
	private readonly hook: MechanicalHook;

	constructor(scene: Phaser.Scene, sub: Submarine, links: number = 3) {
		this.segments = [];
		let prev: Phaser.Physics.Matter.Image | undefined;

		for (let i = 0; i < links; i++) {
			const x = prev ? prev.x : sub.x;
			const y = prev ? prev.y : sub.y;
			this.segments[i] = new MechanicalArmSegment(scene, x, y, prev);
			prev = this.segments[i];
		}

		scene.matter.add.constraint(
			sub as any,
			this.segments[0] as any,
			CONSTRAINT_LENGTH,
			SEGMENT_STIFFNESS,
			{
				pointA: { x: 0, y: 15 },
				pointB: { x: -SEGMENT_LENGTH / 2 + 10, y: 0 }
			}
		);

		// TODO: sub and hook should collide; chains should not
		this.hook = new MechanicalHook(scene, this.segments[links - 1], sub);
	}

	update() {
		this.segments.forEach((segment) => segment.update());
		this.hook.update();
	}

	getLength() {
		return this.segments.length;
	}

	destroy() {
		this.segments.forEach((x) => x.destroy());
		this.hook.destroy();
	}
}

export class MechanicalArmSegment extends Phaser.Physics.Matter.Image {
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		prev?: Phaser.Physics.Matter.Image
	) {
		// Create claw
		super(scene.matter.world, x, y, "chain", undefined, {
			frictionAir: 0.05,
			mass: 0.3,
		});

		this.setIgnoreGravity(true);
		this.setCollisionCategory(CollisionCategories.MECHANICAL_ARM_SEGMENT);
		this.setCollidesWith(0);
		// this.setAngle(90)

		this.scene = scene;
		this.displayHeight = SEGMENT_LENGTH / 4;
		this.displayWidth = SEGMENT_LENGTH;
		scene.add.existing(this);

		if (prev) {
			this.y += SEGMENT_LENGTH;
			scene.matter.add.constraint(
				prev as any,
				this as any,
				CONSTRAINT_LENGTH,
				SEGMENT_STIFFNESS,
				{
					pointA: {
						x: SEGMENT_LENGTH / 2 - SEGMENT_LENGTH / 8,
						y: 0
					},
					pointB: {
						x: -SEGMENT_LENGTH / 2 + SEGMENT_LENGTH / 8,
						y: 0
					}
				}
			);
		}
	}
}

export class MechanicalHook extends Phaser.Physics.Matter.Image {
	// private readonly keys: Record<string, Phaser.Input.Keyboard.Key>;
	private readonly prev: Phaser.Physics.Matter.Image;
	sub: Submarine;

	// Constructor for the claw
	constructor(
		scene: Phaser.Scene,
		parent: Phaser.Physics.Matter.Image,
		submarine: Submarine
	) {
		// Create claw
		super(
			scene.matter.world,
			parent.x,
			parent.y + SEGMENT_LENGTH / 2,
			"mechanical-hook",
			undefined,
			{
				frictionAir: 0.05,
				mass: 2,
			}
		);
		this.setIgnoreGravity(true);

		this.setCollisionCategory(CollisionCategories.MECHANICAL_HOOK);
		this.setCollidesWith(
			// CollisionCategories.SUBMARINE |
			CollisionCategories.WALLS | CollisionCategories.FISH
		);
		this.sub = submarine;
		this.prev = parent;
		scene.add.existing(this);

		this.displayHeight = SEGMENT_LENGTH / 2;
		this.displayWidth = SEGMENT_LENGTH / 2;

		scene.matter.add.constraint(
			parent as any,
			this as any,
			CONSTRAINT_LENGTH,
			SEGMENT_STIFFNESS,
			{
				pointA: { x: SEGMENT_LENGTH / 2, y: 0 },
				pointB: { x: 0, y: 0 }
			}
		);
	}

	update() {
		this.updateMouse();
		this.angle = this.prev.angle - 90;
	}

	// alternative update function using position instead of acceleration
	updateMouse2() {
		const cameraOffset = this.scene.cameras.main.worldView.top;
		const mouse = new Phaser.Math.Vector2(
			this.scene.input.activePointer.worldX,
			this.scene.input.activePointer.worldY + cameraOffset
		);
		const subToMouse = mouse.clone().subtract(this.sub);

		if (
			!gameManager.submarine.isAtSurface &&
			!gameManager.submarine.isDead
		) {
			const maxDistance =
				gameManager.getUpgradeValue("chain") * (SEGMENT_LENGTH - 20);
			if (subToMouse.length() < maxDistance) {
				this.x = mouse.x;
				this.y = mouse.y;
			} else {
				const hookPos = subToMouse
					.clone()
					.setLength(maxDistance)
					.add(this.sub);
				this.x = hookPos.x;
				this.y = hookPos.y;
			}
		}
		if (this.y < WATER_LEVEL) {
			this.y = WATER_LEVEL;
		}
	}
	updateMouse() {
		const cameraOffset = this.scene.cameras.main.worldView.top;
		const target = new Phaser.Math.Vector2(
			this.scene.input.activePointer.worldX,
			this.scene.input.activePointer.worldY + cameraOffset
		);
		if (this.y < WATER_LEVEL) {
			this.y = WATER_LEVEL + 1;
			this.setIgnoreGravity(false);
		} else {
			this.setIgnoreGravity(true);
			const distance = target.subtract(this);
			const speed = gameManager.getUpgradeValue("clawSpeed");
			if (
				distance.length() > speed &&
				!gameManager.submarine.isAtSurface &&
				!gameManager.submarine.isDead
			) {
				const velocity = distance.setLength(speed);
				this.setVelocity(velocity.x, velocity.y);
			} else {
				// this.x = target.x;tis.y = target.y;
				this.setVelocity(0);
				// this.setPosition(target.x, target.y)
			}
		}
		// this.setAngularVelocity(HOOK_SPEED);
		// }
	}
}
