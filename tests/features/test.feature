@focus
Feature: A user can sign up on HUman Being

  As a human
  I want to sign in on HumanBeing
  So I can use it

  Scenario: Sign in
    Given I have visited "HumanBeing"

    When I click on the connexion button
    And I signin as "jeremy" with password "123456"

    Then I am on the "/user/my_profile" page
    And "jeremy" is registered
