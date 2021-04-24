import { Fish } from "./Fishes";
import { MechanicalArm, MechanicalHook } from "./MechanicalHook";
import { Bar } from "./Bar";

type Key = "up" | "down" | "left" | "right"
const BAR_OFFSET_Y = -80;
const OXYGEN_CONSUMPTION_RATE = 0.05;
const OXYGEN_REFUEL_RATE = 1;
export default class Submarine extends Phaser.Physics.Matter.Image {
    keys: Record<Key, Phaser.Input.Keyboard.Key>;
    hook: MechanicalArm;
    cargo: { fishWeight: number, fishValue: number, oreWeight: number, oreValue: number, researchWeight: number, researchValue: number };
    oxygen: number;
    maxOxygen: number;
    maxCapacity: number;
    oxygenBar: Bar;

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
        const subGroup = scene.matter.world.nextGroup(true);
        this.setCollisionGroup(subGroup)
        this.hook = new MechanicalArm(scene, this, subGroup);
        this.oxygenBar = new Bar(scene, 50, 50, 100, 100);
        this.setScale(0.025);

        // Initialise the empty hold (units will be mass)
        this.cargo = { fishWeight: 0, fishValue: 0, oreWeight: 0, oreValue: 0, researchWeight: 0, researchValue: 0 };
        this.maxOxygen = 0;
        this.oxygen = 0;
        this.maxCapacity = 0;
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
        // If still no key pressed, set vertical acceleration to 0
        // if (!somethingDownY)
        //     this.setAccelerationY(0);

        // Force the sub not to rotate
        this.setRotation(0);

    }

    updateKeys() {
        // X direction - assume no key pressed
        // // // Check for left and right keys
        if (this.keys.left.isDown) {
            this.setVelocityX(-5)
            this.setFlip(true, false);
        } else if (this.keys.right.isDown) {
            this.setVelocityX(5);
            this.setFlip(false, false);
        }

        // Y direction - assume no key pressed
        // Check for up and down keys
        if (this.keys.up.isDown) {
            this.setVelocityY(-5);
        } else if (this.keys.down.isDown) {
            this.setVelocityY(5);
        }
        if (this.y < 200) {
            this.y = 200;
        }
    }

    updateOxygen() {
        // TODO: determine if we are underwater
        const isUnderwater = this.y > 220;
        if (isUnderwater) {
            this.oxygen -= OXYGEN_CONSUMPTION_RATE;
        } else {
            this.oxygen += OXYGEN_REFUEL_RATE;
        }
        this.oxygen = Math.max(0, Math.min(this.oxygen, this.maxOxygen))
        this.oxygenBar.update(this.x, this.y + BAR_OFFSET_Y, this.oxygen, this.maxOxygen);
    }

}
