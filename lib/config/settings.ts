export const DEFAULT_TAX_RATE = 18; // Default GST rate in India

interface Settings {
  taxRate: number;
  currency: string;
  dateFormat: string;
}

export const SETTINGS: Settings = {
  taxRate: DEFAULT_TAX_RATE,
  currency: "₹",
  dateFormat: "PPP",
};

// Function to get current tax rate - in a real app this would fetch from backend/database
export function getCurrentTaxRate(): number {
  return SETTINGS.taxRate;
}

// Function to update tax rate - in a real app this would update the backend/database
export function updateTaxRate(newRate: number): void {
  SETTINGS.taxRate = newRate;
} 