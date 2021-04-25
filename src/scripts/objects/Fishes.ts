import { CollisionCategories } from "./CollisionCategories";
import { ASpawnable } from "./spawnables/ASpawnable";
import { ASpawnableBand } from "./spawnables/ASpawnableBand";
import { ASpawnableGroup } from "./spawnables/ASpawnableGroup";
import { ISpawnableBandParameters } from "./spawnables/ISpawnableBandParameters";
import { ISpawnableParameters } from "./spawnables/ISpawnableParameters";

interface IFishParameters extends ISpawnableParameters {
	worth: number;
	weight: number;
}

export class Fish extends ASpawnable<
	IFishParameters,
	ISpawnableBandParameters
> {
	private readonly fishBand: FishBand;

	public worth: number = 0;
	public weight: number = 0;

	// Constructor for a fish
	constructor(scene: Phaser.Scene, band: FishBand) {
		// Create fish
		super(scene, band, "fish1");

		this.fishBand = band;

		this.setCollisionCategory(CollisionCategories.FISH);
		this.setCollidesWith(CollisionCategories.MECHANICAL_HOOK);
	}

	public setParameters(parameters: IFishParameters) {
		super.setParameters(parameters);

		this.setTexture(`fish${parameters.type}`);

		this.worth = parameters.worth;
		this.weight = parameters.weight;
	}

	public catch() {
		this.fishBand.removeItem(this);
	}
}

export class FishBand extends ASpawnableBand<
	IFishParameters,
	ISpawnableBandParameters
> {
	constructor(scene: Phaser.Scene, parameters: ISpawnableBandParameters) {
		super(scene, parameters);
	}

	protected createNewItem(
		scene: Phaser.Scene
	): ASpawnable<IFishParameters, ISpawnableBandParameters> {
		return new Fish(scene, this);
	}

	protected spawnRandomItem(leftSide: boolean): IFishParameters {
		const parameters: IFishParameters = <IFishParameters>(
			super.getBaseParameters(leftSide)
		);
		parameters.weight = Math.floor(20 * parameters.scale);
		parameters.worth = parameters.weight;
		return parameters;
	}
}

export class FishGroup extends ASpawnableGroup<
	IFishParameters,
	ISpawnableBandParameters
> {
	private static readonly bandParameters: ISpawnableBandParameters[] = [
		{
			minDepth: 500,
			maxDepth: 1500,
			maxNumberOfItems: 20,
			availableItemTypes: [1, 2],
			itemRespawnRate: 10 * 1000, // 10 seconds in milliseconds
			minScale: 0.25,
			maxScale: 1
		},
		{
			minDepth: 1500,
			maxDepth: 3000,
			maxNumberOfItems: 15,
			availableItemTypes: [2, 3],
			itemRespawnRate: 30 * 1000, // 30 seconds in milliseconds
			minScale: 0.25,
			maxScale: 1
		}
	];

	constructor(scene: Phaser.Scene, minSafeHeight: number) {
		super(scene, minSafeHeight, FishGroup.bandParameters);
	}

	protected CreateBand(
		scene: Phaser.Scene,
		parameters: ISpawnableBandParameters
	): ASpawnableBand<IFishParameters, ISpawnableBandParameters> {
		return new FishBand(scene, parameters);
	}
}
