💰 Dashboard Financeiro Pessoal (v2.0)
Um sistema Full Stack completo para controle de finanças, focado em visualização de dados e gestão por competência mensal. Este projeto demonstra a integração entre uma API assíncrona, banco de dados relacional e manipulação dinâmica do DOM.

🚀 Tecnologias Utilizadas
Back-End: Python com FastAPI (Uvicorn)

Banco de Dados: SQLite com SQLAlchemy (ORM)

Front-End: HTML5, CSS3 e JavaScript (Fetch API)

Gráficos: Chart.js para visualização de despesas

Versionamento: Git & GitHub

🛠️ Novas Funcionalidades (Updates)
📊 Resumo Visual: Gráfico de pizza interativo que categoriza gastos automaticamente.

📅 Lançamento Retroativo: Campo de data manual que permite registrar gastos de dias anteriores.

🔍 Filtro Mensal Dinâmico: Seletor de mês que filtra a lista de transações e recalcula o dashboard e o gráfico em tempo real.

🗂️ Categorização: Organização de gastos por tipos (Alimentação, Lazer, Transporte, etc.).

💰 Gestão de Fluxo: Cálculo automático de Entradas, Saídas e Saldo Líquido.

🏗️ Arquitetura do Projeto
O projeto utiliza uma estrutura desacoplada para garantir escalabilidade:
RoadMap/
├── main.py           # Rotas da API e lógica de negócio (FastAPI)
├── models.py         # Definição das tabelas do banco (SQLAlchemy)
├── database.py       # Configuração da conexão com SQLite
├── index.html        # Estrutura da interface com filtros e dashboard
├── style.css         # Estilização moderna e responsiva
└── script.js         # Lógica de consumo da API, filtros e Chart.js

🔧 Como Rodar o Projeto
Instale as dependências: pip install fastapi uvicorn sqlalchemy

Inicie o servidor local: python main.py ou python -m uvicorn main:app --reload

Acesse o sistema: Abra o arquivo index.html diretamente no seu navegador.

📝 Próximos Passos (Roadmap)
[ ] Geração de relatórios semanais detalhados.

[ ] Exportação de dados para CSV/Excel.

[ ] Definição de metas de gastos por categoria.
