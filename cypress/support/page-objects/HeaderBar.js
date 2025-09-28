class HeaderBar {
  // Selectors
  get logo() {
    return cy.get("#cdllogo");
  }
  get hamburgerIcon() {
    return cy.get("#hamburgericon");
  }
  get hamburgerMenu() {
    return cy.get("#hamburgermenu", { timeout: 20000 }); // Increased timeout for menu to appear
  }
  get mediaMenuItem() {
    return cy
      .get("#hamburgermenu-media.hamburgermenuitem.fontfill.tier1.toggle")
      .scrollIntoView();
  }
  get newsMenuItem() {
    return cy.contains("News");
  }
  get careersMenuItem() {
    return cy.get(
      "#hamburgermenu-careers.hamburgermenuitem.fontfill.tier1.toggle",
    );
  }

  // Actions
  visit() {
    cy.visit("/");
    return this;
  }

  verifyLogoExists() {
    this.logo.should("exist");
    return this;
  }

  openHamburgerMenu() {
    // First ensure the hamburger icon is visible and clickable
    this.hamburgerIcon.should("exist").and("not.be.disabled").click();

    // Wait for menu to be visible and fully expanded
    this.hamburgerMenu.should("exist").and("be.visible");

    // Wait for menu items to be present before proceeding
    cy.get("#hamburgermenu-media.hamburgermenuitem.fontfill.tier1.toggle", {
      timeout: 10000,
    }).should("exist");

    return this;
  }

  navigateToNews() {
    this.openHamburgerMenu();
    this.mediaMenuItem.should("exist").and("be.visible").click();
    this.newsMenuItem.should("exist").and("be.visible").click();
    return this;
  }

  navigateToCareers() {
    this.openHamburgerMenu();
    this.careersMenuItem.should("exist").and("be.visible").click();
    return this;
  }

  // Wait for menu to be fully expanded and interactive
  waitForMenuReady() {
    // Wait for the hamburger menu to be visible and have completed its transition
    this.hamburgerMenu.should("exist").and("be.visible");

    // Wait for menu items to be present and visible
    cy.get("#hamburgermenu-media.hamburgermenuitem.fontfill.tier1.toggle", {
      timeout: 10000,
    }).should("exist");
    cy.get("#hamburgermenu-careers.hamburgermenuitem.fontfill.tier1.toggle", {
      timeout: 10000,
    }).should("exist");

    return this;
  }
}

export default HeaderBar;
