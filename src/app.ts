import express, {Request, Response, json, NextFunction } from 'express';
import CompanyService, {Company} from './services/company';

const app = express();

const company = new CompanyService();

var LRU = require("lru-cache")
  , options = { max: 10
              , maxAge: 1000 * 60 * 60 }
  , cacheName = new LRU(options)
  , cacheSymbol = new LRU(options)

app.use(json());

async function getByName(name: string){
  if(cacheName.has(name)){
      const values = cacheName.peek(name);
      const result:Company = {
        price: values.price,
        name: values.name
      };
      cacheName.set(name, {name: result.name, price:result.price});
      return(result);
  }else{
      const result = await company.get({name: name});
      cacheName.set(name, {price:result.price, name: result.name});
      return(result);
  }
}

async function getBySymbol(symbol: string){
  if(cacheSymbol.has(symbol)){
      const values = cacheSymbol.peek(symbol);
      const result:Company = {
        price: values.price,
        name: values.name
      };
      cacheSymbol.set(symbol, {name: result.name, price:result.price});
      return(result);
  }else{
      const result = await company.get({name: symbol});
      cacheSymbol.set(symbol, {price:result.price, name: result.name});
      return(result);
  }
}

app.get("/api/v1/prices", async (req: Request, res: Response) => {
  try {
    if(req.query.name){
        const result = await getByName(req.query.name);
        res.status(200).json(result);
    }else if(req.query.symbol){
      const result = await getBySymbol(req.query.symbol);
      res.status(200).json(result);
    }else{
      res.status(400).send("Please input company Symbol (APPL) or Name (Apple Inc.).");
    }
  }catch(err) {
    console.log(err.message);
  }
});

app.get("/api/v1/cache/name", async (req: Request, res: Response) => {
  try {
    res.status(200).json(cacheName.keys());
  }catch(err) {
    console.log(err.message);
  }
});

app.get("/api/v1/cache/symbol", async (req: Request, res: Response) => {
  try {
    res.status(200).json(cacheSymbol.keys());
  }catch(err) {
    console.log(err.message);
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hi");
});

export default app;
