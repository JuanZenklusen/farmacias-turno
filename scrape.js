const fs = require('fs');

const puppeteer = require('puppeteer-extra');

const StealthPlugin =
    require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1366,
        height: 768
    });

    await page.goto(
        'https://circulorafaela.com.ar/farmacias',
        {
            waitUntil: 'networkidle2',
            timeout: 0
        }
    );

    // esperar challenge cloudflare
    await new Promise(r => setTimeout(r, 10000));

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
