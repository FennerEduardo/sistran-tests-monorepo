Feature: React Frontend E-Commerce and UI Components
  As a frontend user of the SISTRAN application
  I want to interact with an E-Commerce interface built in React
  So that I can browse products, manage a cart, and complete a purchase

  Background:
    Given the React application is loaded at "http://localhost"
    And the backend API is available at "http://localhost:5000"

  # React Test Requirement: Product Listing
  Scenario: Display product catalog from backend
    When the user navigates to "/ecommerce"
    Then the page should display a list of products fetched from "/api/products"
    And each product card should show a title, description, price, and image
    And each product should display a category badge

  # React Test Requirement: Shopping Cart (useContext)
  Scenario: Add products to the shopping cart
    Given the user is on the E-Commerce page
    When the user clicks "Add to Cart" on a product
    Then the cart widget counter should increment by 1
    And the cart context should hold the product reference and quantity

  Scenario: Cart persists across route changes
    Given the user has added 2 products to the cart
    When the user navigates to "/ecommerce/checkout"
    Then the checkout page should display 2 items with correct totals

  # React Test Requirement: Theme Toggle
  Scenario: Toggle between Light and Dark theme
    Given the application loads with the system-preferred theme
    When the user clicks the theme toggle button
    Then the root element should set data-theme="dark" or remove it
    And all CSS variables should update to the dark/light palette

  # React Test Requirement: Language Toggle (i18n)
  Scenario: Toggle between English and Spanish
    Given the application is displayed in English
    When the user clicks the language toggle button
    Then all navigation labels should switch to Spanish
    And the E-Commerce product titles should re-fetch with Accept-Language "es"
    And the Q&A questions should display in Spanish

  # React Test Requirement: Responsive Layout
  Scenario: Navigation adapts to mobile screens
    Given the viewport width is 375px
    Then the navigation links should wrap to a new line
    And the header should remain usable without overflow

  Scenario: Registration form stacks on mobile
    Given the viewport width is 375px
    When the user navigates to "/registration"
    Then the first name and last name fields should stack vertically
    And the contact type/value row should stack vertically
