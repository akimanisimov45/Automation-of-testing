const { Builder, By, until } = require('selenium-webdriver');
jest.setTimeout(30000);

describe('Перевірка головної сторінки https://automationexercise.com/', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  test('Перевірка наявності елементів на головній сторінці', async () => {
    await driver.get('https://automationexercise.com/');

    const homeLink = await driver.wait(
      until.elementLocated(By.linkText('Home')),
      10000
    );
    expect(homeLink).toBeDefined();
    const logo = await driver.wait(
      until.elementLocated(By.css('img[alt="Website for automation practice"]')),
      10000
    );
    expect(await logo.getAttribute('alt')).toBe('Website for automation practice');

    const signupButton = await driver.wait(
      until.elementLocated(By.linkText('Signup / Login')),
      10000
    );
    expect(await signupButton.getText()).toBe('Signup / Login');
  });

  test('Сценарій 1: Перевірка форми входу', async () => {
    await driver.get('https://automationexercise.com/');

    const signupButton = await driver.wait(
      until.elementLocated(By.linkText('Signup / Login')),
      10000
    );
    await signupButton.click();

    const emailInput = await driver.wait(
      until.elementLocated(By.css('input[data-qa="login-email"]')),
      10000
    );
    const passwordInput = await driver.findElement(By.css('input[data-qa="login-password"]'));

    await emailInput.sendKeys('user@example.com');
    await passwordInput.sendKeys('password123');
    const loginBtn = await driver.findElement(By.css('button[data-qa="login-button"]'));
    await loginBtn.click();
    
    const errorMessage = await driver.wait(
      until.elementLocated(By.css('.login-form p')),
      10000
    );
    expect(await errorMessage.getText()).toContain('Your email or password is incorrect!');
  });
});
