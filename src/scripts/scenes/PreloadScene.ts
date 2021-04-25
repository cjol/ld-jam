export default class PreloadScene extends Phaser.Scene {
	constructor() {
		super({ key: "PreloadScene", active: true });
	}

	preload() {
		this.load.image("submarine", "assets/img/submarine.png");
		this.load.image("mechanical-hook", "assets/img/claw.png");
		this.load.image("chain", "assets/img/chain.png");
		this.load.image("fish1", "assets/img/fish_type1.png");
		this.load.image("fish2", "assets/img/fish_type2.png");
		this.load.image("fish3", "assets/img/fish_type3.png");
		this.load.image("background-tiles", "assets/img/tiles/wall.png");
		this.load.image("surface-vessel", "assets/img/Fishing_vessel_1.png");
		this.load.image("big-button", "assets/img/ui/Big_Button.png");
		this.load.image("little-button", "assets/img/ui/Little_Button.png");
		this.load.image("ui-backdrop", "assets/img/ui/Menu_Panel.png");
	}

	create() {
		/**
		 * This is how you would dynamically import the mainScene class (with code splitting),
		 * add the mainScene to the Scene Manager
		 * and start the scene.
		 * The name of the chunk would be 'mainScene.chunk.js
		 * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
		 */
		// let someCondition = true
		// if (someCondition)
		//   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
		//     this.scene.add('MainScene', mainScene.default, true)
		//   })
		// else console.log('The mainScene class will not even be loaded by the browser')
	}
}