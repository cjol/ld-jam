import { Math as PMath, Scene } from "phaser";
import { ASpawnable } from "./ASpawnable";
import { ISpawnableBandParameters } from "./ISpawnableBandParameters";
import { ISpawnableParameters } from "./ISpawnableParameters";

export abstract class ASpawnableBand<
	T extends ISpawnableParameters,
	K extends ISpawnableBandParameters
> {
	private static readonly safetyGap: number = 200;
	private static readonly minSpeed: number = 0.5;
	private static readonly maxSpeed: number = 1;
	private static readonly maxAngle: number = 15;

	protected readonly generator: PMath.RandomDataGenerator = new PMath.RandomDataGenerator();
	protected readonly parameters: K;
	protected readonly scene: Scene;
	protected readonly items: ASpawnable<T, K>[] = [];

	protected activeNumberOfItems: number = 0;
	protected respawnTimer: number = 0;

	constructor(scene: Scene, parameters: K) {
		this.scene = scene;
		this.parameters = parameters;
	}

	public createItems(): void {
		const half: number = this.parameters.maxNumberOfItems / 2;
		for (let i = 0; i < this.parameters.maxNumberOfItems; i++) {
			const parameters = this.spawnRandomItem(i < half);
			const item: ASpawnable<T, K> = this.createNewItem();
			item.setParameters(parameters);
			this.items.push(item);
			this.activeNumberOfItems++;
		}
	}

	protected abstract createNewItem(): ASpawnable<T, K>;

	public respawnItem(item: ASpawnable<T, K>): void {
		const newParameters = this.spawnRandomItem(
			this.generator.pick([false])
		);
		item.setParameters(newParameters);
	}

	public removeItem(item: ASpawnable<T, K>): void {
		item.dead = true;
		item.x = -400;
		item.y = -400;
		item.setVelocity(0, 0);
		this.activeNumberOfItems--;
	}

	public update(delta: number) {
		this.items.forEach((item) => item.update());

		this.generateNewItem(delta);
	}

	protected generateNewItem(delta: number) {
		if (this.activeNumberOfItems >= this.parameters.maxNumberOfItems)
			return;

		this.respawnTimer += delta;
		if (this.respawnTimer < this.parameters.itemRespawnRate)
			return;

		this.respawnTimer -= this.parameters.itemRespawnRate;
		const firstDeadItem = this.items.filter((x) => x.dead)[0];
		this.respawnItem(firstDeadItem);
		this.activeNumberOfItems++;
	}

	protected abstract spawnRandomItem(leftSide: boolean): T;

	protected getBaseParameters(leftSide: boolean): ISpawnableParameters {
		const width: number = this.scene.cameras.main.width;
		const x: number = leftSide
			? -ASpawnableBand.safetyGap
			: width + ASpawnableBand.safetyGap;
		const y: number = this.generator.integerInRange(
			this.parameters.minDepth,
			this.parameters.maxDepth
		);
		const speed: number = this.generator.realInRange(
			ASpawnableBand.minSpeed,
			ASpawnableBand.maxSpeed
		);
		const type: number = this.generator.pick(
			this.parameters.availableItemTypes
		);

		const maxAngles = this.getMaxAngles(
			x,
			y,
			this.parameters.minDepth,
			this.parameters.maxDepth,
			leftSide ? width : 0
		);
		let directionAngle: number = this.generator.integerInRange(
			leftSide ? -maxAngles.up : maxAngles.up,
			leftSide ? maxAngles.down : -maxAngles.down
		);
		if (!leftSide)
			directionAngle += 180;
		const directionX = Math.cos(PMath.DEG_TO_RAD * directionAngle);
		const directionY = Math.sin(PMath.DEG_TO_RAD * directionAngle);

		const scale = this.generator.realInRange(
			this.parameters.minScale,
			this.parameters.maxScale
		);

		return {
			type: type,
			position: new Phaser.Math.Vector2(x, y),
			directionAngle: directionAngle,
			direction: new Phaser.Math.Vector2(directionX, directionY),
			speed: speed,
			scale: scale,
			left: leftSide
		};
	}

	protected getMaxAngles(
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

		upAngle = Math.min(Math.floor(upAngle), ASpawnableBand.maxAngle);
		downAngle = Math.min(Math.floor(downAngle), ASpawnableBand.maxAngle);

		return { up: upAngle, down: downAngle };
	}
}
