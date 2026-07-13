import { h } from 'preact';

console.log('SidePanel module loaded');

interface Props {
    id?: string;
    sendKey: (key: string) => void;
}

export function SidePanel({ id, sendKey }: Props) {
    return (
        <div id={id}>
            <button onClick={() => sendKey('\x1bOP')}>PF1</button>
            <button onClick={() => sendKey('\x1bOQ')}>PF2</button>
            <button onClick={() => sendKey('\x1bOR')}>PF3</button>
            <button onClick={() => sendKey('\x1bOS')}>PF4</button>

            <button onClick={() => sendKey('\x1b]L')}>Insert Line</button>
            <button onClick={() => sendKey('\x1b]l')}>Insert Char</button>

            <button onClick={() => sendKey('\x1b]W')}>Delete Line</button>
            <button onClick={() => sendKey('\x1b]P')}>Delete Char</button>
            <button onClick={() => sendKey('\x1b]K')}>Erase</button>
        </div>
    );
}
