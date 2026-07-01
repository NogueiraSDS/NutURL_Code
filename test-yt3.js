const youtubedl = require('youtube-dl-exec');

async function testYT() {
    try {
        console.log("Fetching YT...");
        const info = await youtubedl('https://www.youtube.com/watch?v=XFkzRNyygfk', {
            dumpSingleJson: true,
            noCheckCertificates: true,
            noWarnings: true,
            preferFreeFormats: true
        });
        
        console.log("Title:", info.title);
        
        const playableFormats = info.formats.filter(f => 
            (f.vcodec !== 'none' && f.acodec !== 'none') || 
            (f.vcodec === 'none' && f.acodec !== 'none')
        );
        
        console.log("Playable Formats:", playableFormats.length);
        playableFormats.forEach(f => {
            console.log(`- Type: ${f.vcodec === 'none' ? 'audio' : 'video'} | Quality: ${f.format_note} | Ext: ${f.ext}`);
        });

    } catch (e) {
        console.log("Error:", e.message);
    }
}
testYT();
