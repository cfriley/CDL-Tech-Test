import HomePage from "../support/page-objects/HomePage";
import NewsPage from "../support/page-objects/NewsPage";
import CloudArticlePage from "../support/page-objects/CloudArticlePage";
import VacanciesPage from "../support/page-objects/VacanciesPage";

describe("CDL Website Navigation Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should click on the menu, select media, then news, and click on the Cloud-only transformation article", () => {
    // Verify CDL logo is visible
    HomePage.verifyLogoVisible();

    // Click on the menu
    HomePage.openHamburgerMenu();

    // Click on Media
    HomePage.mediaMenuItem.should("be.visible").click();

    // Select News
    HomePage.newsMenuItem.should("be.visible").click();

    // Verify the URL of the News page is correct
    NewsPage.newsPageUrl.should("include", "/media/news");

    // Open Cloud-only transformation article
    NewsPage.openCloudTransformationArticle();

    // Verify the URL of the article is correct
    CloudArticlePage.cloudArticleUrl.should(
      "include",
      "Cloud_only_transformation",
    );

    // Navigate back to News page via browser back button
    // cy.go("back");
    CloudArticlePage.navigateBack();

    // Assert the news video pad exists and news page is loaded
    NewsPage.newsVideoPad.should("exist");

    // Click on the menu again and select Careers, then vacancies
    NewsPage.openHamburgerMenu();
    HomePage.careersMenuItem.should("exist").click({ force: true });
    HomePage.waitForMenuReady();
    cy.contains("Vacancies").should("exist").click({ force: true });

    // Wait for the Vacancies page to load
    cy.url().should("include", "vacancies");

    // Search for multiple roles using fixture data
    cy.fixture("roles").then(({ roles }) => {
      roles.forEach((role) => {
        // Search for the role
        VacanciesPage.searchForRole(role.title);

        // If results expected, verify job details

        VacanciesPage.searchResultCount.should("be.visible");

        VacanciesPage.openJobDetails(role.title).verifyJobDetailsPage(
          role.title,
        );
      });
    });
  });
});
