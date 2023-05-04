const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const imageSize = require("image-size");

const argv = require("minimist")(process.argv.slice(2), {
    alias: {
        w: "width",
        h: "height",
    },
});

const inputPath = argv._[0];
const dimensions = imageSize(inputPath);

let targetWidth = parseInt(argv.w);
let targetHeight = parseInt(argv.h);
let targetX = parseInt(argv.x);
let targetY = parseInt(argv.y);

if (fs.existsSync(inputPath) && (targetWidth && targetHeight) || (targetX && targetY)) {
    if (targetWidth) {
        targetX = Math.ceil(targetWidth / dimensions.width);
        targetY = Math.ceil(targetHeight / dimensions.height);
    }
    else if (targetX) {
        targetWidth = targetX * dimensions.width;
        targetHeight = targetY * dimensions.height;
    }
    generateImage();
}
else {
    console.log("Missing arguments");
}

function generateImage() {
    try {
        const canvas = createCanvas(targetWidth, targetHeight);
        const ctx = canvas.getContext("2d");

        loadImage(inputPath).then(data => {
            for (let y = 0; y < targetY; y++) {
                for (let x = 0; x < targetX; x++) {
                    ctx.drawImage(
                        data,
                        x * dimensions.width,
                        y * dimensions.height,
                        dimensions.width,
                        dimensions.height
                    );
                }
            }

            // Write to file
            let outputPath = path.join(path.dirname(inputPath), `tile-${path.parse(inputPath).name}-${targetWidth}x${targetHeight}.png`);
            fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
            console.log(`Image generated at ${outputPath}`);
        });
    }
    catch (e) {
        console.log("Unable to process image");
    }
}