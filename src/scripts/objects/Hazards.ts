import { Math as PMath, Scene } from "phaser";

import { CollisionCategories } from "./CollisionCategories";

interface IHazardParameters {
	type: number;
	weight: number;
	position: Phaser.Math.Vector2;
	directionAngle: number;
	direction: Phaser.Math.Vector2;
	speed: number;
	scale: number;
}

export class Hazard extends Phaser.Physics.Matter.Image {
	private readonly band: HazardBand;

	private started: boolean = false;
	private offscreen: boolean = false;

	public weight: number = 0;
	public dead: boolean = true;

	// Constructor for a hazard
	constructor(scene: Phaser.Scene, band: HazardBand) {
		// Create hazard
		super(scene.matter.world, 0, 0, "submarine", undefined, {
			frictionAir: 0,
			mass: 0.001
		});
		scene.add.existing(this);

		this.band = band;

		this.setSensor(true);
		this.setCollisionCategory(CollisionCategories.HAZARD);
		this.setCollidesWith(CollisionCategories.MECHANICAL_HOOK | CollisionCategories.SUBMARINE);
		this.setIgnoreGravity(true);
	}

	public setParameters(parameters: IHazardParameters) {
		this.setTexture(`submarine`);

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
			this.band.respawnHazard(this);
		}
	}

	public hit() {
		this.band.hazardHit(this);
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
	maxNumberOfHazards: number;
	hazardRespawnRate: number;
	availableHazardTypes: number[];
}

export class HazardBand {
	private static readonly safetyGap: number = 200;
	private static readonly minSpeed: number = 0.5;
	private static readonly maxSpeed: number = 1;
	private static readonly maxAngle: number = 15;

	private readonly generator: PMath.RandomDataGenerator = new PMath.RandomDataGenerator();
	private readonly parameters: IBandParameters;
	private readonly scene: Scene;
	private readonly hazards: Hazard[] = [];

	private activeNumberOfHazards: number = 0;
	private respawnTimer: number = 0;

	// Constructor for a hazard
	constructor(scene: Phaser.Scene, parameters: IBandParameters) {
		this.scene = scene;

		// Create hazard group
		this.parameters = parameters;

		const half: number = this.parameters.maxNumberOfHazards / 2;
		for (let i = 0; i < this.parameters.maxNumberOfHazards; i++) {
			const parameters = this.spawnRandomHazard(i < half);
			const hazard= new Hazard(scene, this);
			hazard.setParameters(parameters);
			this.hazards.push(hazard);
			this.activeNumberOfHazards++;
		}
	}

	public respawnHazard(hazard: Hazard): void {
		const newParameters = this.spawnRandomHazard(
			this.generator.pick([true, false])
		);
		hazard.setParameters(newParameters);
	}

	public hazardHit(hazard: Hazard): void {
		hazard.dead = true;
		hazard.x = -400;
		hazard.y = -400;
		this.activeNumberOfHazards--;
	}

	// Update loop - game physics based on acceleration
	public update(delta: number) {
		this.hazards.forEach((hazard) => hazard.update());

		this.generateNewHazard(delta);
	}

	private generateNewHazard(delta: number) {
		if (this.activeNumberOfHazards >= this.parameters.maxNumberOfHazards)
			return;

		this.respawnTimer += delta;
		if (this.respawnTimer < this.parameters.hazardRespawnRate)
			return;

		this.respawnTimer -= this.parameters.hazardRespawnRate;
		const firstDeadHazard = this.hazards.filter((x) => x.dead)[0];
		this.respawnHazard(firstDeadHazard);
		this.activeNumberOfHazards++;
	}

	// Method to create a hazard moving in a random direction
	private spawnRandomHazard(leftSide: boolean): IHazardParameters {
		const width: number = this.scene.cameras.main.width;
		const x: number = leftSide
			? -HazardBand.safetyGap
			: width + HazardBand.safetyGap;
		const y: number = this.generator.integerInRange(
			this.parameters.minDepth,
			this.parameters.maxDepth
		);
		const speed: number = this.generator.realInRange(
			HazardBand.minSpeed,
			HazardBand.maxSpeed
		);
		const type: number = this.generator.pick(
			this.parameters.availableHazardTypes
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

		const scale = this.generator.realInRange(0.3, 0.05);
		const weight: number = Math.floor(200 * scale);

		return {
			type: type,
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
		upAngle = Math.min(Math.floor(upAngle), HazardBand.maxAngle);
		downAngle = Math.min(Math.floor(downAngle), HazardBand.maxAngle);
		return { up: upAngle, down: downAngle };
	}
}

export class HazardGroup {
	private readonly bandParameters: IBandParameters[] = [
		{
			minDepth: 0,
			maxDepth: 1000,
			maxNumberOfHazards: 2,
			availableHazardTypes: [1],
			hazardRespawnRate: 10 * 1000 // 10 seconds in milliseconds
		}
	];
	private readonly hazardBands: HazardBand[] = [];

	// Constructor for a hazard
	constructor(scene: Phaser.Scene, minSafeHeight: number) {
		// Create hazard group
		this.hazardBands = this.bandParameters.map((x) => {
			x.minDepth += minSafeHeight;
			x.maxDepth += minSafeHeight;
			return new HazardBand(scene, x);
		});
	}

	// Update loop - game physics based on acceleration
	update(delta: number) {
		this.hazardBands.forEach((band) => band.update(delta));
	}
}
