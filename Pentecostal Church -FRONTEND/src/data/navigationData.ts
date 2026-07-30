export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const organizationSections: NavSection[] = [
  {
    title: 'Quick Access',
    items: [
      { label: 'Feedback', href: '/recomendations' },
      { label: 'Financials', href: '/financial' }
    ],
  },
  {
    title: 'Boards',
    items: [
      { label: 'ICT Board', href: '/boards/ict' },
      { label: 'Media Board', href: '/boards/media' },
      { label: 'Communication Board', href: '/boards/communication' },
      { label: 'Editorial Board', href: '/boards/editorial' },
      { label: 'Software Dev Board', href: '/boards/software' },
    ],
  },
  {
    title: 'Evangelistic Teams',
    items: [
      { label: 'RIVET', href: '/ets/rivet' },
      { label: 'ESET', href: '/ets/eset' },
      { label: 'WESO', href: '/ets/weso' },
      { label: 'NET', href: '/ets/net' },
      { label: 'CET', href: '/ets/cet' },
    ],
  },
  {
    title: 'Ministries',
    items: [
      { label: 'Praise & Worship', href: '/ministries/praiseAndWorship' },
      { label: 'Choir', href: '/ministries/choir' },
      { label: 'Instrumentalists (Wananzambe)', href: '/ministries/wananzambe' },
      { label: 'High School', href: '/ministries/highSchool' },
      { label: 'Church School', href: '/ministries/churchSchool' },
      { label: 'Creativity', href: '/ministries/creativity' },
      { label: 'Intercessory', href: '/ministries/intercessory' },
      { label: 'Ushering & Hospitality', href: '/ministries/ushering' },
      { label: 'Compassion & Counseling', href: '/ministries/compassion' },
    ],
  },
  {
    title: 'Fellowships',
    items: [
      {
        label: 'Class Fellowships',
        children: [
          { label: 'First Years', href: '/classFellowship' },
          { label: 'Second Years', href: '/classFellowship' },
          { label: 'Third Years', href: '/classFellowship' },
          { label: 'Fourth Years', href: '/classFellowship' },
        ],
      },
      { label: 'Brothers Fellowship', href: '/brothersfellowship' },
      { label: 'Sisters Fellowship', href: '/sistersfellowship' },
    ],
  },
  {
    title: 'Committees',
    items: [
      { label: 'Sub Executive Committee', href: '/other-committees' },
      { label: 'Sub Committee', href: '/other-committees' },
      { label: 'Bible Study Committee', href: '/other-committees#bible-study' },
      { label: 'Best-P Committee', href: '/other-committees#best-p' },
      { label: 'Christian Minds Committee', href: '/christianminds' },
      { label: 'Discipleship Committee', href: '/other-committees#discipleship' },
      { label: 'Prayer Committee', href: '/other-committees#prayer' },
      { label: 'Orientation Committee', href: '/other-committees#orientation' },
      { label: 'Strategic Plan Implementation', href: '/other-committees#strategic-plan' },
      { label: 'Elders Committee', href: '/elders' },
      { label: 'Development Committee', href: '/other-committees#development' },
      { label: 'Accounts Committee', href: '/other-committees#accounts' },
      { label: 'Worship Committee', href: '/other-committees#worship' },
      { label: 'Missions Committee', href: '/other-committees#missions' },
    ],
  },
  {
    title: 'Classes',
    items: [
      { label: 'Best-P Classes', href: '/bestpClass' },
      { label: 'Discipleship Class', href: '/discipleship' },
    ],
  },
  {
    title: 'Leadership',
    items: [
      { label: 'Executive Committee', href: '/leadership' },
      { label: 'Sub-Committee', href: '/other-committees' },
      {
        label: 'Other Committees',
        children: [
          { label: 'Sub Executive Committee', href: '/other-committees' },
          { label: 'Bible Study Committee', href: '/other-committees#bible-study' },
          { label: 'Best-P Committee', href: '/other-committees#best-p' },
          { label: 'Christian Minds Committee', href: '/christianminds' },
          { label: 'Discipleship Committee', href: '/other-committees#discipleship' },
          { label: 'Prayer Committee', href: '/other-committees#prayer' },
          { label: 'Orientation Committee', href: '/other-committees#orientation' },
          { label: 'Strategic Plan Implementation', href: '/other-committees#strategic-plan' },
          { label: 'Elders Committee', href: '/elders' },
          { label: 'Development Committee', href: '/other-committees#development' },
          { label: 'Accounts Committee', href: '/other-committees#accounts' },
          { label: 'Worship Committee', href: '/other-committees#worship' },
          { label: 'Missions Committee', href: '/other-committees#missions' },
        ],
      },
    ],
  },
];

// Grouped navigation for the Header mega-menu
export const headerNavGroups = {
  services: organizationSections[0], // Quick Access
  mediaDesk: [
    { label: 'News', href: '/news' },
    { label: 'Gallery', href: '/media' },
    {
      label: 'Socials',
      children: [
        { label: 'TikTok', href: 'https://www.tiktok.com/@rikurumapentecostal', external: true },
        { label: 'YouTube', href: 'https://www.youtube.com/@savedbychriststainedbylove', external: true },
        { label: 'Facebook', href: 'https://www.facebook.com/share/18rhcZ1XpA/', external: true },
        { label: 'Instagram', href: 'https://www.instagram.com/rpc_nyamira', external: true },
        { label: 'X (Twitter)', href: 'https://x.com/rpcnyamira', external: true },
      ],
    },
  ] as NavItem[],
  organization: [
    organizationSections[1], // Boards
    organizationSections[2], // Evangelistic Teams
    organizationSections[3], // Ministries
    organizationSections[4], // Fellowships
  ],
  governance: [
    organizationSections[7], // Leadership (now first, includes Other Committees)
    {
      title: 'Governing Docs',
      items: [
        { label: 'Constitution', href: '/pdfs/constitution.pdf', external: true },
        { label: 'Church Handbook', href: '/handbook' },
        { label: 'Financial Policy', href: '#' },
        { label: 'Partnership Policies', href: '#' },
      ],
    },
  ],
  aboutUs: [
    { label: 'Who We Are', href: '/about#who-we-are' },
    { label: 'Our History', href: '/about#our-history' },
    { label: 'Vision & Mission', href: '/about#vision-mission' },
    { label: 'Statement of Faith', href: '/about#statement-of-faith' },
  ] as NavItem[],
};
