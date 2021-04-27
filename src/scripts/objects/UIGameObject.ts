import { Bar } from "./Bar";
import GameManager from "./GameManager";
import UIButton from "./UIButton";
import UpgradeMenu from "./UpgradeMenu";

const OXYGEN_CONSUMPTION_RATE = 0.05;
const HULL_DAMAGE_RATE = 1;
const OXYGEN_REFUEL_RATE = 1;
const BIG_BUTTON_SCALE = 0.4;
const RED = 0xff0000;
const ORANGE = 0xffa500;

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
			735,
			100,
			this.gameManager
		);

		// Draw a background for the left side
		this.leftBarsBG = new Phaser.GameObjects.Image(
			scene,
			0,
			0,
			"bottom-left-panel"
		);
		this.leftBarsBG
			.setScale(screenWidthRatio)
			.setX(this.leftBarsBG.displayWidth / 2)
			.setY(screenHeight - (this.leftBarsBG.displayHeight / 2));
		scene.add.existing(this.leftBarsBG);

		const barsIconInset = (75 * screenWidthRatio);
		const barsEdgeInset = (15 * screenWidthRatio);
		const barsBGY = screenHeight - this.leftBarsBG.displayHeight;
		const barsTopInset = (16 * screenWidthRatio);
		const leftBarsWidth = this.leftBarsBG.displayWidth - barsIconInset - barsEdgeInset;
		const leftBarsBarX = barsEdgeInset + (leftBarsWidth / 2);
		const barHeight = Math.ceil(25 * screenHeightRatio);

		// Draw the left bars
		this.cargoBar = new Bar(
			scene,
			leftBarsBarX,
			barsBGY + (9 * barsTopInset),
			100,
			100,
			leftBarsWidth,
			barHeight,
			{
				color: 0x555555
			}
		);

		// Create a warning message (can be used for multiple things)
		this.warningMessage = new Phaser.GameObjects.Text(
			scene,
			barsEdgeInset,
			barsBGY + barsTopInset + (8 * screenWidthRatio),
			"I'm a warning",
			{ color: "red", fontSize: `${20 * screenWidthRatio}px`, align: 'left' }
		);
		this.warningMessage.visible = false;
		scene.add.existing(this.warningMessage);

		// Create a text message for current gold
		this.currentWealthText = new Phaser.GameObjects.Text(
			scene,
			barsEdgeInset,
			barsBGY + (5 * barsTopInset),
			"0G",
			{ color: "black", fontSize: `${40 * screenWidthRatio}px`, align: 'left' }
		);
		scene.add.existing(this.currentWealthText);

		this.rightBarsBG = new Phaser.GameObjects.Image(
			scene,
			0,
			0,
			"bottom-right-panel"
		);
		this.rightBarsBG
			.setScale(screenWidthRatio)
			.setX(screenWidth - (this.rightBarsBG.displayWidth / 2))
			.setY(screenHeight - (this.rightBarsBG.displayHeight / 2));
		scene.add.existing(this.rightBarsBG);

		const rightBarsBGX = screenWidth - this.rightBarsBG.displayWidth;
		const rightBarsWidth = this.rightBarsBG.displayWidth - barsIconInset - barsEdgeInset;
		const rightBarsBarX = rightBarsBGX + barsIconInset + (rightBarsWidth / 2);
		const rightBarsTextX = rightBarsBGX + barsIconInset;

		// Draw the right bars
		this.oxygenBar = new Bar(
			scene,
			rightBarsBarX,
			barsBGY + (5 * barsTopInset),
			100,
			100,
			rightBarsWidth,
			barHeight,
			{
				warnThreshold: 0.5,
				warnColor: ORANGE,
				lowThreshold: 0.25,
				lowColor: RED,
				color: 0x0088ff
			}
		);
		this.hullBar = new Bar(
			scene,
			rightBarsBarX,
			barsBGY + (9 * barsTopInset),
			100,
			100,
			rightBarsWidth,
			barHeight,
			{
				warnThreshold: 0.5,
				warnColor: ORANGE,
				lowThreshold: 0.25,
				lowColor: RED,
				color: 0x00ff88
			}
		);

		// Create a text message for current depth
		this.currentDepthText = new Phaser.GameObjects.Text(
			scene,
			rightBarsTextX,
			barsBGY + (barsTopInset),
			"0m / 250m",
			{ color: "black", fontSize: `${20 * screenWidthRatio}px`, align: 'left' }
		);
		scene.add.existing(this.currentDepthText);

		// Create a text message for best depth
		this.maxDepthText = new Phaser.GameObjects.Text(
			scene,
			rightBarsTextX,
			barsBGY + (2 * barsTopInset) + (5 * screenWidthRatio),
			"Max Depth: 0m",
			{ color: "black", fontSize: `${20 * screenWidthRatio}px`, align: 'left' }
		);
		scene.add.existing(this.maxDepthText);
	}

	update() {
		// If at the surface, show the selling buttons (if anything to sell)
		const { isAtSurface } = this.gameManager.submarine;
		const subHasFish = this.gameManager.submarine.cargo.fishWeight > 0;
		const hasMoney = this.gameManager.CurrentWealth > 0;
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

		const { pressureWarning, oxygenLow } = this.gameManager.submarine;

		// Show the pressure warning (overwrites hold full if necessary)
		if (pressureWarning == 1)
			this.warningMessage.setText("Hull Breach!").visible = true;

		// If oxygen is low, show the warning (overwrites hull breach if necessary)
		if (!oxygenLow)
			this.oxygenBar.stopShake();
		else {
			this.warningMessage.setText("Oxygen Level Low!").visible = true;
			this.oxygenBar.shake();
		}

		if (pressureWarning !== 2)
			this.hullBar.stopShake();
		else {
			this.warningMessage.setText("Hull Breach Critical!").visible = true;
			this.hullBar.shake();
		}

		// Show or don't show the upgrade menu
		if (!isAtSurface)
			this.gameManager.upgradeMenuOpen = false;

		this.upgradeMenu.showMenu(this.gameManager.upgradeMenuOpen);

		// Update the tracker texts
		this.currentWealthText.setText(
			`${this.gameManager.CurrentWealth}G`
		);
		this.currentDepthText.setText(
			`${Math.floor(this.gameManager.currentDepth)}m / ${this.gameManager.getUpgradeValue("depthLimit")}m`
		);
		this.maxDepthText.setText(
			`Max Depth: ${Math.floor(this.gameManager.maxDepthReached)}m`
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
		if (this.gameManager.submarine.oxygen / maxOxygen <= (this.oxygenBar.config.lowThreshold || 0))
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
		if (this.gameManager.submarine.hull / maxHull < (this.hullBar.config.lowThreshold || 0))
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
