export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
  }).format(price);
};

export const formatPriceSimple = (price: number): string => {
  return new Intl.NumberFormat("he-IL").format(price) + "₪";
};

export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateRelative = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "היום";
  if (diffInDays === 1) return "אתמול";
  if (diffInDays < 7) return `לפני ${diffInDays} ימים`;
  if (diffInDays < 30) return `לפני ${Math.floor(diffInDays / 7)} שבועות`;
  if (diffInDays < 365) return `לפני ${Math.floor(diffInDays / 30)} חודשים`;
  return `לפני ${Math.floor(diffInDays / 365)} שנים`;
};

export const formatCarTitle = (
  make: string,
  model: string,
  year: number
): string => {
  return `${make} ${model} ${year}`;
};

export const formatEngineSize = (engineSize?: string): string => {
  return engineSize || "לא צוין";
};

export const formatTransmission = (transmission?: string): string => {
  const transmissionMap: Record<string, string> = {
    manual: "ידני",
    automatic: "אוטומטי",
    cvt: "CVT",
    hybrid: "היברידי",
  };

  return transmission
    ? transmissionMap[transmission] || transmission
    : "לא צוין";
};

export const formatFuelType = (fuelType?: string): string => {
  const fuelTypeMap: Record<string, string> = {
    gasoline: "בנזין",
    diesel: "דיזל",
    hybrid: "היברידי",
    electric: "חשמלי",
    lpg: "גז",
  };

  return fuelType ? fuelTypeMap[fuelType] || fuelType : "לא צוין";
};
