describe('Main page', () => {
  before(() => {
    cy.exec('yarn start');
  });
  it('successfully loads', () => {
    cy.visit('http://localhost:3000');
  });
  it('deposit', () => {
    cy.get('.main__title__button.pc-only > div:nth-child(1) > p').click();
    cy.url().should('include', '/ko/deposit');
    cy.go(-1);
  });
  it('learn more about', () => {
    cy.contains('자세히 알아보기').click();
  });
  it('check APR', () => {
    cy.get(
      '.root-container > div:nth-child(2) > div.main__content > div:nth-child(2) > div > p',
    ).click();
    cy.url().should('include', '/rewardplan/deposit');
    cy.go(-1);
  });
  it('check collateral', () => {
    cy.get(
      '.main.root-container > div:nth-child(3) > div.main__content > div:nth-child(2) > div > p',
    ).click();
    cy.url().should('include', '/deposit');
    cy.go(-1);
  });
  it('check Governance', () => {
    cy.get(
      '.root-container > div:nth-child(4) > div.main__content > div:nth-child(2) > div > p',
    ).click();
    cy.url().should('include', '/governance');
    cy.go(-1);
  });
  it('offchain governance', () => {
    cy.get('.main__governance__content > div:nth-child(2)').click();
  });
  it('onchain governance', () => {
    cy.get('.main__governance__converter > div:nth-child(2)').click();
    cy.get('.main__governance__content > div:nth-child(2)').click();
  });
});
