import { MouseConstraint } from "matter";
import { Fish } from "./Fishes";
import Submarine from "./Submarine";


const SEGMENT_LENGTH = 80;
const CONSTRAINT_LENGTH = 0;
const SEGMENT_STIFFNESS = 1;
export class MechanicalArm {
  segments: MechanicalArmSegment[];
  hook: MechanicalHook;
  constructor(scene: Phaser.Scene, sub: Submarine, group: number, links: number = 3) {
    this.segments = [];
    let prev: Phaser.Physics.Matter.Image | undefined;

    for (let i = 0; i < links; i++) {
      const x = prev ? prev.x : sub.x
      const y = prev ? prev.y : sub.y
      this.segments[i] = new MechanicalArmSegment(scene, x, y, group, prev);
      prev = this.segments[i];
    }

    scene.matter.add.constraint(sub as any, this.segments[0] as any, CONSTRAINT_LENGTH, SEGMENT_STIFFNESS, {
      pointA: { x: 0, y: 20 },
      pointB: { x: -SEGMENT_LENGTH / 2 + 10, y: 0 },
    });


    // TODO: sub and hook should collide; chains should not
    const hookGroup = group;
    this.hook = new MechanicalHook(scene, this.segments[links - 1], hookGroup, sub);
    sub.setCollidesWith(hookGroup);
  }
  update() {
    this.segments.forEach(segment => segment.update());
    this.hook.update();
  }

}

export class MechanicalArmSegment extends Phaser.Physics.Matter.Image {
  constructor(scene: Phaser.Scene, x: number, y: number, group: number, prev?: Phaser.Physics.Matter.Image) {
    // Create claw
    super(scene.matter.world, x + SEGMENT_LENGTH, y, 'chain', undefined, {
      frictionAir: 0.05,
      mass: 0.001,
      collisionFilter: {
        group
      }
    });
    this.scene = scene;
    this.displayHeight = 20;
    this.displayWidth = SEGMENT_LENGTH;
    scene.add.existing(this)
    if (prev) {
      scene.matter.add.constraint(prev as any, this as any, CONSTRAINT_LENGTH, SEGMENT_STIFFNESS, {
        pointA: { x: SEGMENT_LENGTH / 2 - 10, y: 0 },
        pointB: { x: -SEGMENT_LENGTH / 2 + 10, y: 0 },
      });
    }
  }

}

export class MechanicalHook extends Phaser.Physics.Matter.Image {
  keys: Record<string, Phaser.Input.Keyboard.Key>;
  scene: Phaser.Scene;
  sub: Submarine;
  prev: Phaser.Physics.Matter.Image

  // Constructor for the claw
  constructor(scene: Phaser.Scene, parent: Phaser.Physics.Matter.Image, group: number, sub: Submarine) {
    // Create claw
    super(scene.matter.world, parent.x + SEGMENT_LENGTH / 2, parent.y, 'mechanical-hook', undefined, {
      frictionAir: 0.05,
      mass: 0.1,
      collisionFilter: {
        group
      }
    });

    this.prev = parent;
    this.scene = scene;
    scene.add.existing(this)
    this.sub = sub;
    this.displayHeight = SEGMENT_LENGTH/2;
    this.displayWidth = SEGMENT_LENGTH/2;
    scene.matter.add.constraint(parent as any, this as any, CONSTRAINT_LENGTH, SEGMENT_STIFFNESS,
      {
        pointA: { x: SEGMENT_LENGTH / 2, y: 0 },
        pointB: { x: 0, y: 0 },
      });
    this.setupKeys();

  }

  setupKeys() {
    this.keys = this.scene.input.keyboard.addKeys({
      up: 'UP',
      down: 'DOWN',
      left: 'LEFT',
      right: 'RIGHT'
    }, true, true) as Record<string, Phaser.Input.Keyboard.Key>;
  }

  update() {
    this.angle = this.prev.angle - 90;
    if (this.keys.left.isDown) {
      this.setVelocityX(-5)
    } else if (this.keys.right.isDown) {
      this.setVelocityX(5);
    }

    if (this.keys.up.isDown) {
      this.setVelocityY(-5);
    } else if (this.keys.down.isDown) {
      this.setVelocityY(5);
    }
  }

    // Called when the submarine catches a fish. It needs to get the fish that was caught, and add its weight to the sub's cargo
    catchFish(fish: Fish) {

        // Add the fish's weight to the hold
        this.sub.cargo.fishWeight += fish.weight;
        // Add its value to the hold
        this.sub.cargo.fishValue += fish.worth;

        // Destroy the fish

    }

    // Called when the submarine picks up some ore. Get the weight and value and add it to the hold
    collectOre() {

        // Will need to write this once we have created the Ore class (as for fish)

    }

    // Called when the submarine picks up some research. Get the weight and value and add it to the hold
    collectResearch() {

        // Will need to write this once we have created the Research class (as for fish)

    }

}
