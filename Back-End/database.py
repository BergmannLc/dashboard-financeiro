from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Definimos onde o arquivo do banco será salvo (na mesma pasta)
SQLALCHEMY_DATABASE_URL = "sqlite:///./financas.db"

# Criamos o "Motor" que conversa com o SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Criamos uma Sessão (É por ela que será enviado os comandos SQL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# A base que vamos usar para criar as tabelas
Base = declarative_base()