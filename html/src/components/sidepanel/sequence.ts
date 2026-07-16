const ESC = String.fromCharCode(27);
const BEL = String.fromCharCode(7);

export function decodeSequence(seq: string): string {
    return seq.split(ESC).join('ESC ').split(BEL).join('BEL ').replace(/\r/g, 'CR ').replace(/\n/g, 'LF ').trim();
}

export function encodeSequence(text: string): string {
    return text.split('ESC ').join(ESC).split('BEL ').join(BEL).split('CR ').join('\r').split('LF ').join('\n');
}
