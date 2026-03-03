window.App = window.App || {};

(() => {
  let toastTimer = null;

  window.App.toast = (message) => {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;

    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("is-show"));

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.classList.remove("is-show");
      setTimeout(() => el.remove(), 250);
    }, 1600);
  };

  window.App.normalizePhone = (raw) => {
    let s = (raw || "").trim();
    s = s.replace(/[^\d+]/g, "");
    if (s.includes("+")) s = "+" + s.replace(/\+/g, "");
    return s;
  };

  window.App.isValidEmail = (email) => {
    const e = (email || "").trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  };

  window.App.isValidPhone = (phone) => {
    const p = window.App.normalizePhone(phone);
    return /^\+\d{8,15}$/.test(p);
  };

  const fallbackCountries = () => ([
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AS", name: "American Samoa" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AI", name: "Anguilla" },
    { code: "AQ", name: "Antarctica" },
    { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AW", name: "Aruba" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BM", name: "Bermuda" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BV", name: "Bouvet Island" },
    { code: "BR", name: "Brazil" },
    { code: "BN", name: "Brunei" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "CV", name: "Cape Verde" },
    { code: "KY", name: "Cayman Islands" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CX", name: "Christmas Island" },
    { code: "CC", name: "Cocos Islands" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CG", name: "Congo" },
    { code: "CD", name: "Congo (DRC)" },
    { code: "CK", name: "Cook Islands" },
    { code: "CR", name: "Costa Rica" },
    { code: "CI", name: "Côte d'Ivoire" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "ET", name: "Ethiopia" },
    { code: "FK", name: "Falkland Islands" },
    { code: "FO", name: "Faroe Islands" },
    { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GF", name: "French Guiana" },
    { code: "PF", name: "French Polynesia" },
    { code: "TF", name: "French Southern Territories" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GI", name: "Gibraltar" },
    { code: "GR", name: "Greece" },
    { code: "GL", name: "Greenland" },
    { code: "GD", name: "Grenada" },
    { code: "GP", name: "Guadeloupe" },
    { code: "GU", name: "Guam" },
    { code: "GT", name: "Guatemala" },
    { code: "GG", name: "Guernsey" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HK", name: "Hong Kong" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IM", name: "Isle of Man" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "JM", name: "Jamaica" },
    { code: "JP", name: "Japan" },
    { code: "JE", name: "Jersey" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KI", name: "Kiribati" },
    { code: "KP", name: "Korea (North)" },
    { code: "KR", name: "Korea (South)" },
    { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "LA", name: "Laos" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libya" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MO", name: "Macao" },
    { code: "MK", name: "Macedonia" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MH", name: "Marshall Islands" },
    { code: "MQ", name: "Martinique" },
    { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" },
    { code: "YT", name: "Mayotte" },
    { code: "MX", name: "Mexico" },
    { code: "FM", name: "Micronesia" },
    { code: "MD", name: "Moldova" },
    { code: "MC", name: "Monaco" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar" },
    { code: "NA", name: "Namibia" },
    { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "NC", name: "New Caledonia" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "NU", name: "Niue" },
    { code: "NF", name: "Norfolk Island" },
    { code: "MP", name: "Northern Mariana Islands" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PW", name: "Palau" },
    { code: "PS", name: "Palestine" },
    { code: "PA", name: "Panama" },
    { code: "PG", name: "Papua New Guinea" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PN", name: "Pitcairn Islands" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "PR", name: "Puerto Rico" },
    { code: "QA", name: "Qatar" },
    { code: "RE", name: "Réunion" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russia" },
    { code: "RW", name: "Rwanda" },
    { code: "BL", name: "Saint Barthélemy" },
    { code: "SH", name: "Saint Helena" },
    { code: "KN", name: "Saint Kitts and Nevis" },
    { code: "LC", name: "Saint Lucia" },
    { code: "MF", name: "Saint Martin" },
    { code: "PM", name: "Saint Pierre and Miquelon" },
    { code: "VC", name: "Saint Vincent and the Grenadines" },
    { code: "WS", name: "Samoa" },
    { code: "SM", name: "San Marino" },
    { code: "ST", name: "São Tomé and Príncipe" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SC", name: "Seychelles" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SG", name: "Singapore" },
    { code: "SX", name: "Sint Maarten" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "SB", name: "Solomon Islands" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "South Africa" },
    { code: "SS", name: "South Sudan" },
    { code: "ES", name: "Spain" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SD", name: "Sudan" },
    { code: "SR", name: "Suriname" },
    { code: "SJ", name: "Svalbard and Jan Mayen" },
    { code: "SZ", name: "Swaziland" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SY", name: "Syria" },
    { code: "TW", name: "Taiwan" },
    { code: "TJ", name: "Tajikistan" },
    { code: "TZ", name: "Tanzania" },
    { code: "TH", name: "Thailand" },
    { code: "TL", name: "Timor-Leste" },
    { code: "TG", name: "Togo" },
    { code: "TK", name: "Tokelau" },
    { code: "TO", name: "Tonga" },
    { code: "TT", name: "Trinidad and Tobago" },
    { code: "TN", name: "Tunisia" },
    { code: "TR", name: "Turkey" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TC", name: "Turks and Caicos Islands" },
    { code: "TV", name: "Tuvalu" },
    { code: "UG", name: "Uganda" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" },
    { code: "VA", name: "Vatican City" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Vietnam" },
    { code: "VG", name: "Virgin Islands (British)" },
    { code: "VI", name: "Virgin Islands (US)" },
    { code: "WF", name: "Wallis and Futuna" },
    { code: "EH", name: "Western Sahara" },
    { code: "YE", name: "Yemen" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" },
  ].sort((a, b) => a.name.localeCompare(b.name)));

  window.App.getAllCountryOptionsSafe = () => {
    try {
      if (
        typeof Intl === "undefined" ||
        typeof Intl.DisplayNames === "undefined" ||
        typeof Intl.supportedValuesOf !== "function"
      ) return fallbackCountries();

      const regions = Intl.supportedValuesOf("region");
      const dn = new Intl.DisplayNames(["en"], { type: "region" });

      return regions
        .map(code => ({ code, name: dn.of(code) }))
        .filter(x => x.name)
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch {
      return fallbackCountries();
    }
  };

  window.App.DIAL_BY_COUNTRY = {
    US:"+1",CA:"+1",GB:"+44",IE:"+353",DE:"+49",AT:"+43",CH:"+41",
    FR:"+33",ES:"+34",PT:"+351",IT:"+39",NL:"+31",BE:"+32",LU:"+352",
    PL:"+48",CZ:"+420",SK:"+421",HU:"+36",RO:"+40",BG:"+359",GR:"+30",
    DK:"+45",SE:"+46",NO:"+47",FI:"+358",IS:"+354",UA:"+380",TR:"+90",RU:"+7",
    AU:"+61",NZ:"+64",JP:"+81",KR:"+82",CN:"+86",HK:"+852",TW:"+886",
    IN:"+91",PK:"+92",BD:"+880",LK:"+94",NP:"+977",AE:"+971",SA:"+966",QA:"+974",
    KW:"+965",OM:"+968",BH:"+973",IL:"+972",EG:"+20",MA:"+212",TN:"+216",DZ:"+213",
    ZA:"+27",NG:"+234",KE:"+254",GH:"+233",BR:"+55",AR:"+54",CL:"+56",CO:"+57",PE:"+51",MX:"+52",
    VE:"+58",EC:"+593",BO:"+591",UY:"+598",PY:"+595",TH:"+66",VN:"+84",PH:"+63",
    MY:"+60",SG:"+65",ID:"+62",MM:"+95",KH:"+855",LA:"+856",KZ:"+7",UZ:"+998",
    TM:"+993",KG:"+996",TJ:"+992",AF:"+93",LK:"+94",MV:"+960",BT:"+975",NP:"+977",
    LB:"+961",JO:"+962",SY:"+963",IQ:"+964",IR:"+98",PW:"+680",FJ:"+679",MP:"+1",
    GU:"+1",AS:"+1",VI:"+1",PR:"+1",DO:"+1",TT:"+1",BS:"+1",BB:"+1",KY:"+1",
    AG:"+1",DM:"+1",GD:"+1",KN:"+1",LC:"+1",VC:"+1",JM:"+1",BZ:"+501",CR:"+506",
    PA:"+507",HT:"+509",SV:"+503",GT:"+502",HN:"+504",NI:"+505",CU:"+53",VG:"+1",
    AI:"+1",BM:"+1",TC:"+1",FK:"+500",GL:"+299",SJ:"+47",SM:"+378",MC:"+377",
    AD:"+376",VA:"+39",MT:"+356",CY:"+357",RS:"+381",ME:"+382",HR:"+385",SI:"+386",
    BA:"+387",MK:"+389",AL:"+355",MZ:"+258",MW:"+265",TZ:"+255",UG:"+256",RW:"+250",
    BI:"+257",SO:"+252",DJ:"+253",ER:"+291",ET:"+251",SD:"+249",SS:"+211",CM:"+237",
    CG:"+242",CD:"+243",GA:"+241",GQ:"+240",AO:"+244",SC:"+248",MU:"+230",RE:"+262",
    YT:"+262",KM:"+269",MG:"+261",CV:"+238",ST:"+239",SH:"+290",BJ:"+229",BF:"+226",
    ML:"+223",SN:"+221",MR:"+222",WS:"+685",TO:"+676",PG:"+675",SB:"+677",VU:"+678",
    NC:"+687",PF:"+689",GW:"+245",ZM:"+260",ZW:"+263",BW:"+267",NA:"+264",
    LS:"+266",SZ:"+268",YE:"+967",AZ:"+994",AM:"+374",GE:"+995",MD:"+373",BY:"+375",
    LT:"+370",LV:"+371",EE:"+372",GI:"+350",LI:"+423",TL:"+670",WF:"+681",PM:"+508",
    BL:"+590",MF:"+590",TV:"+688",NR:"+674",AQ:"+672",BV:"+47",CX:"+61",CC:"+61",
    FO:"+298",GF:"+594",GP:"+590",IO:"+246",JE:"+44",KP:"+850",MQ:"+596",MS:"+1",
    PS:"+970",PN:"+64",GS:"+500",TF:"+262",UM:"+1",AX:"+358",BB:"+1",BN:"+673",
    FM:"+691",GG:"+44",IM:"+44",KI:"+686",MH:"+692",MO:"+853",MN:"+976",
  };

  // Persistent site zoom utility
  (function(){
    const KEY = "site.zoom";
    const DEFAULT = 100;

    function read() {
      try {
        const v = Number(localStorage.getItem(KEY));
        return Number.isFinite(v) && v > 10 && v <= 300 ? v : DEFAULT;
      } catch { return DEFAULT; }
    }

    function write(v) {
      try { localStorage.setItem(KEY, String(v)); } catch {}
    }

    function apply(v) {
      const pct = Number(v) || DEFAULT;
      // apply via nonstandard zoom for widest browser support
      try { document.documentElement.style.zoom = (pct / 100).toString(); } catch(e){}
      // fallback: set a transform on body (keeps layout box-sizing) if zoom unsupported
      if (!document.documentElement.style.zoom) {
        document.body.style.transformOrigin = '0 0';
        document.body.style.transform = `scale(${pct/100})`;
      }
      write(pct);
    }

    function set(v) { apply(v); }
    function get() { return read(); }

    // expose API
    window.App.zoom = { get, set, apply };

    // apply stored zoom on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
      apply(read());
    });
  })();
})();