export interface StyleTemplate {
  key: string
  label: string
  labelZh: string
  prefix: string
  suffix: string
  colors: string
}

export const STYLE_TEMPLATES: StyleTemplate[] = [
  {
    key: '3d-relief',
    label: '3D Relief',
    labelZh: '3D 浮雕',
    prefix: '3D relief model of',
    suffix: '--ar 16:9 --style raw',
    colors: 'on an aged blueprint, miniatures, macro photography.',
  },
  {
    key: 'watercolor',
    label: 'Watercolor',
    labelZh: '水彩',
    prefix: 'Watercolor painting of',
    suffix: '--ar 16:9 --style raw',
    colors: 'soft transparent washes, wet-on-wet technique, visible paper texture.',
  },
  {
    key: 'cyberpunk',
    label: 'Cyberpunk',
    labelZh: '賽博龐克',
    prefix: 'Cyberpunk neon-lit reimagination of',
    suffix: '--ar 16:9 --style raw',
    colors: 'electric neon pink, cyan, and purple holographic tones, rain-slicked streets.',
  },
  {
    key: 'ukiyo-e',
    label: 'Ukiyo-e',
    labelZh: '浮世繪',
    prefix: 'Japanese ukiyo-e woodblock print style depiction of',
    suffix: '--ar 16:9 --style raw --niji 6',
    colors: 'flat color planes, bold outlines, traditional indigo and vermillion palette.',
  },
  {
    key: 'steampunk',
    label: 'Steampunk',
    labelZh: '蒸汽龐克',
    prefix: 'Victorian steampunk reimagination of',
    suffix: '--ar 16:9 --style raw',
    colors: 'brass gears, copper pipes, steam vents, clockwork mechanisms, sepia-toned.',
  },
]
