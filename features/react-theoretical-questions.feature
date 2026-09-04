Feature: React Theoretical Knowledge Questions
  As a technical evaluator
  I want the application to present React knowledge test questions
  So that the candidate demonstrates understanding of React hooks and patterns

  Background:
    Given the Q&A module is accessible at "/qa"

  # React Test Requirement: useEffect dependency
  Scenario: Question 1 - useEffect dependency error
    When the user expands the "React Test" section
    Then question 1 should ask about the useEffect error
    And the answer should indicate the dependency array issue with props.value

  # React Test Requirement: useState batching
  Scenario: Question 2 - useState batching behavior
    Then question 2 should ask about React state batching
    And the answer should explain both calls use the same previous value

  # React Test Requirement: useContext re-render
  Scenario: Question 3 - useContext not updating children
    Then question 3 should ask why useContext doesn't trigger re-renders
    And the answer should explain the cart state is not tied to useState

  # React Test Requirement: useEffect dependency array
  Scenario: Question 4 - useEffect missing dependency
    Then question 4 should ask about fetchData in useEffect
    And the answer should explain it should be in the dependency array

  # React Test Requirement: useReducer mutation
  Scenario: Question 5 - useReducer state mutation
    Then question 5 should ask about useReducer direct mutation
    And the answer should explain state must return a new copy

  # React Test Requirement: onClick handler
  Scenario: Question 6 - onClick immediate execution
    Then question 6 should ask why onClick={handleClick()} doesn't work
    And the answer should explain it executes immediately upon rendering

  # React Test Requirement: useState initialization
  Scenario: Question 7 - useState without initial value
    Then question 7 should ask about useState without initialization
    And the answer should recommend initializing with empty string

  # React Test Requirement: Infinite loop
  Scenario: Question 8 - useEffect infinite loop
    Then question 8 should ask about setCounter inside useEffect with [counter]
    And the answer should explain it causes an infinite loop

  # React Test Requirement: Nested contexts
  Scenario: Question 9 - Nested useContext risks
    Then question 9 should ask about nested useContext risks
    And the answer should explain missing Provider returns undefined

  # React Test Requirement: Object reference
  Scenario: Question 10 - useState object reference
    Then question 10 should ask about setUser(user) not triggering re-render
    And the answer should explain reference equality prevents re-render
