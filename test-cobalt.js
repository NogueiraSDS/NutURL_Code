async function testCobalt() {
  try {
      const response = await fetch('https://api.cobalt.tools/api/json', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          },
          body: JSON.stringify({
              url: 'https://www.instagram.com/p/DaJ_ffJA9Aq/',
              isAudioOnly: false
          })
      });

      const text = await response.text();
      console.log("Status:", response.status);
      console.log("Response:", text);
  } catch (err) {
      console.error("Error:", err.message);
  }
}
testCobalt();
