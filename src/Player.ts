class Player extends GameItem {
    // x Value
    private xVel: number;

    // Y Velue
    private yVel: number;

    // Keyboard listener so the player can move
    private keyboardListener: KeyboardListener;

    constructor(xPos: number, yPos: number, xVel: number, yVel: number) {
        super('./assets/img/character_robot_walk0.png', xPos, yPos);

        this.xVel = xVel;
        this.yVel = yVel;
        this.keyboardListener = new KeyboardListener();
    }

    /**
     * Moves the player depending on which arrow key is pressed. Player is bound
     * to the canvas and cannot move outside of it
     */
    public move(canvas: HTMLCanvasElement): void {
        // Moving right
        if (
            this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT)
            && this.xPos + this.img.width < canvas.width
        ) {
            this.xPos += this.xVel;
        }

        // Moving left
        if (
            this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT)
            && this.xPos > 0
        ) {
            this.xPos -= this.xVel;
        }

        // Moving up
        if (
            this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP)
            && this.yPos > 0
        ) {
            this.yPos -= this.yVel;
        }

        // Moving down
        if (
            this.keyboardListener.isKeyDown(KeyboardListener.KEY_DOWN)
            && this.yPos + this.img.height < canvas.height
        ) {
            this.yPos += this.yVel;
        }
    }

    public isCollidingWith(item: GameItem): boolean {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
            const img = item.getImg();
            if (
                this.xPos < item.getXPos() + img.width &&
                this.xPos + this.img.width > item.getXPos() &&
                this.yPos < item.getYPos() + img.height &&
                this.yPos + img.height > item.getYPos()
            ) {
                return true;
            }
        }
        return false;
    }
}