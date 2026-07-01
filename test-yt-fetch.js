const youtubedl = require('youtube-dl-exec');
const https = require('https');

async function testFetch() {
    try {
        console.log("Fetching YT info...");
        const info = await youtubedl('https://www.youtube.com/watch?v=XFkzRNyygfk', {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true
        });
        
        // Let's get the 360p or 720p URL
        const playableFormats = info.formats.filter(f => 
            (f.vcodec !== 'none' && f.acodec !== 'none') || 
            (f.vcodec === 'none' && f.acodec !== 'none') ||
            (f.vcodec !== 'none' && f.acodec === 'none' && f.height >= 720)
        );
        
        const f720 = playableFormats.find(f => f.height === 720);
        if (!f720) {
            console.log("No 720p found. Found formats:");
            playableFormats.forEach(f => console.log(f.format_note, f.height));
            return;
        }

        const url = f720.url;
        console.log("720p URL:", url.substring(0, 100) + "...");
        
        console.log("Fetching the URL natively...");
        const req = https.get(url, (res) => {
            console.log("Status Code:", res.statusCode);
            console.log("Content-Length:", res.headers['content-length']);
            
            let bytes = 0;
            res.on('data', chunk => {
                bytes += chunk.length;
                if (bytes > 1024 * 1024) { // stop after 1MB
                   console.log("Successfully read > 1MB");
                   req.destroy();
                }
            });
            res.on('end', () => {
                console.log("Stream ended. Total bytes:", bytes);
            });
        });
        
        req.on('error', e => {
            console.log("Request error:", e.message);
        });

    } catch (e) {
        console.log("Error:", e.message);
    }
}
testFetch();
