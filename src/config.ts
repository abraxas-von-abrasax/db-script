import { Config, Payload } from './types';

let config: Config | null = null;

export function getConfig(): Config {
    if (!config) {
        throw new Error('Config is not initialized yet');
    }

    return config;
}

export function init(payload: Payload) {
    if (!payload.mysql && !payload.postgres) {
        throw new Error('You need to specify at least one database source.');
    }

    config = {
        mysql: payload.mysql ?? false,
        postgres: payload.postgres ?? false,
    };
}
