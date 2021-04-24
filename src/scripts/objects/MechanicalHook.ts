export default class MechanicalHook extends Phaser.Physics.Arcade.Sprite {

  private target: {x: number; y:number};
  scene: Phaser.Scene;
  // Constructor for the claw
  constructor(scene: Phaser.Scene, x: number, y: number) {
    // Create claw
    super(scene, x, y, 'mechanical-hook')
    this.scene = scene;
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Set physics params for claw
    // this.body.setMass(1)
    this.setDamping(true)
    this.setDrag(0.05);
    this.setCollideWorldBounds(false)
  }

  update(pointer: Phaser.Input.Pointer) {
    if (pointer.leftButtonDown()) {
      this.scene.physics.accelerateTo(this, pointer.x, pointer.y, 300);
    } else {
      this.setAcceleration(0,0);
    }
  }
}
