Feature: E-commerce Store
  In order to buy products
  As a customer
  I want to browse a catalog and add items to a cart

  Scenario: View product catalog
    Given the store has multiple products
    When I visit the home page
    Then I should see the list of products

  Scenario: Add product to cart
    Given a product with ID "1" exists
    When I add the product "1" to the cart with quantity 2
    Then the cart should show 2 items
