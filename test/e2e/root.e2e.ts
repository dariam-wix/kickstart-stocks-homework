import request from "supertest";
import nock from 'nock';

import app from "../../src/app";

describe("GET /api/v1/prices?name={company_name} - check data parsing, from successfull request", () => {
  it("should return company price and name correctly by name", async () => {
    nock("https://www.alphavantage.co")
          .get(/function=SYMBOL_SEARCH/)
          .reply(200, {
                    "bestMatches": [
                        {
                            "1. symbol": "WIX",
                            "2. name": "Wix.com Ltd.",
                            "3. type": "Equity",
                            "4. region": "United States",
                            "5. marketOpen": "09:30",
                            "6. marketClose": "16:00",
                            "7. timezone": "UTC-05",
                            "8. currency": "USD",
                            "9. matchScore": "1.0000"
                        }
                    ]
          });
          nock("https://www.alphavantage.co")
                .get(/function=GLOBAL_QUOTE/)
                .reply(200, {
                          "Global Quote": {
                              "01. symbol": "WIX",
                              "02. open": "174.0500",
                              "03. high": "174.0500",
                              "04. low": "170.7900",
                              "05. price": "172.7800",
                              "06. volume": "51327101",
                              "07. latest trading day": "2020-01-30",
                              "08. previous close": "168.0400",
                              "09. change": "4.7400",
                              "10. change percent": "2.8208%"
                          }
                });
    const result = await request(app).get("/api/v1/prices?name=wix");
    expect(result.body.name).toEqual("Wix.com Ltd.");
    expect(result.body.price).toEqual("172.7800");
    expect(result.status).toEqual(200);
  });
});

describe("GET /api/v1/prices?symbol={company_symbol} - check data parsing, from successfull request", () => {
  it("should return company price and name correctly by symbol", async () => {
    nock("https://www.alphavantage.co")
          .get(/function=SYMBOL_SEARCH/)
          .reply(200, {
                    "bestMatches": [
                        {
                            "1. symbol": "Apple",
                            "2. name": "Apple Ltd.",
                            "3. type": "Equity",
                            "4. region": "United States",
                            "5. marketOpen": "09:30",
                            "6. marketClose": "16:00",
                            "7. timezone": "UTC-05",
                            "8. currency": "USD",
                            "9. matchScore": "1.0000"
                        }
                    ]
          });
          nock("https://www.alphavantage.co")
                .get(/function=GLOBAL_QUOTE/)
                .reply(200, {
                          "Global Quote": {
                              "01. symbol": "Apple",
                              "02. open": "174.0500",
                              "03. high": "174.0500",
                              "04. low": "170.7900",
                              "05. price": "172.7800",
                              "06. volume": "51327101",
                              "07. latest trading day": "2020-01-30",
                              "08. previous close": "168.0400",
                              "09. change": "4.7400",
                              "10. change percent": "2.8208%"
                          }
                });
    const result = await request(app).get("/api/v1/prices?symbol=APPL");
    expect(result.body.name).toEqual("Apple Ltd.");
    expect(result.body.price).toEqual("172.7800");
    expect(result.status).toEqual(200);
  });
});

describe("GET /api/v1/prices?name={company_name} - check when no input or company not found", () => {
  it("should return company not found and price equal to 0", async () => {
    nock("https://www.alphavantage.co")
          .get(/function=SYMBOL_SEARCH/)
          .reply(200, {
                    "bestMatches": []
          });
          nock("https://www.alphavantage.co")
                .get(/function=GLOBAL_QUOTE/)
                .reply(200, {
                          "Global Quote": {}
                });
    const result = await request(app).get("/api/v1/prices?name=apple");
    expect(result.body.name).toEqual("Company not found");
    expect(result.body.price).toEqual("0");
    expect(result.status).toEqual(200);
  });
  it("should return status 400 and request to input company name", async () => {
    const result = await request(app).get("/api/v1/prices");
    expect(result.status).toEqual(400);
    expect(result.text).toEqual("Please input company Symbol (APPL) or Name (Apple Inc.).");
  });
});
