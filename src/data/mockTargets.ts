import type { MonthlyTarget } from "../types";
import { MOCK_USERS } from "./mockUsers";
import { MOCK_CENTERS } from "./mockCenters";

export const MOCK_TARGETS: MonthlyTarget[] = [];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

const salespersons = MOCK_USERS.filter(u => u.role === "SALESPERSON");

salespersons.forEach((salesperson, idx) => {
  const center = MOCK_CENTERS.find(c => c.id === salesperson.centerId);
  
  months.forEach((month, monthIdx) => {
    const achievedAmount = Math.random() * 800000;
    let status: "PENDING" | "APPROVED" | "REJECTED" | "LOCKED" = "PENDING";
    
    if (monthIdx < currentMonth) {
      status = "LOCKED";
    } else if (monthIdx === currentMonth) {
      status = "APPROVED";
    } else {
      status = "PENDING";
    }
    
    MOCK_TARGETS.push({
      id: `target_${salesperson.id}_${monthIdx}`,
      userId: salesperson.id,
      userName: salesperson.name,
      centerId: salesperson.centerId || "",
      centerName: center?.name || "Unknown Center",
      month,
      year: currentYear,
      targetAmount: 500000 + (idx * 50000) + (monthIdx * 25000),
      achievedAmount: achievedAmount,
      status: status,
    });
  });
});