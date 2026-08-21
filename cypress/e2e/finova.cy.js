it("should keep the expense after page refresh", () => {

  cy.visit("http://localhost:5173");

  // Login
  cy.get('input[type="email"]')
    .type("YOUR_TEST_EMAIL");

  cy.get('input[type="password"]')
    .type("YOUR_TEST_PASSWORD");

  cy.contains("button", "Sign In")
    .click();

  // Wait for dashboard
  cy.contains("Here's your financial overview")
    .should("be.visible");

  // Add expense
  cy.contains("Add Expense")
    .click();

  cy.get('input[name="title"]')
    .type("Refresh Test Expense");

  cy.get('input[name="amount"]')
    .type("750");

  cy.get('select[name="category"]')
    .select("Food");

  cy.get('input[name="date"]')
    .type("2026-08-17");

  cy.contains("button", "Save Expense")
    .click();

  // Confirm it was added
  cy.contains("Refresh Test Expense")
    .should("be.visible");

  // Refresh the browser
  cy.reload();

  // Confirm it still exists after refresh
  cy.contains("Refresh Test Expense")
    .should("be.visible");

});