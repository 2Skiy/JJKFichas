// Configurações da API do Google Sheets
const sheetId = "1ljNI4XHJ_Q47PoiETwMM25DWBpTp3KvkBIKw9drJmVE"; // ID da planilha
const apiKey = "AIzaSyCyisUuZCAbV0fIM8xsdqB0SOj57UgpX9Y"; // Substitua pela sua chave de API
const ranges = {
    playerNames: "F3:P5", // Nome do jogador
    currentHealth: "AC7:AE10", // Vida atual
    maxHealth: "AF7:AH10", // Vida máxima
    tempHealth: "AI7:AK10", // Vida temporária
    currentIntegrity: "AM7:AO10", // Integridade atual
    maxIntegrity: "AP7:AR10", // Integridade máxima
    tempIntegrity: "AS7:AU10", // Integridade temporária
    currentEnergy: "AC15:AE18", // Pontos de energia atual
    maxEnergy: "AF15:AH18", // Pontos de energia máximos
    tempEnergy: "AI15:AK18" // Pontos de energia temporária
};

// Função para buscar os dados de um intervalo específico
async function fetchRangeData(range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
}

// Função para exibir as fichas
async function updateFichas() {
    const fichasContainer = document.getElementById("fichas");
    fichasContainer.innerHTML = ""; // Limpa o conteúdo anterior

    // Busca os dados de todos os intervalos
    const allData = {};
    for (const [key, range] of Object.entries(ranges)) {
        allData[key] = await fetchRangeData(range);
    }

    // Exibe as fichas
    for (let i = 0; i < allData.playerNames.length; i++) {
        const ficha = document.createElement("div");
        ficha.className = "ficha";

        const nome = allData.playerNames[i].join(" ");
        const vidaAtual = allData.currentHealth[i].join(" ");
        const vidaMaxima = allData.maxHealth[i].join(" ");
        const vidaTemp = allData.tempHealth[i].join(" ");
        const integridadeAtual = allData.currentIntegrity[i].join(" ");
        const integridadeMaxima = allData.maxIntegrity[i].join(" ");
        const integridadeTemp = allData.tempIntegrity[i].join(" ");
        const energiaAtual = allData.currentEnergy[i].join(" ");
        const energiaMaxima = allData.maxEnergy[i].join(" ");
        const energiaTemp = allData.tempEnergy[i].join(" ");

        ficha.innerHTML = `
            <h2>${nome}</h2>
            <p><strong>Vida:</strong> ${vidaAtual} / ${vidaMaxima} (Temp: ${vidaTemp})</p>
            <p><strong>Integridade:</strong> ${integridadeAtual} / ${integridadeMaxima} (Temp: ${integridadeTemp})</p>
            <p><strong>Energia:</strong> ${energiaAtual} / ${energiaMaxima} (Temp: ${energiaTemp})</p>
        `;

        fichasContainer.appendChild(ficha);
    }
}

// Atualiza as fichas a cada 60 segundos
updateFichas();
setInterval(updateFichas, 60000);