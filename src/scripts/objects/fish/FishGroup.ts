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
			minDepth: 50,
			maxDepth: 2000,
			maxNumberOfItems: 25,
			availableItemTypes: [1, 2],
			itemRespawnRate: 10 * 1000, // 10 seconds in milliseconds
			minScale: 0.1,
			maxScale: 0.25,
			rarities: [1, 2, 3],
		},
		{
			minDepth: 2000,
			maxDepth: 4000,
			maxNumberOfItems: 20,
			availableItemTypes: [1, 2, 3],
			itemRespawnRate: 15 * 1000, // 15 seconds in milliseconds
			minScale: 0.15,
			maxScale: 0.35,
			rarities: [1, 2, 3, 4],
		},
		{
			minDepth: 4000,
			maxDepth: 6000,
			maxNumberOfItems: 18,
			availableItemTypes: [1, 2, 3],
			itemRespawnRate: 20 * 1000, // 20 seconds in milliseconds
			minScale: 0.2,
			maxScale: 0.4,
			rarities: [3, 4],
		},
		{
			minDepth: 6000,
			maxDepth: 8000,
			maxNumberOfItems: 15,
			availableItemTypes: [1, 2, 3],
			itemRespawnRate: 40 * 1000, // 40 seconds in milliseconds
			minScale: 0.25,
			maxScale: 0.5,
			rarities: [3, 4, 5],
		},
		{
			minDepth: 8000,
			maxDepth: 10000,
			maxNumberOfItems: 12,
			availableItemTypes: [1, 2, 3],
			itemRespawnRate: 60 * 1000, // 60 seconds in milliseconds
			minScale: 0.25,
			maxScale: 0.75,
			rarities: [4, 5],
		},
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
