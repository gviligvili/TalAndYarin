import { ESPPage } from './app.po';

describe('esp App', () => {
  let page: ESPPage;

  beforeEach(() => {
    page = new ESPPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
