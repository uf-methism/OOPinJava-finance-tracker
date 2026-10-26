package com.financetracker;

// Child class: SavingsGoal — mirrors your backend_structure exactly
public class SavingsGoal extends FinanceRecord {
    private double target;
    private String duration; // "Immediate" | "6 Months" | "Long-term"

    public SavingsGoal(String name, double saved, double target, String duration) {
        super(name, saved); // 'amount' field holds the saved amount
        this.target = target;
        this.duration = duration;
    }

    @Override
    public String getCategory() {
        return duration;
    } // duration acts as category

    public double getTarget() {
        return target;
    }
}
