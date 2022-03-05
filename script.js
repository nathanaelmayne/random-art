let x, y;
let px, py;
let frameCount = 0;
let blendPosition = 0;
let fromColour;
let toColour;
let blendLength = 100;

function setup() {
    createCanvas(windowWidth, windowHeight);

    x = width / 2;
    y = height / 2;
    px = x;
    py = y;

    background(0);
}

function draw() {
    // if (frameCount === 600)
    //     return;

    frameCount++;
    blendPosition++;

    if (frameCount === 1) {
        fromColour = getRandomRgba();
        toColour = getRandomRgba();
    }

    if (isEndOfBlend()) {
        fromColour = toColour;
        toColour = getRandomRgba();
        console.log(`from ${JSON.stringify(fromColour)}`);
        console.log(`to  + ${JSON.stringify(toColour)}`);
        blendPosition = 1;
    }

    const fadeColour = getBlendRgba(blendPosition, 100);

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

    stroke(fadeColour.r, fadeColour.g, fadeColour.b, fadeColour.a);
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

function getBlendRgba(blendPosition, blendLength) {
    const percent = blendPosition / blendLength;

    const r = getBlendValue("r", percent);
    const g = getBlendValue("g", percent);
    const b = getBlendValue("b", percent);
    const a = getBlendValue("a", percent);
    
    return {r, g, b, a};
}

function getBlendValue(colourParam, percent) {
    const from = fromColour[colourParam];
    const to = toColour[colourParam];
    const difference = Math.abs(fromColour.r - toColour.r);

    let value;

    if (from < to)
        value = from + (difference * percent);
    else if (from > to)
        value = from - (difference * percent);
    else
        value = from;

    if (colourParam === "r"){
        console.log(`${frameCount} ${blendPosition} from: ${from} | current: ${value} | to: ${to}`);
    }

    return value;
}

function isEndOfBlend() {
    return blendPosition === blendLength;
}