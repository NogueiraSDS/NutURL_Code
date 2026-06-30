const { snapsave } = require("snapsave-media-downloader");

async function test() {
    try {
        console.log("Fetching Instagram with snapsave...");
        const res = await snapsave("https://www.instagram.com/p/DaJ_ffJA9Aq/");
        console.log("Result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
