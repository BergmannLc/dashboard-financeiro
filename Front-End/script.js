const form = document.getElementById('form-transacao');
const lista = document.getElementById('lista-transacoes');

// Elementos dos cards de resumo
const elementoEntradas = document.getElementById('total-entradas');
const elementoSaidas = document.getElementById('total-saidas');
const elementoSaldo = document.getElementById('saldo-total');

// 1. Função para calcular a matemática do Dashboard
function atualizarResumo(transacoes) {
    let entradas = 0;
    let saidas = 0;

    transacoes.forEach(t => {
        if (t.tipo === 'receita') {
            entradas += t.valor;
        } else {
            saidas += t.valor;
        }
    });

    const saldo = entradas - saidas;

    elementoEntradas.innerText = `R$ ${entradas.toFixed(2)}`;
    elementoSaidas.innerText = `R$ ${saidas.toFixed(2)}`;
    elementoSaldo.innerText = `R$ ${saldo.toFixed(2)}`;

    elementoSaldo.style.color = saldo >= 0 ? '#27ae60' : '#e74c3c';
}

// 2. Função para buscar e exibir as transações do banco
async function carregarTransacoes() {
    const resposta = await fetch('http://127.0.0.1:8000/transacoes');
    const transacoes = await resposta.json();

    lista.innerHTML = ''; 
    
    transacoes.forEach(t => {
        const li = document.createElement('li');
        const corBorda = t.tipo === 'receita' ? '#27ae60' : '#e74c3c';
        li.style.borderLeft = `5px solid ${corBorda}`;
        
        // Aqui adicionamos o botão de excluir e passamos o ID da transação
        li.innerHTML = `
            <span>${t.descricao}</span>
            <div style="display: flex; align-items: center; gap: 10px;">
                <strong>R$ ${t.valor.toFixed(2)}</strong>
                <button onclick="excluirTransacao(${t.id})" style="background: #e74c3c; padding: 5px 10px; font-size: 12px; margin: 0;">X</button>
            </div>
        `;
        lista.appendChild(li);
    });

    atualizarResumo(transacoes);
}

// 3. Função para EXCLUIR uma transação
async function excluirTransacao(id) {
    if (confirm("Deseja realmente excluir esta transação?")) {
        await fetch(`http://127.0.0.1:8000/transacoes/${id}`, {
            method: 'DELETE'
        });
        carregarTransacoes(); // Recarrega a lista e os cálculos após deletar
    }
}

// 4. Evento para salvar uma nova transação
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        tipo: document.getElementById('tipo').value
    };

    await fetch('http://127.0.0.1:8000/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    form.reset();
    carregarTransacoes();
});

carregarTransacoes();