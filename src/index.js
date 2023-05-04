const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");
const imageSize = require("image-size");

const argv = require("minimist")(process.argv.slice(2), {
    alias: {
        w: "width",
        h: "height"
    }
});

// If the path exists, and a numeric width and height are provided
if (fs.existsSync(argv._[0]) && parseInt(argv.w) && parseInt(argv.h)) {
    generateImage(argv._[0], argv.w, argv.h);
}
else {
    console.log("Missing or invalid arguments");
}

function generateImage(inputPath, w, h) {
    try {
        const canvas = createCanvas(w, h);
        const ctx = canvas.getContext("2d");
        const dimensions = imageSize(inputPath);
        loadImage(inputPath).then(data => {
            let xAmount = Math.ceil(w, dimensions.width);
            let yAmount = Math.ceil(h, dimensions.height);
            for (let y = 0; y < yAmount; y++) {
                for (let x = 0; x < xAmount; x++) {
                    let xPosition = x * dimensions.width;
                    let yPosition = y * dimensions.height;
                    ctx.drawImage(data, xPosition, yPosition, dimensions.width, dimensions.height);
                }
            }
            // Write canvas to file
            let outputPath = path.join(path.dirname(inputPath), `tiled-${path.parse(inputPath).name}-${w}-${h}.png`);
            fs.writeFileSync(outputPath, canvas.toBuffer("image/png"));
            console.log(`Tiled image generated at ${outputPath}`);
        });
    }
    catch (e) {
        console.log("An error occurred while trying to process the image");
    }
}