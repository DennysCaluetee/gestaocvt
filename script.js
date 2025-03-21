const urls = [
    "https://script.google.com/macros/s/AKfycbyVlKGZydz7K1rQc3KgTvIlK-YHJyp2baML927Cul0Y3NzoJNGFEobCZqvYxdtKF2mz/exec", 
    "https://script.google.com/macros/s/AKfycbywA6YEvDO8no50zTuwkiwP1sTKYC4hYw91ptAiQK5LDtqc3iSsj28fR5NLtxphDz45/exec",
    "https://script.google.com/macros/s/AKfycbx2qV1HH-utAe7-PRzj3k-2PUbW5T1I6OLSfn1Yms6VF2ihqr_KnnobNJSm4h7CNJjf/exec",
    "https://script.google.com/macros/s/AKfycbyKyrFmCUsVsSri4X5dx8G8l4XgMG8unmEJFTVeliHMkOj4aIqTFWsDZma_OU75J6Sx/exec",
    "https://script.google.com/macros/s/AKfycbywMGhm6uwaHiS5W7bo9r7hpwPskQFlokbW-k7x1eqYk_Z1tp2STuWWvsnt5NTRZcuI/exec",
    "https://script.google.com/macros/s/AKfycbwaPtnPA4eTJ0cDPGonNEuPo9xw3iHMUGIjtPyDcH0bkfqeuVX1eZuyEKyIJ1sHStYn/exec",
    "https://script.google.com/macros/s/AKfycbxqMCghB0oE-lq6tK7-etXyTJIZ3BP1UNetiKCDzZc4yUC1JKG4TIxBscw4liMhjjOr/exec",
    "https://script.google.com/macros/s/AKfycbySuGUWLlQRfj4It6pOH131450jEYu_o8Dbo4lJYv41Pzll46ZiGmA2_M8AviiFPUqM/exec",
    "https://script.google.com/macros/s/AKfycbwjsUGY2h_oc05Ah59HttU_zAorVA_FuqfTvPy849gajmznLNqL7_yDdZQ54TtbTpgg/exec",
    "https://script.google.com/macros/s/AKfycbxsvc7zoEMkjMVOdKQH06Fqr5sVyRkB6WOAd_SVSkLJok43qceoorGzQM6JbyCRwyOF/exec",
];

const telas = ["tela1","tela2", "tela7", "tela8", "tela9", "tela10", "tela11", "tela12", "tela13", "tela14", ];

// Função para carregar os dados de todas as telas
async function carregarDados() {
    try {
        const dados = await Promise.all(urls.map(url => fetch(url).then(res => res.json())));
        exibirDados(dados);
    } catch (error) {
        console.error("Erro ao carregar os dados: ", error);
    }
}

// Função para exibir os dados nas telas
function exibirDados(dados) {
    telas.forEach((tela, index) => {
        const container = document.getElementById(`container${index + 1}`);
        const data = dados[index];
        container.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {
            container.innerHTML = "<p>Nenhum dado encontrado.</p>";
            return;
        }

        data.sort((a, b) => {
            const percentualA = parseInt(a.meta) > 0 ? Math.round((parseInt(a.alcancado) / parseInt(a.meta)) * 100) : 100;
            const percentualB = parseInt(b.meta) > 0 ? Math.round((parseInt(b.alcancado) / parseInt(b.meta)) * 100) : 100;
            return percentualB - percentualA;
        });

        const slaIndex = data.findIndex(item => item.nome && item.nome.toLowerCase() === 'sla');
        if (slaIndex !== -1) {
            const slaCard = data.splice(slaIndex, 1)[0];
            data.unshift(slaCard);
        }

        data.forEach((item, i) => {
            const nome = item.nome || `P${i + 1}`;
            const meta = parseInt(item.meta) || 0;
            const alcancado = parseInt(item.alcancado) || 0;
            let percentual = meta > 0 ? Math.round((alcancado / meta) * 100) : 100;
            const percentualExibido = percentual; // Mantém o valor real para exibição
            percentual = percentual > 100 ? 100 : percentual; // Garante que a barra não passe de 100%
            const corBarra = percentualExibido < 50 ? "#dc3545" : percentualExibido < 100 ? "#ffc107" : "#28a745";
        
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-body">
                    <h3 style="text-align: center;">${nome}</h3>
                    <p style="text-align: center;">Meta: <span>${meta}</span></p>
                    <p style="text-align: center;">Alcançado: <span>${alcancado}</span></p>
                    <div class="progress" style="background-color: white; border-radius: 10px; border: 1px solid #ccc; box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);">
                        <div class="progress-bar" style="width: ${percentual}%; background: ${corBarra}; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                            <span style="color: #000; font-weight: bold;">${percentualExibido}%</span> <!-- Cor da porcentagem alterada para preto -->
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

// Função para alternar entre as telas
let indiceTela = 0; // Variável para o índice da tela atual
function mudarTela(screenIndex) {
    // Esconde todas as telas
    for (let i = 1; i <= 14; i++) {
        document.getElementById(`tela${i}`).style.display = 'none';
    }

    // Exibe a tela correta com base no índice passado
    document.getElementById(`tela${screenIndex}`).style.display = 'block';
    
    // Atualiza o índice da tela
    indiceTela = screenIndex;
}

// Função para alternar o menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('open');
}

// Carregar os dados assim que a página for carregada
window.onload = () => {
    carregarDados();  // Carrega dados na inicialização
    setInterval(carregarDados, 5000);  // Atualiza os dados a cada 5 segundos
};

// Inicializa exibindo a tela 1
mudarTela(1);
