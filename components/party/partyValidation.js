import { proteins, GUEST_LIMITS } from './partyData.js';

// Form validation functions
export const validateGuestCount = (adults, children) => {
  const errors = [];
  if (adults < GUEST_LIMITS.minAdults) {
    errors.push(`Minimum ${GUEST_LIMITS.minAdults} Adults Required`);
  }
  if (adults > GUEST_LIMITS.maxAdults) {
    errors.push(`Maximum ${GUEST_LIMITS.maxAdults} Adults Allowed`);
  }
  return errors;
};

export const validateProteinSelection = (adultsCount, childrenCount, adultProteins, childProteins, adultProteinCount, childProteinCount) => {
  const errors = [];
  
  if (adultProteins.length < adultProteinCount) {
    errors.push(`Select ${adultProteinCount} Adult Proteins (${adultProteins.length}/${adultProteinCount} selected)`);
  }
  
  if (childrenCount > 0 && childProteins.length < childProteinCount) {
    errors.push(`Select ${childProteinCount} Child Proteins (${childProteins.length}/${childProteinCount} selected)`);
  }
  
  return errors;
};

export const getMissingFields = (adults, children, adultProteins, childProteins, adultProteinCount, childProteinCount) => {
  const guestErrors = validateGuestCount(adults, children);
  const proteinErrors = validateProteinSelection(adults, children, adultProteins, childProteins, adultProteinCount, childProteinCount);
  
  return [...guestErrors, ...proteinErrors];
};

// Protein selection handler factory
export const createProteinChangeHandler = (selected, setSelected, count) => {
  return (e) => {
    const { value, checked } = e.target;
    let updated = checked
      ? [...selected, value]
      : selected.filter((item) => item !== value);

    // Allow only up to count, else ignore
    if (updated.length > count) return;
    setSelected(updated);
  };
};

// Protein upcharge calculation
export const calcProteinUpcharge = (selectedProteins, guestCount, isChild = false) => {
  let total = 0;
  for (const proteinName of selectedProteins) {
    const proteinInfo = proteins.find((p) => p.name === proteinName);
    if (!proteinInfo) continue;
    total += (isChild ? proteinInfo.childExtra : proteinInfo.adultExtra) * guestCount;
  }
  return total;
};
