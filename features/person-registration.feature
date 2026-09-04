Feature: Person Registration
  In order to manage persons
  As an operator
  I want to register persons with specific business rules

  Scenario: Successful person registration
    Given a new person with identity document "AB1234", names "Pedro Estiven", surnames "Gil Barón", and birth date "1979-10-26"
    And contact info with email "pedro@test.com" and phone "12345678"
    When I register the person
    Then the person should be registered successfully

  Scenario: Prevent registering person with duplicate identity document
    Given an existing person with identity document "AB1234"
    When I try to register a new person with identity document "AB1234"
    Then the system should reject the registration

  Scenario: Validate person names and surnames format
    Given a new person with names "Pedro123" and surnames "Gil"
    When I register the person
    Then the registration should fail because names cannot contain numbers

  Scenario: Validate identity document format
    Given a new person with identity document "123-456"
    When I register the person
    Then the registration should fail because identity document must be alphanumeric

  Scenario: Validate maximum contact info
    Given a new person with 3 phones, 3 emails and 3 addresses
    When I register the person
    Then the registration should fail because maximum limits are 2 phones, 2 emails and 2 addresses
