import HeaderBar from "./HeaderBar";

class NewsPage extends HeaderBar {
  // Selectors
  get newsPageUrl() {
    return cy.url();
  }

  get cloudTransformationArticle() {
    return cy.contains(".contentboxtitle", "Cloud-only transformation");
  }

  get newsVideoPad() {
    return cy.get("#videopad", { timeout: 10000 });
  }

  // Actions
  openCloudTransformationArticle() {
    this.cloudTransformationArticle.click();
    return this;
  }
}

export default new NewsPage();
