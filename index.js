const got = require('got');
const cheerio = require('cheerio');


const startURL = 'https://hexact.io';
const links = new Set();
links.add(startURL);
const urlMap = new Map();

const extractLinks = async (url) => {
    try {
        const response = await got(url);
        console.log('{url: ' + url + ', status: ' + response.statusCode + '}');
        let value = urlMap.get(response.statusCode) || 0;
        urlMap.set(response.statusCode, ++value);

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
            console.log('{url: ' + url + ', status: ' + err.response.statusCode + '}');
            let value = urlMap.get(err.response.statusCode) || 0;
            urlMap.set(err.response.statusCode, ++value);
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