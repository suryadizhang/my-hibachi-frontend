// Protein configuration data
export const proteins = [
  { name: "Chicken", adultExtra: 0, childExtra: 0 },
  { name: "NY Strip Steak", adultExtra: 0, childExtra: 0 },
  { name: "Filet Mignon", adultExtra: 10, childExtra: 5 },
  { name: "Calamari", adultExtra: 0, childExtra: 0 },
  { name: "Shrimp", adultExtra: 0, childExtra: 0 },
  { name: "Scallops", adultExtra: 5, childExtra: 5 },
  { name: "Lobster Tail", adultExtra: 20, childExtra: 15 },
  { name: "Salmon", adultExtra: 5, childExtra: 5 },
  { name: "Tofu", adultExtra: 0, childExtra: 0 }
];

// Pricing constants
export const PRICING = {
  perAdult: 55,
  perChild: 25,
  extraProteinAdult: 10,
  extraProteinChild: 10,
  noodlePrice: 5
};

// Guest limits
export const GUEST_LIMITS = {
  minAdults: 10,
  maxAdults: 100,
  minChildren: 0
};
