const urls = [
    "https://script.google.com/macros/s/AKfycbyVlKGZydz7K1rQc3KgTvIlK-YHJyp2baML927Cul0Y3NzoJNGFEobCZqvYxdtKF2mz/exec", // interface
    "https://script.googleusercontent.com/a/macros/ebdicorp.com.br/echo?user_content_key=AehSKLivUkOubCdosh5aCwRkUBoQKW2naKZgTd76GKJE4LmhYHPRl0B4kI8agNXVxyUzIKrjPl-G7LzGFzTQ_urz_UtxK_MwyeXtb3UMXOEuLnuGxtAZl7BZzspGrJNeJrgBjzncdJv7Vyg6RYpnlC2PhUtehnhMycHVJStpsT_lMv7N1iOae97uuCZqZCxKNBqTFzQsDXAJoWYRvv5a6ppCzLl1q85yiO2FhvUIOPoe-PCUchhrgolwPM3PxH3M6M0Vt1S2DVsP0bFh-UGitWxjYM00OyUVw9qzooZAC9Hy-MKbRh4Is_eC_d_CCTCS7Q&lib=MkqVb0B2Pj277gHbDBh6U8aNWmXF4loPg", // PM - DELAWARE 2025 imp
    "https://script.google.com/macros/s/AKfycbyrmAcmr4hz1WjESuN6HEJNtwS968-F761YHc0YoEziq9VznDI03JuX6ll6HehArYuk/exec", //implementação  DOCUSIGN 10/04
    "https://script.google.com/macros/s/AKfycbwJXHcIHTpAkbCEZzDUshYTa3VXKzQCi8Q3nNktifubt4sVYOMCyPOl62_4sZyYvhzt/exec", //implementação  Equinix 15/04
    "https://script.google.com/macros/s/AKfycbzQivMZRx6HmklYTE_SEX0Ya8Q5C0r4FiSZ0DAqoFO4THkQpEii8GGOO4JMXa6Q0L0/exec", // Outsystems 16.04
    "https://script.google.com/macros/s/AKfycbznldRpGqqXwN-FB5VtdEwesqrX7BL71wiQ8kHIIviyP4nJWD8jYLdNW5OscMvcSdOR/exec", // Snowflake 23.04
    "https://script.google.com/macros/s/AKfycbxJYfiI7Jck3Tf6hZNwrvAkzLWMPMCs784SEaCNd_FlxQjGaBc9mAvyWvEy5imSbF57/exec", // PROVENIR 24/04
    "https://script.google.com/macros/s/AKfycbwroToctf-OFm8bTg593DgvEtxwQ1D3ttWJhEDASVBGbq4Qz62X1DAgQmaXnCZKw3xR/exec", // Genesys 24.04
    "https://script.google.com/macros/s/AKfycbxERaUNrtYseVyS8_iLJ2ndPwvSGgRwJZfR472h9iEMuCuGaZwnYroR6Ij7IKwB3_F4/exec", //  Agência Multiedro 29.04
]
const telas = ["tela1","tela2","tela3", "tela4", "tela5", "tela6", "tela7", "tela8", "tela9"];

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
