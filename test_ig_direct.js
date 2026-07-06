const instagramGetUrl = require("instagram-url-direct");

async function test() {
    try {
        console.log("Testing instagram-url-direct...");
        console.log("Exports:", instagramGetUrl);
        const url = 'https://www.instagram.com/stories/cruel_angel0/';
        const links = await instagramGetUrl.default ? instagramGetUrl.default(url) : instagramGetUrl(url);
        console.log("Result:", links);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
