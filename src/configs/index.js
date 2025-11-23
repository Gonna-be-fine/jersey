export const LogoPrevList = [
  {
    name: 'FE_LOGO_BACKGROUND_REVERSE',
    ename: 'FE_LOGO_BACKGROUND_REVERSE',
    id: 'FE_LOGO_BACKGROUND_REVERSE',
  },
  {
    name: 'LOGO_BOTTOM_REVERSE',
    ename: 'LOGO_BOTTOM_REVERSE',
    id: 'LOGO_BOTTOM_REVERSE',
  },
  {
    name: 'LOGO_BACK_REVERSE',
    ename: 'LOGO_BACK_REVERSE',
    id: 'LOGO_BACK_REVERSE',
  },
  {
    name: 'LOGO_TOP_RIGHT_REVERSE',
    ename: 'LOGO_TOP_RIGHT_REVERSE',
    id: 'LOGO_TOP_RIGHT_REVERSE',
  },
  {
    name: 'LOGO_TOP_LEFT_REVERSE',
    ename: 'LOGO_TOP_LEFT_REVERSE',
    id: 'LOGO_TOP_LEFT_REVERSE',
  },
  {
    name: 'LOGO_TEAM_REVERSE',
    ename: 'LOGO_TEAM_REVERSE',
    id: 'LOGO_TEAM_REVERSE',
  },
  {
    name: 'FE_LOGO_REVERSE',
    ename: 'FE_LOGO_REVERSE',
    id: 'FE_LOGO_REVERSE',
  },
  {
    name: 'FE_LOGO_BACKGROUND',
    ename: 'FE_LOGO_BACKGROUND',
    id: 'FE_LOGO_BACKGROUND',
  },
  {
    name: 'LOGO_BOTTOM',
    ename: 'LOGO_BOTTOM',
    id: 'LOGO_BOTTOM',
  },
  {
    name: 'LOGO_BACK',
    ename: 'LOGO_BACK',
    id: 'LOGO_BACK',
  },
  {
    name: 'LOGO_TOP_RIGHT',
    ename: 'LOGO_TOP_RIGHT',
    id: 'LOGO_TOP_RIGHT',
  },
  {
    name: 'LOGO_TOP_LEFT',
    ename: 'LOGO_TOP_LEFT',
    id: 'LOGO_TOP_LEFT',
  },
  {
    name: 'LOGO_TEAM',
    ename: 'LOGO_TEAM',
    id: 'LOGO_TEAM',
  },
];

export const ColorPrevList = [
  {
    name: '基础色',
    id: 'COLOUR_BASE',
    ename: 'Base Color',
  },
  {
    name: '肩部与袖子', // 衣领-衣袖
    id: 'COLOUR_SECONDARY',
    ename: 'Shoulder & Sleeves',
  },
  {
    name: '辅助色', //
    id: 'COLOUR_PRIMARY',
    ename: 'Accent Color',
  },
  {
    name: '下摆边色', //
    id: 'COLOUR_HEM',
    ename: 'Hem Color',
  },
  {
    name: '背面基础色', //
    id: 'COLOUR_BASE_REVERSE',
    ename: 'Reverse Base Color',
  },
  {
    name: '背面肩部与袖子', //
    id: 'COLOUR_SECONDARY_REVERSE',
    ename: 'Reverse Shoulder & Sleeves',
  },
  {
    name: '背面辅助色', //
    id: 'COLOUR_PRIMARY_REVERSE',
    ename: 'Reverse Accent Color',
  },
  {
    name: '第三颜色', //
    id: 'COLOUR_TERTIARY',
    ename: 'Tertiary Color',
  },
];

export const TextPrevList = [];
export const DefaultTextItem = {
  text: 'NAME',
  fill: '#ffffff',
  fontSize: 40,
  fontFamily: 'serif',
  fontWeight: 500,
  charSpacing: 100,
  textAlign: 'center',
  lineHeight: 1.2,
  fontStyle: 'normal',
  underline: false,
  stroke: '',
  strokeWidth: 1,
  curveValue: 50,
};

export function pickTextOptions(text) {
  const options = JSON.parse(JSON.stringify(DefaultTextItem));
  for (const key in options) {
    options[key] = text[key];
  }
  return options;
}

export const ColorList = [
  '#FCE6F5',
  '#FD9ACC',
  '#ff4081',
  '#C23281',
  '#512433',
  '#b71c1c',
  '#d50000',
  '#ff8a80',
  '#ff6f00',
  '#ffa000',
  '#ffd54f',
  '#F8DD18',
  '#fff59d',
  '#c5e1a5',
  '#8bc34a',
  '#1b5e20',
  '#293F21',
  '#006064',
  '#4db6ac',
  '#a3e4d7',
  '#CAEEFB',
  '#64b5f6',
  '#1e88e5',
  '#283593',
  '#17386E',
  '#232156',
  '#5c6bc0',
  '#b39ddb',
  '#884ea0',
  '#642F92',
  '#4a148c',
  '#fff8e1',
  '#bcaaa4',
  '#A49C86',
  '#6d4c41',
  '#838181',
  '#383838',
  '#000000',
  '#FFFFFF',
];

export const FontTypeList = [
  {
    type: 'American Captain',
    url: '',
    base64: '/fonts/css/American_Captain.css',
    img: '',
  },
  {
    type: 'Athletic',
    url: '',
    base64: '/fonts/css/Athletic.css',
    img: '',
  },
  {
    type: 'Komikazoom',
    url: '',
    base64: '/fonts/css/Komikazoom.css',
    img: '',
  },
  {
    type: 'Marguerite',
    url: '',
    base64: '/fonts/css/Marguerite.css',
    img: '',
  },
  {
    type: 'DELIRIUM NCV',
    url: '',
    base64: '/fonts/css/DELIRIUM_NCV.css',
    img: '',
  },
  {
    type: 'High Trash',
    url: '/fonts/HighTrash-R92KV.otf',
    base64: '/fonts/HighTrash-R92KV.css',
    img: '/fonts/image/HighTrash.png',
  },
  {
    type: 'AirAmerica',
    url: '/fonts/AirAmericanaBoldItalic-3ln18.ttf',
    img: '/fonts/image/AirAmerica.png',
  },
  {
    type: 'summber-bike',
    url: '/fonts/SummerBike-Wpdm4.otf',
    img: '/fonts/image/summber-bike.png',
  },
];
