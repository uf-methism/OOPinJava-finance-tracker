// When running via Vite dev server, requests to /api are proxied to http://localhost:8080
const BASE = '/api/finance'

// Helper: throw a readable error when the server returns a non-OK status
async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

// GET /api/finance/summary
export async function getSummary() {
  const res = await fetch(`${BASE}/summary`)
  return handleResponse(res)
}

// PUT /api/finance/income  — body: { income: number }
export async function setIncome(income) {
  const res = await fetch(`${BASE}/income`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ income }),
  })
  return handleResponse(res)
}

// GET /api/finance/expenses
export async function getExpenses() {
  const res = await fetch(`${BASE}/expenses`)
  return handleResponse(res)
}

// POST /api/finance/expenses  — body: { name, amount, category }
export async function addExpense(name, amount, category) {
  const res = await fetch(`${BASE}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, amount, category }),
  })
  return handleResponse(res)
}

// GET /api/finance/savings
export async function getSavings() {
  const res = await fetch(`${BASE}/savings`)
  return handleResponse(res)
}

// POST /api/finance/savings  — body: { name, amount, target, duration }
export async function addSavings(name, amount, target, duration) {
  const res = await fetch(`${BASE}/savings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, amount, target, duration }),
  })
  return handleResponse(res)
}

// GET /api/finance/investments
export async function getInvestments() {
  const res = await fetch(`${BASE}/investments`)
  return handleResponse(res)
}

// POST /api/finance/investments  — body: { name, amount, type }
export async function addInvestment(name, amount, type) {
  const res = await fetch(`${BASE}/investments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, amount, type }),
  })
  return handleResponse(res)
}
