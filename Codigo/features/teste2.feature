Feature: Atualização de fornecedor
  Como administrador
  Quero alterar os dados de um fornecedor
  Para manter as informações atualizadas

  Scenario: Atualizar dados de um fornecedor com sucesso
    Given um fornecedor já existe com ID "2"
    When atualizo o fornecedor com ID "2" para:
      | Nome        | Email               | Telefone  |
      | Maria Souza | maria@email.com     | 987654321 |
    Then vejo a mensagem de retorno "Atualização do Fornecedor - Fornecedor atualizado com sucesso!"

