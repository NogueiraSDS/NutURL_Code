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
        
        console.log("Title:", info.title);
        console.log("Formats count:", info.formats?.length);
        
        // Find formats with both video and audio
        const mergedFormats = info.formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none');
        console.log("Merged Formats:");
        mergedFormats.forEach(f => {
            console.log(`- ${f.format_note} (${f.ext}) : ${f.vcodec} / ${f.acodec}`);
        });

    } catch (e) {
        console.log("Error:", e.message);
    }
}
testYT();
