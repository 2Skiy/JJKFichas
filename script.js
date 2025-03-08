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

// Função para atualizar a barra de status e o texto
function atualizarBarra(barraElement, textoElement, atual, maximo, temporario = 0, corFogo = "255, 100, 0") {
    const porcentagem = (atual / maximo) * 100;
    barraElement.style.clipPath = `inset(0 ${100 - porcentagem}% 0 0)`;

    let texto = `${Math.round(atual)}/${Math.round(maximo)}`;
    if (temporario > 0) {
        texto += ` +${Math.round(temporario)}`;
    }
    textoElement.textContent = texto;

    // Aplica o efeito de fogo com a cor baseada na energia
    textoElement.style.background = `linear-gradient(90deg, rgba(${corFogo}, 0.5), rgba(255, 200, 0, 0.5))`;
}

// Função para carregar a ficha com base no ID do jogador
async function carregarFicha(jogadorId) {
    // Define os intervalos de células com base no ID do jogador
    const ranges = {
        playerName: `F${3 + jogadorId}:P${3 + jogadorId}`, // Nome do jogador
        currentHealth: `AC${7 + jogadorId}:AE${7 + jogadorId}`, // Vida atual
        maxHealth: `AF${7 + jogadorId}:AH${7 + jogadorId}`, // Vida máxima
        tempHealth: `AI${7 + jogadorId}:AK${7 + jogadorId}`, // Vida temporária
        currentIntegrity: `AM${7 + jogadorId}:AO${7 + jogadorId}`, // Integridade atual
        maxIntegrity: `AP${7 + jogadorId}:AR${7 + jogadorId}`, // Integridade máxima
        tempIntegrity: `AS${7 + jogadorId}:AU${7 + jogadorId}`, // Integridade temporária
        currentEnergy: `AC${15 + jogadorId}:AE${15 + jogadorId}`, // Pontos de energia atual
        maxEnergy: `AF${15 + jogadorId}:AH${15 + jogadorId}`, // Pontos de energia máximos
        tempEnergy: `AI${15 + jogadorId}:AK${15 + jogadorId}` // Pontos de energia temporária
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
    const vidaTemp = parseFloat(allData.tempHealth[0].join(" "));
    const integridadeAtual = parseFloat(allData.currentIntegrity[0].join(" "));
    const integridadeMaxima = parseFloat(allData.maxIntegrity[0].join(" "));
    const integridadeTemp = parseFloat(allData.tempIntegrity[0].join(" "));
    const energiaAtual = parseFloat(allData.currentEnergy[0].join(" "));
    const energiaMaxima = parseFloat(allData.maxEnergy[0].join(" "));
    const energiaTemp = parseFloat(allData.tempEnergy[0].join(" "));

    // Define a cor do efeito de fogo com base na energia
    const corFogo = `255, ${100 + (energiaAtual / energiaMaxima) * 155}, 0`;

    // Atualiza o nome e a foto
    document.getElementById("nome").textContent = nome;
    document.querySelector(".foto img").src = `imagens/jogador${jogadorId + 1}.jpg`;

    // Atualiza as barras e textos
    atualizarBarra(
        document.getElementById("vida-bar"),
        document.getElementById("vida-texto"),
        vidaAtual,
        vidaMaxima,
        vidaTemp
    );
    atualizarBarra(
        document.getElementById("integridade-bar"),
        document.getElementById("integridade-texto"),
        integridadeAtual,
        integridadeMaxima,
        integridadeTemp
    );
    atualizarBarra(
        document.getElementById("energia-bar"),
        document.getElementById("energia-texto"),
        energiaAtual,
        energiaMaxima,
        energiaTemp,
        corFogo
    );
}

// Obtém o ID do jogador da URL
const urlParams = new URLSearchParams(window.location.search);
const jogadorId = parseInt(urlParams.get("id")) || 0; // ID padrão é 0 (primeiro jogador)

// Carrega a ficha correspondente
carregarFicha(jogadorId);
