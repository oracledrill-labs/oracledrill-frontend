import http from 'node:http';import {readFile} from 'node:fs/promises';
export const assets={'/':['index.html','text/html'],'/app.mjs':['app.mjs','text/javascript'],'/style.css':['style.css','text/css']};
export function createFrontend(){return http.createServer(async(req,res)=>{
 if(!/^localhost(?::\d+)?$|^127\.0\.0\.1(?::\d+)?$/.test(req.headers.host??'')){res.writeHead(403).end();return}
 if(req.url?.startsWith('/api/')){try{const r=await fetch('http://127.0.0.1:4371'+req.url.slice(4),{method:req.method,headers:{'content-type':req.headers['content-type']??'application/json',...(req.headers.origin?{origin:req.headers.origin}:{})},body:req.method==='POST'?req:undefined,duplex:'half',signal:AbortSignal.timeout(10000)});res.writeHead(r.status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(await r.text())}catch{res.writeHead(502).end('{"error":"API unavailable"}')}return}
 const a=assets[req.url];if(!a){res.writeHead(404).end();return}
 res.writeHead(200,{'Content-Type':a[1],'Content-Security-Policy':"default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'",'X-Content-Type-Options':'nosniff'});res.end(await readFile(new URL(a[0],import.meta.url)));
})}
if(process.argv[1]===new URL(import.meta.url).pathname)createFrontend().listen(4370,'127.0.0.1',()=>console.log('OracleDrill UI http://127.0.0.1:4370'));
