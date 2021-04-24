import GameManager from "./GameManager";
import UIButton from "./UIButton";

// The UI game object contains lots of UI elements to be shown / hidden. Pressing UI buttons should call functions in the GameManager (usually)
export default class UIGameObject {

    scene: Phaser.Scene;
    gameManager: GameManager;
    sellFishButton: UIButton;
    sellOreButton: UIButton;
    sellResearchButton: UIButton;

    // Add all the required buttons
    constructor(scene: Phaser.Scene,gameManager: GameManager) {

        this.scene = scene;
        this.gameManager = gameManager;

        // Create the 'selling' buttons
        this.sellFishButton = new UIButton(this.scene,'sell-fish-button',100,100,this.gameManager)
        this.sellOreButton = new UIButton(this.scene,'sell-ore-button',100,200,this.gameManager)
        this.sellResearchButton = new UIButton(this.scene,'sell-research-button',100,300,this.gameManager)

    }

}