# 💰 Dashboard Financeiro Pessoal

Um sistema Full Stack de controle de finanças desenvolvido para fins de estudo de integração entre Front-End, Back-End e Banco de Dados.

## 🚀 Tecnologias Utilizadas

* **Back-End:** Python com **FastAPI**
* **Banco de Dados:** SQLite com **SQLAlchemy** (ORM)
* **Front-End:** HTML5, CSS3 e JavaScript (Fetch API)
* **Versionamento:** Git & GitHub

## 🛠️ Funcionalidades

* **Cadastro de Transações:** Adiciona descrição, valor e tipo (Receita/Despesa).
* **Cálculo Automático:** Dashboard exibe o total de entradas, saídas e o saldo líquido em tempo real.
* **Persistência de Dados:** Os dados são salvos em um banco de dados relacional.
* **Exclusão:** Permite remover registros indesejados diretamente pela interface.
* **Interface Responsiva:** Layout que se adapta a diferentes tamanhos de tela.

## 🏗️ Arquitetura do Projeto

O projeto segue uma estrutura separada para facilitar a manutenção:

```text
RoadMap/
├── Back-End/         # API em FastAPI, Modelos e Banco de Dados
├── Front-End/        # Interface do Usuário (HTML, CSS, JS)
└── README.md         # Documentação do projeto

🔧 Como Rodar o Projeto
1. Instale as dependências: pip install fastapi uvicorn sqlalchemy
2. Navegue até a pasta do servidor: cd Back-End
3. Inicie o servidor: python -m uvicorn main:app --reload
4. Abra o arquivo Front-End/index.html no seu navegador.
