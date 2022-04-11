/* eslint-disable cypress/no-unnecessary-waiting */
describe('Deposit page', () => {
  before(() => {
    cy.exec('yarn start');
  });
  it('successfully loads', () => {
    cy.visit('http://localhost:3000/ko/deposit');
  });
  it('BUSD reward plan', () => {
    cy.get('.reward-plan-button > a > p').click();
    cy.url().should('include', '/ko/rewardplan/deposit');
    cy.get('.component__text-navigation > p.pointer').click();
    cy.url().should('include', '/ko/deposit');
  });
  it('BUSD detail page', () => {
    cy.get('.deposit__table__header').click();
    cy.url().should('include', '/ko/deposit/BUSD');
    cy.get('.component__text-navigation > p.pointer').click();
    cy.url().should('include', '/ko/deposit');
  });
  it('change network', () => {
    cy.get('.navigation__mainnet__container > div > div').click();
    cy.get('.navigation__mainnet__change-network__wrapper > div').click();
  });
  it('ETH reward plan', () => {
    cy.get('.reward-plan-button > a > p').click();
    cy.url().should('include', '/ko/rewardplan/deposit');
    cy.get('.component__text-navigation > p.pointer').click();
    cy.url().should('include', '/ko/deposit');
  });
  it('DAI detail page', () => {
    cy.get(
      '.deposit__table__wrapper > div:nth-child(1) > div.deposit__table__header',
    ).click();
    cy.url().should('include', '/ko/deposit/DAI');
    cy.get('.component__text-navigation > p.pointer').click();
    cy.url().should('include', '/ko/deposit');
  });
  it('USDT detail page', () => {
    cy.get(
      '.deposit__table__wrapper > div:nth-child(2) > div.deposit__table__header',
    ).click();
    cy.url().should('include', '/ko/deposit/USDT');
    cy.get('.component__text-navigation > p.pointer').click();
    cy.url().should('include', '/ko/deposit');
  });
  it('DAI loaned building ', () => {
    cy.get(
      '.deposit__table__wrapper > div:nth-child(1) > div.deposit__table__body > div.deposit__table__body__loan-list > div > div:nth-child(2) > div > div:nth-child(1)',
    ).click();
    cy.url().should('include', '/ko/portfolio');
    cy.get('.component__text-navigation > p.pointer').click();
    cy.url().should('include', '/ko/deposit');
  });
  it('USDT loaned building ', () => {
    cy.get(
      '.deposit__table__wrapper > div:nth-child(2) > div.deposit__table__body > div.deposit__table__body__loan-list > div > div:nth-child(2) > div > div:nth-child(1)',
    ).click();
    cy.url().should('include', '/ko/portfolio');
    cy.get('.component__text-navigation > p.pointer').click();
    cy.url().should('include', '/ko/deposit');
  });
  it('change network', () => {
    cy.get('.navigation__mainnet__container > div > div').click();
    cy.get('.navigation__mainnet__change-network__wrapper > div').click();
  });
  it('deposit and reward btn And connect wallet', () => {
    cy.get('.deposit__table__body__amount__button > p').click({
      multiple: true,
      force: true,
    });
    cy.get('.modal__button > p').click({
      multiple: true,
      force: true,
    });
    cy.get('.wallet_select_modal > div > div:nth-child(3)').click({
      multiple: true,
      force: true,
    });
  });
});

describe('Bsc Deposit', () => {
  before(() => {
    cy.exec('yarn start');
  });

  it('successfully loads', () => {
    cy.visit('http://localhost:3000/ko/deposit');
  });

  it('sand Transaction', () => {
    cy.contains('예치 | 출금').wait(3000).click({
      force: true,
    });
    cy.wait(5000)
      .contains('금액을 입력하세요')
      .get('.modal__input__value')
      .type('500');
    cy.contains('예치하기').click({
      force: true,
    });
  });

  it('wait for the transaction and click the button', () => {
    cy.wait(15000)
      .contains('예치 | 출금')
      .click({
        force: true,
      })
      .get('.modal__converter > div:nth-child(2)')
      .click();
  });

  it('withdraw DAI', () => {
    cy.contains('금액을 입력하세요').get('.modal__input__value').type('500');
    cy.contains('출금하기').click().wait(20000);
  });

  it('claim reward', () => {
    cy.wait(4000).contains('수령하기').click({
      force: true,
    });
    cy.wait(3000);
    cy.get('.modal__button > p').click();
  });
});

describe('Eth deposit', () => {
  before(() => {
    cy.exec('yarn start');
  });

  it('successfully loads', () => {
    cy.visit('http://localhost:3000/ko/deposit');
  });

  it('sand Transaction', () => {
    cy.contains('예치 | 출금').wait(3000).click({
      force: true,
    });
    cy.wait(5000)
      .contains('금액을 입력하세요')
      .get('.modal__input__value')
      .type('500');
    cy.contains('예치하기').click({
      force: true,
    });
  });

  it('wait for the transaction and click the button', () => {
    cy.wait(15000)
      .contains('예치 | 출금')
      .click({
        force: true,
      })
      .get('.modal__converter > div:nth-child(2)')
      .click();
  });

  it('withdraw DAI', () => {
    cy.contains('금액을 입력하세요').get('.modal__input__value').type('500');
    cy.contains('출금하기').click().wait(20000);
  });

  it('claim reward', () => {
    cy.wait(4000)
      .get('.event-button')
      .first()
      .click({
        force: true,
        multiple: true,
      })
      .get('.modal__button')
      .click();
  });
});
