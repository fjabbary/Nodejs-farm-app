const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const templateProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);



const server = http.createServer((req, res) => {
    const pathName = req.url

    const { query, pathname } = url.parse(req.url, true)

    // Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html' })

        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARD%}', cardsHtml)
        res.end(output);

        // Product Page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const id = query.id;
        const foundProduct = dataObj[id]
        const output = replaceTemplate(templateProduct, foundProduct)

        res.end(output);

        //API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(data);

        // NOT FOUND
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' })
        res.end('<h1>Not Found!</h1>')
    }
})

server.listen(8000, 'localhost', () => {
    console.log('Server is running at port 8000');
})

