export interface Shortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
}

export interface PFButton {
    label: string;
    sequence: string;
    shortcut?: Shortcut;
}

export interface PFConfig {
    normal: PFButton[];
    shift: PFButton[];
    ctrl: PFButton[];
    alt: PFButton[];
}

export const defaultPFConfig: PFConfig = {
    normal: [
        { label: 'PF1', sequence: '\x1bOP', shortcut: { key: 'F1' } },
        { label: 'PF2', sequence: '\x1bOQ' },
        { label: 'PF3', sequence: '\x1bOR' },
        { label: 'PF4', sequence: '\x1bOS' },
    ],
    shift: [
        { label: 'S-PF1', sequence: '\x1b[1;2P' },
        { label: 'S-PF2', sequence: '\x1b[1;2Q' },
        { label: 'S-PF3', sequence: '\x1b[1;2R' },
        { label: 'S-PF4', sequence: '\x1b[1;2S' },
    ],
    ctrl: [
        { label: 'C-PF1', sequence: '\x1b[1;5P' },
        { label: 'C-PF2', sequence: '\x1b[1;5Q' },
        { label: 'C-PF3', sequence: '\x1b[1;5R' },
        { label: 'C-PF4', sequence: '\x1b[1;5S' },
    ],
    alt: [
        { label: 'M-PF1', sequence: '\x1b[1;3P' },
        { label: 'M-PF2', sequence: '\x1b[1;3Q' },
        { label: 'M-PF3', sequence: '\x1b[1;3R' },
        { label: 'M-PF4', sequence: '\x1b[1;3S' },
    ],
};
