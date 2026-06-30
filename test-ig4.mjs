import { load } from 'cheerio';

async function testIG() {
    const url = 'https://www.instagram.com/p/DaJ_ffJA9Aq/';
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
    });
    const html = await response.text();
    console.log("HTML Length:", html.length);
    console.log("Title:", html.match(/<title>([^<]+)<\/title>/)?.[1]);
    
    // find instagram JSON embedded
    const sharedData = html.match(/window\._sharedData\s*=\s*({.+?});/);
    if (sharedData) {
        console.log("Found _sharedData:", sharedData[1].substring(0, 100));
    }
}
testIG();
