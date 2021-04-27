import "phaser";

import MainScene from "./scenes/MainScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import UIScene from "./scenes/UIScene";

const config = window.addEventListener("load", () => {
	const game = new Phaser.Game({
		type: Phaser.AUTO,
		backgroundColor: "#244b7e",
		scale: {
			parent: "phaser-game",
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: window.innerWidth,
			height: window.innerHeight
		},
		scene: [MenuScene, PreloadScene, MainScene, UIScene],
		physics: {
			default: "matter",
			matter: {
				debug: false,
				gravity: { y: 10 },
				autoUpdate: false
			}
		}
	});
});
