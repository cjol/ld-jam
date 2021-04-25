import { Bar } from "./Bar";
import { CollisionCategories } from "./CollisionCategories";
import { gameManager } from "./GameManager";
import { MechanicalArm } from "./MechanicalHook";

type Key = "up" | "down" | "left" | "right"
const OXYGEN_BAR_OFFSET_Y = -80;
const OXYGEN_CONSUMPTION_RATE = 0.05;
const OXYGEN_REFUEL_RATE = 1;
const CARGO_BAR_OFFSET_Y = -60;
const WATER_LEVEL = 200;

export default class Submarine extends Phaser.Physics.Matter.Image {
    keys: Record<Key, Phaser.Input.Keyboard.Key>;
    hook: MechanicalArm;
    oxygenBar: Bar;
    cargoBar: Bar;

    // Constructor for submarine
    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Create submarine
        super(scene.matter.world, x, y, 'submarine', undefined, {
            frictionAir: 0.05,
            mass: 500,
            restitution: 0.6
        });

        scene.add.existing(this);
        this.setupKeys();

        this.setCollisionCategory(CollisionCategories.SUBMARINE);
        this.setCollidesWith(CollisionCategories.WALLS | CollisionCategories.MECHANICAL_HOOK);

        this.hook = new MechanicalArm(scene, this);
        this.oxygenBar = new Bar(scene, 50, 50, 100, 100,'health');
        this.cargoBar = new Bar(scene, 50, 50, 100, 100,'cargo');
        this.setScale(0.25);
    }

    setupKeys() {
        this.keys = this.scene.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        }, true, true) as Record<string, Phaser.Input.Keyboard.Key>;
    }

    // Update loop - game physics based on acceleration
    update() {

        this.hook.update();
        this.updateKeys();
        this.updateOxygen();
        this.updateCargo()
        // If still no key pressed, set vertical acceleration to 0
        // if (!somethingDownY)
        //     this.setAccelerationY(0);

        // Update the max depth if it needs it
        var depth = (this.y - WATER_LEVEL) / 10;
        gameManager.currentDepth = depth
        if (depth > gameManager.maxDepthReached) {
            gameManager.maxDepthReached = depth
        }


    }

    updateKeys() {
        if (gameManager.submarine.oxygen > 0) {
            // X direction - assume no key pressed
            // // // Check for left and right keys
            let flipX = this.flipX;
            if (this.keys.left.isDown) {
                this.setVelocityX(-5)
                flipX = true;
            } else if (this.keys.right.isDown) {
                this.setVelocityX(5);
                flipX = false;
            }

            // Force the sub not to rotate
            this.setFlip(flipX, false);
            this.setRotation(0);


            // Y direction - assume no key pressed
            // Check for up and down keys
            if (this.keys.up.isDown) {
                this.setVelocityY(-5);
                this.setRotation(flipX ? 0.15 : -0.15 )
            } else if (this.keys.down.isDown) {
                this.setVelocityY(5);
                this.setRotation(flipX ? -0.15 : 0.15)
            }

            // stop moving up past the water level
            if (this.y < WATER_LEVEL) {
                this.y = WATER_LEVEL;
                if (!gameManager.submarine.isAtSurface) {
                    gameManager.submarine.isAtSurface = true;
                }
            } else {
                if (gameManager.submarine.isAtSurface) {
                    gameManager.submarine.isAtSurface = false;
                }
            }
        }
    }

    updateOxygen() {
        const isUnderwater = this.y > 220;
        if (isUnderwater) {
            gameManager.submarine.oxygen -= OXYGEN_CONSUMPTION_RATE;
        } else {
            gameManager.submarine.oxygen += OXYGEN_REFUEL_RATE;
            gameManager.submarine.oxygenLow = false;
        }
        gameManager.submarine.oxygen = Math.max(0, Math.min(gameManager.submarine.oxygen, gameManager.getUpgradeValue('tank')))
        this.oxygenBar.update(this.x, this.y + OXYGEN_BAR_OFFSET_Y, gameManager.submarine.oxygen, gameManager.getUpgradeValue('tank'));

        // Set the warning if the bar is nearly empty
        if ((gameManager.submarine.oxygen/gameManager.getUpgradeValue('tank')) <= 0.3) {
            gameManager.submarine.oxygenLow = true;
        }

        // End the game
        if (gameManager.submarine.oxygen == 0) {
            this.flipY = true;
            this.setVelocityY(5);
        }

    }
    
    updateCargo() {
        // Calculate the total amount in the hold
        var totalCargo = gameManager.submarine.cargo.fishWeight + gameManager.submarine.cargo.oreWeight + gameManager.submarine.cargo.researchWeight
        this.cargoBar.update(this.x, this.y + CARGO_BAR_OFFSET_Y, totalCargo, gameManager.getUpgradeValue('capacity'));
    }


}
