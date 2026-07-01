const { create } = require('youtube-dl-exec');
const path = require('path');
const fs = require('fs');

const isWin = process.platform === 'win32';
const binName = isWin ? 'yt-dlp.exe' : 'yt-dlp';
const binPath = path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', binName);

console.log("Exists?", fs.existsSync(binPath), binPath);

const ytdl = create(binPath);

async function test() {
    const info = await ytdl('https://www.youtube.com/watch?v=XFkzRNyygfk', { dumpSingleJson: true, preferFreeFormats: true });
    console.log("Title:", info.title);
}
test();
