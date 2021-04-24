import { Math as PMath } from "phaser";

interface IFishParameters {
    type: number;
    worth: number;
    weight: number;
    position: Phaser.Math.Vector2;
    directionAngle: number;
    direction: Phaser.Math.Vector2;
    speed: number;
    scale: number;
}

export class Fish extends Phaser.Physics.Matter.Image {
    worth: number;
    velocity: PMath.Vector2;

    // Constructor for a fish
    constructor(scene: Phaser.Scene, parameters: IFishParameters) {
        // Create fish
        super(scene.matter.world, 0, 0, 'fish' + parameters.type, undefined, {
            frictionAir: 0
        });

        this.setPosition(parameters.position.x, parameters.position.y);
        this.setScale(parameters.scale);

        if (parameters.directionAngle > 0)
            this.setFlipX(true);
        this.setRotation(parameters.directionAngle);

        this.worth = parameters.worth;
        scene.add.existing(this);
    }

    update(delta: number) {
        let acceleration: PMath.Vector2 = PMath.Vector2.ZERO;

        // if (IsHeadingForCollision ()) {
        //     Vector3 collisionAvoidDir = ObstacleRays ();
        //     Vector3 collisionAvoidForce = SteerTowards (collisionAvoidDir) * settings.avoidCollisionWeight;
        //     acceleration += collisionAvoidForce;
        // }

        // velocity += acceleration * Time.deltaTime;
        // float speed = velocity.magnitude;
        // Vector3 dir = velocity / speed;
        // speed = Mathf.Clamp (speed, settings.minSpeed, settings.maxSpeed);
        // velocity = dir * speed;

        // cachedTransform.position += velocity * Time.deltaTime;
        // cachedTransform.forward = dir;
        // position = cachedTransform.position;
        // forward = dir;
    }
}

export class FishGroup {
    fishes: Fish[];

    // Constructor for a fish
    constructor(scene: Phaser.Scene, num: number) {
        // Create fish group
        this.fishes = [];
        for (let i = 0; i<num; i++) {

            // Create the fish
            const parameters: IFishParameters = this.spawnRandomFish(scene);
            this.fishes[i] = new Fish(scene, parameters);
        }
    }

    // Update loop - game physics based on acceleration
    update(delta: number) {
        this.fishes.forEach(fish => fish.update(delta));
    }

    // Method to create a fish moving in a random direction
    spawnRandomFish(scene: Phaser.Scene): IFishParameters {
        const generator: PMath.RandomDataGenerator = new PMath.RandomDataGenerator();

        // Choose a random fish to create
        const x: number = generator.integerInRange(64, scene.cameras.main.width - 64);
        const y: number = generator.integerInRange(64, scene.cameras.main.height - 64);
        const speed: number = generator.integerInRange(1, 10);
        const weight: number = generator.integerInRange(1, 100);
        const worth: number = generator.integerInRange(0, 10000);
        const type: number = generator.integerInRange(1, 3);
        const directionAngle: number = generator.rotation();
        const directionX = Math.cos(directionAngle);
        const directionY = Math.sin(directionAngle);

        return {
            type: type,
            worth: worth,
            weight: weight,
            position: new Phaser.Math.Vector2(x, y),
            directionAngle: directionAngle,
            direction: new Phaser.Math.Vector2(directionX, directionY),
            speed: speed,
            scale: generator.realInRange(0.25, 1)
        };
    }
}