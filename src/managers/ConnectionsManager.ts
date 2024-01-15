import { Connection, ConnectionOptions, createConnection} from "mysql2/promise";
import {Packets} from "@/types/TypeDefinitions";

export type CMOptions = ConnectionOptions & { connection_name: string };

export default class ConnectionsManager {
	private static connections: { [key: string]: Connection } = {};

	public static get connectionNames(): string[] {
		return Object.keys(this.connections);
	}

	public static async addConnection({connection_name, ...options}: CMOptions): Promise<void> {
		if (connection_name in this.connections)
			throw { message: `A connection named "${connection_name}" already exists.` };

		const connection: Connection = await createConnection(options satisfies ConnectionOptions);
		await connection.connect();

		this.connections[connection_name] = connection;
	}

	public static removeConnection(name: string): boolean {
		if (!(name in this.connections))
			return false;

		delete this.connections[name];

		return true;
	}

	public static async queryConnection(name: string, ...commands: string[]): Promise<Packets[] | undefined> {
		if (!(name in this.connections))
			return undefined;

		const result: Packets[] = [];

		for (const command of commands) {
			const [rows] = await this.connections[name].query(command);
			result.push(rows);
		}

		return result;
	}
}