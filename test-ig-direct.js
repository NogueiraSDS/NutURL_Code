const instagramGetUrl = require("instagram-url-direct");

async function test() {
    try {
        console.log("Fetching Instagram...");
        const res = await instagramGetUrl("https://www.instagram.com/p/DaJ_ffJA9Aq/");
        console.log("Result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
