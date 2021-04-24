export default class Submarine extends Phaser.Physics.Arcade.Sprite {
    // Constructor for submarine
    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Create submarine
        super(scene, x, y, 'submarine');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set physics params
        this.body.setMass(100);
        this.setDamping(true);
        this.setDrag(0.25);
        this.setMaxVelocity(200);
        this.setCollideWorldBounds(false);
    }

    // Update loop - game physics based on acceleration
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        // X direction - assume no key pressed
        let somethingDownX = false;
        // Check for left and right keys
        if (cursors.left.isDown) {
            somethingDownX = true;
            this.setAccelerationX(-100);
            this.setFlip(true, false);
        } else if (cursors.right.isDown) {
            somethingDownX = true;
            this.setAccelerationX(100);
            this.setFlip(false, false);
        }
        // If still no key pressed, set horizontal acceleration to 0
        if (!somethingDownX)
            this.setAccelerationX(0);

        // Y direction - assume no key pressed
        let somethingDownY = false;
        // Check for up and down keys
        if (cursors.up.isDown) {
            somethingDownY = true;
            this.setAccelerationY(-100);
        } else if (cursors.down.isDown) {
            somethingDownY = true;
            this.setAccelerationY(100);
        }
        // If still no key pressed, set vertical acceleration to 0
        if (!somethingDownY)
            this.setAccelerationY(0);
    }
}
