// script.js
const urlParams = new URLSearchParams(window.location.search);

// Mapeamento de planilhas para cores
const planilhas = {
    "1jvuzyQLHbxNj_FDrNVARRf8LK6zyBBUI1fEvt69hLLs": { cor: "#205238", fogo: "#42c947" },
    "1Pp1lNOLswuuMvZf5NLEgM_XbozUQ6jLg5JPFFRzeDNY": { cor: "#42c947", fogo: "#205238" },
    "1q0dToeheZKbMiEEQr8Ofxe2Q9ONvDqdGxPPnsMMH7f0": { cor: "#36251e", fogo: "#ff0000" }
};

// Parâmetros da URL
const planilhaId = urlParams.get("planilha"); // ID da planilha
const jogadorId = parseInt(urlParams.get("id")) || 0; // ID do jogador
const fotoJogador = urlParams.get("foto") || `jogador${jogadorId + 1}.jpg`; // Foto do jogador

// Aplicar cores personalizadas com base na planilha
if (planilhas[planilhaId]) {
    document.documentElement.style.setProperty('--cor-barra', planilhas[planilhaId].cor);
    document.documentElement.style.setProperty('--cor-fogo', planilhas[planilhaId].fogo);
}

// Atualizar foto
document.getElementById("foto-jogador").src = `imagens/${fotoJogador}`;

// Configurações da API do Google Sheets
const apiKey = "SUA_API_KEY"; // Substitua pela sua chave de API

async function fetchRangeData(range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${planilhaId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

function atualizarBarra(barraElement, textoElement, atual, maximo, temporario = 0) {
    const porcentagem = (atual / maximo) * 100;
    barraElement.style.clipPath = `inset(0 ${100 - porcentagem}% 0 0)`;
    textoElement.textContent = `${Math.round(atual)}/${Math.round(maximo)}${temporario > 0 ? ` +${temporario}` : ''}`;
}

async function carregarFicha(jogadorId) {
    const ranges = {
        playerName: `F${3 + jogadorId}:P${3 + jogadorId}`,
        currentHealth: `AC${7 + jogadorId}:AE${7 + jogadorId}`,
        maxHealth: `AF${7 + jogadorId}:AH${7 + jogadorId}`,
        tempHealth: `AI${7 + jogadorId}:AK${7 + jogadorId}`,
        currentIntegrity: `AM${7 + jogadorId}:AO${7 + jogadorId}`,
        maxIntegrity: `AP${7 + jogadorId}:AR${7 + jogadorId}`,
        tempIntegrity: `AS${7 + jogadorId}:AU${7 + jogadorId}`,
        currentEnergy: `AC${15 + jogadorId}:AE${15 + jogadorId}`,
        maxEnergy: `AF${15 + jogadorId}:AH${15 + jogadorId}`,
        tempEnergy: `AI${15 + jogadorId}:AK${15 + jogadorId}`
    };

    const allData = {};
    for (const [key, range] of Object.entries(ranges)) {
        allData[key] = await fetchRangeData(range);
    }

    // Atualizar nome e barras
    document.getElementById("nome").textContent = allData.playerName[0].join(" ");
    atualizarBarra(
        document.getElementById("vida-bar"),
        document.getElementById("vida-texto"),
        parseFloat(allData.currentHealth[0].join(" ")),
        parseFloat(allData.maxHealth[0].join(" ")),
        parseFloat(allData.tempHealth[0].join(" "))
    );
    atualizarBarra(
        document.getElementById("integridade-bar"),
        document.getElementById("integridade-texto"),
        parseFloat(allData.currentIntegrity[0].join(" ")),
        parseFloat(allData.maxIntegrity[0].join(" ")),
        parseFloat(allData.tempIntegrity[0].join(" "))
    );
    atualizarBarra(
        document.getElementById("energia-bar"),
        document.getElementById("energia-texto"),
        parseFloat(allData.currentEnergy[0].join(" ")),
        parseFloat(allData.maxEnergy[0].join(" ")),
        parseFloat(allData.tempEnergy[0].join(" "))
    );
}

// Carregar ficha ao iniciar
if (planilhaId) {
    carregarFicha(jogadorId);
} else {
    console.error("Planilha não especificada na URL.");
}
