package com.financetracker;

// Child class: Expenses 
public class Expense extends FinanceRecord {
    private String category; // "Needs" | "Wants" | "Bills"

    public Expense(String name, double amount, String category) {
        super(name, amount);
        this.category = category;
    }

    @Override
    public String getCategory() {
        return category;
    }
}
