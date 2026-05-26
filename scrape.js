const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    // Simular navegador real
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    await page.setViewport({
        width: 1366,
        height: 768
    });

    await page.goto(
        'https://circulorafaela.com.ar/farmacias',
        {
            waitUntil: 'domcontentloaded',
            timeout: 0
        }
    );

    // esperar un poco
    await new Promise(r => setTimeout(r, 5000));

    // DEBUG
    const html = await page.content();

    fs.writeFileSync('debug.html', html);

    const farmacias = await page.evaluate(() => {

        return [...document.querySelectorAll('.widget-farmacia')]
            .map(f => ({

                nombre:
                    f.querySelector('.titulo')
                    ?.innerText
                    ?.trim(),

                telefono:
                    f.querySelector('.telefono')
                    ?.innerText
                    ?.trim(),

                direccion:
                    f.querySelector('.direccion')
                    ?.innerText
                    ?.trim()
            }));
    });

    fs.writeFileSync(
        'farmacias.json',
        JSON.stringify(farmacias, null, 2)
    );

    console.log(farmacias);

    await browser.close();

})();
