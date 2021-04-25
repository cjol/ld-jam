import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ASpawnableGroup } from "../spawnables/ASpawnableGroup";
import { ISpawnableBandParameters } from "../spawnables/ISpawnableBandParameters";
import { IFishParameters } from "./Fish";
import { FishBand } from "./FishBand";

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
