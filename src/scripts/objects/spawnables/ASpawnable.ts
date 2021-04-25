import { ASpawnableBand } from "./ASpawnableBand";
import { ISpawnableBandParameters } from "./ISpawnableBandParameters";
import { ISpawnableParameters } from "./ISpawnableParameters";

export abstract class ASpawnable<
	T extends ISpawnableParameters,
	K extends ISpawnableBandParameters
> extends Phaser.Physics.Matter.Image {
	protected readonly band: ASpawnableBand<T, K>;

	protected started: boolean = false;
	protected offscreen: boolean = false;

	public dead: boolean = true;

	public constructor(
		scene: Phaser.Scene,
		band: ASpawnableBand<T, K>,
		baseTexture: string
	) {
		super(scene.matter.world, -400, -400, baseTexture, undefined, {
			frictionAir: 0,
			mass: 0.001
		});

		this.band = band;

		this.setSensor(true);
		this.setIgnoreGravity(true);

		this.beforeSceneAdd(scene);

		scene.add.existing(this);
	}

	protected beforeSceneAdd(scene: Phaser.Scene): void {}

	public setParameters(parameters: T) {
		this.x = parameters.position.x;
		this.y = parameters.position.y;

		this.displayWidth = this.width * parameters.scale;
		this.displayHeight = this.height * parameters.scale;

		this.setVelocity(
			parameters.direction.x * parameters.speed,
			parameters.direction.y * parameters.speed
		);
		this.setFlipX(true);
		this.setFlipY(false);
		this.setRotationDeg(parameters.directionAngle);

		this.started = true;
		this.offscreen = true;
		this.dead = false;
	}

	public update() {
		if (this.dead)
			return;

		const width = this.scene.cameras.main.width;
		const bounds = this.getBounds();
		if (this.started && this.offscreen) {
			if (bounds.right <= width && bounds.left >= 0) {
				this.started = false;
				this.offscreen = false;
			}
		} else if (
			!this.offscreen &&
			(bounds.right < 0 || bounds.left > width)
		) {
			this.offscreen = true;
			this.band.respawnItem(this);
		}
	}

	protected setRotationDeg(angle: number): void {
		if (angle > 165 && angle < 195)
			this.setFlipY(true);
		this.angle = angle;
	}
}
