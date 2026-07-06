const { ttdl } = require('btch-downloader');

async function test() {
    try {
        const url = 'https://www.tiktok.com/@the_hadassaa_/video/7642040787735203093?is_from_webapp=1&sender_device=pc';
        console.log("Testing ttdl from btch-downloader...");
        const result = await ttdl(url);
        console.log("Result:", result);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
