import { default as file1 } from './move1.mp3';
import { default as file2 } from './move2.mp3';
import { default as file3 } from './move3.mp3';

const Move1 = new Audio(file1);
const Move2 = new Audio(file2);
const Move3 = new Audio(file3);

export function PlayRandomMoveClip() {
    const audios = [Move1, Move2, Move3];
    const rnd = Math.floor(Math.random() * audios.length);

    audios[rnd].play();
}

export { Move1, Move2, Move3 }