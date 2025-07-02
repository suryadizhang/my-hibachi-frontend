// Menu data and constants
export const proteinOptions = [
  { 
    name: 'Chicken', 
    description: 'Tender grilled chicken breast with signature hibachi seasonings and teriyaki glaze',
    icon: '🍗',
    popular: true
  },
  { 
    name: 'Premium Angus Sirloin Steak', 
    description: 'Premium Angus Sirloin steak cooked to your preferred temperature',
    icon: '🥩',
    premium: true
  },
  { 
    name: 'Shrimp', 
    description: 'Fresh jumbo shrimp with garlic butter and hibachi spices',
    icon: '🍤',
    popular: true
  },
  { 
    name: 'Calamari', 
    description: 'Fresh tender calamari grilled with garlic and hibachi spices',
    icon: '🦑'
  },
  { 
    name: 'Tofu', 
    description: 'Fried tofu with our house special seasoning - perfect vegetarian option',
    icon: '🟫',
    vegetarian: true
  }
];

export const upgradeOptions = [
  { 
    name: 'Salmon', 
    extra: 5, 
    description: 'Wild-caught Atlantic salmon with teriyaki glaze',
    icon: '🐟'
  },
  { 
    name: 'Scallops', 
    extra: 5, 
    description: 'Fresh sea scallops grilled to perfection',
    icon: '🥢'
  },
  { 
    name: 'Filet Mignon', 
    extra: 8, 
    description: 'Premium tender beef filet',
    icon: '🥩',
    premium: true
  },
  { 
    name: 'Lobster Tail', 
    extra: 15, 
    description: 'Fresh lobster tail with garlic butter',
    icon: '🦞',
    luxury: true
  }
].sort((a, b) => a.extra - b.extra);

export const additionalOptions = [
  { 
    name: 'Yakisoba Noodles', 
    extra: 5, 
    description: 'Japanese style lo mein noodles',
    icon: '🍜'
  },
  { 
    name: 'Extra Fried Rice', 
    extra: 5, 
    description: 'Additional portion of hibachi fried rice',
    icon: '🍚'
  },
  { 
    name: 'Extra Vegetables', 
    extra: 5, 
    description: 'Additional portion of mixed seasonal vegetables',
    icon: '🥬'
  },
  { 
    name: '3rd Protein', 
    extra: 10, 
    description: 'Add a third protein to your meal',
    icon: '🍽️'
  }
].sort((a, b) => a.extra - b.extra);

export const includedItems = [
  {
    name: 'Hibachi Fried Rice',
    description: 'Perfectly seasoned with egg and fresh vegetables',
    icon: '🍚'
  },
  {
    name: 'Seasonal Vegetables',
    description: 'Fresh zucchini, carrots, onions, mushrooms, and broccoli',
    icon: '🥬'
  },
  {
    name: 'Garden Fresh Salad',
    description: 'Crisp greens with signature ginger dressing',
    icon: '🥗'
  },
  {
    name: 'Miso Soup',
    description: 'Traditional Japanese soup to start your meal',
    icon: '🍲'
  },
  {
    name: 'Hibachi Sauces',
    description: 'Our signature yum yum sauce, ginger sauce, and teriyaki glaze',
    icon: '🥫'
  },
  {
    name: 'Hot Tea',
    description: 'Fresh brewed green tea served throughout the meal',
    icon: '🍵'
  }
];

export const pricingInfo = {
  basePrice: 30,
  description: 'Per person (choose 2 proteins)',
  gratuityRange: '20-35%',
  travelFee: {
    freeDistance: 30,
    ratePerMile: 2,
    maxDistance: 150
  }
};
