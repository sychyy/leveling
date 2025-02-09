const puppeteer = require('puppeteer-core');
const chrome = require('chrome-aws-lambda');

module.exports = async (req, res) => {
    try {
        const { background, level, exp, count, avatar } = req.query;

        if (!background || !level || !exp || !count || !avatar) {
            return res.status(400).send("Missing required query parameters");
        }

        // Konfigurasi Puppeteer untuk menggunakan chrome-aws-lambda
        const browser = await puppeteer.launch({
            headless: true,
            args: [...chrome.args, '--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: await chrome.executablePath,
            defaultViewport: chrome.defaultViewport
        });

        const page = await browser.newPage();

        // HTML yang akan di-render
        const content = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        text-align: center;
                        padding: 20px;
                    }
                    .level-container {
                        background-image: url('${background}');
                        background-size: cover;
                        background-position: center;
                        padding: 50px;
                        border-radius: 15px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        display: inline-block;
                        max-width: 600px;
                        width: 100%;
                        text-align: center;
                    }
                    .avatar {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        object-fit: cover;
                        margin-bottom: 20px;
                    }
                    .level-bar {
                        width: 100%;
                        height: 30px;
                        background-color: #e0e0e0;
                        border-radius: 20px;
                        overflow: hidden;
                        margin-bottom: 20px;
                        position: relative;
                    }
                    .level-progress {
                        height: 100%;
                        background-color: #4caf50;
                        width: 0%;
                        border-radius: 20px 0 0 20px;
                    }
                    .level-info {
                        font-size: 18px;
                        margin-bottom: 10px;
                    }
                    .exp-info {
                        font-size: 16px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <div class="level-container">
                    <img class="avatar" src="${avatar}" alt="Avatar">
                    <div class="level-info">Level: ${level}</div>
                    <div class="level-bar">
                        <div class="level-progress" style="width: ${(exp / count) * 100}%"></div>
                    </div>
                    <div class="exp-info">EXP: ${exp}/${count}</div>
                </div>
            </body>
        </html>`;

        await page.setContent(content);  // Set the HTML content
        const screenshot = await page.screenshot();  // Capture the screenshot
        await browser.close();  // Close the browser

        res.setHeader('Content-Type', 'image/png');
        res.send(screenshot);  // Send the screenshot as the response

    } catch (error) {
        console.error("Error rendering image:", error);  // Log error to server logs
        res.status(500).send(`Internal Server Error: ${error.message}`);  // Send more details in response
    }
};
