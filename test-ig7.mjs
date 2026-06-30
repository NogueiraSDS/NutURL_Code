async function test() {
  const urls = [
      'https://ddinstagram.com/p/DaJ_ffJA9Aq',
      'https://www.ddinstagram.com/p/DaJ_ffJA9Aq',
      'https://rxistagram.com/p/DaJ_ffJA9Aq'
  ];

  for (const url of urls) {
      try {
          console.log("Testing:", url);
          const response = await fetch(url, {
              headers: {
                  'User-Agent': 'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)'
              }
          });
          console.log("Status:", response.status);
          const text = await response.text();
          const videoMatch = text.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i);
          if (videoMatch) {
              console.log("Found Video:", videoMatch[1]);
          } else {
              console.log("No og:video. HTML length:", text.length);
          }
      } catch (e) {
          console.log("Error:", e.message);
      }
  }
}
test();
