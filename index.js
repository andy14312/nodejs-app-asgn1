const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req,res)=>{
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toUpperCase();
    const queryObject = parsedUrl.query;
    const headers = req.headers;
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    // getting payload
    req.on('data',(data) => {
        buffer += decoder.write(data);
    });
    req.on('end',() => {
        buffer += decoder.end();
        const data = {
            trimmedPath,
            parsedUrl,
            method,
            queryObject,
            payload : buffer,
            headers
        };
        const handler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        handler(data,(statusCode,payload) => {
            statusCode = statusCode || 200;
            payload = payload || {};
            res.setHeader('content-type','application/json');
            res.writeHead(statusCode);
            res.end(JSON.stringify(payload))
        })

    })

});

let handlers = {};

handlers.hello = (data,callback) => {
    callback(200,{
        'message' : 'Hello there! Glad you found your way here. :p'
    });
}

handlers.notFound = (data,callback) => {
    callback(404);
}


const router = {
    'hello' : handlers.hello
}

server.listen(5000,()=>{
    console.log('server listening on port 5000');
})