export function processMonthlyData(sales, expenses, days = 30) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const daySales = sales.filter(s => s.date?.startsWith(dateStr));
    const dayExpenses = expenses.filter(e => e.date?.startsWith(dateStr));
    const membershipIncome = daySales.filter(s => s.type === 'membership').reduce((sum, s) => sum + (s.total || 0), 0);
    const productIncome = daySales.filter(s => s.type === 'product').reduce((sum, s) => sum + (s.total || 0), 0);
    const totalExpenses = dayExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    data.push({
      date: dateStr,
      label: date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' }),
      memberships: daySales.filter(s => s.type === 'membership').length,
      membershipIncome,
      productIncome,
      totalIncome: membershipIncome + productIncome,
      expenses: totalExpenses,
      profit: membershipIncome + productIncome - totalExpenses,
    });
  }
  return data;
}

export function processYearlyData(sales, expenses) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months.map((month, i) => {
    const monthStr = String(i + 1).padStart(2, '0');
    const monthSales = sales.filter(s => s.date?.startsWith(`2026-${monthStr}`) || s.date?.startsWith(`2025-${monthStr}`));
    const monthExpenses = expenses.filter(e => e.date?.startsWith(`2026-${monthStr}`) || e.date?.startsWith(`2025-${monthStr}`));
    const membershipIncome = monthSales.filter(s => s.type === 'membership').reduce((sum, s) => sum + (s.total || 0), 0);
    const productIncome = monthSales.filter(s => s.type === 'product').reduce((sum, s) => sum + (s.total || 0), 0);
    const totalExpenses = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    return {
      month,
      membershipIncome,
      productIncome,
      totalIncome: membershipIncome + productIncome,
      expenses: totalExpenses,
      profit: membershipIncome + productIncome - totalExpenses,
      clients: 0,
    };
  });
}

export function getTodayStats(sales, expenses) {
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date?.startsWith(today));
  const membershipSales = todaySales.filter(s => s.type === 'membership');
  const productSales = todaySales.filter(s => s.type === 'product');
  return {
    totalIncome: todaySales.reduce((sum, s) => sum + (s.total || 0), 0),
    membershipSales: membershipSales.length,
    productSales: productSales.length,
  };
}

export function getClientStats(clients, memberships) {
  const now = new Date();
  const active = clients.filter(c => {
    const m = memberships.filter(m => m.clientId === c.id).sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0];
    return m && new Date(m.endDate) > now;
  }).length;
  const expiringSoon = clients.filter(c => {
    const m = memberships.filter(m => m.clientId === c.id).sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0];
    if (!m) return false;
    const daysLeft = Math.ceil((new Date(m.endDate) - now) / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 && daysLeft <= 5;
  }).length;
  const expired = clients.filter(c => {
    const m = memberships.filter(m => m.clientId === c.id).sort((a, b) => new Date(b.endDate) - new Date(a.endDate))[0];
    return m && new Date(m.endDate) < now;
  }).length;
  return { active, expiringSoon, expired };
}

export function getTopProducts(saleItems, products) {
  const productCounts = {};
  for (const item of saleItems) {
    productCounts[item.productId] = (productCounts[item.productId] || 0) + (item.quantity || 0);
  }
  const topIds = Object.entries(productCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  return topIds.map(([productId, sold]) => {
    const product = products.find(p => String(p.id) === String(productId));
    return {
      name: product?.name || 'Producto eliminado',
      sold,
      revenue: 0,
    };
  });
}
