import { useState, useEffect, useCallback } from 'react'
import * as api from './api.js'

// ─── Utility: format a number as Indian Rupees ────────────────────────────────
function rupees(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(value ?? 0)
}

// ─── Utility: today's date label ─────────────────────────────────────────────
function todayLabel() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ─── Small reusable Modal ────────────────────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [summary, setSummary]         = useState(null)
  const [expenses, setExpenses]       = useState([])
  const [savings, setSavings]         = useState([])
  const [investments, setInvestments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')

  // Which modal is open: null | 'income' | 'expense' | 'savings' | 'investment'
  const [modal, setModal] = useState(null)

  // Form field states
  const [incomeVal, setIncomeVal]   = useState('')
  const [expForm, setExpForm]       = useState({ name: '', amount: '', category: 'Needs' })
  const [savForm, setSavForm]       = useState({ name: '', amount: '', target: '', duration: 'Immediate' })
  const [invForm, setInvForm]       = useState({ name: '', amount: '', type: 'Liquid' })
  const [formError, setFormError]   = useState('')
  const [submitting, setSubmitting] = useState(false)

  // ── Fetch all data from the Java backend ────────────────────────────────────
  const loadAll = useCallback(async () => {
    setError('')
    try {
      const [s, e, sv, inv] = await Promise.all([
        api.getSummary(),
        api.getExpenses(),
        api.getSavings(),
        api.getInvestments(),
      ])
      setSummary(s)
      setExpenses(e)
      setSavings(sv)
      setInvestments(inv)
    } catch (err) {
      setError('Could not connect to the backend. Is the Java server running on port 8080?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Close modal and clear form errors ──────────────────────────────────────
  function closeModal() {
    setModal(null)
    setFormError('')
  }

  // ── Submit: Update Income ───────────────────────────────────────────────────
  async function handleSetIncome(e) {
    e.preventDefault()
    const val = parseFloat(incomeVal)
    if (!incomeVal || val <= 0) return setFormError('Please enter a positive income amount.')
    setSubmitting(true)
    try {
      await api.setIncome(val)
      await loadAll()
      setIncomeVal('')
      closeModal()
    } catch (err) { setFormError(err.message) }
    finally { setSubmitting(false) }
  }

  // ── Submit: Add Expense ─────────────────────────────────────────────────────
  async function handleAddExpense(e) {
    e.preventDefault()
    const amount = parseFloat(expForm.amount)
    if (!expForm.name.trim()) return setFormError('Expense name cannot be empty.')
    if (!expForm.amount || amount <= 0) return setFormError('Amount must be a positive number.')
    setSubmitting(true)
    try {
      await api.addExpense(expForm.name.trim(), amount, expForm.category)
      await loadAll()
      setExpForm({ name: '', amount: '', category: 'Needs' })
      closeModal()
    } catch (err) { setFormError(err.message) }
    finally { setSubmitting(false) }
  }

  // ── Submit: Add Savings ─────────────────────────────────────────────────────
  async function handleAddSavings(e) {
    e.preventDefault()
    const amount = parseFloat(savForm.amount)
    const target = parseFloat(savForm.target)
    if (!savForm.name.trim()) return setFormError('Goal name cannot be empty.')
    if (!savForm.amount || amount <= 0) return setFormError('Saved amount must be positive.')
    if (!savForm.target || target <= 0) return setFormError('Target amount must be positive.')
    setSubmitting(true)
    try {
      await api.addSavings(savForm.name.trim(), amount, target, savForm.duration)
      await loadAll()
      setSavForm({ name: '', amount: '', target: '', duration: 'Immediate' })
      closeModal()
    } catch (err) { setFormError(err.message) }
    finally { setSubmitting(false) }
  }

  // ── Submit: Add Investment ──────────────────────────────────────────────────
  async function handleAddInvestment(e) {
    e.preventDefault()
    const amount = parseFloat(invForm.amount)
    if (!invForm.name.trim()) return setFormError('Investment name cannot be empty.')
    if (!invForm.amount || amount <= 0) return setFormError('Amount must be a positive number.')
    setSubmitting(true)
    try {
      await api.addInvestment(invForm.name.trim(), amount, invForm.type)
      await loadAll()
      setInvForm({ name: '', amount: '', type: 'Liquid' })
      closeModal()
    } catch (err) { setFormError(err.message) }
    finally { setSubmitting(false) }
  }

  // ── Render: Loading / Error states ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="center-screen">
        <div className="spinner" />
        <p className="loading-text">Connecting to Java backend…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="center-screen">
        <div className="error-box">
          <span className="error-icon">⚠</span>
          <p>{error}</p>
          <button className="btn-primary" onClick={loadAll}>Retry</button>
        </div>
      </div>
    )
  }

  // ── Render: Dashboard ───────────────────────────────────────────────────────
  return (
    <div className="page">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="header">
        <div>
          <h1 className="app-name">PocketLedger</h1>
          <p className="app-subtitle">Your money, made simple</p>
        </div>
        <div className="header-right">
          <span className="date-label">{todayLabel()}</span>
          <button className="btn-outline" onClick={() => { setModal('income'); setFormError('') }}>
            ✏ Set Income
          </button>
        </div>
      </header>

      {/* ── Summary Cards ──────────────────────────────────────────────── */}
      <section className="summary-grid">
        <SummaryCard label="Total Income"      value={rupees(summary?.income)}      accent />
        <SummaryCard label="Total Expenses"    value={rupees(summary?.expenses)}    />
        <SummaryCard label="Total Savings"     value={rupees(summary?.savings)}     />
        <SummaryCard label="Total Investments" value={rupees(summary?.investments)} />
      </section>

      <div className="balance-bar">
        <span className="balance-label">Available Balance</span>
        <span className={`balance-amount ${(summary?.balance ?? 0) < 0 ? 'negative' : ''}`}>
          {rupees(summary?.balance)}
        </span>
      </div>

      {/* ── Expenses ───────────────────────────────────────────────────── */}
      <Section
        title="Expenses"
        onAdd={() => { setModal('expense'); setFormError('') }}
        addLabel="+ Add Expense"
      >
        {expenses.length === 0
          ? <EmptyState text="No expenses yet." />
          : expenses.map((ex, i) => (
              <ListRow key={i}>
                <div className="row-main">
                  <span className="row-name">{ex.name}</span>
                  <span className="tag">{ex.category}</span>
                </div>
                <span className="row-amount">{rupees(ex.amount)}</span>
              </ListRow>
            ))
        }
      </Section>

      {/* ── Savings ────────────────────────────────────────────────────── */}
      <Section
        title="Savings Goals"
        onAdd={() => { setModal('savings'); setFormError('') }}
        addLabel="+ Add Goal"
      >
        {savings.length === 0
          ? <EmptyState text="No savings goals yet." />
          : savings.map((sv, i) => (
              <ListRow key={i}>
                <div className="row-main">
                  <span className="row-name">{sv.name}</span>
                  <span className="tag">{sv.duration}</span>
                </div>
                <div className="row-right">
                  <span className="row-amount">{rupees(sv.amount)}</span>
                  <span className="row-sub">of {rupees(sv.target)}</span>
                </div>
              </ListRow>
            ))
        }
      </Section>

      {/* ── Investments ────────────────────────────────────────────────── */}
      <Section
        title="Investments"
        onAdd={() => { setModal('investment'); setFormError('') }}
        addLabel="+ Add Investment"
      >
        {investments.length === 0
          ? <EmptyState text="No investments yet." />
          : investments.map((inv, i) => (
              <ListRow key={i}>
                <div className="row-main">
                  <span className="row-name">{inv.name}</span>
                  <span className="tag">{inv.type}</span>
                </div>
                <span className="row-amount">{rupees(inv.amount)}</span>
              </ListRow>
            ))
        }
      </Section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="footer">
        PocketLedger · Java OOP Project · Data stored in-memory (resets on server restart)
      </footer>

      {/* ── Modals ─────────────────────────────────────────────────────── */}

      {modal === 'income' && (
        <Modal title="Set / Update Income" onClose={closeModal}>
          <form onSubmit={handleSetIncome} className="form">
            <label className="form-label">Monthly Income (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 50000"
              value={incomeVal}
              onChange={e => setIncomeVal(e.target.value)}
              autoFocus
            />
            {formError && <p className="form-error">{formError}</p>}
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Income'}
            </button>
          </form>
        </Modal>
      )}

      {modal === 'expense' && (
        <Modal title="Add Expense" onClose={closeModal}>
          <form onSubmit={handleAddExpense} className="form">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Groceries"
              value={expForm.name}
              onChange={e => setExpForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 1500"
              value={expForm.amount}
              onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))}
            />
            <label className="form-label">Category</label>
            <select
              className="form-input"
              value={expForm.category}
              onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))}
            >
              <option>Needs</option>
              <option>Wants</option>
              <option>Bills</option>
            </select>
            {formError && <p className="form-error">{formError}</p>}
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Expense'}
            </button>
          </form>
        </Modal>
      )}

      {modal === 'savings' && (
        <Modal title="Add Savings Goal" onClose={closeModal}>
          <form onSubmit={handleAddSavings} className="form">
            <label className="form-label">Goal Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Emergency Fund"
              value={savForm.name}
              onChange={e => setSavForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
            <label className="form-label">Amount Already Saved (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 5000"
              value={savForm.amount}
              onChange={e => setSavForm(f => ({ ...f, amount: e.target.value }))}
            />
            <label className="form-label">Target Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 20000"
              value={savForm.target}
              onChange={e => setSavForm(f => ({ ...f, target: e.target.value }))}
            />
            <label className="form-label">Duration</label>
            <select
              className="form-input"
              value={savForm.duration}
              onChange={e => setSavForm(f => ({ ...f, duration: e.target.value }))}
            >
              <option>Immediate</option>
              <option>6 Months</option>
              <option>Long-term</option>
            </select>
            {formError && <p className="form-error">{formError}</p>}
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Goal'}
            </button>
          </form>
        </Modal>
      )}

      {modal === 'investment' && (
        <Modal title="Add Investment" onClose={closeModal}>
          <form onSubmit={handleAddInvestment} className="form">
            <label className="form-label">Investment Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Nifty 50 Fund"
              value={invForm.name}
              onChange={e => setInvForm(f => ({ ...f, name: e.target.value }))}
              autoFocus
            />
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 10000"
              value={invForm.amount}
              onChange={e => setInvForm(f => ({ ...f, amount: e.target.value }))}
            />
            <label className="form-label">Type</label>
            <select
              className="form-input"
              value={invForm.type}
              onChange={e => setInvForm(f => ({ ...f, type: e.target.value }))}
            >
              <option>Liquid</option>
              <option>Mid-cap</option>
              <option>Large-cap</option>
            </select>
            {formError && <p className="form-error">{formError}</p>}
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Investment'}
            </button>
          </form>
        </Modal>
      )}

    </div>
  )
}

// ─── Small presentational helpers ────────────────────────────────────────────

function SummaryCard({ label, value, accent }) {
  return (
    <div className={`summary-card ${accent ? 'accent-card' : ''}`}>
      <p className="card-label">{label}</p>
      <p className="card-value">{value}</p>
    </div>
  )
}

function Section({ title, onAdd, addLabel, children }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <button className="btn-add" onClick={onAdd}>{addLabel}</button>
      </div>
      <div className="list-container">{children}</div>
    </section>
  )
}

function ListRow({ children }) {
  return <div className="list-row">{children}</div>
}

function EmptyState({ text }) {
  return <p className="empty-state">{text}</p>
}
