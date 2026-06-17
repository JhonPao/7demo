// Mock data simulating what Firebase would provide after daily syncs
// In production, this will be replaced with real Firestore queries

const today = new Date();
const formatDate = (d) => d.toISOString().split('T')[0];

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate 30 days of sales data
export function generateMonthlyData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const memberships = randomBetween(2, 8);
    const membershipIncome = memberships * randomBetween(80, 150);
    const productIncome = randomBetween(30, 200);
    const expenses = randomBetween(20, 120);
    data.push({
      date: formatDate(date),
      label: date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
      memberships,
      membershipIncome,
      productIncome,
      totalIncome: membershipIncome + productIncome,
      expenses,
      profit: membershipIncome + productIncome - expenses,
    });
  }
  return data;
}

// Generate 12 months of data
export function generateYearlyData() {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months.map((month, i) => {
    const membershipIncome = randomBetween(4000, 12000);
    const productIncome = randomBetween(1000, 4000);
    const expenses = randomBetween(2000, 5000);
    return {
      month,
      membershipIncome,
      productIncome,
      totalIncome: membershipIncome + productIncome,
      expenses,
      profit: membershipIncome + productIncome - expenses,
      clients: randomBetween(40, 120),
    };
  });
}

// Top selling products
export function getTopProducts() {
  return [
    { name: 'Agua Mineral 500ml', sold: randomBetween(80, 150), revenue: 0 },
    { name: 'Proteína Whey 2lb', sold: randomBetween(10, 30), revenue: 0 },
    { name: 'Creatina 300g', sold: randomBetween(8, 20), revenue: 0 },
    { name: 'Pre-Workout', sold: randomBetween(5, 15), revenue: 0 },
    { name: 'BCAA Polvo', sold: randomBetween(5, 12), revenue: 0 },
    { name: 'Shaker Botella', sold: randomBetween(3, 10), revenue: 0 },
    { name: 'Guantes Gym', sold: randomBetween(2, 8), revenue: 0 },
    { name: 'Barra Proteína', sold: randomBetween(15, 40), revenue: 0 },
  ].map(p => ({ ...p, revenue: p.sold * randomBetween(5, 120) }))
    .sort((a, b) => b.sold - a.sold);
}

// Client stats
export function getClientStats() {
  const total = randomBetween(80, 200);
  const active = randomBetween(50, total - 10);
  const expiringSoon = randomBetween(5, 15);
  const expired = total - active - expiringSoon;
  return { total, active, expiringSoon, expired, newThisMonth: randomBetween(5, 25) };
}

// Today stats
export function getTodayStats() {
  const membershipSales = randomBetween(2, 6);
  const membershipIncome = membershipSales * randomBetween(80, 150);
  const productSales = randomBetween(5, 20);
  const productIncome = randomBetween(50, 300);
  const expenses = randomBetween(10, 80);
  return {
    membershipSales,
    membershipIncome,
    productSales,
    productIncome,
    totalIncome: membershipIncome + productIncome,
    expenses,
    profit: membershipIncome + productIncome - expenses,
  };
}
