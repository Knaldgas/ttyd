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
}

export class SidePanel extends Component<Props, State> {
    private config: PFConfig;

    state = {
        shift: false,
        ctrl: false,
        alt: false,
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

    getButtons(): PFButton[] {
        const { shift, ctrl, alt } = this.state;

        if (ctrl) return this.config.ctrl;
        if (shift) return this.config.shift;
        if (alt) return this.config.alt;

        return this.config.normal;
    }

    render({ id }: Props) {
        const buttons = this.getButtons();

        return (
            <div id={id} tabindex={-1}>
                {buttons.map(button => (
                    <button
                        tabIndex={-1}
                        onMouseDown={e => {
                            e.preventDefault();
                            this.props.sendKey(button.sequence);
                        }}
                    >
                        {button.label}
                    </button>
                ))}
            </div>
        );
    }
}
