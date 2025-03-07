// Configurações da API do Google Sheets
const sheetId = "1ljNI4XHJ_Q47PoiETwMM25DWBpTp3KvkBIKw9drJmVE"; // ID da planilha
const apiKey = "AIzaSyCyisUuZCAbV0fIM8xsdqB0SOj57UgpX9Y"; // Substitua pela sua chave de API

// Função para buscar os dados de um intervalo específico
async function fetchRangeData(range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

// Função para criar uma barra de status
function criarBarra(valorAtual, valorMaximo, classe) {
    const porcentagem = (valorAtual / valorMaximo) * 100;
    return `
        <div class="barra ${classe}">
            <div class="preenchimento" style="width: ${porcentagem}%;"></div>
        </div>
    `;
}

// Função para carregar a ficha com base no ID do jogador
async function carregarFicha(jogadorId) {
    const fichaContainer = document.getElementById("ficha");
    fichaContainer.innerHTML = ""; // Limpa o conteúdo anterior

    // Define os intervalos de células com base no ID do jogador
    const ranges = {
        playerName: `F${3 + jogadorId}:P${3 + jogadorId}`, // Nome do jogador
        currentHealth: `AC${7 + jogadorId}:AE${7 + jogadorId}`, // Vida atual
        maxHealth: `AF${7 + jogadorId}:AH${7 + jogadorId}`, // Vida máxima
        currentIntegrity: `AM${7 + jogadorId}:AO${7 + jogadorId}`, // Integridade atual
        maxIntegrity: `AP${7 + jogadorId}:AR${7 + jogadorId}`, // Integridade máxima
        currentEnergy: `AC${15 + jogadorId}:AE${15 + jogadorId}`, // Pontos de energia atual
        maxEnergy: `AF${15 + jogadorId}:AH${15 + jogadorId}` // Pontos de energia máximos
    };

    // Busca os dados de todos os intervalos
    const allData = {};
    for (const [key, range] of Object.entries(ranges)) {
        allData[key] = await fetchRangeData(range);
    }

    // Exibe a ficha
    const nome = allData.playerName[0].join(" ");
    const vidaAtual = parseFloat(allData.currentHealth[0].join(" "));
    const vidaMaxima = parseFloat(allData.maxHealth[0].join(" "));
    const integridadeAtual = parseFloat(allData.currentIntegrity[0].join(" "));
    const integridadeMaxima = parseFloat(allData.maxIntegrity[0].join(" "));
    const energiaAtual = parseFloat(allData.currentEnergy[0].join(" "));
    const energiaMaxima = parseFloat(allData.maxEnergy[0].join(" "));

    fichaContainer.innerHTML = `
        <img src="imagens/jogador${jogadorId + 1}.jpg" alt="${nome}">
        <h2>${nome}</h2>
        <p><strong>Vida:</strong></p>
        ${criarBarra(vidaAtual, vidaMaxima, "vida")}
        <p><strong>Integridade:</strong></p>
        ${criarBarra(integridadeAtual, integridadeMaxima, "integridade")}
        <p><strong>Energia:</strong></p>
        ${criarBarra(energiaAtual, energiaMaxima, "energia")}
    `;
}

// Obtém o ID do jogador da URL
const urlParams = new URLSearchParams(window.location.search);
const jogadorId = parseInt(urlParams.get("id")) || 0; // ID padrão é 0 (primeiro jogador)

// Carrega a ficha correspondente
carregarFicha(jogadorId);
