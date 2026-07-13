import React from 'react';

interface Props {
    sendKey: (key: string) => void;
}

export default function SidePanel({ sendKey }: Props) {
    return (
        <div className="side-panel">
            <button onClick={() => sendKey('\x1bOP')}>PF1</button>
            <button onClick={() => sendKey('\x1bOQ')}>PF2</button>
            <button onClick={() => sendKey('\x1bOR')}>PF3</button>
            <button onClick={() => sendKey('\x1bOS')}>PF4</button>
        </div>
    );
}
