// A map from ISO 639-3 language codes to a more useful structure
const langMap: Record<string, { name: string; countryCode: string }> = {
  'eng': { name: 'English', countryCode: 'GB' },
  'spa': { name: 'Spanish', countryCode: 'ES' },
  'fra': { name: 'French', countryCode: 'FR' },
  'deu': { name: 'German', countryCode: 'DE' },
  'por': { name: 'Portuguese', countryCode: 'PT' },
  'ita': { name: 'Italian', countryCode: 'IT' },
  'nld': { name: 'Dutch', countryCode: 'NL' },
  'rus': { name: 'Russian', countryCode: 'RU' },
  'cmn': { name: 'Mandarin Chinese', countryCode: 'CN' },
  'jpn': { name: 'Japanese', countryCode: 'JP' },
  'kor': { name: 'Korean', countryCode: 'KR' },
  'ara': { name: 'Arabic', countryCode: 'SA' },
  'hin': { name: 'Hindi', countryCode: 'IN' },
  'swe': { name: 'Swedish', countryCode: 'SE' },
  'fin': { name: 'Finnish', countryCode: 'FI' },
  'nor': { name: 'Norwegian', countryCode: 'NO' },
  'dan': { name: 'Danish', countryCode: 'DK' },
  'pol': { name: 'Polish', countryCode: 'PL' },
  'tur': { name: 'Turkish', countryCode: 'TR' },
  'heb': { name: 'Hebrew', countryCode: 'IL' },
  'ukr': { name: 'Ukrainian', countryCode: 'UA' },
  'cat': { name: 'Catalan', countryCode: 'ES-CT' },
  'pes': { name: 'Persian', countryCode: 'IR'},
  'ind': { name: 'Indonesian', countryCode: 'ID'},
  'ell': { name: 'Greek', countryCode: 'GR'},
  'ces': { name: 'Czech', countryCode: 'CZ' },
  'hun': { name: 'Hungarian', countryCode: 'HU' },
  'ron': { name: 'Romanian', countryCode: 'RO' },
  'vie': { name: 'Vietnamese', countryCode: 'VN' },
  'tha': { name: 'Thai', countryCode: 'TH' },
  'bul': { name: 'Bulgarian', countryCode: 'BG' },
  'hrv': { name: 'Croatian', countryCode: 'HR' },
  'lit': { name: 'Lithuanian', countryCode: 'LT' },
  'lav': { name: 'Latvian', countryCode: 'LV' },
  'est': { name: 'Estonian', countryCode: 'EE' },
  'slk': { name: 'Slovak', countryCode: 'SK' },
  'slv': { name: 'Slovenian', countryCode: 'SI' },
  'isl': { name: 'Icelandic', countryCode: 'IS' },
  'msa': { name: 'Malay', countryCode: 'MY' },
  'tgl': { name: 'Tagalog', countryCode: 'PH' },
  'ben': { name: 'Bengali', countryCode: 'BD' },
  'tam': { name: 'Tamil', countryCode: 'LK' },
  'tel': { name: 'Telugu', countryCode: 'IN' },
  'urd': { name: 'Urdu', countryCode: 'PK' },
  'mar': { name: 'Marathi', countryCode: 'IN' },
  'afr': { name: 'Afrikaans', countryCode: 'ZA' },
  'swh': { name: 'Swahili', countryCode: 'KE' },
  'amh': { name: 'Amharic', countryCode: 'ET' },
  'som': { name: 'Somali', countryCode: 'SO' },
  'yor': { name: 'Yoruba', countryCode: 'NG' },
  'zul': { name: 'Zulu', countryCode: 'ZA' },
  'hau': { name: 'Hausa', countryCode: 'NG' },
};

// Converts a 2-letter country code to a flag emoji
function countryCodeToFlag(code: string): string {
  if (code.includes('-')) { // Handle regional flags like Catalonia
    if (code === 'ES-CT') return '🏴󠁧󠁢󠁥󠁮󠁧󠁿'; // This is a stand-in, real catalan flag is not a standard emoji
  }
  const OFFSET = 127397; // Offset for regional indicator symbols
  return code.toUpperCase().split('').map(char => String.fromCodePoint(char.charCodeAt(0) + OFFSET)).join('');
}

export function getLanguageInfo(code: string): { name: string; flag: string } {
  const lang = langMap[code];
  if (lang) {
    return {
      name: lang.name,
      flag: countryCodeToFlag(lang.countryCode),
    };
  }
  return { name: 'Unknown', flag: '🏳️' };
}