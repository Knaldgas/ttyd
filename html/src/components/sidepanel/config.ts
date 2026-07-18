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
    ctrlShift: PFButton[];
    ctrlAlt: PFButton[];
    shiftAlt: PFButton[];
}

export const defaultPFConfig: PFConfig = {
    normal: [
        { label: 'Activate', sequence: '\x1b' },
        { label: 'Break', sequence: '\x1b' },
        { label: 'Catch', sequence: '\x1b' },
        { label: 'Code (all Worlds)', sequence: '\x1b' },
        { label: 'Code (this World)', sequence: '\x1b' },
        { label: 'Code Unit', sequence: '\x1b' },
        { label: 'Complete', sequence: '\x1b' },
        { label: 'Create Body', sequence: '\x1b' },
        { label: 'Create Directory', sequence: '\x1b' },
        { label: 'Create Private', sequence: '\x1b' },
        { label: 'Create World', sequence: '\x1b' },
        { label: 'Create command', sequence: '\x1b' },
    ],
    shift: [
        { label: 'Create text', sequence: '\x1b' },
        { label: 'Definition in place', sequence: '\x1b' },
        { label: 'Definition', sequence: '\x1b' },
        { label: 'Demote', sequence: '\x1b' },
        { label: 'Edit', sequence: '\x1b' },
        { label: 'Enclosing Library', sequence: '\x1b' },
        { label: 'Enclosing in place', sequence: '\x1b' },
        { label: 'Enclosing', sequence: '\x1b' },
        { label: 'Execute', sequence: '\x1b' },
        { label: 'Format', sequence: '\x1b' },
        { label: 'Help on help', sequence: '\x1b' },
        { label: 'Help on key', sequence: '\x1b' },
    ],
    ctrl: [
        { label: 'Help window', sequence: '\x1b' },
        { label: 'Help', sequence: '\x1b' },
        { label: 'Image', sequence: '\x1b' },
        { label: 'Install (this World)', sequence: '\x1b' },
        { label: 'Install Unit', sequence: '\x1b' },
        { label: 'Job connect', sequence: '\x1b' },
        { label: 'Job disable', sequence: '\x1b' },
        { label: 'Job enable', sequence: '\x1b' },
        { label: 'Job kill', sequence: '\x1b' },
        { label: 'Line', sequence: '\x1b' },
        { label: 'Mark', sequence: '\x1b' },
        { label: 'Modify', sequence: '\x1b' },
    ],
    alt: [
        { label: 'Object', sequence: '\x1b' },
        { label: 'Other Part in place', sequence: '\x1b' },
        { label: 'Other Part', sequence: '\x1b' },
        { label: 'Print', sequence: '\x1b' },
        { label: 'Promote', sequence: '\x1b' },
        { label: 'Propagate', sequence: '\x1b' },
        { label: 'Put', sequence: '\x1b' },
        { label: 'Region', sequence: '\x1b' },
        { label: 'Remove breaks', sequence: '\x1b' },
        { label: 'Run local', sequence: '\x1b' },
        { label: 'Run', sequence: '\x1b' },
        { label: 'Semanticize', sequence: '\x1b' },
    ],
    ctrlShift: [
        { label: 'Show access list', sequence: '\x1b' },
        { label: 'Show breaks', sequence: '\x1b' },
        { label: 'Show errors', sequence: '\x1b' },
        { label: 'Show source', sequence: '\x1b' },
        { label: 'Show unused (unit)', sequence: '\x1b' },
        { label: 'Show unused', sequence: '\x1b' },
        { label: 'Show usage (Unit)', sequence: '\x1b' },
        { label: 'Show usage', sequence: '\x1b' },
        { label: 'Source (this Wolrd)', sequence: '\x1b' },
        { label: 'Source Unit', sequence: '\x1b' },
        { label: 'Stack', sequence: '\x1b' },
        { label: 'Stop', sequence: '\x1b' },
    ],
    ctrlAlt: [
        { label: 'Task display', sequence: '\x1b' },
        { label: 'Underlines off', sequence: '\x1b' },
        { label: 'What load', sequence: '\x1b' },
        { label: 'What locks', sequence: '\x1b' },
        { label: 'What object', sequence: '\x1b' },
        { label: 'What time', sequence: '\x1b' },
        { label: 'What time', sequence: '\x1b' },
        { label: 'What users', sequence: '\x1b' },
        { label: 'Window', sequence: '\x1b' },
        { label: 'Withdraw Unit', sequence: '\x1b' },
        { label: 'Word', sequence: '\x1b' },
    ],
    shiftAlt: [],
};
