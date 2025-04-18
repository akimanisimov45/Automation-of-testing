const {
    UserService,
    asyncHello,
    computeValue,
    asyncError,
    ApiClient,
    ApiHelper,
    calculateFinalPrice,
    OrderProcessor,
    getNumber,
  } = require('./labAssignment');
  
  global.fetch = jest.fn();
  
  describe('Завдання 1: UserService', () => {
    test('greet викликає getFullName і повертає правильний рядок', () => {
      const mockGetFullName = jest.fn().mockReturnValue('John Doe');
      const service = new UserService(mockGetFullName);
      const result = service.greet();
  
      expect(mockGetFullName).toHaveBeenCalledWith('John', 'Doe');
      expect(result).toBe('HELLO, JOHN DOE!');
    });
  });
  
  describe('Завдання 2: asyncHello', () => {
    test('повертає "hello world"', async () => {
      await expect(asyncHello()).resolves.toBe('hello world');
    });
  });
  
  describe('Завдання 3: computeValue', () => {
    test('повертає 94', async () => {
      await expect(computeValue()).resolves.toBe(94);
    });
  });
  
  describe('Завдання 4: asyncError', () => {
    test('відхиляється з помилкою "Something went wrong"', async () => {
      await expect(asyncError()).rejects.toThrow('Something went wrong');
    });
  });
  
  describe('Завдання 5: ApiClient.fetchData', () => {
    test('повертає дані з полем fetchedAt', async () => {
      const mockData = { id: 1, name: 'Test' };
      global.fetch.mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(mockData),
      });
  
      const client = new ApiClient();
      const result = await client.fetchData();
  
      expect(result).toMatchObject(mockData);
      expect(typeof result.fetchedAt).toBe('number');
    });
  });
  
  describe('Завдання 6: ApiHelper.fetchViaHelper', () => {
    test('повертає результат з apiCallFunction', async () => {
      const mockResponse = { status: 'ok' };
      const mockApiCall = jest.fn().mockResolvedValue(mockResponse);
  
      const helper = new ApiHelper();
      const result = await helper.fetchViaHelper(mockApiCall);
  
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('Завдання 7: calculateFinalPrice', () => {
    test('правильно рахує фінальну ціну', () => {
      const order = {
        items: [{ price: 100, quantity: 2 }],
        taxRate: 0.1,
        discountService: {
          getDiscount: () => 0.3,
        },
      };
      const result = calculateFinalPrice(order, order.discountService);
      expect(result).toBeCloseTo(154, 1);
    });
  
    test('викидає помилку для невалідного замовлення', () => {
      const badOrder = { items: [] };
      expect(() => calculateFinalPrice(badOrder)).toThrow('Invalid order');
    });
  });
  
  describe('Завдання 8: OrderProcessor.processOrder', () => {
    test('повертає конвертовану ціну', async () => {
      const mockConverter = jest.fn().mockResolvedValue(300);
      const order = {
        items: [{ price: 100, quantity: 1 }],
        taxRate: 0.2,
        currency: 'USD',
        discountService: {
          getDiscount: () => 0.1,
        },
      };
      const processor = new OrderProcessor(mockConverter);
      const result = await processor.processOrder(order, 'EUR');
      expect(result).toBe(300);
    });
  
    test('повертає оригінальну ціну, якщо конвертер кидає помилку', async () => {
      const mockConverter = jest.fn().mockRejectedValue(new Error('Fail'));
      const order = {
        items: [{ price: 100, quantity: 1 }],
        taxRate: 0.2,
        currency: 'USD',
        discountService: {
          getDiscount: () => 0,
        },
      };
      const processor = new OrderProcessor(mockConverter);
      const result = await processor.processOrder(order, 'EUR');
      expect(result).toBe(120);
    });
  });
