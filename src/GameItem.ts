class GameItem {
    // Image of the game item
    protected img: HTMLImageElement;

    // The X-Position of the game item
    protected xPos: number;

    // The Y-position of the game item
    protected yPos: number;

    public constructor(imgSrc: string, xPos: number, yPos: number) {
        this.img = this.createImage(imgSrc),
            this.xPos = xPos,
            this.yPos = yPos
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
    
    /**
     * Method to load an image
     * @param {HTMLImageElement} source
     * @return HTMLImageElement - returns an image
     */
    public createImage(source: string): HTMLImageElement {
        const img = new Image();
        img.src = source;
        return img;
    }

    public getImg(): HTMLImageElement {
        return this.img;
    }

    public getXPos(): number {
        return this.xPos;
    }

    public getYPos(): number {
        return this.yPos;
    }
}