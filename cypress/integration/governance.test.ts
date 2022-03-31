/* eslint-disable cypress/no-unnecessary-waiting */
describe('Governance', () => {
  before(() => {
    cy.exec('yarn start');
  });
  it('successfully loads', () => {
    cy.visit('http://localhost:3000');
  });
  it('governance redirect', () => {
    cy.contains('거버넌스').click();
    cy.url().should('include', '/ko/governance');
  });
  it('BSC building forum redirect', () => {
    cy.wait(4000).get('.governance__grid > div').click();
  });
  it('change network', () => {
    cy.get('.navigation__mainnet__container > div > div').click();
    cy.get('.navigation__mainnet__change-network__wrapper > div').click();
  });
  it('ETH building forum redirect', () => {
    cy.wait(4000).get('.governance__grid > div').click();
  });
  it('ETH asset list', () => {
    cy.get('.component__loan-list__container > div:nth-child(1)').click();
    cy.url().should('include', '/ko/portfolio/');
  });
});
