/** India vernacular atlas — state → region → day-to-day language. */

export interface Region {
  key: string
  label: string
  lang: string
  note: string
}

export interface StateEntry {
  key: string
  label: string
  glyph: string
  note: string
  regions: Region[]
}

/** Soft brand display — gaali softened for public surfaces. */
export const BRAND = {
  short: 'BKC',
  full: 'Bharat Ka Ch**tiya',
  fullSpoken: 'Bharat Ka Chootiya',
  softWord: 'Ch**tiya',
  hinglishLockup: 'चूtiya',
  motto: 'From gaali to habit — the affectionate idiot.',
  differentiator:
    'Shop by where you speak: state → region → day-to-day slang. One atlas. One cart.',
} as const

export const STATES: StateEntry[] = [
  {
    key: 'uttarakhand',
    label: 'Uttarakhand',
    glyph: '🏔️',
    note: 'Pahadi pride — Kumaon and Garhwal speak differently, and both get their own prints.',
    regions: [
      { key: 'kumaon', label: 'Kumaon', lang: 'Kumaoni', note: 'Naini, Almora, Pithoragarh energy.' },
      { key: 'garhwal', label: 'Garhwal', lang: 'Garhwali', note: 'Dehradun to Chamoli — औखाण included.' },
    ],
  },
  {
    key: 'punjab',
    label: 'Punjab',
    glyph: '🌾',
    note: 'Chak de energy, yaar register, everyday Punjabi.',
    regions: [
      { key: 'majha', label: 'Majha', lang: 'Punjabi', note: 'Amritsar–Gurdaspur belt.' },
      { key: 'malwa', label: 'Malwa', lang: 'Punjabi', note: 'Ludhiana–Bathinda swagger.' },
    ],
  },
  {
    key: 'haryana',
    label: 'Haryana',
    glyph: '🚜',
    note: 'Straight talk, zero filter.',
    regions: [{ key: 'haryana-core', label: 'Haryana', lang: 'Haryanvi', note: 'Desi swag, katte-pistol memes optional.' }],
  },
  {
    key: 'up',
    label: 'Uttar Pradesh',
    glyph: '🕌',
    note: 'Purvanchal to Awadh — Bhojpuri and Hindustani street talk.',
    regions: [
      { key: 'awadh', label: 'Awadh', lang: 'Awadhi / Hindustani', note: 'Lucknow polite roast.' },
      { key: 'purvanchal', label: 'Purvanchal', lang: 'Bhojpuri', note: 'Banaras–Gorakhpur punchlines.' },
    ],
  },
  {
    key: 'bihar',
    label: 'Bihar',
    glyph: '🚲',
    note: 'Bhojpuri day-to-day — soft, sharp, unforgettable.',
    regions: [{ key: 'bihar-core', label: 'Bihar', lang: 'Bhojpuri / Magahi', note: 'Patna to Mithila vibes.' }],
  },
  {
    key: 'rajasthan',
    label: 'Rajasthan',
    glyph: '🏜️',
    note: 'Marwari warmth and dry humour.',
    regions: [
      { key: 'marwar', label: 'Marwar', lang: 'Marwari', note: 'Jodhpur–Jaisalmer.' },
      { key: 'mewar', label: 'Mewar', lang: 'Mewari', note: 'Udaipur belt.' },
    ],
  },
  {
    key: 'maharashtra',
    label: 'Maharashtra',
    glyph: '🏟️',
    note: 'Puneri paati energy + Bambaiya street.',
    regions: [
      { key: 'pune', label: 'Pune', lang: 'Marathi (Puneri)', note: 'पाटी attitude, no filter.' },
      { key: 'mumbai', label: 'Mumbai', lang: 'Bambaiya', note: 'Tapori-cute, not crude.' },
    ],
  },
  {
    key: 'gujarat',
    label: 'Gujarat',
    glyph: '🦁',
    note: 'Kem cho energy and festival fuel.',
    regions: [{ key: 'gujarat-core', label: 'Gujarat', lang: 'Gujarati', note: 'Ahmedabad to Surat.' }],
  },
  {
    key: 'west-bengal',
    label: 'West Bengal',
    glyph: '🐟',
    note: 'Bangla sarcasm, adda mode.',
    regions: [{ key: 'kolkata', label: 'Kolkata / Bangla', lang: 'Bengali', note: 'Adda is a lifestyle.' }],
  },
  {
    key: 'odisha',
    label: 'Odisha',
    glyph: '🛕',
    note: 'Odia warmth, temple-town humour.',
    regions: [{ key: 'odisha-core', label: 'Odisha', lang: 'Odia', note: 'Bhubaneswar–Puri.' }],
  },
  {
    key: 'tamil-nadu',
    label: 'Tamil Nadu',
    glyph: '🏛️',
    note: 'Tamil punchlines that don’t need translation.',
    regions: [
      { key: 'chennai', label: 'Chennai', lang: 'Tamil', note: 'Madras slang, filter coffee optional.' },
      { key: 'coimbatore', label: 'Kongu', lang: 'Tamil (Kongu)', note: 'West TN energy.' },
    ],
  },
  {
    key: 'kerala',
    label: 'Kerala',
    glyph: '🌴',
    note: 'Malayalam one-liners, monsoon-ready.',
    regions: [{ key: 'kerala-core', label: 'Kerala', lang: 'Malayalam', note: 'Kochi to Kozhikode.' }],
  },
  {
    key: 'karnataka',
    label: 'Karnataka',
    glyph: '💻',
    note: 'Kannada pride + Bengaluru IT sarcasm.',
    regions: [
      { key: 'bengaluru', label: 'Bengaluru', lang: 'Kannada / Hinglish', note: 'Traffic + tech dual citizenship.' },
      { key: 'mysuru', label: 'Mysuru belt', lang: 'Kannada', note: 'Softer Kannada humour.' },
    ],
  },
  {
    key: 'telangana',
    label: 'Telangana',
    glyph: '🕌',
    note: 'Hyderabadi Deccani — arrey miyaan.',
    regions: [{ key: 'hyderabad', label: 'Hyderabad', lang: 'Deccani / Telugu', note: 'Old City soundtrack.' }],
  },
  {
    key: 'andhra',
    label: 'Andhra Pradesh',
    glyph: '🌶️',
    note: 'Telugu spice, literal and figurative.',
    regions: [{ key: 'andhra-core', label: 'Andhra', lang: 'Telugu', note: 'Vizag to Vijayawada.' }],
  },
  {
    key: 'assam',
    label: 'Assam',
    glyph: '🍃',
    note: 'Axomiya day-to-day soft power.',
    regions: [{ key: 'assam-core', label: 'Assam', lang: 'Assamese', note: 'Guwahati register.' }],
  },
  {
    key: 'delhi',
    label: 'Delhi NCR',
    glyph: '🚇',
    note: 'NCR Hinglish — the national group chat.',
    regions: [{ key: 'ncr', label: 'NCR', lang: 'Hinglish', note: 'Dilli swag, Metro delays included.' }],
  },
  {
    key: 'jk',
    label: 'Jammu & Kashmir',
    glyph: '❄️',
    note: 'Kashmiri and Dogri warmth.',
    regions: [
      { key: 'kashmir', label: 'Kashmir', lang: 'Kashmiri', note: 'Soft vowels, strong tea.' },
      { key: 'jammu', label: 'Jammu', lang: 'Dogri', note: 'Plain-spoken hills.' },
    ],
  },
  {
    key: 'goa',
    label: 'Goa',
    glyph: '🏖️',
    note: 'Konkani chill.',
    regions: [{ key: 'goa-core', label: 'Goa', lang: 'Konkani', note: 'Susegad as a print.' }],
  },
  {
    key: 'mp',
    label: 'Madhya Pradesh',
    glyph: '🐅',
    note: 'Bundeli / Hindi heartland humour.',
    regions: [{ key: 'mp-core', label: 'MP', lang: 'Hindi / Bundeli', note: 'Bhopal–Indore corridor.' }],
  },
]

export function getState(key: string) {
  return STATES.find((s) => s.key === key)
}

export function getRegion(stateKey: string, regionKey: string) {
  return getState(stateKey)?.regions.find((r) => r.key === regionKey)
}
