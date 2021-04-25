import { gameManager } from "../objects/GameManager";
import UIButton from "../objects/UIButton";

export default class MenuScene extends Phaser.Scene {
	background: Phaser.GameObjects.Image;
	playButton: UIButton;

	constructor() {
		super({ key: "MenuScene" });
	}

	preload() {
		this.load.image(
			"button-background",
			"assets/img/ui/button_background_2.png"
		);
		this.load.image("menu-background", "assets/img/ui/menu_background.png");
	}

	create() {
		console.log("Creating menu background");

		// Menu Background
		this.background = new Phaser.GameObjects.Image(
			this,
			400,
			400,
			"menu-background"
		);
		this.add.existing(this.background);
		this.background.setScale(0.2);

		// Add a play button
		this.playButton = new UIButton(
			this,
			"play-button",
			"Play!",
			"none",
			400,
			400,
			gameManager
		);

		this.scene.get("MenuScene").events.on("game-started", (e) => {
			this.cameras.main.fadeOut(500, 0, 0, 0);
			this.cameras.main.once(
				Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
				(cam, effect) => {
					this.scene.start("MainScene");
					this.scene.start("UIScene");
				}
			);
		});
	}
}
