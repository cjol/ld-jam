import { ASpawnableBand } from "../spawnables/ASpawnableBand";
import { ASpawnableGroup } from "../spawnables/ASpawnableGroup";
import { IHazardParameters } from "./Hazard";
import { HazardBand, IHazardBandParameters } from "./HazardBand";

export class HazardGroup extends ASpawnableGroup<
	IHazardParameters,
	IHazardBandParameters
> {
	private static readonly bandParameters: IHazardBandParameters[] = [
		{
			minDepth: 150,
			maxDepth: 1000,
			minScale: 0.25,
			maxScale: 0.25,
			minDamage: 1,
			maxDamage: 10,
			maxNumberOfItems: 20,
			availableItemTypes: [1],
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
		console.log(scene, parameters);
		return new HazardBand(scene, parameters);
	}
}
