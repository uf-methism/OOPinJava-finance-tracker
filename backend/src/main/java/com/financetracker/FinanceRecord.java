package com.financetracker;

// Parent class: demonstrates abstraction and inheritance (from your OOP design)
public abstract class FinanceRecord {
    protected String name;
    protected double amount;

    public FinanceRecord(String name, double amount) {
        this.name = name;
        this.amount = amount;
    }

    public String getName() {
        return name;
    }

    public double getAmount() {
        return amount;
    }

    public abstract String getCategory();
}
