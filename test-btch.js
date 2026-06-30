const btch = require('btch-downloader');

async function test() {
    try {
        console.log("Testing btch-downloader...");
        const res = await btch.igdl("https://www.instagram.com/p/DaJ_ffJA9Aq/");
        console.log("Result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.log("Error:", e.message);
    }
}
test();
