import HomePage from "../support/page-objects/HomePage";
import NewsPage from "../support/page-objects/NewsPage";
import CloudArticlePage from "../support/page-objects/CloudArticlePage";
import VacanciesPage from "../support/page-objects/VacanciesPage";

describe("CDL Website Navigation Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should navigate to the news page, click on the Cloud-only transformation article, then navigate to career vacancies, search for developer and open the role overview", () => {
    // Verify CDL logo exists
    HomePage.verifyLogoExists();

    // Click on the menu
    HomePage.openHamburgerMenu();

    // Click on Media
    HomePage.mediaMenuItem.should("exist").click({ force: true });

    // Select News:
    // As per comment on HeaderBar.js lines 16-24
    // if using the commented-out method from HeaderBar instead, line 26 should be replaced with line 25 below

    // HomePage.newsMenuItem.should("exist").click();
    HomePage.menuItem("News").should("exist").click({ force: true });

    // Verify the URL of the News page is correct
    NewsPage.newsPageUrl.should("include", "/media/news");

    // Open Cloud-only transformation article
    NewsPage.openCloudTransformationArticle();

    // Verify the URL of the article is correct
    CloudArticlePage.cloudArticleUrl.should(
      "include",
      "Cloud_only_transformation",
    );

    // Navigate back to News page via footer link
    // cy.go("back") is also possible here

    CloudArticlePage.navigateBack();

    // Assert the news video pad exists and news page is loaded
    NewsPage.newsVideoPad.should("exist");

    // Click on the menu again and select Careers, then vacancies
    NewsPage.openHamburgerMenu();
    NewsPage.waitForMenuReady();
    NewsPage.careersMenuItem.should("exist").click({ force: true });
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
