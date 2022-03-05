let x, y;
let px, py;
let frameCount = 0;
let blendPosition = 0;
let fromColour;
let toColour;
let blendLength = 0;
let pause = false;
let fromStrokeWeight = 1;
let toStrokeWeight = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);

    x = width / 2;
    y = height / 2;
    px = x;
    py = y;

    background(0);
    setupEventListeners();
}

function setupEventListeners() {
    document.addEventListener("keypress", (event) => {
        if (event.key === "p")
            pause = !pause;
    })
}

function draw() {
    if (pause)
        return;

    frameCount++;
    blendPosition++;

    if (frameCount === 1) {
        fromColour = getRandomRgba();
        toColour = getRandomRgba();
        toStrokeWeight = Math.floor(random(1, 10));
        blendLength = Math.floor(random(50, 1000));
    }

    if (isEndOfBlend()) {
        fromColour = toColour;
        toColour = getRandomRgba();
        blendLength = Math.floor(random(50, 1000));
        blendPosition = 1;
        fromStrokeWeight = toStrokeWeight;
        toStrokeWeight = Math.floor(random(1, 10));
    }

    const percent = blendPosition / blendLength;
    const blendColour = getBlendRgba(blendPosition, percent);
    const blendStrokeWeight = getBlendStrokeWeight(percent);

    x += (noise(frameCount * 0.01) - 0.5) * 10;
    y += (noise(frameCount * 0.02) - 0.5) * 10;

    if (x > width) {
        px = x = 0;
    }
    if (x < 0) {
        px = x = width;
    }
    if (y > height) {
        py = y = 0;
    }
    if (y < 0) {
        py = y = height;
    }

    strokeWeight(blendStrokeWeight);
    stroke(blendColour.r, blendColour.g, blendColour.b, blendColour.a);
    line(x, y, px, py);

    px = x;
    py = y;
}

function getRandomRgba() {
    r = random(255);
    g = random(255);
    b = random(255);
    a = random(150, 255);

    return {r, b, g, a}
}

function getBlendRgba(blendPosition, percent) {
    const r = getBlendValue("r", percent);
    const g = getBlendValue("g", percent);
    const b = getBlendValue("b", percent);
    const a = getBlendValue("a", percent);

    console.log(`${frameCount} ${blendPosition} r: ${r} | g: ${g} | b: ${b} | a: ${a}`);
    
    return {r, g, b, a};
}

function getBlendValue(colourParam, percent) {
    const from = fromColour[colourParam];
    const to = toColour[colourParam];
    const difference = Math.abs(from - to);

    return calculateBlendValue(from, to, difference, percent);
}

function getBlendStrokeWeight(percent) {
    const difference = Math.abs(fromStrokeWeight - toStrokeWeight);
    return Math.floor(calculateBlendValue(fromStrokeWeight, toStrokeWeight, difference, percent));
}

function calculateBlendValue(from, to, difference, percent) {
    if (from < to)
        return from + (difference * percent);
    else if (from > to)
        return from - (difference * percent);
    else
        return from;
}

function isEndOfBlend() {
    return blendPosition === blendLength;
}