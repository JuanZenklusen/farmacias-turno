const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    // Simula navegador real
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.goto("https://circulorafaela.com.ar/farmacias", {
        waitUntil: "networkidle2",
        timeout: 0
    });

    // Espera unos segundos extra
    await new Promise(resolve => setTimeout(resolve, 5000));

    // DEBUG: guardar HTML
    const html = await page.content();
    fs.writeFileSync("debug.html", html);

    // Buscar farmacias
    const farmacias = await page.evaluate(() => {

        const cards = document.querySelectorAll(".widget-farmacia");

        return Array.from(cards).map(card => ({
            nombre: card.querySelector(".titulo")?.innerText.trim() || "",
            telefono: card.querySelector(".telefono")?.innerText.trim() || "",
            direccion: card.querySelector(".direccion")?.innerText.trim() || ""
        }));

    });

    fs.writeFileSync(
        "farmacias.json",
        JSON.stringify(farmacias, null, 2)
    );

    console.log(farmacias);

    await browser.close();

})();
