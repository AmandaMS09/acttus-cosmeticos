Use controleProducao;
 -- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
 -- FLUSH PRIVILEGES;

select * from usuario;
INSERT INTO usuario VALUES (NULL, "Admin","Admin","baiao@acttus.com",1);
INSERT INTO usuario VALUES (NULL, "Comum","Comum","paulo@acttus.com",0);
INSERT INTO usuario VALUES (NULL, "Admin2","Admin2","vagner@acttus.com",1);
INSERT INTO usuario VALUES (NULL, "Comum2","Comum2","romario@acttus.com",0);
INSERT INTO usuario VALUES (NULL, "Comum3","Comum3","ronaldo@acttus.com",0);
INSERT INTO usuario VALUES (NULL, "Cobaia","cobaia","cobaia@acttus.com",0);

delete from usuario
where id = 2;

UPDATE usuario
SET nome = 'Cobaia'
WHERE id = 7;

UPDATE usuario
SET email = 'cobaia@acttus.com'
WHERE id = 7;


-- inserts principais

-- select * from origem;
insert into origem values (null, "Vegetal");
insert into origem values (null, "Mineral");
insert into origem values (null, "Animal");
insert into origem values (null, "Silicone");

-- select * from materiaPrima;
insert into materiaPrima values (null, "Materia Prima 1", "INCI 1", 10, 500, 1);
insert into materiaPrima values (null, "Materia Prima 2", "INCI 2", 15, 10000, 2);
insert into materiaPrima values (null, "Materia Prima 3", "INCI 3", 30, 5000, 3);
insert into materiaPrima values (null, "Materia Prima 4", "INCI 4", 100, 40000, 4);
insert into materiaPrima values (null, "Materia Prima 5", "INCI 5", 25, 100000, 1);
insert into materiaPrima values (null, "Materia Prima 6", "INCI 6", 34, 3000, 2);
insert into materiaPrima values (null, "Materia Prima 7", "INCI 7", 150, 10000, 3);
insert into materiaPrima values (null, "Materia Prima 8", "INCI 8", 40, 2000, 4);
insert into materiaPrima values (null, "Materia Prima 9", "INCI 9", 8, 2000, 1);
insert into materiaPrima values (null, "Materia Prima 10", "INCI 10", 32, 2300, 2);
insert into materiaPrima values (null, "Materia Prima 11", "INCI 11", 105, 300, 2);

-- select * from fornecedor;
insert into fornecedor values (null, "Fornecedor 1", "fornecedor1@gmail.com", 911111111);
insert into fornecedor values (null, "Fornecedor 2", "fornecedor2@gmail.com", 922222222);
insert into fornecedor values (null, "Fornecedor 3", "fornecedor3@gmail.com", 933333333);
insert into fornecedor values (null, "Fornecedor 4", "fornecedor4@gmail.com", 944444444);
insert into fornecedor values (null, "Fornecedor 5", "fornecedor5@gmail.com", 955555555);
insert into fornecedor values (null, "Fornecedor 6", "fornecedor6@gmail.com", 966666666);
insert into fornecedor values (null, "Fornecedor 7", "fornecedor7@gmail.com", 977777777);
insert into fornecedor values (null, "Fornecedor 8", "fornecedor8@gmail.com", 988888888);
insert into fornecedor values (null, "Fornecedor 9", "fornecedor9@gmail.com", 999999999);
insert into fornecedor values (null, "Fornecedor 10", "fornecedor10@gmail.com", 910101010);

-- select * from produto;
insert into produto values (null, "Produto 1", 10);
insert into produto values (null, "Produto 2", 15);
insert into produto values (null, "Produto 3", 20);
insert into produto values (null, "Produto 4", 25);
insert into produto values (null, "Produto 5", 30);
insert into produto values (null, "Produto 6", 35);
insert into produto values (null, "Produto 7", 40);
insert into produto values (null, "Produto 8", 45);
insert into produto values (null, "Produto 9", 50);
insert into produto values (null, "Produto 10", 55);
insert into produto values (null, "Produto 11", 12);

