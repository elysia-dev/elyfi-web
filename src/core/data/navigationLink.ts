import NavigationType from 'src/enums/NavigationType';

export interface INavigation {
  id: number;
  type: NavigationType;
  location: string;
  i18nKeyword: string;
  subNavigation?: {
    type: NavigationType;
    location: string;
    i18nKeyword: string;
  }[]
}

export const navigationLink: INavigation[] = [
  {
    id: 1,
    type: NavigationType.Link,
    location: `/dashboard`,
    i18nKeyword: "navigation.dashboard"
  },
  {
    id: 2,
    type: NavigationType.Link,
    location: `/governance`,
    i18nKeyword: "navigation.governance"
  },
  {
    id: 3,
    type: NavigationType.LNB,
    location: `/staking`,
    i18nKeyword: "navigation.staking",
    subNavigation: [
      {
        type: NavigationType.Link,
        location: `/staking/EL`,
        i18nKeyword: "navigation.ELStake"
      },
      {
        type: NavigationType.Link,
        location: `/staking/ELFI`,
        i18nKeyword: "navigation.ELFIStake"
      },
      {
        type: NavigationType.Link,
        location: `/staking/LP`,
        i18nKeyword: "navigation.LPStake"
      },
    ]
  },
  {
    id: 4,
    type: NavigationType.LNB,
    location: '/docs',
    i18nKeyword: "navigation.docs",
    subNavigation: [
      {
        type: NavigationType.Href,
        location: "https://elysia.gitbook.io/elysia.finance/",
        i18nKeyword: "navigation.elyfi_docs"
      },
      {
        type: NavigationType.Link,
        location: `/governance`, 
        i18nKeyword: "navigation.governance_docs"
      }
    ]
  },
  {
    id: 5,
    type: NavigationType.Link,
    location: `/guide`,
    i18nKeyword: "navigation.guide"
  },
  {
    id: 6,
    type: NavigationType.Href,
    location: 'https://info.uniswap.org/#/pools/0xbde484db131bd2ae80e44a57f865c1dfebb7e31f',
    i18nKeyword: "navigation.uniswap_elfi"
  }
]
