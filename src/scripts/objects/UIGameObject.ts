import GameManager from "./GameManager";
import UIButton from "./UIButton";
import UpgradeMenu from "./UpgradeMenu";

// The UI game object contains lots of UI elements to be shown / hidden. Pressing UI buttons should call functions in the GameManager (usually)
export default class UIGameObject {

    scene: Phaser.Scene;
    gameManager: GameManager;
    sellFishButton: UIButton;
    sellOreButton: UIButton;
    sellResearchButton: UIButton;
    warningMessage: Phaser.GameObjects.Text;
    upgradeMenuButton: UIButton;
    upgradeMenu: UpgradeMenu;
    currentWealthText: Phaser.GameObjects.Text;
    maxDepthText: Phaser.GameObjects.Text;
    currentDepthText: Phaser.GameObjects.Text;

    // Add all the required buttons
    constructor(scene: Phaser.Scene,gameManager: GameManager) {

        this.scene = scene;
        this.gameManager = gameManager;

        // Create the 'selling' buttons
        this.sellFishButton = new UIButton(this.scene,'sell-fish-button','Sell Fish',100,100,this.gameManager)
        this.sellOreButton = new UIButton(this.scene,'sell-ore-button','Sell Ore',100,200,this.gameManager)
        this.sellResearchButton = new UIButton(this.scene,'sell-research-button','Sell Research',100,300,this.gameManager)

        // Create the upgrade menu buttons
        this.upgradeMenuButton = new UIButton(this.scene,'upgrade-menu-button','Upgrade',300,100,this.gameManager)
        this.upgradeMenu = new UpgradeMenu(this.scene,400,200,this.gameManager);

        // Create a warning message (can be used for multiple things)
        this.warningMessage = new Phaser.GameObjects.Text(scene, scene.cameras.main.width/2, scene.cameras.main.height-100, "I'm a warning", { color: 'red', fontSize: '56px' }).setOrigin(0.5)
        this.warningMessage.visible = false
        scene.add.existing(this.warningMessage);

        // Create a text message for current gold
        this.currentWealthText = new Phaser.GameObjects.Text(scene, 3*scene.cameras.main.width/4, 50, "Gold: 0", { color: 'green', fontSize: '36px' }).setOrigin(0.5)
        scene.add.existing(this.currentWealthText)

        // Create a text message for current depth
        this.currentDepthText = new Phaser.GameObjects.Text(scene, 3*scene.cameras.main.width/4, 80, "Current Depth: 0", { color: 'green', fontSize: '36px' }).setOrigin(0.5)
        scene.add.existing(this.currentDepthText)

        // Create a text message for best depth
        this.maxDepthText = new Phaser.GameObjects.Text(scene, 3*scene.cameras.main.width/4, 110, "Max Depth: 0", { color: 'green', fontSize: '36px' }).setOrigin(0.5)
        scene.add.existing(this.maxDepthText)

    }

    update() {
        // If at the surface, show the selling buttons
        const {isAtSurface} = this.gameManager.submarine;
        this.sellFishButton.visible = isAtSurface;
        this.sellFishButton.buttonText.visible = isAtSurface;
        this.sellOreButton.visible = isAtSurface;
        this.sellOreButton.buttonText.visible = isAtSurface;
        this.sellResearchButton.visible = isAtSurface;
        this.sellResearchButton.buttonText.visible = isAtSurface;
        this.upgradeMenuButton.visible = isAtSurface;
        this.upgradeMenuButton.buttonText.visible = isAtSurface;

        // Assume no warnings necessary
        this.warningMessage.setText('').visible = false;

        // If the hold is full, show the warning
        const {holdFull} = this.gameManager.submarine;
        if (holdFull) {this.warningMessage.setText('Hold Full!').visible = holdFull};

        // If oxygen is low, show the warning (overwrites hold full if necessary)
        const {oxygenLow} = this.gameManager.submarine;
        if (oxygenLow) {this.warningMessage.setText('Oxygen Level Low!').visible = true};

        // Show the pressure warning (overwrites low o2 if necessary)
        const {pressureWarning} = this.gameManager.submarine;
        if (pressureWarning == 1) {this.warningMessage.setText('Hull Pressure Critical!').visible = true};    
        if (pressureWarning == 2) {this.warningMessage.setText('Hull Failure').visible = true};        

        // Show or don't show the upgrade menu
        if (!isAtSurface) {this.gameManager.upgradeMenuOpen = false};
        this.upgradeMenu.showMenu(this.gameManager.upgradeMenuOpen);

        // Update the tracker texts
        this.currentWealthText.setText("Gold: " + this.gameManager.currentWealth)
        this.currentDepthText.setText("Current Depth: " + Math.floor(this.gameManager.currentDepth))
        this.maxDepthText.setText("Max Depth: " + Math.floor(this.gameManager.maxDepthReached))
    }

}