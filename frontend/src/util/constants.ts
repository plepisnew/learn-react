/**
 * Bubble behavior options
 */
export const bubbles = {
    /**
     * How fast bubbles float
     */
    floatation: 100,
    /**
     * How fast bubbles inflate (increase radius)
     */
    inflation: 200,
    /**
     * Number of spawned bubbles every framesPerSpawn frames
     */
    count: 1,
    /**
     * Bubble fill opacity (alpha channnel) in percentage
     */
    opacity: 30,
    /**
     * Smallest initial radius of a bubble
     */
    radiusFloor: 20,
    /**
     * Greatest initial radius of a bubbble
     */
    radiusCeiling: 40,
    /**
     * Smallest increase in bubble radius by inflation
     */
    inflationDifferenceFloor: 10,
    /**
     * Greatest increase in bubble radius by inflation
     */
    inflationDifferenceCeiling: 20,
    /**
     * Number of frames after which new bubbles are spawned
     */
    framesPerSpawn: 1,
};

/**
 * Welcome text options
 */
export const welcome = {
    /**
     * Delay in miliseconds after which a character is appended
     */
    appendMillis: 50,
    /**
     * Delay in miliseconds after which a character is deleted
     */
    eraseMillis: 50,
    /**
     * Delay in miliseconds between new words being written
     */
    newWordMillis: 500,
    /**
     * Delay in miliseconds before word is erased after being written
     */
    drawEraseMillis: 500,
    /**
     * Caret character (text cursor)
     */
    flashingCharacter: '_',
    /**
     * Number of caret blinks between drawing and erasing a word
     */
    flashingCount: 3,
    /**
     * Time in miliseconds spent blinking the caret
     */
    flashingDelayMillis: 1500,
    /**
     * Number of random words to display (words are chosen from data/randomWords.json)
     */
    wordCount: 10,
    /**
     * Array of words to be placed before the random words
     */
    intro: [
        "Welcome; I'm Ansis, an aspiring Web Developer",
        "Since you're here, you may as well check out my projects",
        'Anyways, here are some random words:',
    ],
};

/**
 * Chat options
 */
export const chat = {
    /**
     * Delay in miliseconds between message fetches
     */
    latencyMillis: 250,
    /**
     * GET endpoint for messages (localhost in development)
     */
    messagesUrl: `${
        import.meta.env.DEV
            ? `http://localhost:${import.meta.env.VITE_PORT}`
            : ''
    }${import.meta.env.VITE_MESSAGES}`,
};

export const math = {
    /**
     * Array of valid variable names
     */
    validVariableNames:
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    /**
     * Order of execution for Mathematical operators (PEMDAS)
     */
    precedence: ['()', '^', '*', '/', '+', '-'],
};

export const tetris = {
    /**
     * Size of a single cell block in pixels
     */
    cellSize: 30,
    /**
     * Number of rows in the tetris canvas
     */
    rows: 20,
    /**
     * Number of columns in the tetris canvas
     */
    cols: 10,
    /**
     * Messes up each piece's center of rotation
     */
    cancerMode: false,
    /**
     * Turns all tetris pieces black
     */
    shadowMode: false,
    /**
     * Attempting to move down when a piece cannot will automatically place the piece
     */
    placeOnMoveDown: false,
    /**
     * Opacity (alpha channel) of a tetris piece's projection
     */
    projectionOpacity: 0.4,
    /**
     * Number of frames until piece continues falling down after piece rotation
     */
    rotationDelay: 100,
    /**
     * Number of frames to wait before continuing moving a piece after the initial keypress
     */
    keyPressFrameDelay: 10,
    /**
     * Number of frames after which key events are handled
     */
    framesPerKeyHandle: 1,
    /**
     * Time in milliseconds between tetris piece fall-downs
     */
    fallInterval: 2000,
    /**
     * Number of tiles to move tetris pieces to the right on spawn
     */
    moveRightOnSpawn: 3,
};

/**
 * User Interface options
 */
export const ui = {
    header: {
        height: '5vw',
        titleFontSize: '2.4vw',
        navFontSize: '1.4vw',
    },
    sidebar: {
        width: '300px',
        borderWidth: '1px',
    },
};

/**
 * Transitioning Canvas options
 */
export const transition = {
    /**
     * Number of frames to wait before clearing the canvas
     */
    sleepFrames: 24,
    /**
     * Number of columns in which to split tiles of equal length
     */
    columns: 20,
};

export const capybara = {
    /**
     * Source of Capybara image
     */
    src: '/images/game/capybara_11.png',
    /**
     * Number of frames in the image
     */
    frames: 11,
    /**
     * Number of loop frames per single capybara frame
     */
    frameSkip: 5,
};
