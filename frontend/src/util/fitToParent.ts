/**
 * Forces Canvas element to take up full width and height of the parent and adjusts width and height of the cavnas accordingly.
 * @param canvas Canvas element
 */
const fitToParent = (canvas: HTMLCanvasElement) => {
    // https://stackoverflow.com/questions/10214873/make-canvas-as-wide-and-as-high-as-parent
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
};

export default fitToParent;
