
const canvas = document.querySelector('.background-canvas');
const ctx = canvas.getContext('2d');
var host = env.NODE_ENV == 'production' ? env.HOST : `http://localhost:${env.DEVPORT}`;
var instanceName;

const init = () => {
    introductionAnimation(animationProp);
    runTests(executableTests);
    addListeners();
    resize();
    drawLoop();
    chatLoop();
    assignName();
    addMessages();
}

const debug = {
    bubblesPerFrame: 1,
    floatingCoefficient: 100, // dy = FC/r
    inflatingCoefficient: 200, // dr = (r'-r)/IC
    bubbleAlpha: 0.3,
}

const defaultBubbleProperties = {
    x: canvas.width/2,
    y: canvas.height/2,
    startRadius: 10,
    endRadius: 20,
    color: 'cyan',
}

const user = {
    stopDrawing: false,
    stopBubbles: false,
}

var frame = 0;
var frameRates = [];
var previousTime = 0;
const bubbles = [];
const chatLatencyMillis = 200;

var loadedMessages;
const scrollBar = document.querySelector('.content-scrollbar');
const typingAudio = document.createElement('audio');
typingAudio.src = '/audio/keypress.wav';

const chatLoop = async () => {   
    let messages = await fetch(`${host}/api/messages`);
    messages = await messages.json();
    if(!loadedMessages) loadedMessages = messages.length;
    if(loadedMessages != messages.length) {
        for(let i=loadedMessages; i<messages.length; i++) {
            insertMessage(contentContainer, messages[i].user, messages[i].content);
            loadedMessages++;
        }
        scrollBar.scrollTop = scrollBar.scrollHeight - scrollBar.clientHeight;
    }

    setTimeout(chatLoop, chatLatencyMillis);
}

const drawLoop = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var currentTime = Date.now();

    if(!user.stopDrawing && !user.stopBubbles) {
        first(debug.bubblesPerFrame).forEach(num => {
            spawnBubbles({
                x: randomInteger(0, canvas.width),
                y: canvas.height,
                startRadius: randomInteger(10, 20),
                endRadius: randomInteger(30, 40),
                color: `rgba(${randomInteger(0, 255)},${randomInteger(0, 255)},${randomInteger(0, 255)})`
            });
        });
    }
    
    if(!user.stopBubbles) {
        floatBubbles(bubbles);
        inflateBubbles(bubbles);
    }
    renderBubbles(bubbles);
    if(!user.stopDrawing) {
    }
    // console.log(bubbles.length);
    var elapsedTime = currentTime - previousTime;
    var frameRate = parseInt(1000/elapsedTime);
    frameRates.push(frameRate);
    previousTime = currentTime;
    let frameReport =`Frame #${frame} took ${elapsedTime} ms (fps=${frameRate})`
    let averageFrameRateReport = `Thus far average fps=${average(frameRates)}`;
    frame++;
    requestAnimationFrame(drawLoop);
}

const spawnBubbles = (prop = defaultBubbleProperties) => {
    let bubble = new Bubble(prop.x, prop.y, prop.startRadius, prop.endRadius, prop.color);
    bubbles.push(bubble);
}

const floatBubbles = (floatables) => {
    floatables.forEach(floatable => {
        let radius = floatable.radius;
        let speed = parseInt(debug.floatingCoefficient/radius);
        floatable.float(speed);
        if(floatable.y < -floatable.radius-200) {
            bubbles.splice(bubbles.indexOf(floatable), 1);
        }
    })
}

const renderBubbles = (renderables) => {
    renderables.forEach(renderable => {
        ctx.beginPath();
        ctx.arc(renderable.x, renderable.y, renderable.radius, 0, Math.PI * 2);
        ctx.fillStyle = renderable.color;
        ctx.globalAlpha = debug.bubbleAlpha;
        ctx.fill();
    })
}

const inflateBubbles = (inflatables) => {
    inflatables.forEach(inflatable => {
        let neededToAverage = (inflatable.endRadius - inflatable.radius)/debug.inflatingCoefficient;
        inflatable.inflate(neededToAverage)
    })
}


class Bubble {

    constructor(x, y, startRadius, endRadius, color) {
        this.x = x;
        this.y = y;
        this.radius = startRadius;
        this.startRadius = startRadius;
        this.endRadius = endRadius;
        this.color = color;
    }

