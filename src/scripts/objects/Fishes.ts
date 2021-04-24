import { Math as PMath } from "phaser";
import { Raycaster } from "./Raycaster";

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
    private static readonly directions: Phaser.Math.Vector2[] = [
        new Phaser.Math.Vector2(Math.sqrt(3) / 2, 0.5),
        new Phaser.Math.Vector2(Math.sqrt(3) / 2, -0.5),
    ]
    public static readonly minSpeed: number = 10;
    public static readonly maxSpeed: number = 100;

    worth: number;
    weight: number;
    velocity: PMath.Vector2;
    forward: PMath.Vector2;
    debugLines: Phaser.GameObjects.Line[];
    text: Phaser.GameObjects.Text;
    raycaster: Raycaster;

    // Constructor for a fish
    constructor(scene: Phaser.Scene, parameters: IFishParameters, raycaster: Raycaster) {
        // Create fish
        super(scene.matter.world, 0, 0, 'fish' + parameters.type, undefined, {
            frictionAir: 0,
            mass: 0.001
        });
        this.x = parameters.position.x;
        this.y = parameters.position.y;
        this.displayWidth = this.width * parameters.scale;
        this.displayHeight = this.height * parameters.scale;
        this.velocity = parameters.direction.scale(parameters.speed);
        this.forward = parameters.direction;

        this.worth = parameters.worth;
        this.weight = parameters.weight;
        scene.add.existing(this);

        this.debugLines = [];
        this.debugLines.push(scene.add.line(this.x, this.y, 0, 0, this.velocity.x, this.velocity.y, 0xff0000));
        this.debugLines[0].setOrigin(0, 0);
        this.debugLines.push(scene.add.line(this.x, this.y, 0, 0, this.velocity.x, this.velocity.y, 0x00ff00));
        this.debugLines[1].setOrigin(0, 0);
        this.debugLines.push(scene.add.line(this.x, this.y, 0, 0, this.velocity.x, this.velocity.y, 0x00ff00));
        this.debugLines[2].setOrigin(0, 0);

        this.text = scene.add.text(10, 10, 'Fish 1', { font: '16px Courier', color: 'red' });
        this.setRotationAngle(parameters.directionAngle);

        this.raycaster = raycaster;
    }

    public update(delta: number) {
        const scaledDelta = delta / 1000;
        let acceleration: PMath.Vector2 = new PMath.Vector2(0, 0);
        let collided: boolean = false;

        if (this.isGoingToCollide()) {
            const avoidDirection: PMath.Vector2 = this.obstacleRays();
            const collisionAvoidForce = this.steerTowards(avoidDirection); // * settings.avoidCollisionWeight;
            acceleration.add(collisionAvoidForce);
            collided = true;
        }

        // if (acceleration.x > 0)
        //     console.log('before', this.velocity);
        this.velocity.add(acceleration);
        // if (acceleration.x > 0)
        //     console.log(this.velocity);
        let speed: number = this.velocity.length();
        let direction = this.velocity.scale(1 / speed);
        speed = PMath.Clamp(speed, 100, 1000);
        this.velocity = direction
            .clone()
            .scale(speed);

        const timeVelocity: PMath.Vector2 = this.velocity
            .clone()
            .scale(scaledDelta);
        this.x += timeVelocity.x;
        this.y += timeVelocity.y;
        this.setRotationAngle(direction.angle());
        this.forward = direction;

        for (const debugLine of this.debugLines) {
            debugLine.x = this.x;
            debugLine.y = this.y;
        }
        this.debugLines[0].setTo(0, 0, this.forward.x * 100, this.forward.y * 100);

        const point0: PMath.Vector2 = new PMath.Vector2(Fish.directions[0].x, Fish.directions[0].y);
        point0.rotate(this.rotation);
        this.debugLines[1].setTo(0, 0, point0.x * 100, point0.y * 100);

        const point1: PMath.Vector2 = new PMath.Vector2(Fish.directions[1].x, Fish.directions[1].y);
        point1.rotate(this.rotation);
        this.debugLines[2].setTo(0, 0, point1.x * 100, point1.y * 100);

        this.text.setText([
            'Fish 1',
            `x: ${this.x}`,
            `y: ${this.y}`,
            `velocity: ${this.velocity.x}, ${this.velocity.y}`,
            `forward: ${this.forward.x}, ${this.forward.y}`,
            `acceleration: ${acceleration.x}, ${acceleration.y}`,
            `collided: ${collided}`
        ])
    }

    private setRotationAngle(angle: number): void {
        if (angle > 0)
            this.setFlipX(true);
        this.rotation = angle;
    }

    private isGoingToCollide(): boolean {
        const ray = this.raycaster.createRay();
        const forwardPositionX = this.x + (this.forward.x * 100);
        const forwardPositionY = this.y + (this.forward.y * 100);
        ray.setPosition(this.x, this.y, forwardPositionX, forwardPositionY);
        if (ray.cast())
            return true;
        return false;
    }

    private obstacleRays(): PMath.Vector2 {
        for (const direction of Fish.directions) {
            const point: PMath.Vector2 = new PMath.Vector2(direction.x * 100, direction.y * 100);
            point.rotate(this.rotation);
            const ray = this.raycaster.createRay();
            ray.setPositionAndDirection(this.x, this.y, point.x, point.y);

            if (!ray.cast())
                return direction;
        }

        return this.forward;
    }

    private steerTowards(direction: PMath.Vector2): PMath.Vector2 {
        const v = direction
            .clone()
            .normalize()
            .scale(Fish.maxSpeed)
            .subtract(this.velocity);
        return this.clampMagnitude(v, 100);
    }

    private clampMagnitude(vector: PMath.Vector2, max: number): PMath.Vector2 {
        let length: number = vector.length();
        let direction = vector
            .clone()
            .scale(1 / length);
        length = PMath.Clamp(length, 0, max);
        return direction.scale(length);
    }
}

export class FishGroup {
    fishes: Fish[];

    // Constructor for a fish
    constructor(scene: Phaser.Scene, num: number, raycaster: Raycaster) {
        // Create fish group
        this.fishes = [];
        for (let i = 0; i<num; i++) {

            // Create the fish
            const parameters: IFishParameters = this.spawnRandomFish(scene);
            this.fishes[i] = new Fish(scene, parameters, raycaster);
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
        const speed: number = generator.integerInRange(Fish.minSpeed, Fish.maxSpeed);
        const weight: number = generator.integerInRange(1, 100);
        const worth: number = generator.integerInRange(0, 10000);
        const type: number = generator.integerInRange(1, 3);
        const directionAngle: number = generator.rotation();//(generator.integerInRange(0, 1) ? -1 : 1) * PMath.PI2 / 2;
        const directionX = Math.cos(directionAngle);
        const directionY = Math.sin(directionAngle);
        const scale = generator.realInRange(0.25, 1);

        return {
            type: type,
            worth: worth,
            weight: weight,
            position: new Phaser.Math.Vector2(x, y),
            directionAngle: directionAngle,
            direction: new Phaser.Math.Vector2(directionX, directionY),
            speed: speed,
            scale: scale
        };
    }
}