import fs from 'fs';

async function testIG() {
    const url = 'https://www.instagram.com/p/DaJ_ffJA9Aq/';
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
    });
    const html = await response.text();
    
    fs.writeFileSync('ig_dump.html', html);
    
    // search for video_url or display_url
    const videoMatches = html.match(/"video_url":"([^"]+)"/g);
    if (videoMatches) {
        console.log("Found video_url:", videoMatches.length);
        console.log(videoMatches[0]);
    } else {
        console.log("No video_url found.");
    }
}
testIG();
