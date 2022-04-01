describe('Connect wallet', () => {
  before(() => {
    cy.exec('yarn start');
  });
  it('successfully loads', () => {
    cy.visit('http://localhost:3000');
  });
  it('connect wallet', () => {
    cy.get('.navigation__wallet__status').click();
    cy.get('.wallet_select_modal > div > div:nth-child(3)').click();
  });
});

describe('DisConnect wallet', () => {
  before(() => {
    cy.exec('yarn start');
  });
  it('successfully loads', () => {
    cy.visit('http://localhost:3000');
  });
  it('disconnect wallet', () => {
    cy.get('.navigation__wallet__wrapper').click();
    cy.get('.modal__account__mainnet-info > div:nth-child(2)').click();
  });
});