-- select * from formula;
insert into formula values (null, "Formula 1", 1, 1);
insert into formula values (null, "Formula 2", 0, 2);
insert into formula values (null, "Formula 3", 1, 3);
insert into formula values (null, "Formula 4", 0, 4);
insert into formula values (null, "Formula 5", 1, 5);
insert into formula values (null, "Formula 6", 0, 6);
insert into formula values (null, "Formula 7", 1, 7);
insert into formula values (null, "Formula 8", 0, 8);
insert into formula values (null, "Formula 9", 1, 9);
insert into formula values (null, "Formula 10", 0, 10);

-- select * from rotulo;
insert into rotulo values (null, 0, 1, 2, "Rotulo 1", 1,5);
insert into rotulo values (null, 1, 1, 2, "Rotulo 2", 2,5);
insert into rotulo values (null, 0, 1, 2, "Rotulo 22", 2,5);
insert into rotulo values (null, 0, 1, 2, "Rotulo 3", 3,5);
insert into rotulo values (null, 1, 1, 2, "Rotulo 4", 4,5);
insert into rotulo values (null, 0, 1, 2, "Rotulo 5", 5,5);
insert into rotulo values (null, 1, 1, 2, "Rotulo 6", 6,5);
insert into rotulo values (null, 0, 1, 2, "Rotulo 7", 7,5);
insert into rotulo values (null, 1, 1, 2, "Rotulo 8", 8,5);
insert into rotulo values (null, 0, 1, 2, "Rotulo 9", 9,5);
insert into rotulo values (null, 1,1, 2, "Rotulo 10", 10,5);

-- select * from producao;
insert into producao values (1, '2023-05-21 10:30:00', "enche linguiça");
insert into producao values (2, '2023-05-14 10:30:00', "enche linguiça");
insert into producao values (3, '2023-03-19 10:30:00', "enche linguiça");
insert into producao values (4, '2023-02-09 10:30:00', "enche linguiça");
insert into producao values (5, '2023-05-12 10:30:00', "enche linguiça");
insert into producao values (6, '2023-04-10 10:30:00', "enche linguiça");
insert into producao values (7, '2023-03-28 10:30:00', "enche linguiça");
insert into producao values (8, '2023-05-12 10:30:00', "enche linguiça");
insert into producao values (9, '2023-01-20 10:30:00', "enche linguiça");
insert into producao values (10, '2023-05-03 10:30:00', "enche linguiça");
insert into producao values (11, '2023-05-20 10:30:00', "enche linguiça");

-- select * from embalagem;
insert into embalagem values (null, "Embalagem 1", 0, 400, 1,2);
insert into embalagem values (null, "Embalagem 2", 1, 800, 1,2);
insert into embalagem values (null, "Embalagem 3", 0, 550, 1,2);
insert into embalagem values (null, "Embalagem 4", 1, 100, 1,2);
insert into embalagem values (null, "Embalagem 5", 0, 400, 1,2);
insert into embalagem values (null, "Embalagem 6", 1, 300, 1,2);
insert into embalagem values (null, "Embalagem 7", 0, 1000, 1,2);
insert into embalagem values (null, "Embalagem 8", 1, 500, 1,2);
insert into embalagem values (null, "Embalagem 9", 0, 350, 1,2);
insert into embalagem values (null, "Embalagem 10", 1, 500, 1,2);
insert into embalagem values (null, "Embalagem 11", 0, 200, 1,2);
insert into embalagem values (null, "Embalagem 112", 0, 200, 1,2);

-- select * from formula_has_materiaPrima;
insert into formula_has_materiaPrima values (1, "1", 10, 1);
insert into formula_has_materiaPrima values (2, "2", 15, 2);
insert into formula_has_materiaPrima values (2, "3", 15, 1);
insert into formula_has_materiaPrima values (2, "4", 20, 3);
insert into formula_has_materiaPrima values (3, "3", 20, 3);
insert into formula_has_materiaPrima values (4, "4", 25, 4);
insert into formula_has_materiaPrima values (5, "5", 10, 5);
insert into formula_has_materiaPrima values (6, "6", 5, 1);
insert into formula_has_materiaPrima values (7, "7", 3, 2);
insert into formula_has_materiaPrima values (8, "8", 2, 3);
insert into formula_has_materiaPrima values (9, "9", 10, 4);
insert into formula_has_materiaPrima values (10, "10", 24, 5);

