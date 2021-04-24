import { CollisionCategories } from "./CollisionCategories";
import Submarine from "./Submarine";

const SEGMENT_LENGTH = 80;
const CONSTRAINT_LENGTH = 0;
const SEGMENT_STIFFNESS = 1;

export class MechanicalArm {
    private readonly segments: MechanicalArmSegment[];
    private readonly hook: MechanicalHook;

    constructor(scene: Phaser.Scene, sub: Submarine, links: number = 3) {
        this.segments = [];
        let prev: Phaser.Physics.Matter.Image | undefined;

        for (let i = 0; i < links; i++) {
            const x = prev ? prev.x : sub.x
            const y = prev ? prev.y : sub.y
            this.segments[i] = new MechanicalArmSegment(scene, x, y, prev);
            prev = this.segments[i];
        }

        scene.matter.add.constraint(sub as any, this.segments[0] as any, CONSTRAINT_LENGTH, SEGMENT_STIFFNESS, {
            pointA: { x: 0, y: -20 },
            pointB: { x: -SEGMENT_LENGTH / 2 + 10, y: 0 },
        });

        // TODO: sub and hook should collide; chains should not
        this.hook = new MechanicalHook(scene, this.segments[links - 1]);
    }

    update() {
        this.segments.forEach(segment => segment.update());
        this.hook.update();
    }
}

export class MechanicalArmSegment extends Phaser.Physics.Matter.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, prev?: Phaser.Physics.Matter.Image) {
        // Create claw
        super(scene.matter.world, x + SEGMENT_LENGTH, y, 'chain', undefined, {
            frictionAir: 0.05,
            mass: 0.001
        });

        this.setCollisionCategory(CollisionCategories.MECHANICAL_ARM_SEGMENT);
        this.setCollidesWith(0);

        this.scene = scene;
        this.displayHeight = 20;
        this.displayWidth = SEGMENT_LENGTH;
        scene.add.existing(this);

        if (prev) {
            scene.matter.add.constraint(prev as any, this as any, CONSTRAINT_LENGTH, SEGMENT_STIFFNESS, {
                pointA: { x: SEGMENT_LENGTH / 2 - 10, y: 0 },
                pointB: { x: -SEGMENT_LENGTH / 2 + 10, y: 0 },
            });
        }
    }
}

export class MechanicalHook extends Phaser.Physics.Matter.Image {
    private readonly keys: Record<string, Phaser.Input.Keyboard.Key>;
    private readonly prev: Phaser.Physics.Matter.Image;

    // Constructor for the claw
    constructor(scene: Phaser.Scene, parent: Phaser.Physics.Matter.Image) {
        // Create claw
        super(scene.matter.world, parent.x + SEGMENT_LENGTH / 2, parent.y, 'mechanical-hook', undefined, {
            frictionAir: 0.05,
            mass: 0.1
        });

        this.setCollisionCategory(CollisionCategories.MECHANICAL_HOOK);
        this.setCollidesWith(CollisionCategories.SUBMARINE | CollisionCategories.WALLS | CollisionCategories.FISH);
        
        this.prev = parent;
        scene.add.existing(this);

        this.displayHeight = SEGMENT_LENGTH / 2;
        this.displayWidth = SEGMENT_LENGTH / 2;
        scene.matter.add.constraint(parent as any, this as any, CONSTRAINT_LENGTH, SEGMENT_STIFFNESS, {
            pointA: { x: SEGMENT_LENGTH / 2, y: 0 },
            pointB: { x: 0, y: 0 },
        });

        this.keys = scene.input.keyboard.addKeys({
            up: 'UP',
            down: 'DOWN',
            left: 'LEFT',
            right: 'RIGHT'
        }, true, true) as Record<string, Phaser.Input.Keyboard.Key>;
    }

    update() {
        this.angle = this.prev.angle - 90;
        this.updateKeys();
    }

    updateKeys() {
        if (this.keys.left.isDown)
            this.setVelocityX(-5);
        else if (this.keys.right.isDown)
            this.setVelocityX(5);

        if (this.keys.up.isDown)
            this.setVelocityY(-5);
        else if (this.keys.down.isDown)
            this.setVelocityY(5);
    }

    // alternative update function using mouse instead of keyboard
    updateMouse() {
      const angle = Phaser.Math.Angle.BetweenPoints(this.scene.input, this)
      this.setAngle(angle);
      if (this.scene.input.isActive()) {

      this.setAngularVelocity(5)
      } else {
      this.setAngularVelocity(0)

      }
    }
}
