import UIButton from "./UIButton";
import GameManager from "./GameManager";

export default class UpgradeMenu {

    buttons: UIButton[];
    upgradeO2: UIButton;
    upgradeCapacity: UIButton;

    // Constructor for the upgrade menu
    constructor(scene: Phaser.Scene, x: number, y: number, gameManager: GameManager) {
        this.buttons = [];
        // List of buttons to add
        this.buttons.push(new UIButton(scene,'upgrade-oxygen-button','O2 Tank',x,y,gameManager));
        this.buttons.push(new UIButton(scene,'upgrade-cargo-capacity','Hold Size',x,y+100,gameManager));
        this.buttons.push(new UIButton(scene,'upgrade-chain-length','Arm Segments',x,y+200,gameManager));

    }

    // Show or hide all the buttons of the upgrade menu
    showMenu(show: boolean) {

        // For each button, show it if show is true
        for (let b of this.buttons) {
            b.visible = show;
            b.buttonText.visible = show;
        }

    }

}