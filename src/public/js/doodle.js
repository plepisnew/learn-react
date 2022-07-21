const canvas = document.querySelector('#root');
const ctx = canvas.getContext('2d');
const scoreSpan = document.querySelector('.score');

canvas.width = 400;
canvas.height = 600;

let score = 0;

const platformProps = {
    height: 15,
    easyWidth: 150,
    mediumWidth: 120,
    hardWidth: 100,
    extremeWidth: 80,
}

const debug = {
    gravity: 600, // adjust
    frameReport: false,
    platformWidth: platformProps.easyWidth,
    platformHeight: platformProps.height,
    jumperWidth: 32,
    jumperHeight: 32,
    jumperPosX: canvas.width/2,
    jumperPosY: canvas.height/2,
    jumperUnitDx: 250, // adjust
    jumperCollisionDy: 450, // adjust
    cameraUpdateY: 250, // adjust
    platformCount: 11,
    easyScore: 0,
    mediumScore: 2000,
    hardScore: 3000,
    extremeScore: 4000,
}

/**
 * UTILITY FUNCTIONS 
 */

const randomInteger = (floor, ceiling) => {
    return parseInt(Math.random()*(ceiling - floor + 1) + floor);
}

const updateScore = () => {
    scoreSpan.innerHTML = parseInt(score);
}

/**
 * GAME CLASSES
 */

class ImageHandler {

    static getImage(href, w, h) {
        let image = new Image(w, h);
        image.src = href;
        return image;
    }
}

class CollisionHandler {

    static check(sprite1, sprite2) {
        let collidesVertically = sprite1.y + sprite1.h >= sprite2.y && sprite1.y + sprite1.h <= sprite2.y + sprite2.h;
        let collidesHorizontally = sprite1.x + sprite1.w >= sprite2.x && sprite1.x <= sprite2.x + sprite2.w;
        let goingDown = sprite1.dy >= 0;
        if(collidesHorizontally && collidesVertically && goingDown) {
            return {
                occurs: true,
                x: sprite1.x,
                y: sprite1.y + sprite1.h,
            }
        }
        return {
            occurs: false,
        }
    }

}

class InputHandler {

    static leftArrow = false;
    static rightArrow = false;
    
    static setup() {
        window.onkeydown = (e) => {
            if(e.key == 'ArrowLeft') InputHandler.arrowLeft = true;
            if(e.key == 'ArrowRight') InputHandler.arrowRight = true;
            if(e.key == 'r') InputHandler.reset();
        }
        window.onkeyup = (e) => {
            if(e.key == 'ArrowLeft') InputHandler.arrowLeft = false;
            if(e.key == 'ArrowRight') InputHandler.arrowRight = false;
        }
    }

    static updateJumper() {
        if(InputHandler.arrowLeft) jumper.dx = -debug.jumperUnitDx;
        if(InputHandler.arrowRight) jumper.dx = debug.jumperUnitDx;
        if(!InputHandler.arrowLeft && !InputHandler.arrowRight) jumper.dx = 0;
    }

    static reset() {
        jumper = new Jumper(
            debug.jumperPosX,
            debug.jumperPosY,
            debug.jumperWidth,
            debug.jumperHeight,
            0,
            0,
            'white',
        )
        platforms = [...PlatformFactory.first()];
        score = 0;

    }

}

class DifficultyHandler {

    static updatePlatformCount() {
        
        if(score > debug.easyScore) debug.platformCount = 10;
        if(score > debug.mediumScore) debug.platformCount = 9;
        if(score > debug.hardScore) debug.platformCount = 8;
        if(score > debug.extremeScore) debug.platformCount = 7;
    }

    static updatePlatformWidth() {

        if(score > debug.easyScore) debug.platformWidth = platformProps.easyWidth;
        if(score > debug.mediumScore) debug.platformWidth = platformProps.mediumWidth;
        if(score > debug.hardScore) debug.platformWidth = platformProps.hardWidth;
        if(score > debug.extremeScore) debug.platformWidth = platformProps.extremeWidth;

    }

    static updateJumperDy() {

    }
}

class Sprite {

    constructor(x, y, w, h, dx, dy, sprite) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dx = dx;
        this.dy = dy;
        this.sprite = sprite;
        this.image = ImageHandler.getImage(sprite, w, h); 
    }

}

class Jumper extends Sprite {
    
    constructor(x, y, w, h, dx, dy, sprite) {
        super(x, y, w, h, dx, dy, sprite);
        this.sprite = {
            jumpLeft: ImageHandler.getImage('../images/doodle/jumper_jump_left.png', w, h),
            jumpRight: ImageHandler.getImage('../images/doodle/jumper_jump_right.png', w, h),
        }
        this.frameImage = this.sprite.jumpRight;
    }

