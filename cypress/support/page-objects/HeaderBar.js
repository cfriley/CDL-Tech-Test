class HeaderBar {
  // Selectors
  get logo() {
    return cy.get("#cdllogo");
  }
  get hamburgerIcon() {
    return cy.get("#hamburgericon");
  }
  get hamburgerMenu() {
    return cy.get("#hamburgermenu", { timeout: 25000 }); // Increased timeout for menu to appear
  }
  get mediaMenuItem() {
    return cy.get("#hamburgermenu-media").scrollIntoView();
  }

  // Comment on how to get the news menu item below: I decided to use the uncommented method below to make it more flexible
  // in case the menu structure changes or if I want to select other menu items in future.
  // This way, I can just pass the menu item text as a parameter.
  // I have left the original method commented out for reference to show it can be done both ways.
  // Uncomment the following method if you prefer the original approach.

  // get newsMenuItem() {
  //return cy.contains("News");
  //}

  menuItem(item) {
    return cy.contains(item);
  }
  get careersMenuItem() {
    return cy.get("#hamburgermenu-careers");
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
    cy.get("#hamburgermenu-media", {
      timeout: 10000,
    }).should("exist");

    return this;
  }

  navigateToNews() {
    this.openHamburgerMenu();
    this.mediaMenuItem.should("exist").and("be.visible").click();
    this.menuItem("News").should("exist").and("be.visible").click();
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
    cy.get("#hamburgermenu-media", {
      timeout: 15000,
    }).should("exist");
    cy.get("#hamburgermenu-careers", {
      timeout: 15000,
    }).should("exist");

    return this;
  }
}

export default HeaderBar;
