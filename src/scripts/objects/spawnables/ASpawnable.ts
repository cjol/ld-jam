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
		super(
			scene.matter.world,
			-400,
			-400,
			baseTexture,
			undefined,
			ASpawnable.getMatterBodyConfig()
		);

		this.band = band;
		this.initialisePhysics();
		this.beforeSceneAdd(scene);

		scene.add.existing(this);
	}

	protected initialisePhysics() {
		this.setSensor(true);
		this.setIgnoreGravity(true);
		this.configureOrigin();
	}

	public static getMatterBodyConfig(
		vertices?: Phaser.Types.Math.Vector2Like[][]
	): Phaser.Types.Physics.Matter.MatterBodyConfig {
		const config: Phaser.Types.Physics.Matter.MatterBodyConfig = {
			frictionAir: 0,
			mass: 0.001
		};
		if (vertices) {
			config["shape"] = {
				type: "fromPhysicsEditor",
				isStatic: false,
				fixtures: [
					{
						isSensor: true,
						vertices: vertices
					}
				]
			};
		}
		return config;
	}

	protected beforeSceneAdd(scene: Phaser.Scene): void {}

	protected configureOrigin(parameters?: T): void {
		if (!parameters) {
			this.setOrigin();
			return;
		}
	}

	public setParameters(parameters: T) {
		if (parameters.vertices) {
			const verticiesClone = parameters.vertices.map((x) =>
				x.map((y) => ({ x: y.x || 0, y: y.y || 0 }))
			);
			const verticiesClone1D = verticiesClone.reduce((prev, next) =>
				prev.concat(next)
			);
			this.scene.matter.vertices.scale(
				verticiesClone1D,
				parameters.scale,
				parameters.scale,
				{ x: 0, y: 0 }
			);
			const config: any = ASpawnable.getMatterBodyConfig(verticiesClone);
			this.setBody(config.shape, config);
			this.initialisePhysics();
			this.configureOrigin(parameters);
		}

		this.x = parameters.position.x;
		this.y = parameters.position.y;

		this.scale = parameters.scale;

		this.setVelocity(
			parameters.direction.x * parameters.speed,
			parameters.direction.y * parameters.speed
		);
		this.setRotationDeg(parameters.left, parameters.directionAngle);

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

	protected setRotationDeg(left: boolean, angle: number): void {
		if (left)
			this.setFlipX(true);
		else {
			this.setFlipX(false);
			angle += 180;
		}

		this.angle = angle;
	}
}
