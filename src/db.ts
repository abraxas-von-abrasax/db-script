import { Connection as MySQLConnection, createConnection } from 'mysql2/promise';
import { getConfigValue } from './config';
import { Pool } from 'pg';
import { SourceType } from './types';

const mySQLConnections = new Map<string, MySQLConnection>();
const postgresConnections = new Map<string, Pool>();

export async function query<T>(sourceKey: string, q: string, values: any[] = []): Promise<T[]> {
    const { type } = getConfigValue(sourceKey);

    if (type === SourceType.MYSQL) {
        return queryMySQL<T>(sourceKey, q, values);
    }
    return queryPostgreSQL<T>(sourceKey, q, values);
}

export async function closeConnections() {
    for (const connection of mySQLConnections.values()) {
        await connection.end();
    }

    mySQLConnections.clear();

    for (const connection of postgresConnections.values()) {
        await connection.end();
    }

    postgresConnections.clear();
}

async function queryMySQL<T>(sourceKey: string, q: string, values: any[]): Promise<T[]> {
    const connection = await getMySQLConnection(sourceKey);
    return connection.query(q, values).then(res => (res?.[0] ?? []) as T[]);
}

async function queryPostgreSQL<T>(sourceKey: string, q: string, values: any[]): Promise<T[]> {
    const connection = await getPostgresConnection(sourceKey);
    return connection.query(q, values).then(({ rows }) => rows as T[]);
}

async function getMySQLConnection(sourceKey: string): Promise<MySQLConnection> {
    const mysqlConnection = mySQLConnections.get(sourceKey);

    if (mysqlConnection) {
        return mysqlConnection;
    }

    const { config } = getConfigValue(sourceKey);

    const newConnection = await createConnection({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
    });

    mySQLConnections.set(sourceKey, newConnection);

    return newConnection;
}

async function getPostgresConnection(sourceKey: string): Promise<Pool> {
    const postgresConnection = postgresConnections.get(sourceKey);

    if (postgresConnection) {
        return postgresConnection;
    }

    const { config } = getConfigValue(sourceKey);

    const newConnection = new Pool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
    });

    postgresConnections.set(sourceKey, newConnection);

    return newConnection;
}
