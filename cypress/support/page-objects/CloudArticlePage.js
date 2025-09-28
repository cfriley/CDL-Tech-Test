class CloudArticlePage {
  // Selectors

  get cloudArticleUrl() {
    return cy.url();
  }

  get footerNavigationBack() {
    return cy.get("#footer .left").contains("Back");
  }

  // Actions
  navigateBack() {
    this.footerNavigationBack.click();
    return this;
  }
}
export default new CloudArticlePage();