    float(dy = 1) {
        this.y -= dy;
    }

    inflate(dr = 1) {
        // this.radius = this.radius;
        if(this.radius + dr < this.endRadius) this.radius += dr;
        // this.radius = this.radius + dr >= this.endRadius ? this.endRadius : this.radius + dr;
    }

}

const playTypingAudio = () => {
    typingAudio.currentTime = 0;
    typingAudio.play();
}

const welcomeText = document.querySelector('.welcome-text');

const animationProp = {
    characterDrawingInterval: 50,
    characterErasingInterval: 40,
    intervalBetweenDrawErase: 1200,
    intervalBetweenWords: 400,
    grammar: [
        'Hello :)',
        `I'm Ansis, an aspiring Web Developer`,
        `I don't know what to say other than check out my projects and social media`,
        'Here are some random words',
    ],
    showUnderscoreAfterDraw: true,
    underscoreDrawCount: 3,
    underscoreDrawInterval: 600,
    underscoreCharacter: ' |',
    randomWordCount: 5,
}

const introductionAnimation = async (prop) => {
    let randomWords = await fetch(host + '/api/words');
    let randomWordsJson = await randomWords.json();
    randomWordsJson.forEach(randomWord => animationProp.grammar.push(randomWord));
    for(let i = 0; i < prop.grammar.length; i++) {
        // maybe set characterErasingInterval inversely proprtional to length
        let word = prop.grammar[i];
        await drawText(welcomeText, word, prop.characterDrawingInterval);
        for(let j = 0; j < prop.underscoreDrawCount; j++) {
            await drawText(welcomeText, prop.underscoreCharacter, prop.underscoreDrawInterval);
            // await sleep();
            await eraseText(welcomeText, prop.underscoreDrawInterval, 1);
        }
        await eraseText(welcomeText, prop.characterErasingInterval);
        await sleep(prop.intervalBetweenWords);
    }
}

