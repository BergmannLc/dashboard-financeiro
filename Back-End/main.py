import models
from database import engine, SessionLocal
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

# Instância do Servidor Criada
app = FastAPI()

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