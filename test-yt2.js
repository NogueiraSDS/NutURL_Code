const youtubedl = require('youtube-dl-exec');

async function testYT() {
    try {
        console.log("Fetching YT...");
        const info = await youtubedl('https://www.youtube.com/watch?v=jNQXAC9IVRw', {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true
        });
        
        const mergedVideoFormats = info.formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none');
        console.log("Merged Video Formats:");
        mergedVideoFormats.forEach(f => {
            console.log(`- Quality: ${f.format_note} | Ext: ${f.ext} | URL: ${f.url?.substring(0,30)}...`);
        });

        const audioFormats = info.formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
        console.log("\nAudio Formats:");
        audioFormats.forEach(f => {
            console.log(`- Quality: ${f.format_note} | Ext: ${f.ext} | URL: ${f.url?.substring(0,30)}...`);
        });

    } catch (e) {
        console.log("Error:", e.message);
    }
}
testYT();
