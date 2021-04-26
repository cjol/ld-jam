import MenuControllers from "../objects/MenuControllers";
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

		this.load.image("w-key", "assets/img/ui/prompts/W_Key_Light.png");
		this.load.image("a-key", "assets/img/ui/prompts/A_Key_Light.png");
		this.load.image("s-key", "assets/img/ui/prompts/S_Key_Light.png");
		this.load.image("d-key", "assets/img/ui/prompts/D_Key_Light.png");
		this.load.image("mouse-key", "assets/img/ui/prompts/Mouse_Simple_Key_Light.png");
	}

	create() {
		const menuXPos = this.cameras.main.width / 2;
		const menuYPos = this.cameras.main.height / 2;

		// const scale = this.cameras.main.width / 1980;

		// Menu Background
		this.addBackground(menuXPos, menuYPos);

        this.addTitle(menuXPos, menuYPos);

		// Add a play button
		this.playButton = new UIButton(
			this,
			"button-background-blue",
			"Play!",
			menuXPos,
			menuYPos - 25,
			0.8,
			() => this.startGame(),
			false
		);
		this.playButton.setAlpha(1);

		const treasure = this.add.text(
			menuXPos,
			this.cameras.main.height - 30,
			"What treasures await at the bottom of the ocean?"
		);
		treasure.setOrigin(0.5);

        new MenuControllers(this, menuXPos - 50, menuYPos + 70);
	}

    private addBackground(menuXPos: number, menuYPos: number) {
        this.background = new Phaser.GameObjects.Image(
            this,
            menuXPos,
            menuYPos,
            "menu-background"
        );
        this.add.existing(this.background);

        const targetWidth = 480;
        const sf = targetWidth /this.background.displayWidth;
        this.background.setScale(sf);
    }

    private addTitle(menuXPos: number, menuYPos: number) {
        const title = this.add.text(menuXPos, menuYPos - 100, "Hook, Mines & Sinker!");
        title.setFontSize(40);
        const targetWidth = 300;
        const sf = targetWidth / title.displayWidth;
        title.setScale(sf);
        title.setOrigin(0.5);
    }

	private startGame(): void {
		this.cameras.main
			.fadeOut(500, 0, 0, 0)
			.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
				this.scene.start("MainScene");
				this.scene.start("UIScene");
			});
	}
}
