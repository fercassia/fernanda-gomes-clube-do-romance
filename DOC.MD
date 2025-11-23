# Clube do Livro: trabalhando typescript e Nestjs

Projeto desenvolvido durante a mentoria do Fernando - F-O-L-K-S. Projeto se trata de uma biblioteca especial para que é do mundo lgbtqia+.

## 🔨 Objetivos do projeto

- Aprender sobre desenvolvimento de back-end;
- Aprender node e Ts;
- Desenvolver mentalidade de um desenvolvedor junior;
- Aprender boas praticas de desenvolvimento api, testes unitários, persistencia de dados, autorizaçao e autenticação;
- Desenvolvimento com containers;

## 🔨 Ferramentas usadas no projeto:

- Plataforma desenvolvimento: [Node 24](https://nodejs.org/en/download/archive/v24.10.0);
- Linguagem: [TypeScript](https://www.typescriptlang.org/docs/);
- Framework: [Nestjs](https://docs.nestjs.com/);
- Ferramenta ORM: [TypeOrm](https://typeorm.io/docs/getting-started);
- Commit semantico: [Husky](https://typicode.github.io/husky/get-started.html), [Commitlint](https://commitlint.js.org/guides/local-setup.html) e [Commitzen](https://commitizen.github.io/cz-cli/);
- Documentação: [Swagger Nest](https://docs.nestjs.com/openapi/introduction);
- Banco de Dados: [PostegreSQL](https://www.postgresql.org/docs/);
- Testes unitários: [Jest](https://jestjs.io/) e [Jest Extensão VSC](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)

## 📃 Pré-requisitos

- Tenha o node instalado na __Versão 24__;
- IDE instalado na maquina, indico [Visual Studio Code](https://code.visualstudio.com/);
- Git instalado na maquina;
- Docker instalado na maquina;
- Dbeaver instalado na maquina;

## ⚙ Instalação

  - Clone o projeto no repositório `https://github.com/fercassia/fernanda-gomes-clube-do-romance/tree/feature/HU-1-criacao-api-registro`
  - Na pasta raiz do projeto `/fernanda-gomes-clube-do-romance`: 
  - rode o comando `npm i` para baixar as dependencias;
  - crie o arquivo `.env` com os dados abaixo;
      ```
        PORT=4002
        DB_HOST=db # localhost -- dev e db  -- produção
        DB_PORT=5432
        DB_USER=< user >
        DB_PASSWORD=< senha >
        DB_NAME=clubedoromance
        ADMINER_PORT=8080
        APP_PORT=3001
        HASH_COST=10   # 10 dev -- 12 produção
        ENVIRONMENT=development
        JWT_SECRET=< secret >
        JWT_TIME=< time in seconds >
      ```

## Comandos
1. Commits padronizados: `npm run commit`;
2. Gerar imagem nova no projeto: `docker build -t clube-do-romance:{versao} .`;
3. Rodar o container da imagem pelo dockerfile: `docker run -p{porta}:{portaHost} clube-do-romance:{versao}`;
4. Rodar rodar os containers do projeto e da base de dados: `docker compose up -d --build`;
5. Rodar rodar os logs dos containers: `docker logs -f {nomeDoContainer ou  idContainer}`;
6. Gerar files de migration: `NAME=<NomeDaMigration> npm run db:generate`;
7. Visalizar porcentagem de cobertura e rodar os testes unitários: `npm run test:cov`
8. __Rodar A aplicação localmente para DEBUG e DESENVOLVIMENTO__: 

    a. Rode o comando para subir o container do banco (use --remove-orphans para limpar containers antigos): 
    ```
      sudo docker compose -f docker-compose.dev.yml up --build -d --remove-orphans
    ```

    b. Verifique se os containers estão rodando: 
    ```
      sudo docker ps
    ```

    c. Verifique o banco ficar pronto:
    ```
      sudo docker logs -f {container id}
    ```

    d. Rode as migrations:
    - Se já compilou o projeto:
    ```
      node dist/config/db/migrations.run.js
    ```
    - Para rodar o .ts diretamente (requer ts-node):
    ```
      npx ts-node src/config/db/migrations.run.ts
        # ou
      npx ts-node-esm src/config/db/migrations.run.ts
    ```

## 💡 Dica rápida: 

#### Acesso doc:

- Com o projeto rodando, acesse: 

  ```
  http://localhost:{PORT}/api/docs/clube-livro
  ```

#### Adminer com preenchimento automático

Para acessar o Adminer já com os campos preenchidos para seu banco, use esta URL:

__obs:__ valores utilizados são os valores do `.env` que você criou;

  ```
  http://localhost:8080/?pgsql=db&username=<username>&db=clubedoromance
  ```

Assim, basta abrir a URL e clicar em "Login" para acessar o banco diretamente!

#### Conexao Db Postgress pelo Dbeaver:

- Host: localhost
- Porta: 5432
- Usuário: < user >
- Senha: < senha >
- Database: clubedoromance

Projeto desenvolvido por [@fercassia](https://github.com/fercassia)💚

