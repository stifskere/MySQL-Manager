
// TODO: adapt it to connection that has multiple databases

export type ConnectionData = Connection[];

export interface Connection {
	name: string;
	tables: Table[];
}

export interface Table {
	columns: Column[];
}

export interface Column {
	name: string;
	type: string;

	notNull: boolean;
	unique: boolean;
	autoIncrement: boolean;
	default: boolean;
	primaryKey: boolean;
}
