import { CronEditorPage } from './app.po';

describe('cron-editor App', () => {
  let page: CronEditorPage;

  beforeEach(() => {
    page = new CronEditorPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
