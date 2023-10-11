const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////////////////////////////////////////////////////////
// Synch
// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
// console.log(textIn);

// const textOut = `This is output text: ${textIn} \nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut)


// Asynch
// fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
//     console.log('Asynch');
//     console.log(data);
// })
///////////////////////////////////////////////////////////////////////////////
const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const templateProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data);

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
    output = output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_ID%}/g, product.id);

    if (!product.organic) {
        output = output.replace(/{%PRODUCT_ISORGANIC%}/g, 'not-organic');
    }

    return output;
}

const server = http.createServer((req, res) => {
    const pathName = req.url

    // Overview Page
    if (pathName === '/' || pathName === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html' })

        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARD%}', cardsHtml)
        res.end(output);

        // Product Page
    } else if (pathName === '/product') {
        res.end('Products');

        //API
    } else if (pathName === '/api') {
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

