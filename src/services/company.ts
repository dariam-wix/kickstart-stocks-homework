import axios from 'axios';

type CheckCompanyParams = {
  name: string;
}

export type Company = {
  name: string;
  price: string;
}

export default class CompanyService {

  private key:string = "OKC0BT76URCJ1QBU";

  async getSymbol(userInput: string) {
    return axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${userInput}&apikey=${this.key}`)
    .then(function (response) {
        const result = {
          symbol: response.data.bestMatches[0]['1. symbol'],
          name: response.data.bestMatches[0]['2. name']
        };
        return result;
    })
    .catch(function (error) {
      console.log(error);
      return {
        symbol: "-",
        name: "Company not found"
      };
    });
  }

  async getPrice(symbol: string) {
    return axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.key}`)
    .then(function (response) {
       return response.data['Global Quote']['05. price'] === undefined ? "0" : response.data['Global Quote']['05. price'];
    })
    .catch(function (error) {
      return "0";
    });
  }

  async get (params: CheckCompanyParams): Promise<Company> {
    const {symbol, name} = await this.getSymbol(params.name);
    const price = await this.getPrice(symbol);

    const company:Company = {
      name,
      price
    };
    return company;
  }
}
