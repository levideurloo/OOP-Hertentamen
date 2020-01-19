class Game {
    // Necessary canvas attributes
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    private score: number;
    // Player
    private player: Player; //TODO switch to correct type

    // Game items (Garbage and eggs)
    private gameItems: GameItem[];

    // Eggs (the player needs to leave these be)
    private eggs: any[]; // TODO switch to correct type

    // Amount of frames until the next item
    private countUntilNextItem: number;
    private keyboardListener: KeyboardListener;


    /**
     * Initialize the game
     *
     * @param {HTMLCanvasElement} canvas - The canvas element that the game
     * should be rendered upon
     */
    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.score = 0;
        this.gameItems = [];
        this.eggs = [];
        this.keyboardListener = new KeyboardListener();

        // Create garbage items
        for (let i = 0; i < this.randomNumber(3, 10); i++) {
            // Create a new Garbage object
            const garbage = new Garbage(this.randomNumber(0, this.canvas.width - 32), this.randomNumber(0, this.canvas.height - 32));

            // Add the object to the game items array
            this.gameItems.push(garbage);
        }

        // Create eggs
        for (let i = 0; i < this.randomNumber(1, 5); i++) {
            this.eggs.push({
                img: this.loadNewImage("./assets/img/egg.png"),
                xPos: this.randomNumber(0, this.canvas.width - 50),
                yPos: this.randomNumber(0, this.canvas.height - 64),
            });
        }

        // Create player object
        const player = new Player(this.randomNumber(0, this.canvas.width - 76), this.randomNumber(0, this.canvas.height - 92), 3, 3);

        // Set player object
        this.player = player;

        // Take about 5 seconds on a decent computer to show next item
        this.countUntilNextItem = 300;

        // Start the game cycle
        this.loop();
    }

    /**
     * Game cycle, basically loop that keeps the game running. It contains all
     * the logic needed to draw the individual frames.
     */
    private loop = () => {
        // Clear the screen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Move the player
        this.player.move(this.canvas);

        // Draw everything
        this.draw();

        // Player cleans up garbage
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
            this.pickUpEgg();
        }

        this.gameItems = this.gameItems.filter((item) => {
            if (this.player.isCollidingWith(item)) {
                // change the score
                this.score = (this.score + 1);
                return null;
            } else {
                return item;
            }
         });

        // Show score
        this.writeTextToCanvas("Score: " + this.score, 36, 120, 50);

        // Create new items if necessary
        if (this.countUntilNextItem === 0) {
            const choice = this.randomNumber(0, 10);

            if (choice < 5) {
                const garbage = new Garbage(this.randomNumber(0, this.canvas.width - 32), this.randomNumber(0, this.canvas.height - 32));
                this.gameItems.push(garbage);

            } else {
                // const egg = new Egg(this.randomNumber(0, this.canvas.width - 50), this.randomNumber(0, this.canvas.height - 64));
                // this.gameItems.push(egg);
                this.eggs.push({
                    img: this.loadNewImage("./assets/img/egg.png"),
                    xPos: this.randomNumber(0, this.canvas.width - 50),
                    yPos: this.randomNumber(0, this.canvas.height - 64),
                });
            }

            // Reset the timer with a count between 2 and 4 seconds on a
            // decent computer
            this.countUntilNextItem = this.randomNumber(120, 240);
        }

        // Lower the count until the next item with 1
        this.countUntilNextItem--;

        // Make sure the game actually loops
        requestAnimationFrame(this.loop);
    }

    /**
     * Draw all the necessary items to the screen
     */
    private draw() {
        this.gameItems.forEach((item: GameItem) => {
            this.ctx.drawImage(item.getImg(), item.getXPos(), item.getYPos());
        });

        this.eggs.forEach((element) => {
            this.ctx.drawImage(element.img, element.xPos, element.yPos);
        });

        this.player.draw(this.ctx);
    }

    /**
     * Removes eggs from the game based on box collision detection.
     *
     * NOTE: We use a filter command in this method. A filter is basically a
     * for-loop that returns a new array. It does so by comparing every element
     * of the array with a given check. In this case, that is the collision
     * detection algorithm in the if-statement.
     *
     * If we have a collision, that means the players is standing on top of an
     * egg and therefore, it needs to be removed from the array.
     * The filter command does this for us, but it's a bit paradoxical since
     * we don't do anything in the if-statement. We only return elements in the
     * else-statement.
     *
     * By not returning an egg we have collision with to the new array, and
     * returning eggs we don't have a collision with, we effectively remove
     * elements from the array. Try to do this as a mental exercise with only
     * two elements in the array. You have collision with the first, but not
     * with the second element. What does the if-statement do for the
     * individual elements?
     *
     * Read for more info: https://alligator.io/js/filter-array-method/
     */
    private pickUpEgg() {
        this.eggs = this.eggs.filter((element) => {
            if (
                this.player.getXPos() < element.xPos + element.img.width &&
                this.player.getXPos() + this.player.getImg().width > element.xPos &&
                this.player.getYPos() < element.yPos + element.img.height &&
                this.player.getYPos() + this.player.getImg().height > element.yPos
            ) {
                this.score = (this.score -5);
            } else {
                return element;
            }
        });
    }

    /**
     * Writes text to the canvas
     * @param {string} text - Text to write
     * @param {number} fontSize - Font size in pixels
     * @param {number} xCoordinate - Horizontal coordinate in pixels
     * @param {number} yCoordinate - Vertical coordinate in pixels
     * @param {string} alignment - Where to align the text
     * @param {string} color - The color of the text
     */
    private writeTextToCanvas(
        text: string,
        fontSize: number = 20,
        xCoordinate: number,
        yCoordinate: number,
        alignment: CanvasTextAlign = "center",
        color: string = "white",
    ) {
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = alignment;
        this.ctx.fillText(text, xCoordinate, yCoordinate);
    }

    /**
     * Method to load an image
     * @param {HTMLImageElement} source
     * @return HTMLImageElement - returns an image
     */
    private loadNewImage(source: string): HTMLImageElement {
        const img = new Image();
        img.src = source;
        return img;
    }

    /**
     * Returns a random number between min and max
     * @param {number} min - lower boundary
     * @param {number} max - upper boundary
     */
    private randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min) + min);
    }
}

/**
 * Start the game whenever the entire DOM is loaded
 */
let init = () => new Game(document.getElementById("canvas") as HTMLCanvasElement);

// Add EventListener to load the game whenever the browser is ready
window.addEventListener("load", init);
