export type DatabaseConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
};

export type Payload = {
    mysql?: DatabaseConfig;
    postgres?: DatabaseConfig;
};

export type Config = {
    mysql: DatabaseConfig | false;
    postgres: DatabaseConfig | false;
};
