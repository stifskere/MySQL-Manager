
export interface Connection {
	databases: { [name: string]: Database };
}

export interface Database {
	tables: { [name: string]: TableLike };
	views: { [name: string]: TableLike }; // TODO: implementation same as tables, show the columns that the view would retrieve
	triggers: { [name: string]: Trigger }; // TODO: implementation for [event, timing, table, logic as sql]
	routines: { [name: string]: Routine }; // TODO; implementation just show the sql in another editor
}

export interface Trigger {
	timing: "INSERT" | "UPDATE" | "DELETE";
	event: "BEFORE" | "AFTER";
	table: string;
}

export interface Routine {
	type: "FUNCTION" | "PROCEDURE";
	sql: string;
}

export interface TableLike {
	columns: { [name: string]: Column };
}

export interface Column {
	type: string;
	notNull: boolean;
	unique: boolean;
	autoIncrement: boolean;
	default: boolean;
	primaryKey: boolean;
}
