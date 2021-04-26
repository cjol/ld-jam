import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ASpawnableGroup } from "../spawnables/ASpawnableGroup";
import { IHazardParameters } from "./Hazard";
import { HazardBand, IHazardBandParameters } from "./HazardBand";

export class HazardGroup extends ASpawnableGroup<
	IHazardParameters,
	IHazardBandParameters
> {
	private static readonly bandParameters: IHazardBandParameters[] = [
		//sharks
		{
			minDepth: 200,
			maxDepth: 3000,
			minScale: 0.2,
			maxScale: 0.3,
			damage: 1,
			maxNumberOfItems: 12,
			availableItemTypes: [1],
			itemRespawnRate: 10 * 1000 // 10 seconds in milliseconds
		},
		// big sharks
		{
			minDepth: 3000,
			maxDepth: 6000,
			minScale: 0.3,
			maxScale: 0.6,
			damage: 1,
			maxNumberOfItems: 20,
			availableItemTypes: [1],
			itemRespawnRate: 10 * 1000 // 10 seconds in milliseconds
		},
		// small mines
		{
			minDepth: 5000,
			maxDepth: 8000,
			minScale: 0.1,
			maxScale: 0.3,
			damage: 5,
			maxNumberOfItems: 7,
			availableItemTypes: [2],
			itemRespawnRate: 10 * 1000 // 10 seconds in milliseconds
		},
		// large mines
		{
			minDepth: 7500,
			maxDepth: 9500,
			minScale: 0.2,
			maxScale: 0.5,
			damage: 10,
			maxNumberOfItems: 5,
			availableItemTypes: [2],
			itemRespawnRate: 10 * 1000 // 10 seconds in milliseconds
		}
	];

	public constructor(scene: Phaser.Scene, minSafeHeight: number) {
		super(scene, minSafeHeight, HazardGroup.bandParameters);
	}

	protected CreateBand(
		scene: Phaser.Scene,
		parameters: IHazardBandParameters
	): ASpawnableBand<IHazardParameters, IHazardBandParameters> {
		return new HazardBand(scene, parameters);
	}
}
