
export interface Connection {
	databases: { [name: string]: Database };
}

export interface Database {
	tables: { [name: string]: TableLike };
	views: { [name: string]: TableLike };
	triggers: { [name: string]: Trigger };
	routines: { [name: string]: Routine };
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
