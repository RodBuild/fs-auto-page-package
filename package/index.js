/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  static open(path) {
    return browser.url(`https://beta.familysearch.org/en${path}`);
  }
  static async loginfacebook(username, password) {
    // const arr = await this.getallwindows();
    // await browser.switchToWindow(arr[1]); // check by title and stuff1
    await this.switchwindowfilter('www.facebook.com');
    const title = await browser.getTitle();
    await console.log('title: ' + title);
    if (title != 'Send a Message' && title != 'Post To Facebook') {
      await (await $('[id="email"]')).setValue(username);
      await (await $('[id="pass"]')).setValue(password);
      await (await $('[name="login"]')).click();
    } else {
      await console.log('Skipped Facebook logging-in');
    }
    // await (await $('[id="email"]')).setValue(username);
    // await (await $('[id="pass"]')).setValue(password);
    // await (await $('input[name="login"]')).click();
    // await (await $$('[id="email"]')[0]).setValue(username);
    // await (await $$('[id="pass"]')[0]).setValue(password);
  }
  static async logintwitter(username, password) {
    await this.switchwindowfilter('twitter.com');
    await browser.pause(1200);
    const title = await browser.getTitle();
    // await console.log('main: ' + title);
    // Check if user is already logged in
    // IF title == 'Twitter' we need to login
    if (title === 'Twitter') {
      // 1. Find and click LOGIN button
      await browser.waitUntil(
        async function () {
          return await (await $('[data-testid="sheetDialog"]')).isExisting();
        },
        { timeoutMsg: 'Twitter: Login button was not found' }
      );
      await await $$('[role="button"]')[1].click();

      // 2. Fill first input box, USERNAME
      await browser.waitUntil(
        async function () {
          return await (await $$('input')[0]).isExisting();
        },
        { timeoutMsg: 'Twitter: Username box was not found' }
      );
      await (await $$('input')[0]).setValue(username);

      // 3. Find and click NEXT button
      await (await $$('[role="button"]')[2]).click();

      // 4. Fill second input box, PASSWORD
      await browser.waitUntil(
        async function () {
          return await (await $$('input')[1]).isExisting();
        },
        {
          timeoutMsg: 'Twitter: Password box was not found',
        }
      );
      await (await $$('input')[1]).setValue(password);

      // 5. Find and click last LOGIN button
      await (await $$('[role="button"]')[3]).click();
    }
    // Else, title is 'Home/Twitter'
    else {
      await console.log('Skipped Twitter logging-in');
    }
  }
  static async login(username, password) {
    await (await $('[id="userName"]')).setValue(username);
    await (await $('[id="password"]')).setValue(password);
    await (await $('[id="login"')).click();
  }
  static async logout() {
    // await browser.pause(6000000);
    // await browser.debug();
    await (
      await $(
        '#app-content-scroller > div > div > div > div > div.shadowCss_s1a4lfa8.elevationBaseCss_e1vn31hu.e0_e1gfhbk9 > header > div:nth-child(2) > div > div:nth-child(7) > div:nth-child(1) > button'
      )
    ).click();
    await (await $('a[href="/auth/logout"]')).click();
  }
  /**
   * Not too fast cowboy!
   * @param seconds to keep it simple
   */
  static pause(seconds) {
    return browser.pause(seconds * 1000);
  }
  /**
   * Scroll through the screen
   * @param x horizontal scroll
   * @param y vertical scroll (most common)
   */
  static scroll(x, y) {
    return browser.scroll(x, y);
  }
  /**
   * Open a new tab
   *
   * Default url: https://beta.familysearch.org/
   * @param url target website
   */
  static opennewtab(url = 'https://beta.familysearch.org/') {
    return browser.newWindow(url);
  }
  /**
   * Switch the focus to a different window based
   * of the filter argument.
   * @param filter title or url of desired window
   */
  static switchwindowfilter(filter) {
    return browser.switchWindow(filter);
  }
  /**
   * Return an array with **all** opened windows
   */
  static getallwindows() {
    return browser.getWindowHandles();
  }
  /**
   * Close all windows **except** the main window
   */
  static async closeallwindows() {
    const arr = await this.getallwindows();
    for (let i = 1; i < arr.length; i++) {
      await browser.switchToWindow(arr[i]);
      await browser.closeWindow();
    }
    await browser.switchToWindow(arr[0]);
  }

  /**
   * Clear user tree data - handy to avoid doing it yourself! 😁
   * @param callback redirect to a different URL than beta.familysearch.org
   */
  static async cleartree(callback = 'https://beta.familysearch.org/en') {
    const reasons = [
      'idk',
      'Because I want to',
      '🤫🤫🤫🤫',
      'Hello',
      'I like apples',
      'Deep Fried French Fries',
    ];
    const reason = Math.floor(Math.random() * reasons.length);
    await browser.url(`https://beta.familysearch.org/tree/person`);
    await browser.pause(3000);
    await $('[data-testid="parent-child-relationship-view-button"]').click();
    await browser.pause(1500);
    await $('[data-testid="child-remove-replace-button"]').click();
    await browser.pause(1500);
    await $('[data-testid="signed"]').click();
    await browser.pause(1500);
    await $('[data-testid="remove-button"]').click();
    await browser.pause(1500);
    await $('[data-testid="reason-textarea"]').setValue(reasons[reason]);
    await browser.pause(1500);
    await $('[data-testid="reason-dialog-save-button"]').click();
    await browser.url(callback);
  }
  /**
   * Return array of available languages in BETA.FamilySearch
   * @returns array[] with all available languages in FamilySearch
   */
  static async getlanguages() {
    await $$('header > div:nth-child(2) button')[0].click();
    await browser.pause(1000);
    let lang = [];
    let arr = await $$('input[name="locale"]');

    for (let i = 0; i < arr.length; i++) {
      await lang.push(await arr[i].getAttribute('value'));
    }
    await $$('div[portal=overlays] div[data-size=md] > div:nth-child(4) button')[0].click();
    return lang;
  }
  /**
   * Change language of page
   * @param lang language based on two characters. Ex: en-english, it-italian
   */
  static async changelanguage(lang = 'en') {
    // await browser.debug();
    await $$('header > div:nth-child(2) button')[0].click();
    await browser.pause(1000);
    await $(`[name="locale"][value="${lang}"]`).click();
    await $$('div[portal=overlays] div[data-size=md] > div:nth-child(4) button')[1].click();
  }
  static async test() {
    return await $('[class="text"');
  }
}
