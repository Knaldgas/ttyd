import { h, Component } from 'preact';
import type { PFButton, PFConfig } from './config';
import { loadPFConfig, savePFConfig } from './storage';
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
        mode: 'normal' | 'shift' | 'ctrl' | 'alt';
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
        if (this.state.configuring || this.state.dialog) return;

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
            this.setState({ configuring: false, dialog: undefined });
        }
    };

    getCurrentMode(): 'normal' | 'shift' | 'ctrl' | 'alt' {
        const { shift, ctrl, alt } = this.state;

        if (ctrl) return 'ctrl';
        if (shift) return 'shift';
        if (alt) return 'alt';

        return 'normal';
    }

    getButtons(): PFButton[] {
        return this.config[this.getCurrentMode()];
    }

    configureButton(mode: 'normal' | 'shift' | 'ctrl' | 'alt', index: number) {
        this.setState({ dialog: { mode, index } });
    }

    toggleConfigure = () => {
        this.setState({ configuring: !this.state.configuring, dialog: undefined });
    };

    render({ id }: Props) {
        const buttons = this.getButtons();
        const mode = this.getCurrentMode();
        const dialog = this.state.dialog;

        return (
            <div id={id} tabIndex={-1}>
                <button
                    tabIndex={-1}
                    className={this.state.configuring ? 'active' : ''}
                    aria-pressed={this.state.configuring}
                    onMouseDown={e => {
                        e.preventDefault();
                        this.toggleConfigure();
                    }}
                >
                    Configure Buttons
                </button>
                {buttons.map((button, index) => (
                    <button
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
                        title={'Reconfigure ' + this.config[dialog.mode][dialog.index].label}
                        button={this.config[dialog.mode][dialog.index]}
                        onSave={button => {
                            this.config[dialog.mode][dialog.index] = button;
                            savePFConfig(this.config);

                            this.setState({ dialog: undefined });
                            this.forceUpdate();
                        }}
                        onCancel={() => {
                            this.setState({ dialog: undefined });
                        }}
                    />
                )}
            </div>
        );
    }
}
