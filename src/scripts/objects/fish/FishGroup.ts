import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ASpawnableGroup } from "../spawnables/ASpawnableGroup";
import { IFishParameters } from "./Fish";
import { FishBand, IFishBandParameters } from "./FishBand";

export class FishGroup extends ASpawnableGroup<
	IFishParameters,
	IFishBandParameters
> {
	private static readonly bandParameters: IFishBandParameters[] = [
		{
			minDepth: 0,
			maxDepth: 1500,
			maxNumberOfItems: 20,
			availableItemTypes: [1, 2],
			itemRespawnRate: 10 * 1000, // 10 seconds in milliseconds
			minScale: 0.1,
			maxScale: 0.25,
			rarities: [1, 2, 3]
		},
		{
			minDepth: 1500,
			maxDepth: 3000,
			maxNumberOfItems: 15,
			availableItemTypes: [1, 2, 3],
			itemRespawnRate: 30 * 1000, // 30 seconds in milliseconds
			minScale: 0.1,
			maxScale: 0.5,
			rarities: [1, 2, 3, 4]
		},
		{
			minDepth: 3000,
			maxDepth: 4500,
			maxNumberOfItems: 15,
			availableItemTypes: [1, 2, 3],
			itemRespawnRate: 60 * 1000, // 30 seconds in milliseconds
			minScale: 0.25,
			maxScale: 0.75,
			rarities: [1, 2, 3, 4, 5]
		}
	];

	constructor(scene: Phaser.Scene, minSafeHeight: number) {
		super(scene, minSafeHeight, FishGroup.bandParameters);
	}

	protected CreateBand(
		scene: Phaser.Scene,
		parameters: IFishBandParameters
	): ASpawnableBand<IFishParameters, IFishBandParameters> {
		return new FishBand(scene, parameters);
	}
}
