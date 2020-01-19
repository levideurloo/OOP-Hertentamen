class Garbage extends GameItem {
    // Score you get for the garbage
    private score: number;

    constructor(xPos: number, yPos: number) {
        super('./assets/img/icecream.png', xPos, yPos);
        this.score = 1;
    }

    public getScore(): number {
        return this.score;
    }
}