window.App = window.App || {};

window.App.SUBSCRIPTIONS = [
  {
    brand: "Discord Nitro",
    logo: "discord.svg",
    options: [
      { option: "1 Month Nitro Basic", price: 2.49 },
      { option: "1 Month Boost", price: 4.59 },
      { option: "1 Year Basic", price: 14.99 },
      { option: "1 Year Boost", price: 39.99 },
    ],
  },
  {
    brand: "YouTube Premium",
    logo: "youtube.svg",
    options: [
      { option: "Solo — 1 Month", price: 3.39 },
      { option: "Solo — 1 Year", price: 39.99 },
      { option: "Family — 1 Month", price: 5.99 },
      { option: "Family — 1 Year", price: 59.99 },
    ],
  },
  {
    brand: "Crunchyroll Premium",
    logo: "crunchyroll.svg",
    options: [
      { option: "1 Year Fan", price: 14.99 },
      { option: "1 Year Mega Fan", price: 29.99 },
    ],
  },
  {
    brand: "Spotify Premium",
    logo: "spotify.svg",
    options: [
      { option: "Solo — 1 Year", price: 23.99 },
      { option: "Duo — 1 Year", price: 39.99 },
      { option: "Family — 1 Year", price: 59.99 },
    ],
  },
  { brand: "Disney+ Premium", logo: "disney.svg", options: [{ option: "Soon", price: 0.0, disabled: true }] },
  {
    brand: "IPTV+ Premium",
    logo: "iptv.svg",
    options: [
      { option: "1 Month", price: 4.99 },
      { option: "1 Year", price: 29.99 }
    ],
  },
  { brand: "Telegram Premium", logo: "telegram.svg", options: [{ option: "1 Year", price: 19.99 }] },
  {
    brand: "Amazon Prime Video Premium",
    logo: "primevideo.svg",
    options: [
      { option: "1 Month", price: 3.99 },
      { option: "1 Year", price: 39.99 }
    ],
  },
  { brand: "NordVPN Premium", logo: "nordvpn.svg", options: [{ option: "1 Year", price: 22.99 }] },
  { brand: "ChatGPT Plus", logo: "chatgpt.svg", options: [{ option: "1 Year", price: 104.99 }] },
  { brand: "Gemini Pro", logo: "gemini.svg", options: [{ option: "1 Year", price: 49.99 }] },
  {
    brand: "Deezer Premium",
    logo: "deezer.svg",
    options: [
      { option: "1 Month", price: 1.99 },
      { option: "1 Year", price: 9.99 }
    ],
  },
  { brand: "LinkedIn Premium", logo: "linkedin.svg", options: [{ option: "1 Year", price: 39.99 }] },
  {
    brand: "Netflix Premium",
    logo: "netflix.svg",
    options: [
      { option: "Screen — 1 Month", price: 3.99 },
      { option: "Screen — 1 Year", price: 79.99 },
      { option: "Profile — 1 Month", price: 5.99 },
      { option: "Profile — 1 Year", price: 104.99 },
    ],
  },
  /* Games Box moved to window.App.GAMES below */
];

window.App.SUBSCRIPTIONS_SORTED = [...window.App.SUBSCRIPTIONS].sort((a, b) =>
  a.brand.localeCompare(b.brand)
);

window.App.GAMES = [
  {
    brand: "Cheaper Games Service",
    logo: "epicgames.svg",
    options: [
      { option: "Game 1", price: 14.99 },
      { option: "Game 2", price: 21.99 },
      { option: "Game 3", price: 33.99 },
      { option: "Game 4", price: 49.99 },
    ],
  },
  {
    brand: "EA Play",
    logo: "eaplay.svg",
    options: [
      { option: "1 Month", price: 2.99 },
      { option: "1 Year", price: 34.99 },
    ],
  },
  {
    brand: "Epic Games Service",
    logo: "epicgames.svg",
    options: [
      { option: "Region Change: Turkey", price: 1.99 },
      { option: "Region Change: Ukraine", price: 4.99 },
    ],
  },
  {
    brand: "Fall Guys Service",
    logo: "fallguys.svg",
    options: [
      { option: "2800", price: 11.99 },
      { option: "5000", price: 26.99 },
      { option: "13 500", price: 49.99 },
    ],
  },
  {
    brand: "Fortnite Service",
    logo: "fortnite.svg",
    options: [
      { option: "2800", price: 11.99 },
      { option: "5000", price: 26.99 },
      { option: "13 500", price: 49.99 },
    ],
  },
  {
    brand: "Genshin Impact Service",
    logo: "genshin.svg",
    options: [{ option: "SOON", price: 0.0, disabled: true }],
  },
  {
    brand: "League of Legends RP",
    logo: "leagueoflegends.svg",
    options: [{ option: "11 000 RP", price: 54.99 }],
  },
  {
    brand: "PlayStation Service",
    logo: "playstation.svg",
    options: [
      { option: "Essential — 1 month", price: 10.0 },
      { option: "Essential — 3 months", price: 17.9 },
      { option: "Essential — 12 months", price: 37.0 },

      { option: "Extra — 1 month", price: 12.5 },
      { option: "Extra — 3 months", price: 26.0 },
      { option: "Extra — 12 months", price: 58.0 },

      { option: "Deluxe — 1 month", price: 14.0 },
      { option: "Deluxe — 3 months", price: 30.5 },
      { option: "Deluxe — 12 months", price: 67.0 },
    ],
  },
  { brand: "Roblox Service", logo: "roblox.svg", options: [{ option: "SOON", price: 0.0, disabled: true }] },
  {
    brand: "Steam Service",
    logo: "steam.svg",
    options: [
      { option: "Region Change: Turkey", price: 5.99 },
      { option: "Region Change: Ukraine", price: 7.99 },
    ],
  },
  { brand: "Ubisoft Premium", logo: "ubisoft.svg", options: [{ option: "SOON", price: 0.0, disabled: true }] },
  { brand: "Xbox Service", logo: "xbox.svg", options: [{ option: "SOON", price: 0.0, disabled: true }] },
];

window.App.SERVICES = [
  {
    brand: "Discord Server Boost",
    logo: "discordboost.svg",
    hasSubOptions: true,
    options: [
      { 
        option: "7 Boosts", 
        price: 0,
        suboptions: [
          { option: "1 Month", price: 4.99 },
          { option: "3 Months", price: 9.99 },
          { option: "6 Months", price: 14.99 },
          { option: "12 Months", price: 21.99 }
        ]
      },
      { 
        option: "14 Boosts", 
        price: 0,
        suboptions: [
          { option: "1 Month", price: 7.99 },
          { option: "3 Months", price: 16.99 },
          { option: "6 Months", price: 24.99 },
          { option: "12 Months", price: 39.99 }
        ]
      },
      { 
        option: "21 Boosts", 
        price: 0,
        suboptions: [
          { option: "1 Month", price: 9.99 },
          { option: "3 Months", price: 19.99 },
          { option: "6 Months", price: 39.99 },
          { option: "12 Months", price: 59.99 }
        ]
      }
    ]
  },
  {
    brand: "Windows 11 Key",
    logo: "windows11.svg",
    options: [
      { option: "OEM Lifetime", price: 9.99 },
      { option: "Retail Lifetime", price: 3.99 }
    ]
  },
  {
    brand: "Office 365",
    logo: "office365.svg",
    options: [
      { option: "Lifetime Account", price: 19.99 },
      { option: "Family Invite — 12 Months", price: 12.99 }
    ]
  },
];