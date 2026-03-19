const form = document.getElementById('form-transacao');
const lista = document.getElementById('lista-transacoes');
const elementoEntradas = document.getElementById('total-entradas');
const elementoSaidas = document.getElementById('total-saidas');
const elementoSaldo = document.getElementById('saldo-total');

let instanciaGrafico = null; 

// 1. Função para renderizar o gráfico
function desenharGrafico(transacoes) {
    const canvas = document.getElementById('meuGrafico');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const despesas = transacoes.filter(t => t.tipo === 'despesa');

    // Se não houver despesas, limpa o gráfico e sai
    if (despesas.length === 0) {
        if (instanciaGrafico) instanciaGrafico.destroy();
        instanciaGrafico = null;
        return;
    }
    
    const totaisPorCategoria = {};
    despesas.forEach(t => {
        totaisPorCategoria[t.categoria] = (totaisPorCategoria[t.categoria] || 0) + t.valor;
    });

    const labels = Object.keys(totaisPorCategoria);
    const valores = Object.values(totaisPorCategoria);

    if (instanciaGrafico) instanciaGrafico.destroy();

    instanciaGrafico = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: ['#e74c3c', '#f1c40f', '#3498db', '#9b59b6', '#e67e22', '#95a5a6']
            }]
        },
        options: { 
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// 2. Atualizar Resumo e chamar Gráfico
function atualizarResumo(transacoes) {
    let entradas = 0, saidas = 0;
    transacoes.forEach(t => {
        if (t.tipo === 'receita') entradas += t.valor;
        else saidas += t.valor;
    });

    const saldo = entradas - saidas;
    elementoEntradas.innerText = `R$ ${entradas.toFixed(2)}`;
    elementoSaidas.innerText = `R$ ${saidas.toFixed(2)}`;
    elementoSaldo.innerText = `R$ ${saldo.toFixed(2)}`;
    elementoSaldo.style.color = saldo >= 0 ? '#27ae60' : '#e74c3c';

    desenharGrafico(transacoes);
}

// 3. Carregar dados do Banco
async function carregarTransacoes() {
    try {
        const resposta = await fetch('http://127.0.0.1:8000/transacoes');
        const transacoes = await resposta.json();
        
        lista.innerHTML = '';
        transacoes.forEach(t => {
            const li = document.createElement('li');
            const corBorda = t.tipo === 'receita' ? '#27ae60' : '#e74c3c';
            li.style.borderLeft = `5px solid ${corBorda}`;
            
            const dataFormatada = t.data ? new Date(t.data).toLocaleDateString('pt-BR') : '---';
            
            li.innerHTML = `
                <span>${t.descricao} <br><small style="color:#7f8c8d">${t.categoria} | ${dataFormatada}</small></span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <strong>R$ ${t.valor.toFixed(2)}</strong>
                    <button onclick="excluirTransacao(${t.id})" style="background:#e74c3c; padding:2px 8px; border:none; color:white; border-radius:3px; cursor:pointer">X</button>
                </div>
            `;
            lista.appendChild(li);
        });
        
        atualizarResumo(transacoes);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

// 4. Enviar nova transação
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value
    };

    const resposta = await fetch('http://127.0.0.1:8000/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        form.reset();
        carregarTransacoes();
    } else {
        alert("Erro ao salvar no banco. Verifique se o Python está rodando e se deletou o banco antigo!");
    }
});

// 5. Excluir transação
async function excluirTransacao(id) {
    if (confirm("Deseja realmente excluir?")) {
        await fetch(`http://127.0.0.1:8000/transacoes/${id}`, { method: 'DELETE' });
        carregarTransacoes();
    }
}

carregarTransacoes();