'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('languages', [
      {
        "name": "Afar",
        "code": "aar"
      },
      {
        "name": "Abkhazian",
        "code": "abk"
      },
      {
        "name": "Afrikaans",
        "code": "afr"
      },
      {
        "name": "Akan",
        "code": "aka"
      },
      {
        "name": "Albanian",
        "code": "alb"
      },
      {
        "name": "Amharic",
        "code": "amh"
      },
      {
        "name": "Arabic",
        "code": "ara"
      },
      {
        "name": "Aragonese",
        "code": "arg"
      },
      {
        "name": "Armenian",
        "code": "arm"
      },
      {
        "name": "Assamese",
        "code": "asm"
      },
      {
        "name": "Avaric",
        "code": "ava"
      },
      {
        "name": "Avestan",
        "code": "ave"
      },
      {
        "name": "Aymara",
        "code": "aym"
      },
      {
        "name": "Azerbaijani",
        "code": "aze"
      },
      {
        "name": "Bashkir",
        "code": "bak"
      },
      {
        "name": "Bambara",
        "code": "bam"
      },
      {
        "name": "Basque",
        "code": "baq"
      },
      {
        "name": "Belarusian",
        "code": "bel"
      },
      {
        "name": "Bengali",
        "code": "ben"
      },
      {
        "name": "Bihari languages",
        "code": "bih"
      },
      {
        "name": "Bislama",
        "code": "bis"
      },
      {
        "name": "Bosnian",
        "code": "bos"
      },
      {
        "name": "Breton",
        "code": "bre"
      },
      {
        "name": "Bulgarian",
        "code": "bul"
      },
      {
        "name": "Burmese",
        "code": "bur"
      },
      {
        "name": "Catalan",
        "code": "cat"
      },
      {
        "name": "Chamorro",
        "code": "cha"
      },
      {
        "name": "Chechen",
        "code": "che"
      },
      {
        "name": "Chinese",
        "code": "chi"
      },
      {
        "name": "Chuvash",
        "code": "chv"
      },
      {
        "name": "Cornish",
        "code": "cor"
      },
      {
        "name": "Corsican",
        "code": "cos"
      },
      {
        "name": "Cree",
        "code": "cre"
      },
      {
        "name": "Czech",
        "code": "cze"
      },
      {
        "name": "Danish",
        "code": "dan"
      },
      {
        "name": "Divehi",
        "code": "div"
      },
      {
        "name": "Dutch",
        "code": "dut"
      },
      {
        "name": "Dzongkha",
        "code": "dzo"
      },
      {
        "name": "English",
        "code": "eng"
      },
      {
        "name": "Esperanto",
        "code": "epo"
      },
      {
        "name": "Estonian",
        "code": "est"
      },
      {
        "name": "Ewe",
        "code": "ewe"
      },
      {
        "name": "Faroese",
        "code": "fao"
      },
      {
        "name": "Fijian",
        "code": "fij"
      },
      {
        "name": "Finnish",
        "code": "fin"
      },
      {
        "name": "French",
        "code": "fre"
      },
      {
        "name": "Western Frisian",
        "code": "fry"
      },
      {
        "name": "Fulah",
        "code": "ful"
      },
      {
        "name": "Georgian",
        "code": "geo"
      },
      {
        "name": "German",
        "code": "ger"
      },
      {
        "name": "Gaelic",
        "code": "gla"
      },
      {
        "name": "Irish",
        "code": "gle"
      },
      {
        "name": "Galician",
        "code": "glg"
      },
      {
        "name": "Manx",
        "code": "glv"
      },
      {
        "name": "Greek, Modern (1453-)",
        "code": "gre"
      },
      {
        "name": "Guarani",
        "code": "grn"
      },
      {
        "name": "Gujarati",
        "code": "guj"
      },
      {
        "name": "Haitian",
        "code": "hat"
      },
      {
        "name": "Hausa",
        "code": "hau"
      },
      {
        "name": "Hebrew",
        "code": "heb"
      },
      {
        "name": "Herero",
        "code": "her"
      },
      {
        "name": "Hindi",
        "code": "hin"
      },
      {
        "name": "Hiri Motu",
        "code": "hmo"
      },
      {
        "name": "Croatian",
        "code": "hrv"
      },
      {
        "name": "Hungarian",
        "code": "hun"
      },
      {
        "name": "Igbo",
        "code": "ibo"
      },
      {
        "name": "Icelandic",
        "code": "ice"
      },
      {
        "name": "Ido",
        "code": "ido"
      },
      {
        "name": "Sichuan Yi",
        "code": "iii"
      },
      {
        "name": "Inuktitut",
        "code": "iku"
      },
      {
        "name": "Interlingue",
        "code": "ile"
      },
      {
        "name": "Indonesian",
        "code": "ind"
      },
      {
        "name": "Inupiaq",
        "code": "ipk"
      },
      {
        "name": "Italian",
        "code": "ita"
      },
      {
        "name": "Javanese",
        "code": "jav"
      },
      {
        "name": "Japanese",
        "code": "jpn"
      },
      {
        "name": "Kalaallisut",
        "code": "kal"
      },
      {
        "name": "Kannada",
        "code": "kan"
      },
      {
        "name": "Kashmiri",
        "code": "kas"
      },
      {
        "name": "Kanuri",
        "code": "kau"
      },
      {
        "name": "Kazakh",
        "code": "kaz"
      },
      {
        "name": "Central Khmer",
        "code": "khm"
      },
      {
        "name": "Kikuyu",
        "code": "kik"
      },
      {
        "name": "Kinyarwanda",
        "code": "kin"
      },
      {
        "name": "Kirghiz",
        "code": "kir"
      },
      {
        "name": "Komi",
        "code": "kom"
      },
      {
        "name": "Kongo",
        "code": "kon"
      },
      {
        "name": "Korean",
        "code": "kor"
      },
      {
        "name": "Kuanyama",
        "code": "kua"
      },
      {
        "name": "Kurdish",
        "code": "kur"
      },
      {
        "name": "Lao",
        "code": "lao"
      },
      {
        "name": "Latin",
        "code": "lat"
      },
      {
        "name": "Latvian",
        "code": "lav"
      },
      {
        "name": "Limburgan",
        "code": "lim"
      },
      {
        "name": "Lingala",
        "code": "lin"
      },
      {
        "name": "Lithuanian",
        "code": "lit"
      },
      {
        "name": "Luxembourgish",
        "code": "ltz"
      },
      {
        "name": "Luba-Katanga",
        "code": "lub"
      },
      {
        "name": "Ganda",
        "code": "lug"
      },
      {
        "name": "Macedonian",
        "code": "mac"
      },
      {
        "name": "Marshallese",
        "code": "mah"
      },
      {
        "name": "Malayalam",
        "code": "mal"
      },
      {
        "name": "Maori",
        "code": "mao"
      },
      {
        "name": "Marathi",
        "code": "mar"
      },
      {
        "name": "Malay",
        "code": "may"
      },
      {
        "name": "Malagasy",
        "code": "mlg"
      },
      {
        "name": "Maltese",
        "code": "mlt"
      },
      {
        "name": "Mongolian",
        "code": "mon"
      },
      {
        "name": "Nauru",
        "code": "nau"
      },
      {
        "name": "Navajo",
        "code": "nav"
      },
      {
        "name": "Ndebele, South",
        "code": "nbl"
      },
      {
        "name": "Ndebele, North",
        "code": "nde"
      },
      {
        "name": "Ndonga",
        "code": "ndo"
      },
      {
        "name": "Nepali",
        "code": "nep"
      },
      {
        "name": "Norwegian Nynorsk",
        "code": "nno"
      },
      {
        "name": "Bokmål, Norwegian",
        "code": "nob"
      },
      {
        "name": "Norwegian",
        "code": "nor"
      },
      {
        "name": "Chichewa",
        "code": "nya"
      },
      {
        "name": "Occitan (post 1500)",
        "code": "oci"
      },
      {
        "name": "Ojibwa",
        "code": "oji"
      },
      {
        "name": "Oriya",
        "code": "ori"
      },
      {
        "name": "Oromo",
        "code": "orm"
      },
      {
        "name": "Ossetian",
        "code": "oss"
      },
      {
        "name": "Panjabi",
        "code": "pan"
      },
      {
        "name": "Persian",
        "code": "per"
      },
      {
        "name": "Pali",
        "code": "pli"
      },
      {
        "name": "Polish",
        "code": "pol"
      },
      {
        "name": "Portuguese",
        "code": "por"
      },
      {
        "name": "Pushto",
        "code": "pus"
      },
      {
        "name": "Quechua",
        "code": "que"
      },
      {
        "name": "Romansh",
        "code": "roh"
      },
      {
        "name": "Romanian",
        "code": "rum"
      },
      {
        "name": "Rundi",
        "code": "run"
      },
      {
        "name": "Russian",
        "code": "rus"
      },
      {
        "name": "Sango",
        "code": "sag"
      },
      {
        "name": "Sanskrit",
        "code": "san"
      },
      {
        "name": "Sinhala",
        "code": "sin"
      },
      {
        "name": "Slovak",
        "code": "slo"
      },
      {
        "name": "Slovenian",
        "code": "slv"
      },
      {
        "name": "Northern Sami",
        "code": "sme"
      },
      {
        "name": "Samoan",
        "code": "smo"
      },
      {
        "name": "Shona",
        "code": "sna"
      },
      {
        "name": "Sindhi",
        "code": "snd"
      },
      {
        "name": "Somali",
        "code": "som"
      },
      {
        "name": "Sotho, Southern",
        "code": "sot"
      },
      {
        "name": "Spanish",
        "code": "spa"
      },
      {
        "name": "Sardinian",
        "code": "srd"
      },
      {
        "name": "Serbian",
        "code": "srp"
      },
      {
        "name": "Swati",
        "code": "ssw"
      },
      {
        "name": "Sundanese",
        "code": "sun"
      },
      {
        "name": "Swahili",
        "code": "swa"
      },
      {
        "name": "Swedish",
        "code": "swe"
      },
      {
        "name": "Tahitian",
        "code": "tah"
      },
      {
        "name": "Tamil",
        "code": "tam"
      },
      {
        "name": "Tatar",
        "code": "tat"
      },
      {
        "name": "Telugu",
        "code": "tel"
      },
      {
        "name": "Tajik",
        "code": "tgk"
      },
      {
        "name": "Tagalog",
        "code": "tgl"
      },
      {
        "name": "Thai",
        "code": "tha"
      },
      {
        "name": "Tibetan",
        "code": "tib"
      },
      {
        "name": "Tigrinya",
        "code": "tir"
      },
      {
        "name": "Tonga (Tonga Islands)",
        "code": "ton"
      },
      {
        "name": "Tswana",
        "code": "tsn"
      },
      {
        "name": "Tsonga",
        "code": "tso"
      },
      {
        "name": "Turkmen",
        "code": "tuk"
      },
      {
        "name": "Turkish",
        "code": "tur"
      },
      {
        "name": "Twi",
        "code": "twi"
      },
      {
        "name": "Uighur",
        "code": "uig"
      },
      {
        "name": "Ukrainian",
        "code": "ukr"
      },
      {
        "name": "Urdu",
        "code": "urd"
      },
      {
        "name": "Uzbek",
        "code": "uzb"
      },
      {
        "name": "Venda",
        "code": "ven"
      },
      {
        "name": "Vietnamese",
        "code": "vie"
      },
      {
        "name": "Volapük",
        "code": "vol"
      },
      {
        "name": "Welsh",
        "code": "wel"
      },
      {
        "name": "Walloon",
        "code": "wln"
      },
      {
        "name": "Wolof",
        "code": "wol"
      },
      {
        "name": "Xhosa",
        "code": "xho"
      },
      {
        "name": "Yiddish",
        "code": "yid"
      },
      {
        "name": "Yoruba",
        "code": "yor"
      },
      {
        "name": "Zhuang",
        "code": "zha"
      },
      {
        "name": "Zulu",
        "code": "zul"
      }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.sequelize.query('DELETE FROM languages');
  }
};
