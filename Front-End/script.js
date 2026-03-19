const form = document.getElementById('form-transacao');
const lista = document.getElementById('lista-transacoes');

// Função para buscar e exibir as transações do banco
async function carregarTransacoes() {
    const resposta = await fetch('http://127.0.0.1:8000/transacoes');
    const transacoes = await resposta.json();

    lista.innerHTML = ''; // Limpa a lista antes de carregar
    transacoes.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `${t.descricao} - <strong>R$ ${t.valor.toFixed(2)}</strong> (${t.tipo})`;
        lista.appendChild(li);
    });
}

// Evento para salvar uma nova transação
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

// Carrega os dados assim que a página é aberta
carregarTransacoes();