-- select * from materiaprima_has_fornecedor;
insert into materiaprima_has_fornecedor values (1, 10, 10, 5);
insert into materiaPrima_has_fornecedor values (2, 9, 15, 10);
insert into materiaPrima_has_fornecedor values (3, 1, 20, 15);
insert into materiaPrima_has_fornecedor values (4, 2, 25, 20);
insert into materiaPrima_has_fornecedor values (5, 3, 30, 25);
insert into materiaPrima_has_fornecedor values (6, 4, 35, 30);
insert into materiaPrima_has_fornecedor values (7, 5, 40, 35);
insert into materiaPrima_has_fornecedor values (8, 6, 45, 40);
insert into materiaPrima_has_fornecedor values (9, 7, 50, 45);
insert into materiaPrima_has_fornecedor values (10, 8, 55, 50);
insert into materiaPrima_has_fornecedor values (3, 8, 55, 50);
insert into materiaPrima_has_fornecedor values (3, 7, 25, 500);


-- select * from producao_has_produto;
insert into producao_has_produto values (1, 1, 1000, 'F=10;EC=1;EB=2;R=1;CR=10;//F=6;EC=8;EB=;R=;CR=6;//MP=[{"id":"10","quantidade":"6"}]');
insert into producao_has_produto values (4, 2, 500, "enche linguiça");
insert into producao_has_produto values (8, 3, 200, "enche linguiça");
insert into producao_has_produto values (2, 4, 1500, "enche linguiça");
insert into producao_has_produto values (3, 5, 2000, "enche linguiça");
insert into producao_has_produto values (9, 6, 100, "enche linguiça");
insert into producao_has_produto values (6, 7, 800, "enche linguiça");
insert into producao_has_produto values (5, 8, 600, "enche linguiça");
insert into producao_has_produto values (10, 9, 800, "enche linguiça");
insert into producao_has_produto values (7, 10, 900, "enche linguiça");
insert into producao_has_produto values (11, 11, 2500, "enche linguiça");

-- select * from rotulo_has_fornecedor;
insert into rotulo_has_fornecedor values (1,1, 10, 5);
insert into rotulo_has_fornecedor values (2,1, 20, 10);
insert into rotulo_has_fornecedor values (3, 4, 30, 20);
insert into rotulo_has_fornecedor values (4, 5, 15, 30);
insert into rotulo_has_fornecedor values (5, 3, 12, 35);
insert into rotulo_has_fornecedor values (6, 7, 11, 50);
insert into rotulo_has_fornecedor values (7, 8, 4, 54);
insert into rotulo_has_fornecedor values (8, 7, 6, 51);
insert into rotulo_has_fornecedor values (9, 1, 9, 50);

-- select * from embalagem_has_fornecedor;
insert into embalagem_has_fornecedor values (1, 1, 10, 10);
insert into embalagem_has_fornecedor values (2, 2, 20, 10);
insert into embalagem_has_fornecedor values (3, 3, 3, 10);
insert into embalagem_has_fornecedor values (4, 4, 4, 10);
insert into embalagem_has_fornecedor values (5, 5, 5, 18);
insert into embalagem_has_fornecedor values (6, 6, 7, 16);
insert into embalagem_has_fornecedor values (7, 7, 2, 15);
insert into embalagem_has_fornecedor values (8, 8, 8, 14);
insert into embalagem_has_fornecedor values (9, 9, 30, 13);
insert into embalagem_has_fornecedor values (12, 9, 30, 13);

-- select * from produto_has_embalagem;
insert into produto_has_embalagem values (1, "3", 1);
insert into produto_has_embalagem values (2, "4", 1);
insert into produto_has_embalagem values (3, "5", 1);
insert into produto_has_embalagem values (4, "6", 1);
insert into produto_has_embalagem values (5, "7", 1);
insert into produto_has_embalagem values (6, "8", 1);
insert into produto_has_embalagem values (7, "9", 1);
insert into produto_has_embalagem values (8, "10", 1);
insert into produto_has_embalagem values (2, "12", 1);


