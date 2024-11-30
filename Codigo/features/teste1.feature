Feature: Cadastro de usuário
  Como um novo usuário
  Quero me cadastrar no sistema
  Para acessar as funcionalidades disponíveis

  Scenario: Cadastro bem-sucedido de um novo usuário
    Given estou na página de cadastro
    When preencho o campo "Nome" com "Maria Silva"
    And preencho o campo "Email" com "maria@email.com"
    And preencho o campo "Senha" com "minhaSenha123"
    And clico no botão "Cadastrar"
    Then vejo a mensagem "Cadastro realizado com sucesso"
    

  Scenario: Cadastro com campo obrigatório vazio
    Given estou na página de cadastro
    When preencho o campo "Nome" com ""
    And preencho o campo "Email" com "maria@email.com"
    And preencho o campo "Senha" com "minhaSenha123"
    And clico no botão "Cadastrar"
    Then vejo a mensagem "Erro de cadastro"

  Scenario: Cadastro com email já registrado
    Given um usuário já está cadastrado com o email "maria@email.com"
    And estou na página de cadastro
    When preencho o campo "Nome" com "Maria Silva"
    And preencho o campo "Email" com "maria@email.com"
    And preencho o campo "Senha" com "minhaSenha123"
    And clico no botão "Cadastrar"
    Then vejo a mensagem "Erro de cadastro"
