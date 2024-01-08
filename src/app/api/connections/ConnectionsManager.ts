import mysql, { Connection, ConnectionOptions, Query } from "mysql2";

export type CMOptions = ConnectionOptions & { name: string };

export default class ConnectionsManager {
	private static connections: { [key: string]: Connection } = {};

	public static get connectionNames(): string[] {
		return Object.keys(this.connections);
	}

	public static addConnection(options: CMOptions): boolean {
		if (options.name in this.connections)
			return false;

		this.connections[options.name] = mysql.createConnection(options);

		return true;
	}

	public static removeConnection(name: string): boolean {
		if (!(name in this.connections))
			return false;

		delete this.connections[name];

		return true;
	}

	public static queryConnection(name: string, commands: string[]): Query[] | undefined {
		if (!(name in this.connections))
			return undefined;

		const connection: Connection = this.connections[name];
		const result: Query[] = [];

		for (const command of commands) {
			result.push(connection.query(command));
		}

		return result;
	}
}