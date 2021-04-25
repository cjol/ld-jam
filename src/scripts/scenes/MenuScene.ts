import { gameManager } from "../objects/GameManager";
import UIButton from "../objects/UIButton";

export default class MenuScene extends Phaser.Scene {
	background: Phaser.GameObjects.Image;
	playButton: Phaser.GameObjects.Image;

	constructor() {
		super({ key: "MenuScene" });
	}

	preload() {
		this.load.image(
			"button-background-blue",
			"assets/img/ui/Button_Blue.png"
		);
		this.load.image("menu-background", "assets/img/ui/Main_Menu.png");
	}

	create() {
		console.log("Creating menu background");

		const menuXPos = this.cameras.main.width / 2;
		const menuYPos = this.cameras.main.height / 2;

		const scale = this.cameras.main.width / 1980;

		// Menu Background
		this.background = new Phaser.GameObjects.Image(
			this,
			menuXPos,
			menuYPos,
			"menu-background"
		);
		this.add.existing(this.background);
		this.background.setScale(scale);

		// Add a play button
		this.playButton = new UIButton(
			this,
			"play-button",
			"button-background-blue",
			"Play!",
			"none",
			menuXPos,
			menuYPos,
			1,
			gameManager
		);
		this.playButton.setAlpha(1);

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
