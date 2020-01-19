class Egg {
    // Score of the egg
    private score: number;

    public constructor(xPos: number, yPos: number) {
        // super('./assets/img/egg.png', xPos, yPos);
        this.score = -5;
    }

    public getScore(): number {
        return this.score;
    }
}