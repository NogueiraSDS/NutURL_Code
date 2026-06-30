async function test() {
    const url = 'https://www.instagram.com/p/DaJ_ffJA9Aq/';
    const formData = new URLSearchParams();
    formData.append('q', url);
    formData.append('t', 'media');
    formData.append('lang', 'en');

    try {
        const response = await fetch('https://fastdl.app/c/', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Origin': 'https://fastdl.app',
                'Referer': 'https://fastdl.app/'
            },
            body: formData
        });
        const text = await response.text();
        console.log("Fastdl response:", text.substring(0, 500));
    } catch(e) {
        console.error("FastDL error:", e.message);
    }
}
test();
