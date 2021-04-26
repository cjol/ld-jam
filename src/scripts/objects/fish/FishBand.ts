import { ASpawnable } from "../spawnables/ASpawnable";
import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ISpawnableBandParameters } from "../spawnables/ISpawnableBandParameters";
import { Fish, IFishParameters } from "./Fish";

export interface IFishBandParameters extends ISpawnableBandParameters {
	rarities: number[];
}

export class FishBand extends ASpawnableBand<
	IFishParameters,
	IFishBandParameters
> {
	private static readonly fishRarityColours: number[][] = [
		[0xcccccc, 0x8e8c8d],
		[0x86dca8, 0xa5a3a4],
		[0xffaaee, 0x47ce7f],
		[0xa26cf8, 0xffa700],
		[0xffc467, 0xd96cc4]
	];
	private readonly collisionData: any;

	constructor(scene: Phaser.Scene, parameters: IFishBandParameters) {
		super(scene, parameters);

		this.collisionData = scene.cache.json.get("collision-data");
	}

	protected createNewItem(): ASpawnable<
		IFishParameters,
		IFishBandParameters
		> {
		return new Fish(this.scene, this);
	}

	protected spawnRandomItem(leftSide: boolean): IFishParameters {
		const parameters: IFishParameters = <IFishParameters>(
			super.getBaseParameters(leftSide)
		);
		parameters.vertices = this.collisionData[
			`fish-${parameters.type}-${!leftSide ? "left" : "right"}`
		].fixtures[0].vertices;

		parameters.weight = Math.floor(20 * parameters.scale);
		parameters.worth = parameters.weight;

		const rarity = this.generator.pick(this.parameters.rarities);
		parameters.layer1Tint = FishBand.fishRarityColours[rarity - 1][0];
		parameters.layer2Tint = FishBand.fishRarityColours[rarity - 1][1];
		return parameters;
	}
}
