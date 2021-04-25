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
	constructor(scene: Phaser.Scene, gameManager: GameManager) {
		this.scene = scene;
		this.gameManager = gameManager;

		// Create the 'selling' buttons
		this.sellFishButton = new UIButton(
			this.scene,
			"sell-fish-button",
			"Sell Fish",
			"none",
			300,
			200,
			this.gameManager
		);
		this.sellOreButton = new UIButton(
			this.scene,
			"sell-ore-button",
			"Sell Ore",
			"none",
			300,
			230,
			this.gameManager
		);
		this.sellResearchButton = new UIButton(
			this.scene,
			"sell-research-button",
			"Sell Research",
			"none",
			300,
			260,
			this.gameManager
		);

		// Create the upgrade menu buttons
		this.upgradeMenuButton = new UIButton(
			this.scene,
			"upgrade-menu-button",
			"Upgrade",
			"none",
			550,
			100,
			this.gameManager
		);
		this.upgradeMenu = new UpgradeMenu(
			this.scene,
			580,
			150,
			this.gameManager
		);

		// Create a warning message (can be used for multiple things)
		this.warningMessage = new Phaser.GameObjects.Text(
			scene,
			scene.cameras.main.width / 2,
			scene.cameras.main.height - 100,
			"I'm a warning",
			{ color: "red", fontSize: "56px" }
		).setOrigin(0.5);
		this.warningMessage.visible = false;
		scene.add.existing(this.warningMessage);

		// Create a text message for current gold
		this.currentWealthText = new Phaser.GameObjects.Text(
			scene,
			(3 * scene.cameras.main.width) / 4,
			50,
			"Gold: 0",
			{ color: "green", fontSize: "36px" }
		).setOrigin(0.5);
		scene.add.existing(this.currentWealthText);

		// Create a text message for current depth
		this.currentDepthText = new Phaser.GameObjects.Text(
			scene,
			(3 * scene.cameras.main.width) / 4,
			80,
			"Current Depth: 0",
			{ color: "green", fontSize: "36px" }
		).setOrigin(0.5);
		scene.add.existing(this.currentDepthText);

		// Create a text message for best depth
		this.maxDepthText = new Phaser.GameObjects.Text(
			scene,
			(3 * scene.cameras.main.width) / 4,
			110,
			"Max Depth: 0",
			{ color: "green", fontSize: "36px" }
		).setOrigin(0.5);
		scene.add.existing(this.maxDepthText);
	}

	update() {
		// If at the surface, show the selling buttons (if anything to sell)
		const { isAtSurface } = this.gameManager.submarine;
		const subHasFish = this.gameManager.submarine.cargo.fishWeight > 0;
		const subHasOre = this.gameManager.submarine.cargo.oreWeight > 0;
		const subHasResearch =
			this.gameManager.submarine.cargo.researchWeight > 0;
		const hasMoney = this.gameManager.currentWealth > 0;

		if (isAtSurface) {
			this.upgradeMenuButton.visible = hasMoney;
			this.upgradeMenuButton.buttonText.visible = hasMoney;
			this.sellFishButton.visible = subHasFish;
			this.sellFishButton.buttonText.visible = subHasFish;
			this.sellOreButton.visible = subHasOre;
			this.sellOreButton.buttonText.visible = subHasOre;
			this.sellResearchButton.visible = subHasResearch;
			this.sellResearchButton.buttonText.visible = subHasResearch;
		} else {
			this.upgradeMenuButton.visible = false;
			this.upgradeMenuButton.buttonText.visible = false;
			this.sellFishButton.visible = false;
			this.sellFishButton.buttonText.visible = false;
			this.sellOreButton.visible = false;
			this.sellOreButton.buttonText.visible = false;
			this.sellResearchButton.visible = false;
			this.sellResearchButton.buttonText.visible = false;
		}

		// Assume no warnings necessary
		this.warningMessage.setText("").visible = false;

		// If the hold is full, show the warning
		const { holdFull } = this.gameManager.submarine;
		if (holdFull) {
			this.warningMessage.setText("Hold Full!").visible = holdFull;
		}

		// If oxygen is low, show the warning (overwrites hold full if necessary)
		const { oxygenLow } = this.gameManager.submarine;
		if (oxygenLow) {
			this.warningMessage.setText("Oxygen Level Low!").visible = true;
		}

		// Show the pressure warning (overwrites low o2 if necessary)
		const { pressureWarning } = this.gameManager.submarine;
		if (pressureWarning == 1) {
			this.warningMessage.setText("Hull Failure").visible = true;
		}
		if (pressureWarning == 2) {
			this.warningMessage.setText(
				"Hull Pressure Critical!"
			).visible = true;
		}

		// Show or don't show the upgrade menu
		if (!isAtSurface) {
			this.gameManager.upgradeMenuOpen = false;
		}
		this.upgradeMenu.showMenu(this.gameManager.upgradeMenuOpen);

		// Update the tracker texts
		this.currentWealthText.setText(
			"Gold: " + this.gameManager.currentWealth
		);
		this.currentDepthText.setText(
			"Current Depth: " + Math.floor(this.gameManager.currentDepth)
		);
		this.maxDepthText.setText(
			"Max Depth: " + Math.floor(this.gameManager.maxDepthReached)
		);
	}
}
