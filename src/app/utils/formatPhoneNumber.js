export const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3"); // Example: 07701234567 → (077) 012-3456
};
