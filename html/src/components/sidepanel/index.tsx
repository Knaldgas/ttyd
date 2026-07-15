import { h, Component } from 'preact';
import { loadPFConfig } from './storage';
import type { PFButton, PFConfig } from './config';

interface Props {
    id?: string;
    sendKey: (key: string) => void;
}

interface State {
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    configuring: boolean;
}

export class SidePanel extends Component<Props, State> {
    private config: PFConfig;

    state = {
        shift: false,
        ctrl: false,
        alt: false,
        configuring: false,
    };

    constructor(props: Props) {
        super(props);
        this.config = loadPFConfig();
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('keydown', this.onShortcut, true);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('keydown', this.onShortcut, true);
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
        console.log(mode);
        console.log(index);
    }

    render({ id }: Props) {
        const buttons = this.getButtons();
        const mode = this.getCurrentMode();

        return (
            <div id={id} tabIndex={-1}>
                <button
                    tabIndex={-1}
                    className={this.state.configuring ? 'active' : ''}
                    aria-pressed={this.state.configuring}
                    onMouseDown={e => {
                        e.preventDefault();
                        this.setState({
                            configuring: !this.state.configuring,
                        });
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
            </div>
        );
    }
}
