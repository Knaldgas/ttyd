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
    hidden?: boolean;
}

export interface PFConfig {
    normal: PFButton[];
    shift: PFButton[];
    ctrl: PFButton[];
    ctrlShift: PFButton[];
    shiftAlt: PFButton[];
}

export const defaultPFConfig: PFConfig = {
    normal: [
        { label: 'Run', sequence: '\x1b[O1', shortcut: { key: 'F1' } },
        { label: 'Show source', sequence: '\x1b[O2' },
        { label: 'Put', sequence: '\x1b[O3' },
        { label: 'Definition', sequence: '\x1b[O4' },
        //
        { label: 'Help on help', sequence: '\x1b[O5' },
        { label: 'Install Unit', sequence: '\x1b[O6' },
        { label: 'Edit', sequence: '\x1b[O7' },
        { label: 'Create command', sequence: '\x1b[O8' },
        //
        { label: 'Other Part', sequence: '\x1b[O9' },
        { label: 'Semanticize', sequence: '\x1b[O:' },
        { label: 'Print', sequence: '\x1b[O;' },
        { label: 'What time', sequence: '\x1b[O<' },
        //
        { label: 'Image', sequence: '\x1b[OP' },
        { label: 'Line', sequence: '\x1b[OQ' },
        { label: 'Word', sequence: '\x1b[OR' },
        { label: 'Mark', sequence: '\x1b[OS' },
    ],
    shift: [
        { label: 'Execute', sequence: '\x1b[Oa' },
        { label: 'Break', sequence: '\x1b[Ob' },
        { label: 'Catch', sequence: '\x1b[Oc' },
        { label: 'Definition in place', sequence: '\x1b[Od' },
        //
        { label: 'Help', sequence: '\x1b[Oe' },
        { label: 'Code Unit', sequence: '\x1b[Of' },
        { label: 'Demote', sequence: '\x1b[Og' },
        { label: 'Create Body', sequence: '\x1b[Oh' },
        //
        { label: 'Other Part in place', sequence: '\x1b[Oi' },
        { label: 'Show errors', sequence: '\x1b[Oj' },
        { label: 'Job enable', sequence: '\x1b[Ok' },
        { label: 'What load', sequence: '\x1b[O/' },
        //
        { label: 'Object', sequence: '\x1b[[L' },
        { label: 'Region', sequence: '\x1b[[M' },
        { label: 'Window', sequence: '\x1b[[K' },
        { label: '', sequence: '\x1b[', hidden: true },
    ],
    ctrl: [
        { label: 'Stop', sequence: '\x1b[OE' },
        { label: 'Remove breaks', sequence: '\x1b[OF' },
        { label: 'Stack', sequence: '\x1b[OG' },
        { label: 'Enclosing', sequence: '\x1b[OH' },
        //
        { label: 'Help on key', sequence: '\x1b[OI' },
        { label: 'Code (this World)', sequence: '\x1b[OJ' },
        { label: 'Source Unit', sequence: '\x1b[OK' },
        { label: 'Create text', sequence: '\x1b[OL' },
        //
        { label: 'Show usage', sequence: '\x1b[OM' },
        { label: 'Show unused (unit)', sequence: '\x1b[ON' },
        { label: 'Job kill', sequence: '\x1b[OT' },
        { label: 'What object', sequence: '\x1b[OU' },
        //
        { label: 'Promote', sequence: '\x1b[[4h' },
        { label: 'Complete', sequence: '\x1b[[H' },
        { label: 'Format', sequence: '\x1b[[P' },
        { label: '', sequence: '\x1b[', hidden: true },
    ],
    ctrlShift: [
        { label: 'Run local', sequence: '\x1b\x1b[O1' },
        { label: 'Activate', sequence: '\x1b\x1b[O2' },
        { label: 'Propagate', sequence: '\x1b\x1b[O3' },
        { label: 'Enclosing Library', sequence: '\x1b\x1b[O4' },
        //
        { label: 'Help window', sequence: '\x1b\x1b[O5' },
        { label: 'Install (this World)', sequence: '\x1b\x1b[O6' },
        { label: 'Source (this World)', sequence: '\x1b\x1b[O7' },
        { label: 'Create Directory', sequence: '\x1b\x1b[O8' },
        //
        { label: 'Show usage (Unit)', sequence: '\x1b\x1b[O9' },
        { label: 'Underlines off', sequence: '\x1b\x1b[O:' },
        { label: 'Job connect', sequence: '\x1b\x1b[O;' },
        { label: 'What users', sequence: '\x1b\x1b[O<' },
        //
        { label: '', sequence: '\x1b[', hidden: true },
        { label: '', sequence: '\x1b[', hidden: true },
        { label: '', sequence: '\x1b[', hidden: true },
        { label: '', sequence: '\x1b[', hidden: true },
    ],
    shiftAlt: [
        { label: 'Task display', sequence: '\x1b\x1b[OE' },
        { label: 'Show breaks', sequence: '\x1b\x1b[OF' },
        { label: 'Modify', sequence: '\x1b\x1b[OG' },
        { label: 'Enclosing in place', sequence: '\x1b\x1b[OH' },
        //
        { label: 'Show access list', sequence: '\x1b\x1b[OI' },
        { label: 'Code (all Worlds)', sequence: '\x1b\x1b[OJ' },
        { label: 'Withdraw Unit', sequence: '\x1b\x1b[OK' },
        { label: 'Create World', sequence: '\x1b\x1b[OL' },
        //
        { label: 'Create Private', sequence: '\x1b\x1b[OM' },
        { label: 'Show unused', sequence: '\x1b\x1b[ON' },
        { label: 'Job disable', sequence: '\x1b\x1b[OT' },
        { label: 'What locks', sequence: '\x1b\x1b[OU' },
        //
        { label: '', sequence: '\x1b[', hidden: true },
        { label: '', sequence: '\x1b[', hidden: true },
        { label: '', sequence: '\x1b[', hidden: true },
        { label: '', sequence: '\x1b[', hidden: true },
    ],
};
