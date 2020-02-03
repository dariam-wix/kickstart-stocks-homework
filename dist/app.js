"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const company_1 = __importDefault(require("./services/company"));
const app = express_1.default();
const company = new company_1.default();
var LRU = require("lru-cache"), options = { max: 10,
    maxAge: 1000 * 60 * 60 }, cacheName = new LRU(options), cacheSymbol = new LRU(options);
app.use(express_1.json());
async function getByName(name) {
    if (cacheName.has(name)) {
        const values = cacheName.peek(name);
        const result = {
            price: values.price,
            name: values.name
        };
        cacheName.set(name, { name: result.name, price: result.price });
        return (result);
    }
    else {
        const result = await company.get({ name: name });
        cacheName.set(name, { price: result.price, name: result.name });
        return (result);
    }
}
async function getBySymbol(symbol) {
    if (cacheSymbol.has(symbol)) {
        const values = cacheSymbol.peek(symbol);
        const result = {
            price: values.price,
            name: values.name
        };
        cacheSymbol.set(symbol, { name: result.name, price: result.price });
        return (result);
    }
    else {
        const result = await company.get({ name: symbol });
        cacheSymbol.set(symbol, { price: result.price, name: result.name });
        return (result);
    }
}
app.get("/api/v1/prices", async (req, res) => {
    try {
        if (req.query.name) {
            const result = await getByName(req.query.name);
            res.status(200).json(result);
        }
        else if (req.query.symbol) {
            const result = await getBySymbol(req.query.symbol);
            res.status(200).json(result);
        }
        else {
            res.status(400).send("Please input company Symbol (APPL) or Name (Apple Inc.).");
        }
    }
    catch (err) {
        console.log(err.message);
    }
});
app.get("/api/v1/cache/name", async (req, res) => {
    try {
        res.status(200).json(cacheName.keys());
    }
    catch (err) {
        console.log(err.message);
    }
});
app.get("/api/v1/cache/symbol", async (req, res) => {
    try {
        res.status(200).json(cacheSymbol.keys());
    }
    catch (err) {
        console.log(err.message);
    }
});
app.get("/", (req, res) => {
    res.send("Hi");
});
exports.default = app;
