"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class CompanyService {
    constructor() {
        this.key = "OKC0BT76URCJ1QBU";
    }
    async getSymbol(userInput) {
        return axios_1.default.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${userInput}&apikey=${this.key}`)
            .then(function (response) {
            if (response.data.bestMatches) {
                const result = {
                    symbol: response.data.bestMatches[0]['1. symbol'],
                    name: response.data.bestMatches[0]['2. name']
                };
                return result;
            }
            else {
                return {
                    symbol: "-",
                    name: "Company not found"
                };
            }
        })
            .catch(function (error) {
            console.log(error);
            return {
                symbol: "-",
                name: "Company not found"
            };
        });
    }
    async getPrice(symbol) {
        return axios_1.default.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.key}`)
            .then(function (response) {
            if (response.data['Global Quote']) {
                return response.data['Global Quote']['05. price'];
            }
            else {
                return "0";
            }
        })
            .catch(function (error) {
            console.log(error);
            return "0";
        });
    }
    async get(params) {
        const { symbol, name } = await this.getSymbol(params.name);
        const price = await this.getPrice(symbol);
        const company = {
            name,
            price
        };
        return company;
    }
}
exports.default = CompanyService;
