import * as cdk from 'aws-cdk-lib';

export type ConfigType = {
    env: string
    ecrUri: string
    email: string
}

const ensureString = (e: unknown): e is string => typeof e === "string"

const ensureConfig = (e: unknown): e is ConfigType => {
    if(e != null && typeof e === "object") {
        return "ecrUri" in e
    }

    return false
}

export const getConfig = (app: cdk.App) => {
    const env = app.node.tryGetContext("config")
    if(!env) {
        throw Error("command argument does not exist")
    }

    const config = app.node.tryGetContext(env)
    if(!ensureConfig(config)) {
        throw Error("command argument environment does not exist")
    }
    
    const envConfig: ConfigType = {
        env: env,
        ecrUri: config.ecrUri,
        email: config.email,
    }

    if(Object.values(envConfig).every((e) => ensureString(e))) {
        return envConfig
    } else {
        throw Error("config does not have sufficient data")
    }
}
