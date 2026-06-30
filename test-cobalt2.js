async function test() {
    try {
        const res = await fetch("https://api.cobalt.tools/api/json", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: "https://www.instagram.com/p/DaJ_ffJA9Aq/" })
        });
        const text = await res.text();
        console.log(res.status);
        console.log(text);
    } catch(e) {
        console.log(e);
    }
}
test();
