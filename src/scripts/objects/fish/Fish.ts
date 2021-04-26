import { CollisionCategories } from "../CollisionCategories";
import { ASpawnable } from "../spawnables/ASpawnable";
import { ISpawnableParameters } from "../spawnables/ISpawnableParameters";
import { FishBand, IFishBandParameters } from "./FishBand";

export interface IFishParameters extends ISpawnableParameters {
	worth: number;
	weight: number;
	rarity: number;
	layer1Tint: number;
	layer2Tint: number;
}

export class Fish extends ASpawnable<IFishParameters, IFishBandParameters> {
	private readonly fishBand: FishBand;
	private layer2: Phaser.GameObjects.Image;

	public worth: number = 0;
	public weight: number = 0;

	// Constructor for a fish
	constructor(scene: Phaser.Scene, band: FishBand) {
		// Create fish
		super(scene, band, "fish1l1");

		this.fishBand = band;
	}

	protected initialisePhysics(): void {
		super.initialisePhysics();

		this.setCollisionCategory(CollisionCategories.FISH);
		this.setCollidesWith(CollisionCategories.MECHANICAL_HOOK);
	}

	protected beforeSceneAdd(scene: Phaser.Scene): void {
		super.beforeSceneAdd(scene);

		this.layer2 = scene.add.image(0, 0, "fish1l2");
	}

	public setParameters(parameters: IFishParameters) {
		super.setParameters(parameters);

		this.setTexture(`fish${parameters.type}l1`);
		this.setTint(parameters.layer1Tint);

		this.layer2.setTexture(`fish${parameters.type}l2`);
		this.layer2.x = this.x;
		this.layer2.y = this.y;
		this.layer2.scale = this.scale;
		this.layer2.angle = this.angle;
		this.layer2.setFlipX(this.flipX);
		this.layer2.setFlipY(this.flipY);
		this.layer2.setTint(parameters.layer2Tint);

		this.worth = parameters.worth;
		this.weight = parameters.weight;
	}

	public catch() {
		this.fishBand.removeItem(this);
	}

	public update(): void {
		super.update();

		this.layer2.x = this.x;
		this.layer2.y = this.y;
	}

	protected setRotationDeg(left: boolean, angle: number): void {
		super.setRotationDeg(left, angle);

		if (left)
			this.layer2.setFlipX(true);
		else
			this.layer2.setFlipX(false);

		this.layer2.angle = angle;
	}

	protected configureOrigin(parameters: IFishParameters): void {
		if (!parameters) {
			super.configureOrigin();
			return;
		}

		switch (parameters.type) {
		case 1:
			this.setOrigin(0.5, 0.58);
			break;
		case 2:
			this.setOrigin();
			break;
		case 3:
			this.setOrigin(parameters.left ? 0.48 : 0.52, 0.5);
			break;
		case 4:
			this.setOrigin(parameters.left ? 0.48 : 0.52, 0.49);
			break;
		}
	}

	public setOrigin(x?: number | undefined, y?: number | undefined): this {
		if (this.layer2)
			this.layer2.setOrigin(x, y);
		return super.setOrigin(x, y);
	}
}
