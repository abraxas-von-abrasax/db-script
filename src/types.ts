export enum SourceType {
    MYSQL = 'mysql',
    POSTGRES = 'postgres',
}

export type DatabaseConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
};

export type Payload = {
    mysql?: Record<string, DatabaseConfig>;
    postgres?: Record<string, DatabaseConfig>;
};

export type ConfigValue = {
    type: SourceType;
    config: DatabaseConfig;
};

export type Config = {
    databases: {
        [key: string]: ConfigValue;
    }
};
