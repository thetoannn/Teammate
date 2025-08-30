const StringUtils = {
  isNotEmptyString: (str: string | null | undefined): boolean => {
    return str !== null && str !== undefined && str.trim().length > 0;
  },

  isEmpty: (str: string | null | undefined): boolean => {
    return str === null || str === undefined || str.trim().length === 0;
  },

  formatCurrency: (amount: string | number, locale: string = "vi-VN"): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return numAmount.toLocaleString(locale);
  },
};

export default StringUtils;