const drawText = async (element, text, interval) => {
    let length = text.length;
    for(let i = 0; i < length; i++) {
        element.textContent += text.charAt(i);
        if(text.charAt(i) != ' ') await sleep(interval);
    }
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const eraseText = async (element, interval, eraseLength='all') => {
    let length = element.textContent.length;
    for(let i = length; i > (eraseLength == 'all' ? 0 : length - eraseLength); i--) {
        element.textContent = element.textContent.substring(0, i-1);
        if(element.textContent.charAt(i) != ' ') await sleep(interval);
    }
}


/**
 * Generates random integer in a specified closed interval
 * @param {number} from - Random Integer lower bound (inclusive)
 * @param {number} to - Random Integer upper bound (inclusive)
 * @returns Random number X in [from, to)
 */
const randomInteger = (from, to) => {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

/**
 * Utility method for generating random numbers of different parameters
 */
const inputParser = (input) => {
    let args = input.split(' ');
    switch(args[0]) {
        case 'random':
            args.shift();
            switch(args.length) {
                case 0: // random
                    return Math.random();
                case 1: // random x
                    var count = parseInt(args[0]);
                    var randomNumbers = [];
                    while(count > 0) {
                        randomNumbers.push(Math.random());
                        count--;
                    }
                    return randomNumbers;
                case 2: //random x y
                    return randomInteger(parseInt(args[0]), parseInt(args[1]));
                case 3: // random x y z
                    var count = args[2];
                    var randomNumbers = [];
                    while(count > 0) {
                        randomNumbers.push(randomInteger(parseInt(args[0]), parseInt(args[1])));
                        count--;
                    }
                    return randomNumbers;
            }
            break;
        case 'todo':
            break;
    }
}
/**
 * Generates an array of first natural numbers
 * @param {number} len - length of the array
 * @returns - array of first natural numbers
 */
const first = (len) => {
    let iterable = [];
    for(let i = 0; i < len; i++) {
        iterable.push(i);
    }
    return iterable;
}

const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

/**
 * Tests randomInteger logic: whether returned value is within bounds
 * @param {Object} prop - test properties
 * @param {number} prop.count - number of times to perform test
 * @param {number} prop.lower - lower bound for random integer
 * @param {number} prop.upper - upper bound for random integer 
 */
const randomIntegerTest = (prop = {count: 500, lower: 10, upper: 100}) => {
    for(let i = 0; i < prop.count; i++) {
        let randInt = randomInteger(prop.lower, prop.upper);
        if(randInt >= prop.lower && randInt <= prop.upper) {
            console.log('Test successful!');
        } else {
            console.log('Test failed!');
        }
    }
}

const assignName = async () => {
    let messageRes = `${host}/api/usernames`;
    let usernames = await fetch(messageRes);
    usernames = await usernames.json();
    instanceName = usernames[randomInteger(0, usernames.length-1)];
    console.log(`Your username for this session is ${instanceName}`);
}

const addListeners = () => {

    window.onresize = resize;

    const floatInput = document.querySelector('.float-input');
    floatInput.oninput = () => {
        debug.floatingCoefficient = floatInput.value;
    }
    floatInput.value = debug.floatingCoefficient;

    const inflateInput = document.querySelector('.inflate-input');
    inflateInput.oninput = () => {
        debug.inflatingCoefficient = 550 - inflateInput.value;
    }
    inflateInput.value = 550 - debug.inflatingCoefficient;

    const countInput = document.querySelector('.count-input');
    countInput.oninput = () => {
        debug.bubblesPerFrame = countInput.value;
    }
    countInput.value = debug.bubblesPerFrame;

    const opacityInput = document.querySelector('.opacity-input');
    opacityInput.oninput = () => {
        debug.bubbleAlpha = opacityInput.value/100; //percentage
    }
    opacityInput.value = debug.bubbleAlpha*100;

    const updatingButton = document.querySelector('.updating-button');
    const animationButton = document.querySelector('.animation-button');

    updatingButton.onclick = () => {
        user.stopBubbles = !user.stopBubbles;
        updatingButton.style.backgroundColor = user.stopBubbles ? 'rgb(230, 74, 25)' : 'rgb(21, 101, 192)';
        updatingButton.innerText = user.stopBubbles ? 'UNFREEZE BUBBLES 🥵' : 'FREEZE BUBBLES 🥶';
    }
    animationButton.onclick = () => {
        user.stopDrawing = !user.stopDrawing;
        animationButton.style.backgroundColor = user.stopDrawing ? 'rgb(67, 160, 71)' : 'rgb(198, 40, 40)';
        animationButton.innerText = user.stopDrawing ? 'BUBBLES ON ▶️' : 'BUBBLES OFF ⏸';
        
    }

    const expandChat = document.querySelector('.expand-content');
    const chatbox = document.querySelector('.chatbox');

    expandChat.onclick = () => {
        if(chatbox.classList.contains('open-chatbox')) {
            chatbox.classList.remove('open-chatbox');
            
        } else {
            chatbox.classList.add('open-chatbox');
        }
    }

    const submitButton = document.querySelector('.chat-submit');
    const chatInput = document.querySelector('.chat-input');

    chatInput.onkeypress = (e) => {
        if(e.key === "Enter") {
            submit();
        }
    }
    
    const submit = () => {
        let userInput = chatInput.value;
        if(userInput) {
            chatInput.value = '';
            submitMessage({
                user: instanceName,
                content: userInput,
            });
        }
    }
    submitButton.onclick = submit;

}

const contentContainer = document.querySelector('.content-container');

const addMessages = async () => {
    let messages = await fetch(`${host}/api/messages`);
    messages = await messages.json();
    messages.forEach(message => {
        insertMessage(contentContainer, message.user, message.content);
    });
    scrollBar.scrollTop = scrollBar.scrollHeight - scrollBar.clientHeight;
}

const insertMessage = (contentContainer, user, content) => {
    const msg = document.createElement('p');
    msg.className = 'chat-element';
    msg.innerHTML = `<span class="author">${user}</span>: ${content}`;
    contentContainer.appendChild(msg);
}

const submitMessage = async (message) => {
    let messageRes = `${host}/api/messages`;
    let res = await fetch(messageRes, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: message.content,
            user: message.user,
        })
    })
}

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    defaultBubbleProperties.x = canvas.width/2;
    defaultBubbleProperties.y = canvas.height/2;
}

var executableTests = [
    // randomIntegerTest,
]

const runTests = (tests) => {
    tests.forEach(test => {
        test.apply();
    })
}

init();