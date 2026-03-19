import models
from database import engine, SessionLocal
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
# Importamos o middleware de CORS
from fastapi.middleware.cors import CORSMiddleware

# 1. Instância do Servidor Criada
app = FastAPI()

# 2. CONFIGURAÇÃO DO CORS (Obrigatório para o Front conversar com o Back)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite pedidos de qualquer origem (seu Live Server)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

# Esta linha cria as tabelas no banco de dados se elas não existirem
models.Base.metadata.create_all(bind=engine)

# --- SCHEMA (Contrato de dados) ---
class TransacaoSchema(BaseModel):
    descricao: str
    valor: float
    tipo: str

# --- DEPENDÊNCIA (Conexão com o Banco) ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROTAS ---

@app.get("/")
def home():
    return {"status": "Servidor Rodando"}

# Rota para LISTAR (Lê do banco de dados real)
@app.get("/transacoes")
def listar_transacoes(db: Session = Depends(get_db)):
    return db.query(models.Transacao).all()

# Rota para CRIAR (Salva no banco de dados real)
@app.post("/transacoes")
def criar_transacao(transacao: TransacaoSchema, db: Session = Depends(get_db)):
    nova_transacao = models.Transacao(
        descricao=transacao.descricao,
        valor=transacao.valor,
        tipo=transacao.tipo
    )
    db.add(nova_transacao)
    db.commit()
    db.refresh(nova_transacao)
    return nova_transacao

# Rota para EXCLUIR uma transação
@app.delete("/transacoes/{transacao_id}")
def excluir_transacao(transacao_id: int, db: Session = Depends(get_db)):
    db_transacao = db.query(models.Transacao).filter(models.Transacao.id == transacao_id).first()
    if db_transacao:
        db.delete(db_transacao)
        db.commit()
        return {"message": "Excluído com sucesso"}
    return {"message": "Transação não encontrada"}