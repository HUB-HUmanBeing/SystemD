@watch
Feature: Search the Web

  As a human
  I want to sign in on HumanBeing
  So I can find information

  Scenario: Sign in
    Given I have visited "HumanBeing"
    When I click on inscription
    Then I signin as "jeremy" with password "123456"