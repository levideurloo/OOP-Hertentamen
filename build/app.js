class Egg {
    constructor(xPos, yPos) {
        this.score = -5;
    }
    getScore() {
        return this.score;
    }
}
class Game {
    constructor(canvas) {
        this.loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.player.move(this.canvas);
            this.draw();
            if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
                this.pickUpEgg();
            }
            this.gameItems = this.gameItems.filter((item) => {
                if (this.player.isCollidingWith(item)) {
                    this.score = (this.score + 1);
                    return null;
                }
                else {
                    return item;
                }
            });
            this.writeTextToCanvas("Score: " + this.score, 36, 120, 50);
            if (this.countUntilNextItem === 0) {
                const choice = this.randomNumber(0, 10);
                if (choice < 5) {
                    const garbage = new Garbage(this.randomNumber(0, this.canvas.width - 32), this.randomNumber(0, this.canvas.height - 32));
                    this.gameItems.push(garbage);
                }
                else {
                    this.eggs.push({
                        img: this.loadNewImage("./assets/img/egg.png"),
                        xPos: this.randomNumber(0, this.canvas.width - 50),
                        yPos: this.randomNumber(0, this.canvas.height - 64),
                    });
                }
                this.countUntilNextItem = this.randomNumber(120, 240);
            }
            this.countUntilNextItem--;
            requestAnimationFrame(this.loop);
        };
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.score = 0;
        this.gameItems = [];
        this.eggs = [];
        this.keyboardListener = new KeyboardListener();
        for (let i = 0; i < this.randomNumber(3, 10); i++) {
            const garbage = new Garbage(this.randomNumber(0, this.canvas.width - 32), this.randomNumber(0, this.canvas.height - 32));
            this.gameItems.push(garbage);
        }
        for (let i = 0; i < this.randomNumber(1, 5); i++) {
            this.eggs.push({
                img: this.loadNewImage("./assets/img/egg.png"),
                xPos: this.randomNumber(0, this.canvas.width - 50),
                yPos: this.randomNumber(0, this.canvas.height - 64),
            });
        }
        const player = new Player(this.randomNumber(0, this.canvas.width - 76), this.randomNumber(0, this.canvas.height - 92), 3, 3);
        this.player = player;
        this.countUntilNextItem = 300;
        this.loop();
    }
    draw() {
        this.gameItems.forEach((item) => {
            this.ctx.drawImage(item.getImg(), item.getXPos(), item.getYPos());
        });
        this.eggs.forEach((element) => {
            this.ctx.drawImage(element.img, element.xPos, element.yPos);
        });
        this.player.draw(this.ctx);
    }
    pickUpEgg() {
        this.eggs = this.eggs.filter((element) => {
            if (this.player.getXPos() < element.xPos + element.img.width &&
                this.player.getXPos() + this.player.getImg().width > element.xPos &&
                this.player.getYPos() < element.yPos + element.img.height &&
                this.player.getYPos() + this.player.getImg().height > element.yPos) {
                this.score = (this.score - 5);
            }
            else {
                return element;
            }
        });
    }
    writeTextToCanvas(text, fontSize = 20, xCoordinate, yCoordinate, alignment = "center", color = "white") {
        this.ctx.font = `${fontSize}px sans-serif`;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = alignment;
        this.ctx.fillText(text, xCoordinate, yCoordinate);
    }
    loadNewImage(source) {
        const img = new Image();
        img.src = source;
        return img;
    }
    randomNumber(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
}
let init = () => new Game(document.getElementById("canvas"));
window.addEventListener("load", init);
class GameItem {
    constructor(imgSrc, xPos, yPos) {
        this.img = this.createImage(imgSrc),
            this.xPos = xPos,
            this.yPos = yPos;
    }
    draw(ctx) {
        ctx.drawImage(this.img, this.xPos, this.yPos);
    }
    createImage(source) {
        const img = new Image();
        img.src = source;
        return img;
    }
    getImg() {
        return this.img;
    }
    getXPos() {
        return this.xPos;
    }
    getYPos() {
        return this.yPos;
    }
}
class Garbage extends GameItem {
    constructor(xPos, yPos) {
        super('./assets/img/icecream.png', xPos, yPos);
        this.score = 1;
    }
    getScore() {
        return this.score;
    }
}
class KeyboardListener {
    constructor() {
        this.keyDown = (ev) => {
            this.keyCodeStates[ev.keyCode] = true;
        };
        this.keyUp = (ev) => {
            this.keyCodeStates[ev.keyCode] = false;
        };
        this.keyCodeStates = new Array();
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }
    isKeyDown(keyCode) {
        return this.keyCodeStates[keyCode] === true;
    }
}
KeyboardListener.KEY_SPACE = 32;
KeyboardListener.KEY_LEFT = 37;
KeyboardListener.KEY_UP = 38;
KeyboardListener.KEY_RIGHT = 39;
KeyboardListener.KEY_DOWN = 40;
class Player extends GameItem {
    constructor(xPos, yPos, xVel, yVel) {
        super('./assets/img/character_robot_walk0.png', xPos, yPos);
        this.xVel = xVel;
        this.yVel = yVel;
        this.keyboardListener = new KeyboardListener();
    }
    move(canvas) {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_RIGHT)
            && this.xPos + this.img.width < canvas.width) {
            this.xPos += this.xVel;
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_LEFT)
            && this.xPos > 0) {
            this.xPos -= this.xVel;
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_UP)
            && this.yPos > 0) {
            this.yPos -= this.yVel;
        }
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_DOWN)
            && this.yPos + this.img.height < canvas.height) {
            this.yPos += this.yVel;
        }
    }
    isCollidingWith(item) {
        if (this.keyboardListener.isKeyDown(KeyboardListener.KEY_SPACE)) {
            const img = item.getImg();
            if (this.xPos < item.getXPos() + img.width &&
                this.xPos + this.img.width > item.getXPos() &&
                this.yPos < item.getYPos() + img.height &&
                this.yPos + img.height > item.getYPos()) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=app.js.map