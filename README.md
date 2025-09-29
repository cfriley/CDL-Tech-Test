# CDL Website E2E Test Suite

## Overview

This repository contains an end-to-end test automation suite for the CDL website, developed as part of a QA Engineer technical assessment. The test suite uses Cypress framework and implements the Page Object Model (POM) design pattern to ensure maintainable, scalable, and reliable test automation.

## Test Scenario provided by CDL

1. Navigate to CDL.co.uk
2. Navigate to our "news" page
3. Open "Cloud-Only Transformation"
4. Go back
5. Navigate to Career vacancies
6. Input "Software Developer Apprentice" into the filter
7. Verify that "Software Developer Apprentice" is shown and click to show the role overview

## Notes on Test Scenario

There was no "Software Developer Apprentice" role available on the CDL website. Therefore I opted to search with the term "developer" and select the Full Stack Software Developer role that is available

## Technology Stack

- **Framework**: Cypress v15.3.0
- **Language**: JavaScript (ES6+)
- **Design Pattern**: Page Object Model with Inheritance
- **Data Management**: JSON fixtures
- **Code Quality**: ESLint + Prettier

## Project Structure

```
cypress/
├── e2e/
│   └── cdl_technical_test.cy.js     # Main test specification
├── fixtures/
│   └── roles.json                   # Test data for job search
├── support/
│   ├── commands.js                  # Custom Cypress commands
│   ├── e2e.js                      # Global test configuration
│   └── page-objects/               # Page Object Model implementation
│       ├── HeaderBar.js            # Base class for header navigation
│       ├── HomePage.js             # Homepage specific methods
│       ├── NewsPage.js             # News page interactions
│       ├── CloudArticlePage.js     # Article page operations
│       └── VacanciesPage.js        # Job search functionality
```

## Design Patterns & Architecture

### Page Object Model (POM)

I chose to implement the **Page Object Model** for several key reasons:

#### Benefits:

- **Maintainability**: Changes to UI elements require updates in only one place
- **Reusability**: Page methods can be used across multiple test cases
- **Readability**: Test scripts become more readable and self-documenting
- **Separation of Concerns**: Test logic is separated from page interaction logic
- **Reduced Code Duplication**: Common actions are abstracted into reusable methods

#### Implementation:

```javascript
// Example: HeaderBar.js contains common navigation methods
class HeaderBar {
  get hamburgerIcon() {
    return cy.get("#hamburgericon");
  }

  openHamburgerMenu() {
    this.hamburgerIcon.should("exist").and("not.be.disabled").click();
    this.hamburgerMenu.should("exist").and("be.visible");
    return this;
  }
}
```

### Inheritance Pattern

I utilized **class inheritance** to create a hierarchy of page objects:

```javascript
// HomePage extends HeaderBar to inherit navigation methods
class HomePage extends HeaderBar {
  // HomePage-specific methods can be added here
}
```

#### Advantages of Inheritance:

- **Code Reuse**: Common navigation elements (header, menu) are inherited by all pages
- **Consistency**: Ensures uniform interaction patterns across pages
- **Scalability**: Easy to add new pages that share common functionality
- **Method Chaining**: Enables fluent interface pattern for better test readability

## Challenges Encountered

### Test Flakiness Issues

During development, I encountered significant **flakiness** in the following areas:

#### 1. Hamburger Menu Interactions

**Problem**: Inconsistent behaviour when opening/closing the hamburger menu
**Root Causes**:

- Animation timing issues
- Element visibility state changes
- Race conditions between click and DOM updates

**Solutions Implemented**:

```javascript
openHamburgerMenu() {
  // Increased timeout for menu animations
  this.hamburgerMenu.should("exist").and("be.visible", { timeout: 20000 });

  // Wait for menu items to be fully loaded
  cy.get("#hamburgermenu-media", { timeout: 10000 }).should("exist");
}
```

#### 2. Footer "Back" Element

**Problem**: Unreliable interaction with the back navigation element
**Mitigation**: Implemented alternative navigation strategies and explicit waits

#### 3. Retry Mechanism Implementation

**Solution**: To further address flakiness issues, I implemented **retry logic** within the test suite:

```javascript
// Cypress configuration with retry attempts
{
  "retries": {
    "runMode": 2,
    "openMode": 1
  }
}
```

