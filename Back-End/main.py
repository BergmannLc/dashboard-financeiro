from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date, datetime
import models
from database import engine, SessionLocal

# Cria as tabelas no banco de dados se não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuração do CORS para o Front-End conseguir acessar a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para abrir/fechar o banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- SCHEMAS (O que o FastAPI espera receber do JavaScript) ---
class TransacaoSchema(BaseModel):
    descricao: str
    valor: float
    tipo: str
    categoria: str
    data: date # O campo que adicionamos para aceitar a data do formulário

# --- ROTAS ---

# 1. Listar transações (Ordenadas pela data mais recente)
@app.get("/transacoes")
def listar_transacoes(db: Session = Depends(get_db)):
    return db.query(models.Transacao).order_by(models.Transacao.data.desc()).all()

# 2. Criar nova transação
@app.post("/transacoes")
def criar_transacao(transacao: TransacaoSchema, db: Session = Depends(get_db)):
    nova_transacao = models.Transacao(
        descricao=transacao.descricao,
        valor=transacao.valor,
        tipo=transacao.tipo,
        categoria=transacao.categoria,
        # O banco SQLite/SQLAlchemy precisa de datetime, então combinamos a data com o horário zero
        data=datetime.combine(transacao.data, datetime.min.time())
    )
    db.add(nova_transacao)
    db.commit()
    db.refresh(nova_transacao)
    return nova_transacao

# 3. Deletar transação
@app.delete("/transacoes/{transacao_id}")
def deletar_transacao(transacao_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Transacao).filter(models.Transacao.id == transacao_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    db.delete(item)
    db.commit()
    return {"message": "Deletado com sucesso"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)