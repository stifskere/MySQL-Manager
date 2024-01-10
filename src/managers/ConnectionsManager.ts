import { Connection, ConnectionOptions, Query, QueryError, createConnection } from "mysql2";

export type CMOptions = ConnectionOptions & { connection_name: string };

export default class ConnectionsManager {
	private static connections: { [key: string]: Connection } = {};

	public static get connectionNames(): string[] {
		return Object.keys(this.connections);
	}

	public static async addConnection({connection_name, ...options}: CMOptions): Promise<void> {
		if (connection_name in this.connections)
			return;

		const preConnection: Connection = createConnection(options satisfies ConnectionOptions);

		await new Promise<void>((resolve, reject): void => {
			preConnection.connect((err: QueryError | null): void => {
				if (err !== null)
					return reject(err);

				this.connections[connection_name] = preConnection;
				resolve();
			});
		});
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