export interface ISpawnableGroup {
	create(): void;

	update(delta: number): void;
}
