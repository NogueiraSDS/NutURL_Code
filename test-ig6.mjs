import fs from 'fs';

const text = fs.readFileSync('ig_dump.html', 'utf8');
const mp4Matches = text.match(/https:\/\/[^"'\\]+\.mp4[^"'\\]*/g);
if (mp4Matches) {
    console.log("Found mp4:", mp4Matches.length);
    console.log(mp4Matches.slice(0, 3));
} else {
    console.log("No mp4 found");
}

const jpgMatches = text.match(/https:\/\/[^"'\\]+\.jpg[^"'\\]*/g);
if (jpgMatches) {
    console.log("Found jpg:", jpgMatches.length);
    console.log(jpgMatches.slice(0, 1));
} else {
    console.log("No jpg found");
}
