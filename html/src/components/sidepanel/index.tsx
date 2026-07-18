import { h, Component } from 'preact';
import type { PFButton, PFConfig } from './config';
import { loadPFConfig, savePFConfig, resetPFConfig } from './storage';
import { ButtonDialog } from './dialog';

interface Props {
    id?: string;
    sendKey: (key: string) => void;
}

interface State {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    configuring: boolean;
    dialog?: {
        mode: 'normal' | 'shift' | 'ctrl' | 'alt' | 'ctrlShift' | 'ctrlAlt' | 'shiftAlt';
        index: number;
    };
}

export class SidePanel extends Component<Props, State> {
    private config: PFConfig;

    state: State = {
        shift: false,
        ctrl: false,
        alt: false,
        configuring: false,
        dialog: undefined,
    };

    constructor(props: Props) {
        super(props);
        this.config = loadPFConfig();
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('keydown', this.onShortcut, true);
        window.addEventListener('keydown', this.onEscape);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('keydown', this.onShortcut, true);
        window.removeEventListener('keydown', this.onEscape);
    }

    focusTerminal = () => {
        setTimeout(() => {
            window.term?.focus();
        }, 0);
    };

    onKeyDown = (e: KeyboardEvent) => {
        this.setState({
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
        });
    };

    onKeyUp = (e: KeyboardEvent) => {
        this.setState({
            shift: e.shiftKey,
            ctrl: e.ctrlKey,
            alt: e.altKey,
        });
    };

    onShortcut = (e: KeyboardEvent) => {
        if (this.state.dialog) return;

        const buttons = [...this.config.normal, ...this.config.shift, ...this.config.ctrl, ...this.config.alt];

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
            this.setState({ dialog: undefined }, () => {
                window.term?.focus();
            });
        }
    };

    getCurrentMode(): 'normal' | 'shift' | 'ctrl' | 'alt' | 'ctrlShift' | 'ctrlAlt' | 'shiftAlt' {
        const { shift, ctrl, alt } = this.state;

        if (ctrl && shift) return 'ctrlShift';
        if (ctrl && alt) return 'ctrlAlt';
        if (shift && alt) return 'shiftAlt';
        if (ctrl) return 'ctrl';
        if (shift) return 'shift';
        if (alt) return 'alt';

        return 'normal';
    }

    getButtons(): PFButton[] {
        return this.config[this.getCurrentMode()];
    }

    configureButton(mode: 'normal' | 'shift' | 'ctrl' | 'alt' | 'ctrlShift' | 'ctrlAlt' | 'shiftAlt', index: number) {
        this.setState({ dialog: { mode, index } });
    }

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
        const buttons = this.getButtons();
        const mode = this.getCurrentMode();
        const dialog = this.state.dialog;

        return (
            <div id={id} tabIndex={-1} onMouseDown={e => e.preventDefault()}>
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
                            Save json
                        </button>

                        <button
                            tabIndex={-1}
                            onMouseDown={e => {
                                e.preventDefault();
                                this.loadJson();
                            }}
                        >
                            Load json
                        </button>

                        <button
                            tabIndex={-1}
                            onMouseDown={e => {
                                e.preventDefault();
                                this.resetConfig();
                            }}
                        >
                            To default
                        </button>
                    </div>
                )}
                {buttons.map((button, index) => (
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
                        {button.label}
                    </button>
                ))}
                {dialog && (
                    <ButtonDialog
                        key={`${dialog.mode}:${dialog.index}`}
                        title={'Reconfigure ' + this.config[dialog.mode][dialog.index].label}
                        button={this.config[dialog.mode][dialog.index]}
                        onSave={button => {
                            this.config[dialog.mode][dialog.index] = button;
                            savePFConfig(this.config);

                            this.setState({ dialog: undefined }, () => {
                                window.term?.focus();
                            });
                            this.forceUpdate();
                        }}
                        onCancel={() => {
                            this.setState({ dialog: undefined }, () => {
                                window.term?.focus();
                            });
                        }}
                    />
                )}
            </div>
        );
    }
}
