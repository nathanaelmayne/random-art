let frameCount = 0;
let blendPosition = 0;
let blendLength = 0;
let freeze = false;
let cleanUp = false;
let stopDrawing = false;
let lines = [];
let pens = [
    {
        lines: [],
    },
];

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    setupEventListeners();
}

function setupEventListeners() {
    document.addEventListener("keypress", (event) => {
        if (event.key === "f") freeze = !freeze;
    });

    document.addEventListener("keypress", (event) => {
        if (event.key === "c") cleanUp = !cleanUp;
    });

    document.addEventListener("keypress", (event) => {
        if (event.key === "s") stopDrawing = !stopDrawing;
    });

    document.addEventListener("keypress", (event) => {
        if (event.key === "a") pens.push({ lines: [] });
    });

    document.addEventListener("keypress", (event) => {
        if (event.key === "r") pens.splice(pens.length - 1, 1);
    });
}

function draw() {
    if (freeze) return;

    if (cleanUp)
        pens.forEach(p => p.lines.splice(0, 1));

    frameCount++;

    if (!stopDrawing) {
        pens.forEach((pen) => {
            createLine(pen);
        });
    }

    background(0);

    pens.flatMap(pen => pen.lines)
        .forEach(l => {
            strokeWeight(l.strokeWeight);
            stroke(l.colour.r, l.colour.g, l.colour.b, l.colour.a);
            line(l.line.x, l.line.y, l.line.px, l.line.py);
    }   );
}

function createLine(pen) {
    let previous = pen.lines[pen.lines.length - 1];
    let current = previous || {
        blendPosition: 1
    };

    if (current.blendPosition === 1) {
        current.fromColour = getRandomRgba();
        current.toColour = getRandomRgba();
        current.fromStrokeWeight = 1;
        current.toStrokeWeight = Math.floor(random(1, 10));
        current.blendLength = Math.floor(random(50, 1000));
    } 
    
    current.blendPosition++;

    if (previous && isEndOfBlend(previous)) {
        current.fromColour = previous.toColour;
        current.toColour = getRandomRgba();
        current.blendLength = Math.floor(random(50, 1000));
        current.blendPosition = 1;
        current.fromStrokeWeight = previous.toStrokeWeight;
        current.toStrokeWeight = Math.floor(random(1, 10));
    }

    const percent = current.blendPosition / current.blendLength;
    const blendColour = getBlendRgba(current, percent);
    const blendStrokeWeight = getBlendStrokeWeight(current, percent);
    const startPos = {
        x: previous ? previous.line.x : width / 2,
        y: previous ? previous.line.y : height / 2,
    };

    let penLine = {};

    penLine.x = startPos.x;
    penLine.y = startPos.y;
    penLine.px = startPos.x;
    penLine.py = startPos.y;
    penLine.x += (noise(frameCount * 0.01) - 0.5) * 10;
    penLine.y += (noise(frameCount * 0.02) - 0.5) * 10;

    if (penLine.x > width) {
        penLine.px = 0;
        penLine.x  = 0;
    }
    if (penLine.x  < 0) {
        penLine.px = width;
        penLine.x = width;
    }
    if (penLine.y > height) {
        penLine.py = 0;
        penLine.y = 0;
    }
    if (penLine.y< 0) {
        penLine.py = height;
        penLine.y = height;
    }

    pen.lines.push({
        strokeWeight: blendStrokeWeight,
        colour: blendColour,
        blendPosition: current.blendPosition,
        blendLength: current.blendLength,
        fromColour: current.fromColour,
        toColour: current.toColour,
        fromStrokeWeight: current.fromStrokeWeight,
        toStrokeWeight: current.toStrokeWeight,
        line: {
            x: penLine.x,
            y: penLine.y,
            px: penLine.px,
            py: penLine.py,
        },
    });
}

function getRandomRgba() {
    r = random(255);
    g = random(255);
    b = random(255);
    a = random(150, 255);

    return { r, b, g, a };
}

function getBlendRgba(penLine, percent) {
    const r = getBlendValue(penLine, "r", percent);
    const g = getBlendValue(penLine, "g", percent);
    const b = getBlendValue(penLine, "b", percent);
    const a = getBlendValue(penLine, "a", percent);

    return { r, g, b, a };
}

function getBlendValue(penLine, colourParam, percent) {
    const from = penLine.fromColour[colourParam];
    const to = penLine.toColour[colourParam];
    const difference = Math.abs(from - to);

    let value = calculateBlendValue(from, to, difference, percent);

    return value;
}

function getBlendStrokeWeight(penLine, percent) {
    const difference = Math.abs(
        penLine.fromStrokeWeight - penLine.toStrokeWeight
    );
    return Math.floor(
        calculateBlendValue(
            penLine.fromStrokeWeight,
            penLine.toStrokeWeight,
            difference,
            percent
        )
    );
}

function calculateBlendValue(from, to, difference, percent) {
    if (from < to) return from + difference * percent;
    else if (from > to) return from - difference * percent;
    else return from;
}

function isEndOfBlend(penLine) {
    return penLine.blendPosition === penLine.blendLength;
}
