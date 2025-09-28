import HeaderBar from "./HeaderBar";

class VacanciesPage extends HeaderBar {
  // Selectors
  get vacanciesPageUrl() {
    return cy.url();
  }

  get jobList() {
    return cy.get(".job-list");
  }

  get searchInput() {
    return cy.get("#vacsearch");
  }

  get searchResultCount() {
    return cy.get("#vacsearchcount");
  }

  // Actions
  searchForRole(roleTitle) {
    this.searchInput.should("be.visible").clear().type(roleTitle);
    return this;
  }

  verifySearchResults(expectedCount) {
    if (expectedCount === 0) {
      this.searchResultCount.should("be.visible").and("contain", "0 matching");
    } else {
      this.searchResultCount
        .should("be.visible")
        .and("not.contain", "0 matching");
    }
    return this;
  }

  openJobDetails(jobTitle) {
    cy.contains(".vacsearch", new RegExp(jobTitle, "i"))
      .should("be.visible")
      .click({ force: true });

    // Wait for navigation to complete
    cy.url().should("include", "pinpointhq.com");
    return this;
  }

  verifyJobDetailsPage(jobTitle) {
    cy.origin(
      "https://cdlsoftware.pinpointhq.com",
      { args: { jobTitle } },
      ({ jobTitle }) => {
        cy.contains(jobTitle).should("be.visible");
      },
    );
    return this;
  }
}

export default new VacanciesPage();
