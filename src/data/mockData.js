export const categories = [
  { name: "Food", icon: "🍜", color: "#e07b39" },
  { name: "Transport", icon: "🚌", color: "#3b82f6" },
  { name: "Shopping", icon: "🛍️", color: "#8b5cf6" },
  { name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { name: "Health", icon: "💊", color: "#10b981" },
  { name: "Utilities", icon: "⚡", color: "#f59e0b" },
  { name: "Salary", icon: "💼", color: "#2d7a4f" },
  { name: "Freelance", icon: "💻", color: "#1a5fb4" },
  { name: "Investment", icon: "📈", color: "#c8521a" },
];

export const getCat = (name) =>
  categories.find((c) => c.name === name) || { icon: "💳", color: "#888" };

export const transactions = [
  { id: 1,  date: "2026-03-28", name: "Monthly Salary",         category: "Salary",        type: "income",  amount: 65000 },
  { id: 2,  date: "2026-03-27", name: "Zomato Order",           category: "Food",          type: "expense", amount: 320 },
  { id: 3,  date: "2026-03-26", name: "Metro Card Recharge",    category: "Transport",     type: "expense", amount: 500 },
  { id: 4,  date: "2026-03-25", name: "Freelance Project",      category: "Freelance",     type: "income",  amount: 12000 },
  { id: 5,  date: "2026-03-24", name: "Amazon Shopping",        category: "Shopping",      type: "expense", amount: 2400 },
  { id: 6,  date: "2026-03-23", name: "Netflix Subscription",   category: "Entertainment", type: "expense", amount: 649 },
  { id: 7,  date: "2026-03-22", name: "Apollo Pharmacy",        category: "Health",        type: "expense", amount: 890 },
  { id: 8,  date: "2026-03-21", name: "Electricity Bill",       category: "Utilities",     type: "expense", amount: 1200 },
  { id: 9,  date: "2026-03-20", name: "SIP Investment",         category: "Investment",    type: "expense", amount: 5000 },
  { id: 10, date: "2026-03-19", name: "Swiggy Instamart",       category: "Food",          type: "expense", amount: 540 },
  { id: 11, date: "2026-03-18", name: "Ola Cab",                category: "Transport",     type: "expense", amount: 280 },
  { id: 12, date: "2026-03-17", name: "Dividend Credit",        category: "Investment",    type: "income",  amount: 3200 },
  { id: 13, date: "2026-03-15", name: "Grocery – DMart",        category: "Food",          type: "expense", amount: 1800 },
  { id: 14, date: "2026-03-13", name: "Book Purchase",          category: "Shopping",      type: "expense", amount: 450 },
  { id: 15, date: "2026-03-11", name: "Spotify Premium",        category: "Entertainment", type: "expense", amount: 119 },
  { id: 16, date: "2026-03-09", name: "Water Bill",             category: "Utilities",     type: "expense", amount: 380 },
  { id: 17, date: "2026-03-07", name: "Gym Membership",         category: "Health",        type: "expense", amount: 1500 },
  { id: 18, date: "2026-02-28", name: "Monthly Salary",         category: "Salary",        type: "income",  amount: 65000 },
  { id: 19, date: "2026-02-25", name: "Freelance Payment",      category: "Freelance",     type: "income",  amount: 8500 },
  { id: 20, date: "2026-02-22", name: "Restaurant Dinner",      category: "Food",          type: "expense", amount: 1200 },
  { id: 21, date: "2026-02-19", name: "Bus Pass",               category: "Transport",     type: "expense", amount: 300 },
  { id: 22, date: "2026-02-15", name: "Amazon Prime",           category: "Entertainment", type: "expense", amount: 299 },
  { id: 23, date: "2026-02-12", name: "Doctor Visit",           category: "Health",        type: "expense", amount: 600 },
  { id: 24, date: "2026-02-10", name: "SIP Investment",         category: "Investment",    type: "expense", amount: 5000 },
  { id: 25, date: "2026-02-07", name: "Mobile Recharge",        category: "Utilities",     type: "expense", amount: 599 },
  { id: 26, date: "2026-01-31", name: "Monthly Salary",         category: "Salary",        type: "income",  amount: 65000 },
  { id: 27, date: "2026-01-28", name: "New Year Shopping",      category: "Shopping",      type: "expense", amount: 3800 },
  { id: 28, date: "2026-01-25", name: "Freelance Bonus",        category: "Freelance",     type: "income",  amount: 15000 },
  { id: 29, date: "2026-01-22", name: "Food Delivery",          category: "Food",          type: "expense", amount: 680 },
  { id: 30, date: "2026-01-18", name: "Cab Ride",               category: "Transport",     type: "expense", amount: 420 },
];

export const MONTHS = ["Jan", "Feb", "Mar"];
