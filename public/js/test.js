
const canvas = document.querySelector('.drawing-canvas');
const ctx = canvas.getContext('2d');
const thickness = 20;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
var drawMode = false;

mouse = {
    click: false,
    x: undefined,
    y: undefined,
}

const drawLoop = () => {

    handleDrawing();
    requestAnimationFrame(drawLoop);
}

const handleDrawing = () => {
    if(drawMode) drawCircleAt(mouse.x, mouse.y);
}

canvas.onmousedown = (e) => {
    mouse.click = true;
}

canvas.onmouseup = (e) => {
    mouse.click = false;
}
window.onmousemove = (e) => {
    if(drawMode && mouse.click) {
        mouse.x = e.x;
        mouse.y = e.y;
    }
}

const drawCircleAt = (x, y) => {
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x, y, thickness, 0, Math.PI*2);
    ctx.fill();
}

window.onkeydown = (e) => {
    drawMode = e.key == 'd' ? !drawMode : drawMode;
    let dummy = e.key == 'c' ? ctx.clearRect(0, 0, canvas.width, canvas.height) : '';
}

drawLoop();