const DEFAULT_WHATSAPP_COUNTRY_CODE = "254";

export const normalizeWhatsAppNumber = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) return "";

  const digitsOnly = trimmed.replace(/\D/g, "");

  if (!digitsOnly) return "";

  if (trimmed.startsWith("+")) {
    return digitsOnly;
  }

  if (digitsOnly.startsWith("00")) {
    return digitsOnly.slice(2);
  }

  if (digitsOnly.startsWith(DEFAULT_WHATSAPP_COUNTRY_CODE)) {
    return digitsOnly;
  }

  if (digitsOnly.startsWith("0")) {
    return `${DEFAULT_WHATSAPP_COUNTRY_CODE}${digitsOnly.slice(1)}`;
  }

  if (
    digitsOnly.length === 9 &&
    (digitsOnly.startsWith("7") || digitsOnly.startsWith("1"))
  ) {
    return `${DEFAULT_WHATSAPP_COUNTRY_CODE}${digitsOnly}`;
  }

  return digitsOnly;
};

export const buildWhatsAppLink = (value?: string | null) => {
  const normalized = normalizeWhatsAppNumber(value);
  return normalized
    ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(normalized)}`
    : "";
};
