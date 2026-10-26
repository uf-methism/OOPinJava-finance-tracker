package com.financetracker;

// Child class: Investment — mirrors your backend_structure exactly
public class Investment extends FinanceRecord {
    private String type; // "Liquid" | "Mid-cap" | "Large-cap"

    public Investment(String name, double amount, String type) {
        super(name, amount);
        this.type = type;
    }

    @Override
    public String getCategory() { return type; }
}
