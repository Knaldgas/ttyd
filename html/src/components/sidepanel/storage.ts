import { PFConfig, defaultPFConfig } from './config';

const STORAGE_KEY = 'ttyd-r1000-pf-config';

export function loadPFConfig(): PFConfig {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
        return defaultPFConfig;
    }

    try {
        return JSON.parse(data) as PFConfig;
    } catch {
        return defaultPFConfig;
    }
}

export function savePFConfig(config: PFConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function resetPFConfig(): PFConfig {
    const config = structuredClone(defaultPFConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    return config;
}
