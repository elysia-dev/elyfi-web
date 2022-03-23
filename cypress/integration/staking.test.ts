/* eslint-disable cypress/no-unnecessary-waiting */
const hoverStakingNav = () => {
  cy.get('.navigation__link__container > div:nth-child(3)').trigger(
    'mouseover',
  );
  cy.get(
    '.navigation__link__container > div:nth-child(3) > div > div > div:nth-child(2) > div',
  ).should('be.visible');
};
const onClickStakingType = (order: number, stakingType: string) => {
  cy.get(
    `.navigation__link__container > div:nth-child(3) > div > div > div:nth-child(2) > div > a:nth-child(${order})`,
  ).click();
  cy.url().should('include', `/ko/staking/${stakingType}`);
};

describe('Staking', () => {
  before(() => {
    cy.exec('yarn start');
  });
  it('successfully loads', () => {
    cy.visit('http://localhost:3000');
  });
  it('hover stasking nav', () => {
    hoverStakingNav();
  });
  it('EL staking redirect', () => {
    onClickStakingType(1, 'EL');
  });
  it('ELFI staking redirect', () => {
    hoverStakingNav();
    onClickStakingType(2, 'ELFI');
  });
  it('LP staking redirect', () => {
    hoverStakingNav();
    onClickStakingType(3, 'LP');
  });
});

describe('EL Staking', () => {
  it('connect wallet', () => {
    hoverStakingNav();
    onClickStakingType(1, 'EL');

    // Connect Wallet
    // cy.get('.navigation__mainnet__container > div > div').click();
    // cy.get('.navigation__mainnet__change-network__wrapper > div').click();
    // cy.get('.navigation__wallet__status').click();
    // cy.get('.wallet_select_modal > div > div:nth-child(3)').click();
  });
  it('staking', () => {
    cy.wait(3000)
      .get(
        '.staking__round__remaining-data__body > div:nth-child(1) > div > div > p',
      )
      .click();
    cy.wait(3000)
      .get('.modal__input > h2.modal__input__value > input')
      .type('500');
    cy.get('div > div:nth-child(6) > div > section > div > p')
      .click({
        force: true,
      })
      .wait(15000);
  });
  it('unstaking', () => {
    cy.get(
      '.staking__round__remaining-data__body > div:nth-child(1) > div > div > p',
    ).click();
    cy.get('.modal__converter > div:nth-child(2)')
      .click()
      .get('.modal__input > h2.modal__input__value > input')
      .type('500')
      .get('div > div:nth-child(6) > div > section > div > p')
      .click({
        force: true,
      })
      .wait(15000);
  });
  it('Claim reward', () => {
    cy.get(
      '.staking__round__remaining-data__body > div:nth-child(2) > div > div > p',
    ).click();
    cy.get('.modal__body > div.modal__button > p').click();
  });
});

describe('ELFI Staking', () => {
  it('elfi redirect', () => {
    hoverStakingNav();
    onClickStakingType(2, 'ELFI');
  });
  it('staking', () => {
    cy.wait(3000)
      .get(
        '.staking__round__remaining-data__body > div:nth-child(1) > div > div > p',
      )
      .click();
    cy.wait(3000)
      .get('.modal__input > h2.modal__input__value > input')
      .type('500');
    cy.get('div > div:nth-child(6) > div > section > div > p')
      .click({
        force: true,
      })
      .wait(15000);
  });
  it('unstaking', () => {
    cy.get(
      '.staking__round__remaining-data__body > div:nth-child(1) > div > div > p',
    ).click();
    cy.get('.modal__converter > div:nth-child(2)')
      .click()
      .get('.modal__input > h2.modal__input__value > input')
      .type('500')
      .get('div > div:nth-child(6) > div > section > div > p')
      .click({
        force: true,
      })
      .wait(15000);
  });
  it('claim reward', () => {
    cy.get(
      '.staking__round__remaining-data__body > div:nth-child(2) > div > div > p',
    ).click();
    cy.get('.modal__body > div.modal__button > p').click();
  });
});
