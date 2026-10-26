package com.financetracker;

import java.util.ArrayList;
import java.util.List;

/**
 * Core finance logic — identical to your backend_structure.
 * All calculations live here; the controller just calls these methods.
 */
public class FinanceTracker {

    private double income;

    private final List<Expense>     expenses    = new ArrayList<>();
    private final List<SavingsGoal> savings     = new ArrayList<>();
    private final List<Investment>  investments = new ArrayList<>();

    public void setIncome(double income) {
        if (income < 0) {
            throw new IllegalArgumentException("Income cannot be negative");
        }
        this.income = income;
    }

    public double getIncome() { return income; }

    public void addExpense(Expense expense)       { expenses.add(expense); }
    public void addSavings(SavingsGoal goal)      { savings.add(goal); }
    public void addInvestment(Investment investment) { investments.add(investment); }

    public List<Expense>     getExpenses()    { return expenses; }
    public List<SavingsGoal> getSavings()     { return savings; }
    public List<Investment>  getInvestments() { return investments; }

    public double getTotalExpenses() {
        double total = 0;
        for (Expense e : expenses) total += e.amount;
        return total;
    }

    public double getTotalSavings() {
        double total = 0;
        for (SavingsGoal s : savings) total += s.amount;
        return total;
    }

    public double getTotalInvestments() {
        double total = 0;
        for (Investment i : investments) total += i.amount;
        return total;
    }

    public double getBalance() {
        return income - getTotalExpenses() - getTotalSavings() - getTotalInvestments();
    }
}
