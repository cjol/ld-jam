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
		super(scene, band, "hazard1");

		this.hazardBand = band;
	}

	protected initialisePhysics(): void {
		super.initialisePhysics();

		this.setCollisionCategory(CollisionCategories.HAZARD);
		this.setCollidesWith(
			CollisionCategories.MECHANICAL_HOOK | CollisionCategories.SUBMARINE
		);
	}

	protected configureOrigin(parameters: IHazardParameters): void {
		if (!parameters) {
			super.configureOrigin();
			return;
		}

		switch (parameters.type) {
		case 1:
			if (parameters.left)
				this.setOrigin(0.54, 0.56);
			else
				this.setOrigin(0.46, 0.56);
			break;
		}
	}

	public hit() {
		this.hazardBand.removeItem(this);
	}
}
