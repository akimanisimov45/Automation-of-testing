const { Builder, By, until } = require('selenium-webdriver');

describe('Wikipedia Tests', () => {
  let driver;

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  }, 15000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  }, 15000);

  test('Перевірка основних елементів', async () => {
    await driver.get('https://www.wikipedia.org');
    
    // Пошукове поле (id)
    const searchInput = await driver.findElement(By.id('searchInput'));
    expect(searchInput).toBeDefined();
    
    // Логотип (CSS селектор)
    const logo = await driver.findElement(By.css('svg[class="svg-Wikipedia_wordmark"]'));
    expect(logo).toBeDefined();
  });
  test('Пошук на Wikipedia', async () => {
    await driver.get('https://www.wikipedia.org');
    
    // Введення тексту
    const searchInput = await driver.findElement(By.id('searchInput'));
    await searchInput.sendKeys('Selenium');
    
    // Натискання Enter
    await searchInput.sendKeys('\n');
    
    // Очікування результатів
    await driver.wait(until.titleContains('Selenium'), 5000);
    const title = await driver.getTitle();
    expect(title).toMatch(/Selenium/);
  });
  test('Перевірка сторінки статті', async () => {
    await driver.get('https://en.wikipedia.org/wiki/Selenium');
    
    // Заголовок через XPath
    const title = await driver.findElement(
      By.xpath('//h1[@id="firstHeading"]')
    ).getText();
    expect(title).toContain('Selenium');
    
    // Посилання у меню (CSS)
    const links = await driver.findElements(
      By.css('#p-navigation .vector-menu-content-list a')
    );
    expect(links.length).toBeGreaterThan(0);
    
    // Перевірка посилань
    const firstLinkHref = await links[0].getAttribute('href');
    expect(firstLinkHref).toMatch(/wikipedia\.org/);
  });
  test('Інтерактивні дії та CSS перевірки', async () => {
    await driver.get('https://en.wikipedia.org/wiki/Selenium');
    
    // Клік на посилання
    const link = await driver.wait(
      until.elementLocated(By.css('#mw-content-text a')),
      5000
    );
    await link.click();
    
    // Очікування зміни URL
    await driver.wait(until.urlContains('wiki/'), 5000);
    
    // Перевірка CSS властивості
    const header = await driver.findElement(By.css('h1'));
    const color = await header.getCssValue('color');
    expect(color).toBe('rgba(0, 0, 0, 1)'); // Чорний колір
  });
});