    update(dt) {
        this.x += this.dx * dt;
        this.y += this.dy * dt;

        this.dy += debug.gravity * dt;

        for(let i = 0; i < platforms.length; i++) {
            let collision = CollisionHandler.check(this, platforms[i]);
            if(collision.occurs) {
                this.y = collision.y - this.h;
                // this.dy = -this.dy * debug.jumperCollisionBoost;
                this.dy = -debug.jumperCollisionDy;
            }
        }

        if(this.y <= debug.cameraUpdateY) {
            let overflow = debug.cameraUpdateY - this.y;
            for(let i = 0; i < platforms.length; i++) {
                platforms[i].y += overflow;                
            }
            this.y += overflow;
            score += overflow;
        }
        
        if(this.y >= canvas.height) {
            let overflow = this.y - canvas.height;
            for(let i = 0; i < platforms.length; i++) {
                platforms[i].y -= overflow;
            }
            this.y -= overflow;
            // this.y = canvas.height/2;
        }
        if(this.x <= 0) this.x = 0;
        if(this.x + this.w >= canvas.width) this.x = canvas.width - this.w;
    }

    render(context) {
        if(this.dx > 0) this.frameImage = this.sprite.jumpRight;
        if(this.dx < 0) this.frameImage = this.sprite.jumpLeft;
        context.drawImage(this.frameImage, this.x, this.y);
    }
}

class Platform extends Sprite {
    
    constructor(x, y , w, h, dx, dy, sprite) {
        super(x, y, w, h, dx, dy, sprite);        
    }

    update(dt) {
        this.y += this.dy * dt;
    }

    render(context) {
        context.drawImage(this.image, this.x, this.y);
    }
}

class PlatformFactory {

    static getPlatformSprite() {
        if(score >= debug.extremeScore) return '../images/doodle/extreme_platform.png';
        if(score >= debug.hardScore) return '../images/doodle/hard_platform.png';
        if(score >= debug.mediumScore) return '../images/doodle/medium_platform.png';
        if(score >= debug.easyScore) return '../images/doodle/easy_platform.png';
    }

    static first() {
        let platforms = [];
        for(let i = 0; i < debug.platformCount; i++) {
            platforms.push(new Platform(
                randomInteger(1, canvas.width - debug.platformWidth - 1),
                (canvas.height/debug.platformCount) * (debug.platformCount - i),
                debug.platformWidth,
                debug.platformHeight,
                0,
                0,
                PlatformFactory.getPlatformSprite()
            ));
        }
        return platforms;
    }

    static next() {
        let gapIndex = canvas.height/debug.platformCount;
        let gap = randomInteger(1*gapIndex, 1.5*gapIndex);
        return new Platform(
            randomInteger(1, canvas.width - debug.platformWidth - 1),
            platforms[platforms.length-1].y - gap,
            debug.platformWidth,
            debug.platformHeight,
            0,
            0,
            PlatformFactory.getPlatformSprite()
        )
    }
}

let platforms = [...PlatformFactory.first()];

let jumper = new Jumper(
    debug.jumperPosX,
    debug.jumperPosY,
    debug.jumperWidth,
    debug.jumperHeight,
    0,
    0,
    '../images/doodle/jumper.png',
)

let frame = 0;
let previousTime = Date.now();

const gameloop = () => {

    clearCanvas(ctx);

    const currentTime = Date.now();
    const dt = (currentTime - previousTime)/1000;
    previousTime = currentTime;

    if(debug.frameReport) console.log(`Frame ${frame} of Game Loop with dt=${dt}s`);

    updateScore();
    handlePlatforms();
    InputHandler.updateJumper();
    DifficultyHandler.updatePlatformCount();
    DifficultyHandler.updatePlatformWidth();
    // DifficultyHandler.updateJumperDy();

    for(let i = 0; i < platforms.length; i++) {
        platforms[i].update(dt);
    }
    jumper.update(dt);

    for(let i = 0; i < platforms.length; i++) {
        platforms[i].render(ctx);
    }
    jumper.render(ctx);

    requestAnimationFrame(gameloop);
    frame++;
}

const init = () => {
    InputHandler.setup();
    gameloop();
}

/**
 * GAME FUCNTIONS
 */

const backgroundImage = ImageHandler.getImage('../images/doodle/background.png', 400, 600);

const clearCanvas = (context) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(backgroundImage, 0, 0);
}

const handlePlatforms = () => {

    if(platforms.length < debug.platformCount) {
        platforms.push(PlatformFactory.next());
    }

    for(let i = 0; i < platforms.length; i++) {
        if(platforms[i].y >= canvas.height) {
            platforms.splice(i, 1);
        }
    }
}

init();