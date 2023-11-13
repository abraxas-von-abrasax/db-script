import { Connection as MySQLConnection, createConnection } from 'mysql2/promise';
import { getConfig } from './config';
import { Pool } from 'pg';

export enum SourceType {
    MYSQL = 'mysql',
    POSTGRES = 'postgres',
}

let mysqlConnection: MySQLConnection | null = null;
let postgresConnection: Pool | null = null;

export async function query<T>(type: SourceType, q: string, ...values: any[]): Promise<T[]> {
    if (type === SourceType.MYSQL) {
        return queryMySQL<T>(q, values);
    }
    return queryPostgreSQL<T>(q, values);
}

export async function closeConnections() {
    if (mysqlConnection) {
        await mysqlConnection.end();
        mysqlConnection = null;
    }

    if (postgresConnection) {
        await postgresConnection.end();
        postgresConnection = null;
    }
}

async function queryMySQL<T>(q: string, ...values: any[]): Promise<T[]> {
    const connection = await getMySQLConnection();
    return (await connection.query(q, values)) as unknown as T[];
}

async function queryPostgreSQL<T>(q: string, ...values: any[]): Promise<T[]> {
    const connection = await getPostgresConnection();
    return connection.query(q, ...values).then(({ rows }) => rows as T[]);
}

async function getMySQLConnection(): Promise<MySQLConnection> {
    if (!mysqlConnection) {
        const config = getConfig();

        if (!config.mysql) {
            throw new Error('MySQL connection is not set.');
        }

        mysqlConnection = await createConnection({
            host: config.mysql.host,
            port: config.mysql.port,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database,
        });
    }

    return mysqlConnection;
}

async function getPostgresConnection(): Promise<Pool> {
    if (!postgresConnection) {
        const config = getConfig();

        if (!config.postgres) {
            throw new Error('PostgreSQL connection is not set.');
        }

        postgresConnection = new Pool({
            host: config.postgres.host,
            port: config.postgres.port,
            user: config.postgres.user,
            password: config.postgres.password,
            database: config.postgres.database,
        });
    }

    return postgresConnection;
}
