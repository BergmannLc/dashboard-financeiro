from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

class Transacao(Base):
    __tablename__ = "transacoes"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String)
    valor = Column(Float)
    tipo = Column(String) # 'receita' ou 'despesa'
    categoria = Column(String, default="Outros")
    data = Column(DateTime, default=datetime.now)