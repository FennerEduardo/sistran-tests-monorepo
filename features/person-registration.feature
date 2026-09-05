Feature: Person Registration with Business Rule Validation
  As a user of the SISTRAN application
  I want to register people with validated data
  So that only clean, rule-compliant records are stored in the database

  Background:
    Given the backend API is running at "http://localhost:5000"
    And the database is empty

  # .NET Test Requirement: Person model with validation
  Scenario: Register a person with valid data
    When I send a POST request to "/api/persons" with:
      | field      | value        |
      | documentId | ABC123       |
      | firstName  | Juan         |
      | lastName   | Pérez        |
      | birthDate  | 1990-01-15   |
    Then the response status should be 200
    And the response body "success" should be true
    And the person should be stored in the database

  Scenario: Reject person with duplicate document ID
    Given a person with documentId "ABC123" already exists
    When I send a POST request to "/api/persons" with documentId "ABC123"
    Then the response status should be 400
    And the response body should contain an error about duplicate document

  Scenario: Reject person with numbers in first name
    When I send a POST request to "/api/persons" with firstName "Juan123"
    Then the response status should be 400
    And the response body should contain a validation error for "firstName"

  Scenario: Reject person with numbers in last name
    When I send a POST request to "/api/persons" with lastName "Pérez456"
    Then the response status should be 400
    And the response body should contain a validation error for "lastName"

  # .NET Test Requirement: Contact info with max 2 per type
  Scenario: Add up to 2 phone contacts for a person
    When I send a POST request to "/api/persons" with 2 phone contacts
    Then the response status should be 200
    And the person should have 2 phone contacts

  Scenario: Reject more than 2 phone contacts
    When I send a POST request to "/api/persons" with 3 phone contacts
    Then the response status should be 400
    And the response body should contain "Maximum 2 contacts per type"

  Scenario: Add up to 2 email contacts for a person
    When I send a POST request to "/api/persons" with 2 email contacts
    Then the response status should be 200

  Scenario: Add up to 2 physical address contacts
    When I send a POST request to "/api/persons" with 2 address contacts
    Then the response status should be 200

  Scenario: Reject person without at least one email or physical address
    When I send a POST request to "/api/persons" with only phone contacts
    Then the response status should be 400
    And the response body should contain "Debe registrar al menos una dirección de correo electrónico o una dirección física."
