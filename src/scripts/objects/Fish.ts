export default class Fish extends Phaser.Physics.Arcade.Sprite {
    // Constructor for a fish
    constructor(scene: Phaser.Scene, x: number, y: number) {
        // Create fish
        super(scene, x, y, 'fish');
        scene.add.existing(this);
        // scene.physics.add.existing(this);

        var group = this.add.group({
            defaultKey: 'fish',
            maxSize: 20,
        });

    }

    // Update loop - game physics based on acceleration
    update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {

    }
}
