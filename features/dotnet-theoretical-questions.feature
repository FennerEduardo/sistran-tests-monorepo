Feature: .NET Backend API - Theoretical Knowledge Questions
  As a technical evaluator
  I want the application to present and validate .NET and SQL knowledge
  So that the candidate demonstrates understanding of core concepts

  Background:
    Given the Q&A module is accessible at "/qa"

  # .NET Test Requirement: Algorithm output question
  Scenario: Question 1 - Algorithm execution result
    When the user expands the ".NET & SQL Test" section
    Then question 1 should ask about the algorithm execution result
    And the answer should indicate "Result 1: 69, Result 2: 49"

  # .NET Test Requirement: Display info question
  Scenario: Question 2 - Complete information display
    Then question 2 should ask which options show complete info
    And the answer should indicate "a and b are correct"

  # .NET Test Requirement: MVC pattern
  Scenario: Question 3 - MVC Acronym
    Then question 3 should explain the MVC pattern concept
    And the answer should describe it as a design pattern for presentation

  # .NET Test Requirement: Singleton pattern
  Scenario: Question 4 - Singleton pattern
    Then question 4 should ask about the Singleton pattern
    And the answer should indicate "None of the above"

  # .NET Test Requirement: ORM definition
  Scenario: Question 5 - ORM Definition
    Then question 5 should define ORM
    And the answer should describe converting data between relational DBs and objects

  # .NET Test Requirement: SQL GROUP BY
  Scenario: Question 6 - SQL orders >= 5
    Then question 6 should ask about SQL GROUP BY with HAVING
    And the answer should use GROUP BY and HAVING COUNT >= 5

  # .NET Test Requirement: SQL NOT BETWEEN
  Scenario: Question 7 - Age not between 40 and 50
    Then question 7 should ask about age filtering
    And the answer should use NOT BETWEEN

  # .NET Test Requirement: SQL LIKE
  Scenario: Question 8 - Employees starting with Lu
    Then question 8 should ask about LIKE pattern matching
    And the answer should use WHERE Nombre LIKE 'Lu%'

  # .NET Test Requirement: LEFT JOIN
  Scenario: Question 9 - Employees with order count
    Then question 9 should ask about JOIN with zero-order employees
    And the answer should use LEFT JOIN

  # .NET Test Requirement: jQuery Autocomplete
  Scenario: Question 10 - jQuery Autocomplete
    Then question 10 should ask about autocomplete implementation
    And the answer should use source and select function

  # .NET Test Requirement: JS Validation
  Scenario: Question 11 - JS validation
    Then question 11 should ask about form validation logic
    And the answer should validate letters, ID length, and gender

  # .NET Test Requirement: LINQ
  Scenario: Question 12 - Valid LINQ statement
    Then question 12 should ask about LINQ syntax
    And the answer should use "from num in numeros where (num % 2 == 0)"

  # .NET Test Requirement: DataContract
  Scenario: Question 13 - DataContract for XML Array
    Then question 13 should ask about WCF DataContract definition
    And the answer should use MessageContract with MessageBodyMember
