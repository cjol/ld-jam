import GameManager from "./GameManager";
import UIButton from "./UIButton";
import UpgradeMenu from "./UpgradeMenu";
import { Bar } from "./Bar";

const OXYGEN_CONSUMPTION_RATE = 0.05;
const HULL_DAMAGE_RATE = 1;
const OXYGEN_REFUEL_RATE = 1;

// The UI game object contains lots of UI elements to be shown / hidden. Pressing UI buttons should call functions in the GameManager (usually)
export default class UIGameObject {
	scene: Phaser.Scene;
	gameManager: GameManager;
	sellFishButton: UIButton;
	sellOreButton: UIButton;
	sellResearchButton: UIButton;
	fixSubButton: UIButton;
	warningMessage: Phaser.GameObjects.Text;
	upgradeMenuButton: UIButton;
	upgradeMenu: UpgradeMenu;
	currentWealthText: Phaser.GameObjects.Text;
	maxDepthText: Phaser.GameObjects.Text;
	currentDepthText: Phaser.GameObjects.Text;
	cargoBar: Bar;
	oxygenBar: Bar;
	hullBar: Bar;

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

		// Create the 'fix sub' button
		this.fixSubButton = new UIButton(
			this.scene,
			"fix-sub-button",
			"Fix Sub",
			"none",
			550,
			50,
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

		// Create the three progress bars
		// Get the bar positions from the screen size
		const screenWidth = this.scene.cameras.main.width;
		const screenHeight = this.scene.cameras.main.height;
		const edgeOffset = 50;
		const yPosLower = screenHeight - 100;
		const yPosUpper = screenHeight - 200;
		const xPosLeft = 200 + edgeOffset;
		const xPosRight = screenWidth - (200 + edgeOffset);
		// Draw the bars
		this.cargoBar = new Bar(scene, xPosLeft, yPosLower, 100, 100, "cargo");
		this.hullBar = new Bar(scene, xPosRight, yPosLower, 100, 100, "hull");
		this.oxygenBar = new Bar(
			scene,
			xPosRight,
			yPosUpper,
			100,
			100,
			"oxygen"
		);
	}

	update() {
		// If at the surface, show the selling buttons (if anything to sell)
		const { isAtSurface } = this.gameManager.submarine;
		const subHasFish = this.gameManager.submarine.cargo.fishWeight > 0;
		const subHasOre = this.gameManager.submarine.cargo.oreWeight > 0;
		const subHasResearch =
			this.gameManager.submarine.cargo.researchWeight > 0;
		const hasMoney = this.gameManager.currentWealth > 0;
		const isDamaged =
			this.gameManager.submarine.hull <
			this.gameManager.getUpgradeValue("depthLimit");

		if (isAtSurface) {
			this.upgradeMenuButton.visible = hasMoney;
			this.upgradeMenuButton.buttonText.visible = hasMoney;
			if (hasMoney) {
				this.fixSubButton.visible = isDamaged;
				this.fixSubButton.buttonText.visible = isDamaged;
			} else {
				this.fixSubButton.visible = false;
				this.fixSubButton.buttonText.visible = false;
			}
			this.sellFishButton.visible = subHasFish;
			this.sellFishButton.buttonText.visible = subHasFish;
			this.sellOreButton.visible = subHasOre;
			this.sellOreButton.buttonText.visible = subHasOre;
			this.sellResearchButton.visible = subHasResearch;
			this.sellResearchButton.buttonText.visible = subHasResearch;
		} else {
			this.upgradeMenuButton.visible = false;
			this.upgradeMenuButton.buttonText.visible = false;
			this.fixSubButton.visible = false;
			this.fixSubButton.buttonText.visible = false;
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
		if (holdFull)
			this.warningMessage.setText("Hold Full!").visible = holdFull;

		// If oxygen is low, show the warning (overwrites hold full if necessary)
		const { oxygenLow } = this.gameManager.submarine;
		if (oxygenLow)
			this.warningMessage.setText("Oxygen Level Low!").visible = true;

		// Show the pressure warning (overwrites low o2 if necessary)
		const { pressureWarning } = this.gameManager.submarine;
		if (pressureWarning == 1)
			this.warningMessage.setText("Hull Breach!").visible = true;

		if (pressureWarning == 2)
			this.warningMessage.setText("Hull Breach Critical!").visible = true;

		// Show or don't show the upgrade menu
		if (!isAtSurface)
			this.gameManager.upgradeMenuOpen = false;

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

		// Update the three progress bars
		this.updateOxygen();
		this.updateHull();
		this.updateCargo();
	}

	updateOxygen() {
		const maxOxygen = this.gameManager.getUpgradeValue("tank");
		if (this.gameManager.submarine.isAtSurface) {
			this.gameManager.submarine.oxygen += OXYGEN_REFUEL_RATE;
			this.gameManager.submarine.oxygenLow = false;
		} else
			this.gameManager.submarine.oxygen -= OXYGEN_CONSUMPTION_RATE;

		this.gameManager.submarine.oxygen = Math.max(
			0,
			Math.min(this.gameManager.submarine.oxygen, maxOxygen)
		);
		this.oxygenBar.update(this.gameManager.submarine.oxygen, maxOxygen);

		// Set the warning if the bar is nearly empty
		if (this.gameManager.submarine.oxygen / maxOxygen <= 0.3)
			this.gameManager.submarine.oxygenLow = true;

		// End the game
		if (this.gameManager.submarine.oxygen <= 0)
			this.gameManager.markSubmarineDestroyed();
	}

	updateHull() {
		const maxHull = this.gameManager.getUpgradeValue("depthLimit");
		// calculate how much past the maxHull we are
		const depthExceeded = Math.max(
			0,
			this.gameManager.currentDepth / maxHull - 1
		);
		this.gameManager.submarine.hull -= HULL_DAMAGE_RATE * depthExceeded;
		// clamp to 0-maxHull range
		this.gameManager.submarine.hull = Phaser.Math.Clamp(
			this.gameManager.submarine.hull,
			0,
			maxHull
		);

		this.hullBar.update(this.gameManager.submarine.hull, maxHull);

		// Set the warning if the bar is nearly empty
		if (this.gameManager.submarine.hull / maxHull < 0.3)
			this.gameManager.submarine.pressureWarning = 2;
		else if (depthExceeded > 0)
			this.gameManager.submarine.pressureWarning = 1;
		else
			this.gameManager.submarine.pressureWarning = 0;

		// End the game
		if (this.gameManager.submarine.hull <= 0)
			this.gameManager.markSubmarineDestroyed();
	}

	updateCargo() {
		// Calculate the total amount in the hold
		const totalCargo =
			this.gameManager.submarine.cargo.fishWeight +
			this.gameManager.submarine.cargo.oreWeight +
			this.gameManager.submarine.cargo.researchWeight;
		this.cargoBar.update(
			totalCargo,
			this.gameManager.getUpgradeValue("capacity")
		);
	}
}
