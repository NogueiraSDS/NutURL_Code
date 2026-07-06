const { igdl } = require('btch-downloader');

async function test() {
    try {
        console.log("Testing story URL...");
        const url = 'https://www.instagram.com/stories/cruel_angel0/';
        const data = await igdl(url);
        console.log("Result:", data);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
