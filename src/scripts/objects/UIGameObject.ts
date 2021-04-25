import GameManager from "./GameManager";
import UIButton from "./UIButton";
import UpgradeMenu from "./UpgradeMenu";
import { Bar } from "./Bar";

const OXYGEN_CONSUMPTION_RATE = 0.05;
const HULL_DAMAGE_RATE = 1;
const OXYGEN_REFUEL_RATE = 1;

const BIG_BUTTON_SCALE = 0.4;

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
	infoPanel: Phaser.GameObjects.Image;
	leftBarsBG: Phaser.GameObjects.Image;
	rightBarsBG: Phaser.GameObjects.Image;

	// Add all the required buttons
	constructor(scene: Phaser.Scene, gameManager: GameManager) {
		this.scene = scene;
		this.gameManager = gameManager;

		// Create the three progress bars
		// Get the bar positions from the screen size
		const screenWidth = this.scene.cameras.main.width;
		const screenHeight = this.scene.cameras.main.height;
		const standardScreenWidth = 1550;
		const standardScreenHeight = 972;
		const screenWidthRatio = screenWidth / standardScreenWidth;
		const screenHeightRatio = screenHeight / standardScreenHeight;
		const barWidth = Math.ceil(200 * screenWidthRatio);
		const barHeight = Math.ceil(25 * screenHeightRatio);
		const edgeOffset = 75 * screenWidthRatio;
		const yPosLower = screenHeight - 2 * barHeight;
		const yPosUpper = screenHeight - 4 * barHeight;
		const xPosLeft = barWidth / 2 + edgeOffset;
		const xPosRight = screenWidth - (barWidth / 2 + edgeOffset);
		const xPosInfo = xPosRight - edgeOffset;
		const yPosInfo = 125 * screenHeightRatio;

		// Create the 'selling' buttons
		this.sellFishButton = new UIButton(
			this.scene,
			"big-button",
			"Sell Fish",
			300,
			200,
			BIG_BUTTON_SCALE,
			() => {
				gameManager.sellFish();
			}
		);
		this.sellOreButton = new UIButton(
			this.scene,
			"big-button",
			"Sell Ore",
			300,
			250,
			BIG_BUTTON_SCALE,
			() => {
				gameManager.sellOre();
			}
		);
		this.sellOreButton.hide();
		this.sellResearchButton = new UIButton(
			this.scene,
			"big-button",
			"Sell Research",
			300,
			300,
			BIG_BUTTON_SCALE,
			() => {
				gameManager.sellResearch();
			}
		);
		this.sellResearchButton.hide();

		// Create the 'fix sub' button
		this.fixSubButton = new UIButton(
			this.scene,
			"big-button",
			"Fix Sub",
			550,
			50,
			BIG_BUTTON_SCALE,
			() => {
				gameManager.fixSub();
			}
		);

		// Create the upgrade menu buttons
		this.upgradeMenuButton = new UIButton(
			this.scene,
			"big-button",
			"Shop",
			550,
			100,
			BIG_BUTTON_SCALE,
			() => {
				gameManager.upgradeMenuOpen = !gameManager.upgradeMenuOpen;
			}
		);
		this.upgradeMenu = new UpgradeMenu(
			this.scene,
			720,
			100,
			this.gameManager
		);

		// Draw a background for the control panel
		this.infoPanel = new Phaser.GameObjects.Image(
			scene,
			xPosInfo,
			yPosInfo,
			"ui-backdrop"
		);
		scene.add.existing(this.infoPanel);
		this.infoPanel.setScale(
			0.4 * screenWidthRatio,
			0.35 * screenHeightRatio
		);

		// Create a text message for current gold
		this.currentWealthText = new Phaser.GameObjects.Text(
			scene,
			xPosInfo,
			yPosInfo - 50 * screenHeightRatio,
			"Current Gold: 0",
			{ color: "black", fontSize: "36px" }
		).setOrigin(0.5);
		scene.add.existing(this.currentWealthText);

		// Create a text message for current depth
		this.currentDepthText = new Phaser.GameObjects.Text(
			scene,
			xPosInfo,
			yPosInfo + 0 * screenHeightRatio,
			"Current Depth: 0",
			{ color: "black", fontSize: "36px" }
		).setOrigin(0.5);
		scene.add.existing(this.currentDepthText);

		// Create a text message for best depth
		this.maxDepthText = new Phaser.GameObjects.Text(
			scene,
			xPosInfo,
			yPosInfo + 50 * screenHeightRatio,
			"Max Depth: 0",
			{ color: "black", fontSize: "36px" }
		).setOrigin(0.5);
		scene.add.existing(this.maxDepthText);

		// Draw a background for the left and right sides
		this.leftBarsBG = new Phaser.GameObjects.Image(
			scene,
			xPosLeft,
			(yPosLower + yPosUpper) / 2 + 5,
			"ui-backdrop"
		);
		scene.add.existing(this.leftBarsBG);
		this.leftBarsBG.setScale(
			0.2 * screenWidthRatio,
			0.25 * screenHeightRatio
		);
		this.rightBarsBG = new Phaser.GameObjects.Image(
			scene,
			xPosRight,
			(yPosLower + yPosUpper) / 2 + 5,
			"ui-backdrop"
		);
		scene.add.existing(this.rightBarsBG);
		this.rightBarsBG.setScale(
			0.2 * screenWidthRatio,
			0.25 * screenHeightRatio
		);
		// Draw the bars
		this.cargoBar = new Bar(
			scene,
			xPosLeft,
			yPosLower,
			100,
			100,
			barWidth,
			barHeight,
			"cargo"
		);
		this.hullBar = new Bar(
			scene,
			xPosRight,
			yPosLower,
			100,
			100,
			barWidth,
			barHeight,
			"hull"
		);
		this.oxygenBar = new Bar(
			scene,
			xPosRight,
			yPosUpper,
			100,
			100,
			barWidth,
			barHeight,
			"oxygen"
		);

		// Create a warning message (can be used for multiple things)
		this.warningMessage = new Phaser.GameObjects.Text(
			scene,
			xPosLeft,
			yPosUpper,
			"I'm a warning",
			{ color: "red", fontSize: "16px" }
		).setOrigin(0.5);
		this.warningMessage.visible = false;
		scene.add.existing(this.warningMessage);
	}

	update() {
		// If at the surface, show the selling buttons (if anything to sell)
		const { isAtSurface } = this.gameManager.submarine;
		const subHasFish = this.gameManager.submarine.cargo.fishWeight > 0;
		const hasMoney = this.gameManager.currentWealth > 0;
		const isDamaged =
			this.gameManager.submarine.hull <
			this.gameManager.getUpgradeValue("depthLimit");

		if (isAtSurface) {
			this.upgradeMenuButton.show();
			this.fixSubButton.show();
			this.fixSubButton.setDisabled(!hasMoney || !isDamaged);
			this.sellFishButton.show();
			this.sellFishButton.setDisabled(!subHasFish);
		} else {
			this.upgradeMenuButton.hide();
			this.fixSubButton.hide();
			this.sellFishButton.hide();
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
			"Current Gold: " + this.gameManager.currentWealth
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
