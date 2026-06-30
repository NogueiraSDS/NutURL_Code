import { load } from 'cheerio';

async function testIG() {
    const url = 'https://www.instagram.com/p/DaJ_ffJA9Aq/';
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
    });
    const html = await response.text();
    const $ = load(html);
    
    console.log("og:video =>", $('meta[property="og:video"]').attr('content'));
    console.log("og:video:secure_url =>", $('meta[property="og:video:secure_url"]').attr('content'));
    console.log("og:image =>", $('meta[property="og:image"]').attr('content'));
    console.log("twitter:player:stream =>", $('meta[name="twitter:player:stream"]').attr('content'));
    console.log("video source =>", $('video source').attr('src'));
}
testIG();
