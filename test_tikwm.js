async function test() {
    try {
        const url = 'https://www.tiktok.com/@the_hadassaa_/video/7642040787735203093?is_from_webapp=1&sender_device=pc';
        // Test with hd=1
        const tkUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
        console.log("Fetching with hd=1:", tkUrl);
        const tkRes = await fetch(tkUrl);
        const tkJson = await tkRes.json();
        console.log("Data sample:", {
            play: tkJson.data?.play,
            wmplay: tkJson.data?.wmplay,
            hdplay: tkJson.data?.hdplay,
            size: tkJson.data?.size,
            hd_size: tkJson.data?.hd_size
        });
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
