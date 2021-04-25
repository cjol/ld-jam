import { CollisionCategories } from "../CollisionCategories";
import { ASpawnable } from "../spawnables/ASpawnable";
import { ISpawnableParameters } from "../spawnables/ISpawnableParameters";
import { HazardBand, IHazardBandParameters } from "./HazardBand";

export interface IHazardParameters extends ISpawnableParameters {
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
