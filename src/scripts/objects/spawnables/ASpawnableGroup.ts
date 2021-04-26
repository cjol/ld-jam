import { ASpawnableBand } from "./ASpawnableBand";
import { ISpawnableBandParameters } from "./ISpawnableBandParameters";
import { ISpawnableGroup } from "./ISpawnableGroup";
import { ISpawnableParameters } from "./ISpawnableParameters";

export abstract class ASpawnableGroup<
	T extends ISpawnableParameters,
	K extends ISpawnableBandParameters
> implements ISpawnableGroup {
	private readonly scene: Phaser.Scene;
	private readonly bandParameters: K[];

	private bands: ASpawnableBand<T, K>[] = [];

	// Constructor for a fish
	public constructor(
		scene: Phaser.Scene,
		minSafeHeight: number,
		bandParameters: K[]
	) {
		this.scene = scene;
		this.bandParameters = bandParameters;
		this.bandParameters.forEach((x) => {
			x.minDepth += minSafeHeight;
			x.maxDepth += minSafeHeight;
		});
	}

	protected abstract CreateBand(
		scene: Phaser.Scene,
		parameters: K
	): ASpawnableBand<T, K>;

	public create(): void {
		this.bands = this.bandParameters.map((x) =>
			this.CreateBand(this.scene, x)
		);
		this.bands.forEach((x) => x.createItems());
	}

	// Update loop - game physics based on acceleration
	public update(delta: number): void {
		this.bands.forEach((band) => band.update(delta));
	}
}
