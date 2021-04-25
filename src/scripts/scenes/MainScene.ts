import Background from "../objects/Background";
import { FishGroup } from "../objects/Fishes";
import { HazardGroup } from "../objects/Hazards";
import GameWorld from "../objects/GameWorld";
import Submarine from "../objects/Submarine";

export default class MainScene extends Phaser.Scene {
	private gameWorld: GameWorld;
	private submarine: Submarine;
	private fishGroup: FishGroup;
	private hazardGroup: HazardGroup;
	private background: Background;
	private surfaceVessel: Phaser.GameObjects.Image;
	private width: number;
	private height: number;

	constructor() {
		super({ key: "MainScene" });
	}

	create() {
		this.cameras.main.fadeIn(500, 0, 0, 0);

		// Get the game width and height
		this.width = this.cameras.main.width;
		this.height = this.cameras.main.height;

		// Setup the 'world'
		const maxDepth: number = 10000;
		this.matter.world.setBounds(0, 0, this.width, maxDepth);
		this.cameras.main.setBounds(0, 0, this.width, maxDepth);

		// Add some objects
		this.background = new Background(this, maxDepth);

		// Add a ship to the surface
		this.surfaceVessel = new Phaser.GameObjects.Image(
			this,
			300,
			40,
			"surface-vessel"
		);
		this.surfaceVessel.setScale(0.15).flipX = true;
		this.add.existing(this.surfaceVessel);

		this.fishGroup = new FishGroup(this, this.background.SafeSpawnHeight);
		this.hazardGroup = new HazardGroup(this, this.background.SafeSpawnHeight);
		this.submarine = new Submarine(this, this.width / 2);
		this.gameWorld = new GameWorld(this, this.submarine);

		this.cameras.main.startFollow(this.submarine);
		this.scene
			.get("UIScene")
			.events.on("upgraded", (e) => this.submarine.checkUpgrades());
	}

	update(time: number, delta: number) {
		this.background.draw();
		this.submarine.update();
		this.fishGroup.update(delta);
	}
}
