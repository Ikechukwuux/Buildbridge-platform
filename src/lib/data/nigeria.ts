export const NIGERIA_LOCATIONS = [
  {
    state: "Abia",
    id: "abia",
    lgas: ["Aba North", "Aba South", "Umuahia North", "Umuahia South"],
  },
  {
    state: "Abuja FCT",
    id: "abuja_fct",
    lgas: ["Abuja Municipal", "Bwari", "Gwagwalada", "Kuje"],
  },
  {
    state: "Anambra",
    id: "anambra",
    lgas: ["Awka South", "Nnewi North", "Onitsha North", "Onitsha South"],
  },
  {
    state: "Bayelsa",
    id: "bayelsa",
    lgas: ["Sagbama", "Southern Ijaw", "Yenagoa"],
  },
  {
    state: "Cross River",
    id: "cross_river",
    lgas: ["Akamkpa", "Calabar Municipal", "Calabar South"],
  },
  {
    state: "Delta",
    id: "delta",
    lgas: ["Asaba", "Uvwie", "Warri South"],
  },
  {
    state: "Edo",
    id: "edo",
    lgas: ["Egor", "Ikpoba-Okha", "Oredo"],
  },
  {
    state: "Ekiti",
    id: "ekiti",
    lgas: ["Ado-Ekiti", "Ikere", "Oye"],
  },
  {
    state: "Enugu",
    id: "enugu",
    lgas: ["Enugu North", "Enugu South", "Nsukka"],
  },
  {
    state: "Imo",
    id: "imo",
    lgas: ["Owerri Municipal", "Owerri North", "Owerri West"],
  },
  {
    state: "Kaduna",
    id: "kaduna",
    lgas: ["Chikun", "Kaduna North", "Kaduna South", "Zaria"],
  },
  {
    state: "Kano",
    id: "kano",
    lgas: ["Dala", "Fagge", "Gwale", "Kano Municipal", "Tarauni"],
  },
  {
    state: "Kwara",
    id: "kwara",
    lgas: ["Ilorin East", "Ilorin South", "Ilorin West"],
  },
  {
    state: "Lagos",
    id: "lagos",
    lgas: [
      "Alimosho",
      "Eti-Osa",
      "Ikeja",
      "Kosofe",
      "Lagos Island",
      "Mushin",
      "Oshodi-Isolo",
      "Surulere",
    ],
  },
  {
    state: "Ogun",
    id: "ogun",
    lgas: ["Abeokuta North", "Abeokuta South", "Ijebu Ode", "Sagamu"],
  },
  {
    state: "Ondo",
    id: "ondo",
    lgas: ["Akure North", "Akure South", "Ondo West"],
  },
  {
    state: "Osun",
    id: "osun",
    lgas: ["Ife Central", "Ife East", "Osogbo"],
  },
  {
    state: "Oyo",
    id: "oyo",
    lgas: ["Ibadan North", "Ibadan South-West", "Iseyin", "Ogbomosho North", "Oyo East"],
  },
  {
    state: "Plateau",
    id: "plateau",
    lgas: ["Jos North", "Jos South", "Bukuru"],
  },
  {
    state: "Rivers",
    id: "rivers",
    lgas: ["Bonny", "Eleme", "Obio-Akpor", "Port Harcourt"],
  },
];

export type NigerianState = (typeof NIGERIA_LOCATIONS)[number]["id"];