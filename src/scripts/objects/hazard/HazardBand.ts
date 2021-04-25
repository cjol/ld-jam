import { ASpawnable } from "../spawnables/ASpawnable";
import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ISpawnableBandParameters } from "../spawnables/ISpawnableBandParameters";
import { Hazard, IHazardParameters } from "./Hazard";

export interface IHazardBandParameters extends ISpawnableBandParameters {
	minDamage: number;
	maxDamage: number;
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
