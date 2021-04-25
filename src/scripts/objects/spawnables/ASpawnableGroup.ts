import { ASpawnableBand } from "./ASpawnableBand";
import { ISpawnableBandParameters } from "./ISpawnableBandParameters";
import { ISpawnableGroup } from "./ISpawnableGroup";
import { ISpawnableParameters } from "./ISpawnableParameters";

export abstract class ASpawnableGroup<
	T extends ISpawnableParameters,
	K extends ISpawnableBandParameters
> implements ISpawnableGroup {
	private readonly bands: ASpawnableBand<T, K>[] = [];

	// Constructor for a fish
	public constructor(
		scene: Phaser.Scene,
		minSafeHeight: number,
		bandParameters: K[]
	) {
		this.bands = bandParameters.map((x) => {
			x.minDepth += minSafeHeight;
			x.maxDepth += minSafeHeight;
			return this.CreateBand(scene, x);
		});
	}

	protected abstract CreateBand(
		scene: Phaser.Scene,
		parameters: K
	): ASpawnableBand<T, K>;

	// Update loop - game physics based on acceleration
	public update(delta: number): void {
		this.bands.forEach((band) => band.update(delta));
	}
}