**Benefits of Retry Implementation**:

- **Improved Test Stability**: Automatic retries help handle transient failures
- **Reduced False Negatives**: Temporary network issues or timing problems are mitigated
- **Better CI/CD Integration**: More reliable test results in automated pipelines
- **Graceful Failure Handling**: Distinguishes between genuine failures and environmental issues

This approach provides an additional safety net while working to resolve the underlying flakiness issues in the application under test.

#### 4. Force Click Implementation

**Solution**: In cases where elements were being obscured or covered by other elements, I implemented **force clicks** to bypass Cypress's actionability checks:

```javascript
// Examples from test implementation
HomePage.careersMenuItem.should("exist").click({ force: true });
cy.contains("Vacancies").should("exist").click({ force: true });
```

**When Force Click Was Necessary**:

- **Overlapping Elements**: Menu items sometimes covered by animations or transitions
- **Z-index Issues**: Elements present in DOM but not "clickable" due to layering
- **Animation Interference**: Elements technically visible but covered during transitions

**Trade-offs Considered**:

- **Pros**: Ensures test progression when elements are functionally available but technically obscured
- **Cons**: Bypasses Cypress's built-in actionability checks that mirror real user behaviour
- **Alternative Approach**: Could indicate UI/UX issues that real users might experience

This solution was implemented as a targeted fix for specific problematic interactions while maintaining test reliability.

### Element Selection Challenges

#### Lack of Test-Friendly Selectors

**Issue**: The website lacks `data-testid` attributes, which are considered **best practice** for test automation.

**Current State**: Relying on:

- CSS IDs (`#hamburgericon`, `#hamburgermenu`)
- CSS classes (fragile and subject to styling changes)
- Text content (`cy.contains("News")`)

**Recommendation**: Implement `data-testid` attributes:

```html
<!-- Best Practice -->
<button data-testid="hamburger-menu-btn">☰</button>
<nav data-testid="main-navigation">...</nav>
```

**Benefits of data-testid**:

- **Stability**: Independent of styling changes
- **Clarity**: Clear intent for testing purposes
- **Performance**: Faster element location
- **Maintainability**: Less brittle than CSS selectors

## Test Data Management

The suite uses **JSON fixtures** for data-driven testing:

```json
{
  "roles": [
    {
      "title": "Full Stack Software developer",
      "searchTitle": "developer"
    }
  ]
}
```

This approach allows for:

- Easy test data modification without code changes
- Support for multiple test scenarios
- Clear separation of test logic and test data

## Running the Tests

### Prerequisites

- Node.js (v16+)
- npm

### Installation

```bash
npm install
```

### Execution

```bash
# Interactive mode
npx cypress open

# Headless mode
npx cypress run

# Specific test file
npx cypress run --spec "cypress/e2e/cdl_technical_test.cy.js"
```

## Quality Assurance Considerations

### Reliability Improvements

1. **Explicit Waits**: Implemented throughout to handle dynamic content
2. **Error Handling**: Graceful handling of element state changes
3. **Timeout Configuration**: Adjusted for slow-loading elements

### Future Enhancements

1. **Cross-browser Testing**: Extend coverage to Firefox, Safari
2. **Mobile Testing**: Add viewport testing for responsive design
3. **Visual Regression**: Implement screenshot comparison
4. **API Testing**: Add backend validation where applicable

## Best Practices Implemented

1. **Single Responsibility**: Each page object handles only its specific page
2. **Method Chaining**: Enables fluent test writing
3. **Descriptive Naming**: Clear method and variable names
4. **Error Messages**: Meaningful assertions and error descriptions
5. **Code Organization**: Logical separation of selectors and actions

## Recommendations for Development Team

1. **Add Test IDs**: Implement `data-testid` attributes for reliable element selection
2. **Reduce Animation Timing**: Consider faster transitions for test environments
3. **Consistent Loading States**: Implement clear loading indicators
4. **Test Environment**: Consider a dedicated testing environment with stable data

## Conclusion

This test suite demonstrates a robust, maintainable approach to E2E testing using modern best practices. While challenges with flakiness were encountered due to the dynamic nature of the website, the implementation provides a solid foundation for comprehensive test coverage and future expansion.

---

**Author**: Claire Riley
**Date**: September 2025  
**Framework**: Cypress v15.3.0
