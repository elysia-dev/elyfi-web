import NavigationType from 'src/enums/NavigationType';


export interface ISubNavigation {
  type: NavigationType;
  location: string;
  i18nKeyword: string;
}
export interface INavigation {
  id: number;
  type: NavigationType;
  location: string;
  i18nKeyword: string;
  subNavigation?: ISubNavigation[];
}

export const navigationLink: INavigation[] = [
  {
    id: 1,
    type: NavigationType.Link,
    location: '/deposit',
    i18nKeyword: 'navigation.dashboard',
  },
  {
    id: 2,
    type: NavigationType.Link,
    location: `/governance`,
    i18nKeyword: 'navigation.governance',
  },
  {
    id: 3,
    type: NavigationType.LNB,
    location: `/staking`,
    i18nKeyword: 'navigation.staking',
    subNavigation: [
      {
        type: NavigationType.Link,
        location: `/staking/EL`,
        i18nKeyword: 'navigation.ELStake',
      },
      {
        type: NavigationType.Link,
        location: `/staking/ELFI`,
        i18nKeyword: 'navigation.ELFIStake',
      },
      {
        type: NavigationType.Link,
        location: `/staking/LP`,
        i18nKeyword: 'navigation.LPStake',
      },
    ],
  },
  {
    id: 4,
    type: NavigationType.LNB,
    location: '/docs',
    i18nKeyword: 'navigation.docs',
    subNavigation: [
      {
        type: NavigationType.Href,
        location: "navigation.link.docs",
        i18nKeyword: "navigation.elyfi_docs"
      },
      {
        type: NavigationType.Href,
        location: "navigation.link.guide",
        i18nKeyword: "navigation.elyfi_guide"
      },
      {
        type: NavigationType.Href,
        location: "navigation.link.governance_docs",
        i18nKeyword: "navigation.governance_docs"
      }
    ],
  },
];
