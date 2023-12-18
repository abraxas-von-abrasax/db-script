import { Config, ConfigValue, DatabaseConfig, Payload, SourceType } from './types';

let config: Config = {
    databases: {},
};

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

    const assignValue = (key: string, type: SourceType, value?: DatabaseConfig): void => {
        if (!value) {
            throw new Error(`MySQL source ${key} is not configured.`);
        }

        config.databases[key] = {
            type,
            config: value,
        };
    };

    Object.entries(payload.mysql ?? {}).forEach(([key, value]) => assignValue(key, SourceType.MYSQL, value));
    Object.entries(payload.postgres ?? {}).forEach(([key, value]) => assignValue(key, SourceType.POSTGRES, value));
}

export function getConfigValue(sourceKey: string): ConfigValue {
    if (!config || !Object.keys(config).length) {
        throw new Error('Config is not initialized yet');
    }

    const configValue = config.databases[sourceKey];

    if (!configValue) {
        throw new Error(`Source '${sourceKey}' is not set.`);
    }

    return configValue;
}

