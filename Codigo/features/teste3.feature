Feature: Deletar matéria prima

  Scenario: Deletar matéria prima com sucesso
    Given uma matéria prima já existe com ID "3"
    When deleto a matéria prima com ID "3"
    Then vejo a mensagem de sucesso "Deletar Matéria prima - Matéria prima deletada com sucesso"
