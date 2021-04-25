import Background from "../objects/Background";
import { FishGroup } from "../objects/fish/FishGroup";
import { gameManager } from "../objects/GameManager";
import GameWorld from "../objects/GameWorld";
import { HazardGroup } from "../objects/hazard/HazardGroup";
import { ISpawnableGroup } from "../objects/spawnables/ISpawnableGroup";
import Submarine from "../objects/Submarine";

export default class MainScene extends Phaser.Scene {
	private submarine: Submarine;
	private background: Background;
	private spawnableGroups: ISpawnableGroup[];

	constructor() {
		super({ key: "MainScene" });
	}

	create() {
		this.spawnableGroups = [];

		this.cameras.main.fadeIn(500, 0, 0, 0);

		// Get the game width and height
		const width = this.cameras.main.width;

		// Setup the 'world'
		const maxDepth: number = 10000;
		this.matter.world.setBounds(0, 0, width, maxDepth);
		this.cameras.main.setBounds(0, 0, width, maxDepth);

		// Add some objects
		this.background = new Background(this, maxDepth);

		this.spawnableGroups.push(
			new FishGroup(this, this.background.SafeSpawnHeight)
		);
		this.spawnableGroups.push(
			new HazardGroup(this, this.background.SafeSpawnHeight)
		);
		this.submarine = new Submarine(this, width / 2);

		new GameWorld(this, this.submarine);
		gameManager.initialise();

		this.cameras.main.startFollow(this.submarine);
		this.events.once("shutdown", this.shutdown, this);
		this.scene.get("UIScene").events.on("upgraded", this.doUpgrades, this);
	}

	private shutdown() {
		this.scene.get("UIScene").events.off("upgraded", this.doUpgrades, this);
	}

	private doUpgrades(): void {
		this.submarine.checkUpgrades();
	}

	public update(time: number, delta: number) {
		this.background.draw();
		this.submarine.update(time);

		for (const spawnableGroup of this.spawnableGroups)
			spawnableGroup.update(delta);
	}
}
