export class Match {
    constructor(
        readonly id: string,
        readonly time: Date,
        readonly moves: string[],
        readonly victor: string,
        readonly redPlayer: string,
        readonly blackPlayer: string,
        ) {}
}