-- -----------------------------------------------------
-- Table produto
-- -----------------------------------------------------
CREATE TABLE produto (
  id SERIAL UNIQUE,
  nome VARCHAR(50) NOT NULL UNIQUE,
  lucro DECIMAL NOT NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table formula
-- -----------------------------------------------------
CREATE TABLE formula (
  id SERIAL UNIQUE,
  nome VARCHAR(45) NOT NULL,
  principal SMALLINT NOT NULL,
  produto_id SERIAL,
  PRIMARY KEY (id, produto_id),
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table origem
-- -----------------------------------------------------
CREATE TABLE origem (
  id SERIAL UNIQUE,
  nome VARCHAR(25) NOT NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table materiaPrima
-- -----------------------------------------------------
CREATE TABLE materiaPrima (
  id SERIAL UNIQUE,
  nome VARCHAR(45) NOT NULL UNIQUE,
  inci VARCHAR(45) NOT NULL,
  estoque DECIMAL NOT NULL,
  minimo DECIMAL NOT NULL,
  origem_id SERIAL,
  PRIMARY KEY (id, origem_id),
  FOREIGN KEY (origem_id) REFERENCES origem(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table fornecedor
-- -----------------------------------------------------
CREATE TABLE fornecedor (
  id SERIAL UNIQUE,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(45) NULL,
  telefone CHAR(17) NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table materiaPrima_has_fornecedor
-- -----------------------------------------------------
CREATE TABLE materiaPrima_has_fornecedor (
  materiaPrima_id SERIAL,
  fornecedor_id SERIAL,
  preco DECIMAL NOT NULL,
  quantidade_minima DECIMAL NOT NULL,
  PRIMARY KEY (materiaPrima_id, fornecedor_id),
  FOREIGN KEY (materiaPrima_id) REFERENCES materiaPrima(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table formula_has_materiaPrima
-- -----------------------------------------------------
CREATE TABLE formula_has_materiaPrima (
  formula_id SERIAL,
  materiaPrima_id SERIAL,
  porcentagem DECIMAL NOT NULL,
  passo SMALLINT NOT NULL,
  PRIMARY KEY (formula_id, materiaPrima_id),
  FOREIGN KEY (materiaPrima_id) REFERENCES materiaPrima(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (formula_id) REFERENCES formula(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table usuario
-- -----------------------------------------------------
CREATE TABLE usuario (
  id SERIAL UNIQUE,
  nome VARCHAR(45) NOT NULL,
  senha VARCHAR(45) NOT NULL,
  email VARCHAR(45) NOT NULL UNIQUE,
  temPermissao SMALLINT NOT NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table rotulo
-- -----------------------------------------------------
CREATE TABLE rotulo (
  id SERIAL UNIQUE,
  tipo SMALLINT NOT NULL,
  principal SMALLINT NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  nome VARCHAR(35) NULL,
  produto_id SERIAL,
  minimo DECIMAL NOT NULL,
  PRIMARY KEY (id, produto_id),
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table rotulo_has_fornecedor
-- -----------------------------------------------------
CREATE TABLE rotulo_has_fornecedor (
  rotulo_id SERIAL,
  fornecedor_id SERIAL,
  preco DECIMAL NOT NULL,
  quantidade_minima DECIMAL NOT NULL,
  PRIMARY KEY (rotulo_id, fornecedor_id),
  FOREIGN KEY (rotulo_id) REFERENCES rotulo(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table embalagem
-- -----------------------------------------------------
CREATE TABLE embalagem (
  id SERIAL UNIQUE,
  nome VARCHAR(45) NOT NULL,
  tipo SMALLINT NOT NULL,
  mililitragem FLOAT NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  minimo DECIMAL NOT NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table embalagem_has_fornecedor
-- -----------------------------------------------------
CREATE TABLE embalagem_has_fornecedor (
  embalagem_id SERIAL,
  fornecedor_id SERIAL,
  preco DECIMAL NOT NULL,
  quantidade_minima DECIMAL NOT NULL,
  PRIMARY KEY (embalagem_id, fornecedor_id),
  FOREIGN KEY (embalagem_id) REFERENCES embalagem(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (fornecedor_id) REFERENCES fornecedor(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table produto_has_embalagem
-- -----------------------------------------------------
CREATE TABLE produto_has_embalagem (
  produto_id SERIAL,
  embalagem_id SERIAL,
  ePrincipal SMALLINT NOT NULL,
  PRIMARY KEY (produto_id, embalagem_id),
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (embalagem_id) REFERENCES embalagem(id) ON DELETE CASCADE ON UPDATE NO ACTION
);


-- -----------------------------------------------------
-- Table producao
-- -----------------------------------------------------
CREATE TABLE producao (
  id SERIAL UNIQUE,
  data DATE NOT NULL DEFAULT now(),
  observação VARCHAR(90) NULL,
  PRIMARY KEY (id)
);


-- -----------------------------------------------------
-- Table producao_has_produto
-- -----------------------------------------------------
CREATE TABLE producao_has_produto (
  producao_id SERIAL,
  produto_id SERIAL,
  quantidade INT NOT NULL,
  mudancas TEXT NULL,
  PRIMARY KEY (producao_id, produto_id),
  FOREIGN KEY (producao_id) REFERENCES producao(id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (produto_id) REFERENCES produto(id) ON DELETE CASCADE ON UPDATE NO ACTION
);
