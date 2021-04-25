import { CollisionCategories } from "../CollisionCategories";
import { ASpawnable } from "../spawnables/ASpawnable";
import { ISpawnableBandParameters } from "../spawnables/ISpawnableBandParameters";
import { ISpawnableParameters } from "../spawnables/ISpawnableParameters";
import { FishBand } from "./FishBand";

export interface IFishParameters extends ISpawnableParameters {
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
