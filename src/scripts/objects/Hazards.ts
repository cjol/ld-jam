import { CollisionCategories } from "./CollisionCategories";
import { ASpawnable } from "./spawnables/ASpawnable";
import { ASpawnableBand } from "./spawnables/ASpawnableBand";
import { ASpawnableGroup } from "./spawnables/ASpawnableGroup";
import { ISpawnableBandParameters } from "./spawnables/ISpawnableBandParameters";
import { ISpawnableParameters } from "./spawnables/ISpawnableParameters";

interface IHazardParameters extends ISpawnableParameters {
	damage: number;
}

export class Hazard extends ASpawnable<
	IHazardParameters,
	IHazardBandParameters
> {
	private readonly hazardBand: HazardBand;

	public damage: number = 0;

	// Constructor for a hazard
	public constructor(scene: Phaser.Scene, band: HazardBand) {
		// Create hazard
		super(scene, band, "submarine");

		this.hazardBand = band;

		this.setCollisionCategory(CollisionCategories.HAZARD);
		this.setCollidesWith(
			CollisionCategories.MECHANICAL_HOOK | CollisionCategories.SUBMARINE
		);
	}

	public setParameters(parameters: IHazardParameters) {
		super.setParameters(parameters);

		this.damage = parameters.damage;
	}

	public hit() {
		this.hazardBand.removeItem(this);
	}
}

export class HazardBand extends ASpawnableBand<
	IHazardParameters,
	IHazardBandParameters
> {
	public constructor(scene: Phaser.Scene, parameters: IHazardBandParameters) {
		super(scene, parameters);
	}

	protected createNewItem(
		scene: Phaser.Scene
	): ASpawnable<IHazardParameters, IHazardBandParameters> {
		return new Hazard(scene, this);
	}

	protected spawnRandomItem(leftSide: boolean): IHazardParameters {
		const parameters: IHazardParameters = <IHazardParameters>(
			super.getBaseParameters(leftSide)
		);
		parameters.damage = this.generator.integerInRange(
			this.hazardBandParameters.minDamage,
			this.hazardBandParameters.maxDamage
		);
		return parameters;
	}

	private get hazardBandParameters(): IHazardBandParameters {
		return <IHazardBandParameters>this.parameters;
	}
}

interface IHazardBandParameters extends ISpawnableBandParameters {
	minDamage: number;
	maxDamage: number;
}

export class HazardGroup extends ASpawnableGroup<
	IHazardParameters,
	IHazardBandParameters
> {
	private static readonly bandParameters: IHazardBandParameters[] = [
		{
			minDepth: 150,
			maxDepth: 1000,
			minScale: 0.25,
			maxScale: 0.25,
			minDamage: 1,
			maxDamage: 10,
			maxNumberOfItems: 20,
			availableItemTypes: [1],
			itemRespawnRate: 10 * 1000 // 10 seconds in milliseconds
		}
	];

	public constructor(scene: Phaser.Scene, minSafeHeight: number) {
		super(scene, minSafeHeight, HazardGroup.bandParameters);
	}

	protected CreateBand(
		scene: Phaser.Scene,
		parameters: IHazardBandParameters
	): ASpawnableBand<IHazardParameters, IHazardBandParameters> {
		console.log(scene, parameters);
		return new HazardBand(scene, parameters);
	}
}
