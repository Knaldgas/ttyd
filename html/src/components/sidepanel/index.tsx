import { h, Component } from 'preact';
import type { PFConfig } from './config';
import { loadPFConfig, savePFConfig, resetPFConfig } from './storage';
import { ButtonDialog } from './dialog';

interface Props {
    id?: string;
    sendKey: (key: string) => void;
}

interface State {
    configuring: boolean;
    dialog?: {
        mode: 'normal' | 'shift' | 'ctrl' | 'ctrlShift' | 'shiftAlt';
        index: number;
    };
}

const columns = [
    { mode: 'normal', title: 'Normal' },
    { mode: 'shift', title: 'Shift' },
    { mode: 'ctrl', title: 'Ctrl' },
    { mode: 'ctrlShift', title: 'Ctrl+Shift' },
    { mode: 'shiftAlt', title: 'Shift+Alt' },
] as const;

export class SidePanel extends Component<Props, State> {
    private config: PFConfig;

    modes: Array<'normal' | 'shift' | 'ctrl' | 'ctrlShift' | 'shiftAlt'> = [
        'normal',
        'shift',
        'ctrl',
        'ctrlShift',
        'shiftAlt',
    ];

    state: State = {
        configuring: false,
        dialog: undefined,
    };

    constructor(props: Props) {
        super(props);
        this.config = loadPFConfig();
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onShortcut, true);
        window.addEventListener('keydown', this.onEscape);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onShortcut, true);
        window.removeEventListener('keydown', this.onEscape);
    }

    focusTerminal = () => {
        setTimeout(() => {
            window.term?.focus();
        }, 0);
    };

    onShortcut = (e: KeyboardEvent) => {
        if (this.state.dialog) return;

        const buttons = [
            ...this.config.normal,
            ...this.config.shift,
            ...this.config.ctrl,
            ...this.config.ctrlShift,
            ...this.config.shiftAlt,
        ];

        const button = buttons.find(b => {
            const s = b.shortcut;

            if (!s) return false;

            return (
                e.key === s.key &&
                !!e.ctrlKey === !!s.ctrl &&
                !!e.shiftKey === !!s.shift &&
                !!e.altKey === !!s.alt &&
                !!e.metaKey === !!s.meta
            );
        });

        if (button) {
            e.preventDefault();
            e.stopPropagation();
            this.props.sendKey(button.sequence);
        }
    };

    onEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this.closeDialog();
        }
    };

    configureButton(mode: 'normal' | 'shift' | 'ctrl' | 'ctrlShift' | 'shiftAlt', index: number) {
        this.setState({ dialog: { mode, index } }, () => {
            /* dialog takes focus */
        });
    }

    closeDialog = () => {
        this.setState({ dialog: undefined }, () => {
            window.term?.focus();
        });
    };

    toggleConfigure = () => {
        this.setState({ configuring: !this.state.configuring, dialog: undefined });
    };

    saveJson = () => {
        const blob = new Blob([JSON.stringify(this.config, null, 2)], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'ttyd-buttons.json';
        a.click();

        URL.revokeObjectURL(url);
        this.focusTerminal();
    };

    loadJson = () => {
        const input = document.createElement('input');

        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = () => {
            const file = input.files?.[0];
            if (!file) {
                this.focusTerminal();
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                try {
                    this.config = JSON.parse(reader.result as string);
                    savePFConfig(this.config);
                    this.forceUpdate();
                } catch {
                    alert('Invalid button configuration');
                }
                this.focusTerminal();
            };

            reader.readAsText(file);
        };

        input.click();
    };

    resetConfig = () => {
        if (!confirm('Reset all buttons to their default configuration?')) {
            return;
        }

        this.config = resetPFConfig();

        this.setState({
            dialog: undefined,
            configuring: false,
        });

        this.forceUpdate();
        this.focusTerminal();
    };

    render({ id }: Props) {
        const dialog = this.state.dialog;

        return (
            <div
                id={id}
                tabIndex={-1}
                onMouseDown={e => {
                    if (!this.state.dialog) {
                        e.preventDefault();
                    }
                }}
            >
                <button
                    tabIndex={-1}
                    className={this.state.configuring ? 'config-on' : 'config-off'}
                    aria-pressed={this.state.configuring}
                    onMouseDown={e => {
                        e.preventDefault();
                        this.toggleConfigure();
                    }}
                >
                    ⚙ Configure buttons
                </button>
                {this.state.configuring && (
                    <div>
                        <button
                            tabIndex={-1}
                            onMouseDown={e => {
                                e.preventDefault();
                                this.saveJson();
                            }}
                        >
                            Save to json
                        </button>

                        <button
                            tabIndex={-1}
                            onMouseDown={e => {
                                e.preventDefault();
                                this.loadJson();
                            }}
                        >
                            Load from json
                        </button>

                        <button
                            tabIndex={-1}
                            onMouseDown={e => {
                                e.preventDefault();
                                this.resetConfig();
                            }}
                        >
                            Reset to default
                        </button>
                    </div>
                )}
                <div className="pf-grid">
                    {columns.map(({ mode, title }) => (
                        <div className="pf-column">
                            <div className="pf-header">{title}</div>
                            {this.config[mode]
                                .map((button, index) => ({ button, index }))
                                .filter(({ button }) => this.state.configuring || !button.hidden)
                                .map(({ button, index }) => (
                                    <button
                                        className={index % 4 === 0 ? 'pf-group-first' : 'pf-group-other'}
                                        tabIndex={-1}
                                        onMouseDown={e => {
                                            e.preventDefault();

                                            if (this.state.configuring) {
                                                this.configureButton(mode, index);
                                            } else {
                                                this.props.sendKey(button.sequence);
                                            }
                                        }}
                                    >
                                        {button.label === '' ? '_' : button.label}
                                    </button>
                                ))}
                        </div>
                    ))}
                </div>
                {dialog && (
                    <ButtonDialog
                        key={`${dialog.mode}:${dialog.index}`}
                        title={'Reconfigure ' + this.config[dialog.mode][dialog.index].label}
                        button={this.config[dialog.mode][dialog.index]}
                        onSave={button => {
                            this.config[dialog.mode][dialog.index] = button;
                            savePFConfig(this.config);

                            this.closeDialog();
                            this.forceUpdate();
                        }}
                        onCancel={() => {
                            this.closeDialog();
                        }}
                    />
                )}
            </div>
        );
    }
}
