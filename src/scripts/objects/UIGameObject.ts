import GameManager from "./GameManager";
import UIButton from "./UIButton";

// The UI game object contains lots of UI elements to be shown / hidden. Pressing UI buttons should call functions in the GameManager (usually)
export default class UIGameObject {

    scene: Phaser.Scene;
    gameManager: GameManager;
    sellFishButton: UIButton;
    sellOreButton: UIButton;
    sellResearchButton: UIButton;
    warningMessage: Phaser.GameObjects.Text;

    // Add all the required buttons
    constructor(scene: Phaser.Scene,gameManager: GameManager) {

        this.scene = scene;
        this.gameManager = gameManager;

        // Create the 'selling' buttons
        this.sellFishButton = new UIButton(this.scene,'sell-fish-button',100,100,this.gameManager)
        this.sellOreButton = new UIButton(this.scene,'sell-ore-button',100,200,this.gameManager)
        this.sellResearchButton = new UIButton(this.scene,'sell-research-button',100,300,this.gameManager)

        // Create a warning message (can be used for multiple things)
        this.warningMessage = new Phaser.GameObjects.Text(scene, scene.cameras.main.width/2, scene.cameras.main.height-100, "I'm a warning", { color: 'red', fontSize: '56px' }).setOrigin(0.5)
        this.warningMessage.visible = false
        scene.add.existing(this.warningMessage);

    }

    update() {
        // If at the surface, show the selling buttons
        const {isAtSurface} = this.gameManager.submarine;
        this.sellFishButton.visible = isAtSurface;
        this.sellOreButton.visible = isAtSurface;
        this.sellResearchButton.visible = isAtSurface;

        // If the hold is full, show the warning
        const {holdFull} = this.gameManager.submarine;
        this.warningMessage.setText('Hold Full!').visible = holdFull;

        // If oxygen is low, show the warning (overwriting anything else)
        const {oxygenLow} = this.gameManager.submarine;
        if (oxygenLow) {this.warningMessage.setText('Oxygen Level Low!').visible = true};
    }

}