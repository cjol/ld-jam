import "phaser";

import MainScene from "./scenes/mainScene";
import MenuScene from "./scenes/menuScene";
import PreloadScene from "./scenes/preloadScene";
import UIScene from "./scenes/uiScene";

const config = window.addEventListener("load", () => {
	const game = new Phaser.Game({
		type: Phaser.AUTO,
		backgroundColor: "#244b7e",
		scale: {
			parent: "phaser-game",
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: window.innerWidth,
			height: window.innerHeight,
		},
		scene: [MenuScene, PreloadScene, MainScene, UIScene],
		physics: {
			default: "matter",
			matter: {
				debug: false,
				gravity: { y: 10 },
			},
		},
	});
});
