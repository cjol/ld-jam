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
		this.load.image("hazard1", "assets/img/shark.png");
		this.load.image("hazard2", "assets/img/mine.png");
		this.load.image("background-tiles", "assets/img/tiles/wall.png");
		this.load.image("surface-vessel", "assets/img/Fishing_vessel_1.png");
		this.load.image("big-button", "assets/img/ui/Big_Button.png");
		this.load.image("little-button", "assets/img/ui/Little_Button.png");
		this.load.image("ui-backdrop", "assets/img/ui/Menu_Panel.png");
	}
}
