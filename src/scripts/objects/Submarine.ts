import { MechanicalArm, MechanicalHook } from "./MechanicalHook";

type Key = "up" | "down" | "left" | "right"
export default class Submarine extends Phaser.Physics.Matter.Image {
    keys: Record<Key, Phaser.Input.Keyboard.Key>;
    hook: MechanicalArm;
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
        this.setCollisionGroup(subGroup);
        this.hook = new MechanicalArm(scene, this, subGroup);
        this.setScale(0.025);
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
        this.hook.update();
        // If still no key pressed, set vertical acceleration to 0
        // if (!somethingDownY)
        //     this.setAccelerationY(0);
    }
}
