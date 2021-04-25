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
			maxDepth: 1500,
			minScale: 0.2,
			maxScale: 0.5,
			damage: 5,
			maxNumberOfItems: 10,
			availableItemTypes: [1],
			itemRespawnRate: 10 * 1000 // 10 seconds in milliseconds
		},
		//mines
		{
			minDepth: 1000,
			maxDepth: 3000,
			minScale: 0.1,
			maxScale: 0.02,
			damage: 15,
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
