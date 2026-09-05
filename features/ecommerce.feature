Feature: E-Commerce Shopping Cart and Checkout
  As a customer
  I want to be able to add products to my cart and checkout securely
  So that I can purchase items either as a guest or as a registered person

  Scenario: Secure Cart Persistence
    Given I am on the e-commerce page
    When I add a "Laptop" to the cart
    Then the cart data should be encrypted in local storage
    When I refresh the page
    Then the cart should still contain the "Laptop"

  Scenario: Guest Checkout with Valid Data
    Given I have items in my cart
    And I am on the checkout step
    When I choose to checkout as a "Guest"
    And I provide valid buyer name, document, and an email
    And I submit the order
    Then I should see the Invoice Modal
    And the order should be saved in the database

  Scenario: Guest Checkout with Invalid Data
    Given I have items in my cart
    And I am on the checkout step
    When I choose to checkout as a "Guest"
    And I provide an invalid email format "bademail.com"
    And I submit the order
    Then the system should reject the order
    And I should see a validation error message

  Scenario: Checkout as Registered Person
    Given I have registered a person named "John Doe"
    And I have items in my cart
    And I am on the checkout step
    When I select "John Doe" from the Registered Person list
    Then the form should auto-fill with "John Doe"'s details
    When I submit the order
    Then I should see the Invoice Modal
    And the order should be linked to "John Doe" in the database
