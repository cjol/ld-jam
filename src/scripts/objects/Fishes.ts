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
	private readonly band: FishBand;

	private started: boolean = false;
	private offscreen: boolean = false;

	public worth: number = 0;
	public weight: number = 0;
	public dead: boolean = true;

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
		this.setFlipX(true);
		this.setFlipY(false);
		this.setRotationDeg(parameters.directionAngle);

		this.worth = parameters.worth;
		this.weight = parameters.weight;
		this.started = true;
		this.offscreen = true;
		this.dead = false;
	}

	public update() {
		if (this.dead)
			return;

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
			this.band.respawnFish(this);
		}
	}

	public catch() {
		this.band.fishCaught(this);
	}

	private setRotationDeg(angle: number): void {
		if (angle > 165 && angle < 195)
			this.setFlipY(true);
		this.angle = angle;
	}
}

interface IBandParameters {
	minDepth: number;
	maxDepth: number;
	minScale: number;
	maxScale: number;
	maxNumberOfFish: number;
	availableFishTypes: number[];
	fishRespawnRate: number;
}

export class FishBand {
	private static readonly safetyGap: number = 200;
	private static readonly minSpeed: number = 0.5;
	private static readonly maxSpeed: number = 1;
	private static readonly maxAngle: number = 15;

	private readonly generator: PMath.RandomDataGenerator = new PMath.RandomDataGenerator();
	private readonly parameters: IBandParameters;
	private readonly scene: Scene;
	private readonly fishes: Fish[] = [];

	private activeNumberOfFish: number = 0;
	private respawnTimer: number = 0;

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
			this.activeNumberOfFish++;
		}
	}

	public respawnFish(fish: Fish): void {
		const newParameters = this.spawnRandomFish(
			this.generator.pick([true, false])
		);
		fish.setParameters(newParameters);
	}

	public fishCaught(fish: Fish): void {
		fish.dead = true;
		fish.x = -400;
		fish.y = -400;
		this.activeNumberOfFish--;
	}

	// Update loop - game physics based on acceleration
	public update(delta: number) {
		this.fishes.forEach((fish) => fish.update());

		this.generateNewFish(delta);
	}

	private generateNewFish(delta: number) {
		if (this.activeNumberOfFish >= this.parameters.maxNumberOfFish)
			return;

		this.respawnTimer += delta;
		if (this.respawnTimer < this.parameters.fishRespawnRate)
			return;

		this.respawnTimer -= this.parameters.fishRespawnRate;
		const firstDeadFish = this.fishes.filter((x) => x.dead)[0];
		this.respawnFish(firstDeadFish);
		this.activeNumberOfFish++;
	}

	// Method to create a fish moving in a random direction
	private spawnRandomFish(leftSide: boolean): IFishParameters {
		const width: number = this.scene.cameras.main.width;
		const x: number = leftSide
			? -FishBand.safetyGap
			: width + FishBand.safetyGap;
		const y: number = this.generator.integerInRange(
			this.parameters.minDepth,
			this.parameters.maxDepth
		);
		const speed: number = this.generator.realInRange(
			FishBand.minSpeed,
			FishBand.maxSpeed
		);
		const type: number = this.generator.pick(
			this.parameters.availableFishTypes
		);

		const maxAngles = this.getMaxAngles(
			x,
			y,
			this.parameters.minDepth,
			this.parameters.maxDepth,
			leftSide ? width : 0
		);
		const angleRange: number[] = leftSide
			? this.generator.pick([
				[360 - maxAngles.up, 360],
				[0, maxAngles.down]
			  ])
			: [180 - maxAngles.down, 180 + maxAngles.up];
		const directionAngle: number = this.generator.integerInRange(
			angleRange[0],
			angleRange[1]
		);
		const directionX = Math.cos(PMath.DEG_TO_RAD * directionAngle);
		const directionY = Math.sin(PMath.DEG_TO_RAD * directionAngle);

		const scale = this.generator.realInRange(
			this.parameters.minScale,
			this.parameters.maxScale
		);
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

	private getMaxAngles(
		x: number,
		y: number,
		minDepth: number,
		maxDepth: number,
		screenX: number
	): { up: number; down: number } {
		const x1 = screenX + Math.abs(x);
		let upAngle: number = Math.atan((y - minDepth) / x1) * PMath.RAD_TO_DEG;
		let downAngle: number =
			Math.atan((maxDepth - y) / x1) * PMath.RAD_TO_DEG;
		upAngle = Math.min(Math.floor(upAngle), FishBand.maxAngle);
		downAngle = Math.min(Math.floor(downAngle), FishBand.maxAngle);
		return { up: upAngle, down: downAngle };
	}
}

export class FishGroup {
	private readonly bandParameters: IBandParameters[] = [
		{
			minDepth: 500,
			maxDepth: 1500,
			maxNumberOfFish: 20,
			availableFishTypes: [1, 2],
			fishRespawnRate: 10 * 1000, // 10 seconds in milliseconds
			minScale: 0.25,
			maxScale: 1
		},
		{
			minDepth: 1500,
			maxDepth: 3000,
			maxNumberOfFish: 15,
			availableFishTypes: [2, 3],
			fishRespawnRate: 30 * 1000, // 30 seconds in milliseconds
			minScale: 0.25,
			maxScale: 1
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
	update(delta: number) {
		this.fishBands.forEach((band) => band.update(delta));
	}
}