insert into producao values (12, '2023-01-26 10:30:00', "enche linguiça");
insert into producao values (13, '2023-04-14 10:30:00', "enche linguiça");
insert into producao values (14, '2023-03-11 10:30:00', "enche linguiça");
insert into producao values (15, '2023-02-03 10:30:00', "enche linguiça");
insert into producao values (16, '2023-05-18 10:30:00', "enche linguiça");


select * from materiaprima_has_fornecedor fm join materiaprima m on fm.materiaPrima_id = m.id and fm.fornecedor_id = 2;
 -- select * from producao_has_produto;
 -- select * from producao;
-- ////////////////////////Deus não existe nessa função//////////////////////////////
/*SET SQL_SAFE_UPDATES = 0;

CREATE TEMPORARY TABLE temp_producao
SELECT *, MIN(data) AS producao_mais_antiga
FROM producao_has_produto
inner join producao on producao.id = producao_has_produto.producao_id
GROUP BY produto_id
HAVING COUNT(*) > 3 ;

DELETE FROM producao
WHERE data in (
SELECT  producao_mais_antiga
FROM temp_producao
);

DROP TABLE temp_producao; --  colocar para dar drop na tabela toda vez que for simular produção

SET SQL_SAFE_UPDATES = 1;*/
-- ///////////////////////////////////////////////////////////////////////////////







/*SELECT *, COUNT(*) as 
FROM produto 
inner join producao_has_produto on producao_has_produto.produto_id = produto.id
inner join producao on producao.id = producao_has_produto.producao_id;*/

-- SELECT * FROM produto inner join producao_has_produto on producao_has_produto.produto_id = produto.id inner join producao on producao.id = producao_has_produto.producao_id;

-- select embalagem.nome as nomeE, embalagem.mililitragem, producao_has_produto.quantidade, rotulo.nome as nomeR  from produto inner join rotulo on rotulo.produto_id = produto.id inner join produto_has_embalagem on produto_has_embalagem.produto_id = produto.id inner join embalagem on embalagem.id = produto_has_embalagem.embalagem_id inner join producao_has_produto on producao_has_produto.produto_id = produto.id
-- SELECT produto.nome, produto.id, producao.data , producao_has_produto.quantidade  FROM produto INNER JOIN producao_has_produto ON producao_has_produto.produto_id = produto.id INNER JOIN producao ON producao.id = producao_has_produto.producao_id;

--



/*
INSERT INTO fornecedor VALUES (NULL, "frascos claudia", "claudia@gmail", NULL);
INSERT INTO fornecedor VALUES (NULL, "tampas tamptamp", "tamp@gmail", NULL);
-- INSERT INTO fornecedor VALUES (NULL, "mulher", NULL, NULL);
-- INSERT INTO fornecedor VALUES (NULL, "sexo", NULL, NULL);
INSERT INTO embalagem VALUES (NULL, "pera", 1, NULL);
INSERT INTO embalagem VALUES (NULL, "morango", 2, NULL);
INSERT INTO embalagem VALUES (NULL,"melão",3,"grande");
INSERT INTO fornecedor VALUES (NULL,"Vagner","vagner@gmail.com","90909-9898");
*/
-- SELECT * from fornecedor;
-- SELECT * from embalagem;
-- INSERTS 

/*
id int UN AI PK 
nome varchar(25)
*/
-- select * from materiaprima;
/*
id int UN AI PK 
nome varchar(45) 
inci varchar(45) 
estoque double 
minimo double 
origem_id int UN PK
*/




-- select * from fornecedor;
/*
id int UN AI PK 
nome varchar(45) 
email varchar(45) 
telefone char(17)
*/

-- select * from materiaprima_has_fornecedor;
/*
materiaPrima_id int UN PK 
fornecedor_id int UN PK 
preco double 
quantidade_minima double
*/

