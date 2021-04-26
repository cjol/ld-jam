import { ASpawnable } from "../spawnables/ASpawnable";
import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ISpawnableBandParameters } from "../spawnables/ISpawnableBandParameters";
import { Hazard, IHazardParameters } from "./Hazard";

export interface IHazardBandParameters extends ISpawnableBandParameters {
	damage: number;
}
const SIZE_DAMAGE_RATIO = 100;

export class HazardBand extends ASpawnableBand<
	IHazardParameters,
	IHazardBandParameters
> {
	private readonly collisionData: any;

	public constructor(scene: Phaser.Scene, parameters: IHazardBandParameters) {
		super(scene, parameters);

		this.collisionData = scene.cache.json.get("collision-data");
	}

	protected createNewItem(): ASpawnable<
		IHazardParameters,
		IHazardBandParameters
		> {
		return new Hazard(this.scene, this);
	}

	protected spawnRandomItem(leftSide: boolean): IHazardParameters {
		const parameters: IHazardParameters = <IHazardParameters>(
			super.getBaseParameters(leftSide)
		);
		switch (parameters.type) {
		case 1:
			parameters.vertices = this.collisionData[
				`shark-${!leftSide ? "left" : "right"}`
			].fixtures[0].vertices;
			break;
		case 2:
			parameters.vertices = this.collisionData[
				`mine`
			].fixtures[0].vertices;
			break;
		}

		parameters.damage =
			parameters.scale * SIZE_DAMAGE_RATIO * this.parameters.damage;
		return parameters;
	}
}
