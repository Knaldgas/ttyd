import { h, Component } from 'preact';
import type { PFButton, Shortcut } from './config';
import { decodeSequence, encodeSequence } from './sequence';

interface Props {
    button: PFButton;
    title: string;
    onSave: (button: PFButton) => void;
    onCancel: () => void;
}

interface State {
    label: string;
    sequenceText: string;
    shortcut?: Shortcut;
    listening: boolean;
}

export class ButtonDialog extends Component<Props, State> {
    private sequenceInput?: HTMLInputElement;
    private shortcutButton?: HTMLButtonElement;

    state: State = {
        label: this.props.button.label,
        sequenceText: decodeSequence(this.props.button.sequence),
        shortcut: this.props.button.shortcut,
        listening: false,
    };

    componentDidMount() {
        window.addEventListener('keydown', this.onShortcut);

        setTimeout(() => {
            this.sequenceInput?.focus();
        }, 0);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onShortcut);
    }

    onShortcut = (e: KeyboardEvent) => {
        if (!this.state.listening) return;
        if (e.repeat || e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        // Ignore modifier keys by themselves.
        if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') {
            return;
        }

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
            sequence: encodeSequence(this.state.sequenceText),
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
                        ref={e => (this.sequenceInput = e as HTMLInputElement)}
                        value={this.state.sequenceText}
                        onInput={e => this.setState({ sequenceText: (e.target as HTMLInputElement).value })}
                    />
                </label>

                <label>
                    Shortcut:
                    <div className="shortcut-buttons">
                        <button
                            type="button"
                            onMouseDown={e => {
                                e.preventDefault();
                                this.setState({ listening: true }, () => {
                                    this.shortcutButton?.focus();
                                });
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
                    </div>
                </label>

                <div className="save-cancel-buttons">
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
