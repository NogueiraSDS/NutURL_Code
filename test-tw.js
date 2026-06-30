async function test() {
  const url = 'https://api.vxtwitter.com/iTheWolfman/status/2071943268435185969';
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log("VXTwitter JSON:", JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("VXTwitter ERROR:", err.message);
  }

  const urlFx = 'https://api.fxtwitter.com/iTheWolfman/status/2071943268435185969';
  try {
    const responseFx = await fetch(urlFx);
    const jsonFx = await responseFx.json();
    console.log("FXTwitter JSON:", JSON.stringify(jsonFx, null, 2));
  } catch (err) {
    console.error("FXTwitter ERROR:", err.message);
  }
}
test();
