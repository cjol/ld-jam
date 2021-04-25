import { Fish } from "./fish/Fish";
import { gameManager } from "./GameManager";
import { Hazard } from "./hazard/Hazard";
import { MechanicalHook } from "./MechanicalHook";
import Submarine from "./Submarine";

export default class GameWorld {
	scene: Phaser.Scene;
	submarine: Submarine;
	// Initialise the game

	constructor(scene: Phaser.Scene, submarine: Submarine) {
		// Let us access the important stuff later
		this.scene = scene;
		this.submarine = submarine;

		// start watching for interesting collisions in our world
		this.scene.matter.world.on(
			"collisionstart",
			this.watchCollisions.bind(this)
		);
	}

	watchCollisions(event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
		event.pairs
			.map(detectObjs)
			.filter((x): x is MatchedPair => x !== null)
			.forEach((pair) => {
				const item = pair.item;
				if (pair.type === "hook" && item instanceof Fish)
					gameManager.catchFish(item);

				if (pair.type === "sub" && item instanceof Hazard) {
					gameManager.hitHazard(item);
					this.submarine.takeDamage(item.damage / 20);
				}
			});
	}
}
type MatchedPair =
	| {
			type: "hook";
			hook: MechanicalHook;
			item: Phaser.GameObjects.GameObject;
	  }
	| {
			type: "sub";
			sub: Submarine;
			item: Phaser.GameObjects.GameObject;
	  };

function detectObjs(
	pair: Phaser.Types.Physics.Matter.MatterCollisionData
): null | MatchedPair {
	if (pair.bodyA.gameObject instanceof MechanicalHook) {
		return {
			type: "hook",
			hook: pair.bodyA.gameObject,
			item: pair.bodyB.gameObject,
		};
	}
	if (pair.bodyA.gameObject instanceof Submarine) {
		return {
			type: "sub",
			sub: pair.bodyA.gameObject,
			item: pair.bodyB.gameObject,
		};
	} else if (pair.bodyB.gameObject instanceof Submarine) {
		return {
			type: "sub",
			sub: pair.bodyB.gameObject,
			item: pair.bodyA.gameObject,
		};
	} else if (pair.bodyB.gameObject instanceof MechanicalHook) {
		return {
			type: "hook",
			hook: pair.bodyB.gameObject,
			item: pair.bodyA.gameObject,
		};
	}

	return null;
}
