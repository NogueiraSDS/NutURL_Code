async function test() {
  const url = 'https://api.vxtwitter.com/Twitter/status/1706696756382101683';
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log("VXTwitter:", json.media_extended || json.mediaURLs);
  } catch (err) {
    console.error("VXTwitter ERROR:", err.message);
  }
}
test();