-- select * from produto;
/*
id int UN AI PK 
nome varchar(50) 
lucro double
*/

-- select * from formula;
/*
id int UN AI PK 
nome varchar(45) 
principal tinyint 
produto_id int UN PK
*/




/*SELECT * FROM TB_ContratoCotista
INNER JOIN TB_Contrato ON TB_Contrato.id_contrato = TB_ContratoCotista.id_contrato
INNER JOIN TB_Cotista ON TB_Cotista = TB_ContratoCotista.id_cotista;*/

-- select * from produto; -- volta
-- select * from formula_has_materiaPrima;
/*
formula_id int UN PK 
materiaPrima_id int UN PK 
porcentagem double 
passo smallint
*/

-- select * from rotulo;
/*
id int UN AI PK 
tipo tinyint 
tamanho varchar(10) 
principal tinyint 
nome varchar(35) 
produto_id int UN PK
*/

-- select * from rotulo_has_fornecedor;


-- SELECT * FROM fornecedor WHERE nome LIKE "Fornecedor 1" OR email LIKE "fornecedor2@gmail.com";


/*select materiaPrima.id, materiaPrima.nome, materiaPrima.estoque
from formula_has_materiaPrima join materiaPrima on formula_has_materiaPrima.formula_id = 1 and formula_has_materiaPrima.materiaPrima_id = materiaPrima.id;
SELECT mte.*, mtf.fornecedor_id, mtf.preco, f.*
FROM materiaPrima mte
JOIN materiaPrima_has_fornecedor mtf
ON mtf.materiaPrima_id = mte.id
 JOIN fornecedor f
ON f.id = mtf.fornecedor_id
WHERE mte.estoque < mte.minimo;*/
-- select * from embalagem;
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '1');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '2');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '3');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '4');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '5');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '6');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '7');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '8');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '9');
UPDATE `controleproducao`.`embalagem` SET `estoque` = '500', `minimo` = '1000' WHERE (`id` = '10');

UPDATE `controleproducao`.`rotulo` SET `estoque` = '1000', `minimo` = '5000' WHERE (`id` = '1') and (`produto_id` = '1');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '1000', `minimo` = '5000' WHERE (`id` = '2') and (`produto_id` = '2');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '1000', `minimo` = '5000' WHERE (`id` = '3') and (`produto_id` = '3');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '2000', `minimo` = '5000' WHERE (`id` = '4') and (`produto_id` = '4');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '2000', `minimo` = '5000' WHERE (`id` = '5') and (`produto_id` = '5');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '2000', `minimo` = '5000' WHERE (`id` = '6') and (`produto_id` = '6');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '2000', `minimo` = '5000' WHERE (`id` = '7') and (`produto_id` = '7');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '2000', `minimo` = '5000' WHERE (`id` = '8') and (`produto_id` = '8');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '2000', `minimo` = '5000' WHERE (`id` = '9') and (`produto_id` = '9');
UPDATE `controleproducao`.`rotulo` SET `estoque` = '2000', `minimo` = '5000' WHERE (`id` = '10') and (`produto_id` = '10');


UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000', `minimo` = '30000' WHERE (`id` = '11') and (`origem_id` = '2');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000', `minimo` = '23000' WHERE (`id` = '10') and (`origem_id` = '2');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000', `minimo` = '20000' WHERE (`id` = '9') and (`origem_id` = '1');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000', `minimo` = '10000' WHERE (`id` = '8') and (`origem_id` = '4');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000', `minimo` = '30000' WHERE (`id` = '6') and (`origem_id` = '2');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000', `minimo` = '50000' WHERE (`id` = '3') and (`origem_id` = '3');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000', `minimo` = '50000' WHERE (`id` = '1') and (`origem_id` = '1');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000' WHERE (`id` = '2') and (`origem_id` = '2');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000' WHERE (`id` = '4') and (`origem_id` = '4');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000' WHERE (`id` = '5') and (`origem_id` = '1');
UPDATE `controleproducao`.`materiaPrima` SET `estoque` = '1000' WHERE (`id` = '7') and (`origem_id` = '3');



select * from producao_has_produto;



