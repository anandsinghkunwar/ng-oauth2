/// <reference path='../../_all.ts' />

module todos {
	export interface ITodoStorage {
		get (): string;
		put(todos: string): any;
	}
}
