import type { DailySale, ProductSale } from "../types";
import { MOCK_USERS } from "./mockUsers";
import { MOCK_CENTERS } from "./mockCenters";

const generateMockProducts = (): ProductSale[] => {
  const products = [
    { id: "prod_001", name: "IT Professional Course", price: 25000 },
    { id: "prod_002", name: "Data Science Certificate", price: 35000 },
    { id: "prod_003", name: "Web Development Bootcamp", price: 20000 },
    { id: "prod_004", name: "Cybersecurity Course", price: 30000 },
    { id: "prod_005", name: "Cloud Architecture Program", price: 45000 },
  ];
  
  const selectedProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
  return selectedProducts.map(p => ({
    productId: p.id,
    productName: p.name,
    quantity: Math.floor(Math.random() * 5) + 1,
    unitPrice: p.price,
    total: 0,
  }));
};

export const MOCK_DAILY_SALES: DailySale[] = [];
const salespersons = MOCK_USERS.filter(u => u.role === "SALESPERSON");

// Generate mock sales for the last 60 days
for (let i = 0; i < 300; i++) {
  const salesperson = salespersons[Math.floor(Math.random() * salespersons.length)];
  const center = MOCK_CENTERS.find(c => c.id === salesperson.centerId);
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 60));
  
  const products = generateMockProducts();
  const total = products.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
  products.forEach(p => p.total = p.quantity * p.unitPrice);
  
  MOCK_DAILY_SALES.push({
    id: `sale_${i}`,
    userId: salesperson.id,
    userName: salesperson.name,
    centerId: salesperson.centerId || "",
    centerName: center?.name || "Unknown Center",
    date: date.toISOString().split('T')[0],
    amount: total,
    products,
    status: Math.random() > 0.2 ? "APPROVED" : "SUBMITTED",
    submittedAt: new Date(date.setHours(18, 0)).toISOString(),
    notes: Math.random() > 0.7 ? "Special promotion applied" : undefined,
  });
}