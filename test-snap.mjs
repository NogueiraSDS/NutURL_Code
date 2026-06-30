async function getSnapInsta() {
    const url = 'https://www.instagram.com/p/DaJ_ffJA9Aq/';
    const formData = new URLSearchParams();
    formData.append('url', url);
    formData.append('action', 'post');

    try {
        const response = await fetch('https://snapinsta.app/action.php', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://snapinsta.app',
                'Referer': 'https://snapinsta.app/'
            },
            body: formData
        });
        const text = await response.text();
        console.log("SnapInsta response length:", text.length);
        console.log("SnapInsta response:", text.substring(0, 300));
        
        // it returns something like `<a href="https://scontent...`
        const m = text.match(/href="([^"]+\.mp4[^"]*)"/);
        if (m) {
            console.log("Found mp4:", m[1]);
        }
    } catch(e) {
        console.error(e.message);
    }
}
getSnapInsta();
