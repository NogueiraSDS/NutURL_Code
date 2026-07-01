async function testAPI() {
    try {
        console.log("Fetching API...");
        const res = await fetch("http://localhost:3000/api/downloader", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: "https://www.youtube.com/watch?v=XFkzRNyygfk" })
        });
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch(e) {
        console.log("Error:", e.message);
    }
}
testAPI();
