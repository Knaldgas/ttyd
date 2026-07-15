import { h, Component } from 'preact';
import type { PFButton, Shortcut } from './config';

interface Props {
    button: PFButton;
    title: string;
    onSave: (button: PFButton) => void;
    onCancel: () => void;
}

interface State {
    label: string;
    sequence: string;
    shortcut?: Shortcut;
    listening: boolean;
}

export class ButtonDialog extends Component<Props, State> {
    state: State = {
        label: this.props.button.label,
        sequence: this.props.button.sequence,
        shortcut: this.props.button.shortcut,
        listening: false,
    };

    componentDidMount() {
        window.addEventListener('keydown', this.onShortcut);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onShortcut);
    }

    onShortcut = (e: KeyboardEvent) => {
        if (!this.state.listening) return;

        e.preventDefault();
        e.stopPropagation();

        this.setState({
            shortcut: {
                key: e.key,
                ctrl: e.ctrlKey,
                shift: e.shiftKey,
                alt: e.altKey,
                meta: e.metaKey,
            },
            listening: false,
        });
    };

    save = () => {
        this.props.onSave({
            label: this.state.label,
            sequence: this.state.sequence,
            shortcut: this.state.shortcut,
        });
    };

    clearShortcut = () => {
        this.setState({
            shortcut: undefined,
        });
    };

    shortcutText(): string {
        const s = this.state.shortcut;

        if (!s) return 'None';

        return [s.ctrl ? 'Ctrl' : '', s.shift ? 'Shift' : '', s.alt ? 'Alt' : '', s.meta ? 'Meta' : '', s.key]
            .filter(Boolean)
            .join('+');
    }

    render() {
        return (
            <div className="button-dialog">
                <h3>{this.props.title}</h3>

                <label>
                    Label:
                    <input
                        value={this.state.label}
                        onInput={e =>
                            this.setState({
                                label: (e.target as HTMLInputElement).value,
                            })
                        }
                    />
                </label>

                <label>
                    Sequence:
                    <input
                        value={this.state.sequence}
                        onInput={e =>
                            this.setState({
                                sequence: (e.target as HTMLInputElement).value,
                            })
                        }
                    />
                </label>

                <label>
                    Shortcut:
                    <button
                        type="button"
                        onMouseDown={e => {
                            e.preventDefault();
                            this.setState({ listening: true });
                        }}
                    >
                        {this.state.listening ? 'Press shortcut...' : this.shortcutText()}
                    </button>
                    <button
                        type="button"
                        onMouseDown={e => {
                            e.preventDefault();
                            this.clearShortcut();
                        }}
                    >
                        Clear
                    </button>
                </label>

                <div>
                    <button
                        type="button"
                        onMouseDown={e => {
                            e.preventDefault();
                            this.save();
                        }}
                    >
                        Save
                    </button>

                    <button
                        type="button"
                        onMouseDown={e => {
                            e.preventDefault();
                            this.props.onCancel();
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}
