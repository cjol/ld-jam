export interface ISpawnableParameters {
	position: Phaser.Math.Vector2;
	directionAngle: number;
	direction: Phaser.Math.Vector2;
	speed: number;
	scale: number;
	type: number;
	vertices?: Phaser.Types.Math.Vector2Like[][];
	left: boolean;
}
