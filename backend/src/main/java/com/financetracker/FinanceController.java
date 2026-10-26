package com.financetracker;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API controller.
 * A single FinanceTracker instance lives for the lifetime of the app
 * (in-memory, as requested — data resets on restart).
 */
@RestController
@RequestMapping("/api/finance")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FinanceController {

    // One shared instance — all endpoints use the same tracker
    private final FinanceTracker tracker = new FinanceTracker();

    // ── Summary ────────────────────────────────────────────────────────────────

    /** GET /api/finance/summary */
    @GetMapping("/summary")
    public Map<String, Double> getSummary() {
        return Map.of(
                "income", tracker.getIncome(),
                "expenses", tracker.getTotalExpenses(),
                "savings", tracker.getTotalSavings(),
                "investments", tracker.getTotalInvestments(),
                "balance", tracker.getBalance());
    }

    // ── Income ─────────────────────────────────────────────────────────────────

    /** PUT /api/finance/income body: { "income": 50000 } */
    @PutMapping("/income")
    public ResponseEntity<Map<String, String>> setIncome(@RequestBody Map<String, Double> body) {
        try {
            tracker.setIncome(body.get("income"));
            return ResponseEntity.ok(Map.of("message", "Income updated"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Expenses ───────────────────────────────────────────────────────────────

    /** GET /api/finance/expenses */
    @GetMapping("/expenses")
    public List<Map<String, Object>> getExpenses() {
        return tracker.getExpenses().stream()
                .map(e -> Map.<String, Object>of(
                        "name", e.getName(),
                        "amount", e.getAmount(),
                        "category", e.getCategory()))
                .toList();
    }

    /**
     * POST /api/finance/expenses body: { "name": "Groceries", "amount": 1500,
     * "category": "Needs" }
     */
    @PostMapping("/expenses")
    public ResponseEntity<Map<String, String>> addExpense(@RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            double amount = ((Number) body.get("amount")).doubleValue();
            String category = (String) body.get("category");
            tracker.addExpense(new Expense(name, amount, category));
            return ResponseEntity.ok(Map.of("message", "Expense added"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid expense data"));
        }
    }

    // ── Savings ────────────────────────────────────────────────────────────────

    /** GET /api/finance/savings */
    @GetMapping("/savings")
    public List<Map<String, Object>> getSavings() {
        return tracker.getSavings().stream()
                .map(s -> Map.<String, Object>of(
                        "name", s.getName(),
                        "amount", s.getAmount(),
                        "target", s.getTarget(),
                        "duration", s.getCategory() // getCategory() returns duration
                ))
                .toList();
    }

    /**
     * POST /api/finance/savings body: { "name": "Emergency Fund", "amount": 5000,
     * "target": 20000, "duration": "6 Months" }
     */
    @PostMapping("/savings")
    public ResponseEntity<Map<String, String>> addSavings(@RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            double amount = ((Number) body.get("amount")).doubleValue();
            double target = ((Number) body.get("target")).doubleValue();
            String duration = (String) body.get("duration");
            tracker.addSavings(new SavingsGoal(name, amount, target, duration));
            return ResponseEntity.ok(Map.of("message", "Savings goal added"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid savings data"));
        }
    }

    // ── Investments ────────────────────────────────────────────────────────────

    /** GET /api/finance/investments */
    @GetMapping("/investments")
    public List<Map<String, Object>> getInvestments() {
        return tracker.getInvestments().stream()
                .map(i -> Map.<String, Object>of(
                        "name", i.getName(),
                        "amount", i.getAmount(),
                        "type", i.getCategory() // getCategory() returns type
                ))
                .toList();
    }

    /**
     * POST /api/finance/investments body: { "name": "Nifty 50 Fund", "amount":
     * 10000, "type": "Large-cap" }
     */
    @PostMapping("/investments")
    public ResponseEntity<Map<String, String>> addInvestment(@RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            double amount = ((Number) body.get("amount")).doubleValue();
            String type = (String) body.get("type");
            tracker.addInvestment(new Investment(name, amount, type));
            return ResponseEntity.ok(Map.of("message", "Investment added"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid investment data"));
        }
    }
}
