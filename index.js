const fs = require('fs')
const path = require('path')
const Jimp = require('jimp')
const GIFEncoder = require('gifencoder')
const pngFileStream = require('png-file-stream')

const COLOURS = 20
const FILENAME = 'test.jpg'
const DELAY = 50

try {
    fs.mkdirSync('tmp')
} catch(err) {
    if (err.code !== 'EEXIST') {
        throw err
    }
}

Jimp.read(FILENAME, (err, image) => {
    if (err) throw err

    for (let i = 0; i < COLOURS; i++) {
        image
            .clone()
            .color([
                { apply: 'hue', params: [360.0 / COLOURS * i] }
            ])
            .write(path.join('tmp', `frame${i}.png`))
    }

    pngFileStream('tmp/frame*.png')
      .pipe(new GIFEncoder(image.bitmap.width, image.bitmap.height).createWriteStream({ repeat: 0, delay: DELAY, quality: 10 }))
      .pipe(fs.createWriteStream('myanimated.gif'))
})

 