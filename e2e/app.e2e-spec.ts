import { AnglarCliLoginPage } from './app.po';

describe('anglar-cli-login App', function() {
  let page: AnglarCliLoginPage;

  beforeEach(() => {
    page = new AnglarCliLoginPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
