async function test() {
  const urlsToTest = [
      'https://ddinstagram.com/p/DaJ_ffJA9Aq',
      'https://www.ddinstagram.com/p/DaJ_ffJA9Aq'
  ];

  for (const url of urlsToTest) {
      try {
          console.log("Testing:", url);
          const response = await fetch(url, {
              headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                  'Accept': 'text/html'
              }
          });
          const text = await response.text();
          
          // look for meta og:video
          const videoMatch = text.match(/<meta\s+property="og:video"\s+content="([^"]+)"/i);
          if (videoMatch) {
              console.log("Found Video in HTML:", videoMatch[1]);
          } else {
              console.log("No og:video found. Length:", text.length);
          }
      } catch (e) {
          console.error("Error:", e.message);
      }
  }
}
test();
