
import {gameManager} from "../objects/GameManager";
import UIButton from "../objects/UIButton";

export default class MenuScene extends Phaser.Scene {

    background: Phaser.GameObjects.Image;
    playButton: UIButton;

	constructor() {
		super({ key: "MenuScene" });
	}

    create() {
        console.log("Creating menu background")

        // Menu Background
		this.background = new Phaser.GameObjects.Image(this,400,400,'menu-background');
        this.add.existing(this.background);

        // Add a play button
        this.playButton = new UIButton(this,'play-button','Play!','none',400,400,gameManager);

    }

}
