# kickstart-stocks-homework
Service for getting actual stock prices by company symbol

Task:


- Test (TDD) + замокаать реальные запросы во внешнее АПИ (смотреть nock)
- Сделать сервис для получения цены акций по символу акций компании
- GET /api/v1/prices?symbol=WIX 
    {
      name: <company_name>,
      price: <value_in_usd>
    }
- Сервис должен кешировать результат в памяти на 10 минут (смотреть lru-cache)
