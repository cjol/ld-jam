import Submarine from '../objects/Submarine'
import FpsText from '../objects/fpsText'

export default class MainScene extends Phaser.Scene {
  fpsText: FpsText
  cursor: Phaser.Types.Input.Keyboard.CursorKeys
  submarine: Submarine

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.submarine = new Submarine(this, this.cameras.main.width / 2, 0)
    this.fpsText = new FpsText(this)

    // display the Phaser.VERSION
    this.add
      .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
        color: '#000000',
        fontSize: '24px'
      })
      .setOrigin(1, 0)
    this.cursor = this.input.keyboard.createCursorKeys()
  }

  update() {
    this.submarine.update(this.cursor)
    this.fpsText.update()
  }
}
