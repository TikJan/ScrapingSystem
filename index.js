const got = require('got');
const cheerio = require('cheerio');


const startURL = process.env.START_URL || 'https://hexact.io';
const links = new Set();
links.add(startURL);
const urlMap = new Map();

const outputProcessor = (url, statusCode) => {
    console.log('{url: ' + url + ', status: ' + statusCode + '}');
    let value = urlMap.get(statusCode) || 0;
    urlMap.set(statusCode, ++value);
}

const extractLinks = async (url) => {
    try {
        const response = await got(url);
        outputProcessor(url, response.statusCode);

        if (!url.includes(startURL)) {
            return;
        }

        const html = response.body;
        const $ = cheerio.load(html);
        const linkObjects = $('a');

        linkObjects.each((index, element) => {
            link = $(element).attr('href');
            if (!link.includes('http')) {
                link = startURL + link;
            }
            links.add(link);
        });
    } catch (err) {
        if (err.response && err.response.statusCode) {
            outputProcessor(url, err.response.statusCode);
        } else {
            console.log(err);
        }
    }
};

const start = async () => {
    for (let item of links) {
        await extractLinks(item);
    }
    console.log(urlMap);
}

start();
