Feature: SISTRAN E-commerce Refactor and UI/UX Enhancements

  Background:
    Given the application is running
    And the backend provides products with multi-language support

  Scenario: Full Internationalization (i18n) for theoretical tests
    Given the user opens the QA Responses page
    When the user changes the language to "es"
    Then all theoretical questions and answers should be displayed in Spanish
    When the user changes the language to "en"
    Then all theoretical questions and answers should be displayed in English

  Scenario: Multi-language Support for Products
    Given the E-commerce backend is running
    When the frontend sends a request to GET /api/products with Accept-Language "es"
    Then the backend responds with Spanish titles and descriptions
    When the frontend sends a request to GET /api/products with Accept-Language "en"
    Then the backend responds with English titles and descriptions

  Scenario: Global Footer and Branding
    Given the user navigates to any page
    Then the header must display the "FennerEduardo.com" logo
    And the footer must display a copyright notice
    And the footer must contain a link to "fennereduardo.com"

  Scenario: Advanced Product Management (CRUD)
    Given the E-commerce backend API is available
    When the admin sends a POST request to "/api/products" with valid product data
    Then the product should be created successfully
    When the admin sends a PUT request to "/api/products/1" to update the price
    Then the product should be updated successfully
    When the admin sends a DELETE request to "/api/products/1"
    Then the product should be removed successfully

  Scenario: Advanced Order Management (CRUD)
    Given the E-commerce backend API is available
    When the system sends a GET request to "/api/orders"
    Then a list of orders with their associated product items should be returned
    When the system sends a POST request to "/api/orders" with a valid order
    Then the order is created with the current UTC date
    When the system sends a DELETE request to "/api/orders/1"
    Then the order should be removed successfully
