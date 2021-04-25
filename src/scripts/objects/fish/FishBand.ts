import { ASpawnable } from "../spawnables/ASpawnable";
import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ISpawnableBandParameters } from "../spawnables/ISpawnableBandParameters";
import { Fish, IFishParameters } from "./Fish";

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
