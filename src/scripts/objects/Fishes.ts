import { Math as PMath, Scene } from "phaser";

import { CollisionCategories } from "./CollisionCategories";

interface IFishParameters {
	type: number;
	worth: number;
	weight: number;
	position: Phaser.Math.Vector2;
	directionAngle: number;
	direction: Phaser.Math.Vector2;
	speed: number;
	scale: number;
}

export class Fish extends Phaser.Physics.Matter.Image {
	public static readonly minSpeed: number = 0.5;
	public static readonly maxSpeed: number = 1;

	private readonly band: FishBand;

	private started: boolean = false;
	private offscreen: boolean = false;

	worth: number;
	weight: number;

	// Constructor for a fish
	constructor(scene: Phaser.Scene, band: FishBand) {
		// Create fish
		super(scene.matter.world, 0, 0, "fish1", undefined, {
			frictionAir: 0,
			mass: 0.001
		});
		scene.add.existing(this);

		this.band = band;

		this.setSensor(true);
		this.setCollisionCategory(CollisionCategories.FISH);
		this.setCollidesWith(CollisionCategories.MECHANICAL_HOOK);
		this.setIgnoreGravity(true);
	}

	public setParameters(parameters: IFishParameters) {
		this.setTexture(`fish${parameters.type}`);

		this.x = parameters.position.x;
		this.y = parameters.position.y;

		this.displayWidth = this.width * parameters.scale;
		this.displayHeight = this.height * parameters.scale;

		this.setVelocity(
			parameters.direction.x * parameters.speed,
			parameters.direction.y * parameters.speed
		);
		this.setRotationDeg(parameters.directionAngle);
		this.setFlipX(true);

		this.worth = parameters.worth;
		this.weight = parameters.weight;
		this.started = true;
		this.offscreen = true;
	}

	public update() {
		const width = this.scene.cameras.main.width;
		const bounds = this.getBounds();
		if (this.started && this.offscreen) {
			if (bounds.right <= width && bounds.left >= 0) {
				this.started = false;
				this.offscreen = false;
			}
		} else if (
			!this.offscreen &&
			(bounds.right < 0 || bounds.left > width)
		) {
			this.offscreen = true;
			this.band.recycleFish(this);
		}
	}

	public catch() {
		this.band.recycleFish(this);
	}

	private setRotationDeg(angle: number): void {
		if (angle >= 165 && angle <= 195) this.setFlipY(true);
		this.angle = angle;
	}
}

interface IBandParameters {
	minDepth: number;
	maxDepth: number;
	maxNumberOfFish: number;
	availableFishTypes: number[];
}

export class FishBand {
	private static readonly safetyGap: number = 200;
	private readonly generator: PMath.RandomDataGenerator = new PMath.RandomDataGenerator();
	private readonly parameters: IBandParameters;
	private readonly scene: Scene;
	private readonly fishes: Fish[] = [];

	// Constructor for a fish
	constructor(scene: Phaser.Scene, parameters: IBandParameters) {
		this.scene = scene;

		// Create fish group
		this.parameters = parameters;

		const half: number = this.parameters.maxNumberOfFish / 2;
		for (let i = 0; i < this.parameters.maxNumberOfFish; i++) {
			const parameters = this.spawnRandomFish(i < half);
			const fish: Fish = new Fish(scene, this);
			fish.setParameters(parameters);
			this.fishes.push(fish);
		}
	}

	public recycleFish(fish: Fish): void {
		const newParameters = this.spawnRandomFish(
			this.generator.pick([true, false])
		);
		fish.setParameters(newParameters);
	}

	// Update loop - game physics based on acceleration
	update() {
		this.fishes.forEach((fish) => fish.update());
	}

	// Method to create a fish moving in a random direction
	spawnRandomFish(leftSide: boolean): IFishParameters {
		// Choose a random fish to create
		const x: number = leftSide
			? -FishBand.safetyGap
			: this.scene.cameras.main.width + FishBand.safetyGap;
		const y: number = this.generator.integerInRange(
			this.parameters.minDepth,
			this.parameters.maxDepth
		);
		const speed: number = this.generator.integerInRange(
			Fish.minSpeed,
			Fish.maxSpeed
		);
		const type: number = this.generator.pick(
			this.parameters.availableFishTypes
		);

		const angleRange: number[] = leftSide
			? this.generator.pick([
					[345, 360],
					[0, 15],
			  ])
			: [165, 195];
		const directionAngle: number = this.generator.integerInRange(
			angleRange[0],
			angleRange[1]
		);
		const directionX = Math.cos(PMath.DEG_TO_RAD * directionAngle);
		const directionY = Math.sin(PMath.DEG_TO_RAD * directionAngle);

		const scale = this.generator.realInRange(0.25, 1);
		const weight: number = Math.floor(20 * scale);
		const worth: number = weight;

		return {
			type: type,
			worth: worth,
			weight: weight,
			position: new Phaser.Math.Vector2(x, y),
			directionAngle: directionAngle,
			direction: new Phaser.Math.Vector2(directionX, directionY),
			speed: speed,
			scale: scale
		};
	}
}

export class FishGroup {
	private readonly bandParameters: IBandParameters[] = [
		{
			minDepth: 0,
			maxDepth: 1000,
			maxNumberOfFish: 10,
			availableFishTypes: [1, 2]
		}
	];
	private readonly fishBands: FishBand[] = [];

	// Constructor for a fish
	constructor(scene: Phaser.Scene, minSafeHeight: number) {
		// Create fish group
		this.fishBands = this.bandParameters.map((x) => {
			x.minDepth += minSafeHeight;
			x.maxDepth += minSafeHeight;
			return new FishBand(scene, x);
		});
	}

	// Update loop - game physics based on acceleration
	update() {
		this.fishBands.forEach((band) => band.update());
	}
}
