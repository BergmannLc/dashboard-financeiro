const form = document.getElementById('form-transacao');
const lista = document.getElementById('lista-transacoes');
const elementoEntradas = document.getElementById('total-entradas');
const elementoSaidas = document.getElementById('total-saidas');
const elementoSaldo = document.getElementById('saldo-total');
const seletorMes = document.getElementById('filtro-mes');

let instanciaGrafico = null;

// 1. Configuração Inicial: Define o filtro para o mês atual ao abrir a página
function configurarFiltroDataPadrao() {
    const dataHoje = new Date();
    const ano = dataHoje.getFullYear();
    const mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
    
    // Preenche o seletor de mês (Ex: 2026-03)
    if (seletorMes) seletorMes.value = `${ano}-${mes}`;
    
    // Preenche o campo de data do formulário (Ex: 2026-03-20)
    const campoDataForm = document.getElementById('data');
    if (campoDataForm) {
        campoDataForm.value = dataHoje.toISOString().split('T')[0];
    }
}

// 2. Renderizar o Gráfico de Pizza (Apenas Despesas do Mês Filtrado)
function desenharGrafico(transacoes) {
    const canvas = document.getElementById('meuGrafico');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const despesas = transacoes.filter(t => t.tipo === 'despesa');

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

// 3. Atualizar os Cards de Resumo (Entradas, Saídas, Saldo)
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

// 4. Buscar Transações no Banco e FILTRAR por Mês
async function carregarTransacoes() {
    try {
        const resposta = await fetch('http://127.0.0.1:8000/transacoes');
        const todasAsTransacoes = await resposta.json();
        
        // Filtro: Pega o que o usuário selecionou no input type="month" (AAAA-MM)
        const mesSelecionado = seletorMes.value; 

        const transacoesFiltradas = todasAsTransacoes.filter(t => {
            // t.data vem do Python como "2026-03-20T00:00:00"
            return t.data.startsWith(mesSelecionado);
        });

        lista.innerHTML = '';
        transacoesFiltradas.forEach(t => {
            const li = document.createElement('li');
            const corBorda = t.tipo === 'receita' ? '#27ae60' : '#e74c3c';
            li.style.borderLeft = `5px solid ${corBorda}`;
            
            // Tratamento de data para evitar erro de fuso horário
            const partesData = t.data.split('T')[0].split('-');
            const dataObjeto = new Date(partesData[0], partesData[1] - 1, partesData[2]);
            const dataFormatada = dataObjeto.toLocaleDateString('pt-BR');
            
            li.innerHTML = `
                <span>${t.descricao} <br><small style="color:#7f8c8d">${t.categoria} | ${dataFormatada}</small></span>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <strong>R$ ${t.valor.toFixed(2)}</strong>
                    <button onclick="excluirTransacao(${t.id})" style="background:#e74c3c; padding:2px 8px; border:none; color:white; border-radius:3px; cursor:pointer">X</button>
                </div>
            `;
            lista.appendChild(li);
        });
        
        atualizarResumo(transacoesFiltradas);
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
    }
}

// 5. Enviar Nova Transação
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        tipo: document.getElementById('tipo').value,
        categoria: document.getElementById('categoria').value,
        data: document.getElementById('data').value
    };

    const resposta = await fetch('http://127.0.0.1:8000/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    if (resposta.ok) {
        form.reset();
        configurarFiltroDataPadrao(); // Reseta campos para o dia de hoje
        carregarTransacoes();
    } else {
        alert("Erro ao salvar! Verifique se o Back-End está rodando.");
    }
});

// 6. Excluir Transação
async function excluirTransacao(id) {
    if (confirm("Deseja realmente excluir?")) {
        await fetch(`http://127.0.0.1:8000/transacoes/${id}`, { method: 'DELETE' });
        carregarTransacoes();
    }
}

// 7. Evento para mudar a lista quando o usuário trocar o mês no filtro
seletorMes.addEventListener('change', carregarTransacoes);

// --- Inicialização ---
configurarFiltroDataPadrao();
carregarTransacoes();