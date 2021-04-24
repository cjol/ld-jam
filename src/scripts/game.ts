import 'phaser';
import PhaserRaycaster from 'phaser-raycaster';
import MainScene from './scenes/mainScene';
import PreloadScene from './scenes/preloadScene';
import UIScene from './scenes/uiScene';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
    },
    scene: [PreloadScene, MainScene, UIScene],
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 0 }
        }
    },
    plugins: {
        scene: [
            {
                key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
            }
        ]
    }
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(config);
})
