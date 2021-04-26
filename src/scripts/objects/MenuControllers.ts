const KEY_SIZE = 70;
const KEY_SPACE = KEY_SIZE - 20;
export default class MenuControllers {
	constructor(scene: Phaser.Scene, x: number, y: number) {
		// Add text to the button
		// const buttonText = new Phaser.GameObjects.Text(scene, x, y, "hello", ).setOrigin(0.5);
		const w = scene.add.image(x, y, "w-key");
		const a = scene.add.image(x - KEY_SPACE, y + KEY_SPACE, "a-key");
		const s = scene.add.image(x, y + KEY_SPACE, "s-key");
		const d = scene.add.image(x + KEY_SPACE, y + KEY_SPACE, "d-key");
		[w, a, s, d].forEach((k) => {
			k.displayHeight = KEY_SIZE;
			k.displayWidth = KEY_SIZE;
		});
		const mouse = scene.add.image(x + KEY_SPACE * 3, y + KEY_SPACE/2, "mouse-key");
        mouse.displayHeight = KEY_SPACE * 2;
        mouse.displayWidth = KEY_SPACE * 2;
		// this.add([text])
	}
}
