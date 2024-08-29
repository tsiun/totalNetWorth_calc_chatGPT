// Начальные данные по активам и долгам (пока что значения берутся из input полей)
const API_BASE_URL = "https://api.coingecko.com/api/v3";

const portfolio = {
    rune: { quantity: parseFloat(document.getElementById('rune-quantity-input').value), price: 0, value: 0 },
    btc: { quantity: parseFloat(document.getElementById('btc-quantity-input').value), price: 0, value: 0 },
    cbeth: { quantity: parseFloat(document.getElementById('cbeth-quantity-input').value), price: 0, value: 0 },
    wsteth: { quantity: parseFloat(document.getElementById('wsteth-quantity-input').value), price: 0, value: 0 },
    eth: { quantity: parseFloat(document.getElementById('eth-quantity-input').value), price: 0, value: 0 },
    usdc: { quantity: parseFloat(document.getElementById('usdc-quantity-input').value), price: 1, value: 0 },
    savax: { quantity: parseFloat(document.getElementById('savax-quantity-input').value), price: 0, value: 0 }
};

// Долги на платформах AAVE и Compound
let debt = {
    aave: parseFloat(document.getElementById('aave-debt-input').value),
    compound: parseFloat(document.getElementById('compound-debt-input').value)
};

// Функция для получения текущих цен активов
async function fetchAssetPrices() {
    const assetIds = ["thorchain", "bitcoin", "coinbase-wrapped-staked-eth", "wrapped-steth", "ethereum", "avalanche-2"];
    const response = await fetch(`${API_BASE_URL}/simple/price?ids=${assetIds.join(',')}&vs_currencies=usd`);
    const prices = await response.json();

     // Обновляем цены в портфеле
     portfolio.rune.price = prices["thorchain"].usd;
     portfolio.btc.price = prices["bitcoin"].usd;
     portfolio.cbeth.price = prices["coinbase-wrapped-staked-eth"].usd;
     portfolio.wsteth.price = prices["wrapped-steth"].usd;
     portfolio.eth.price = prices["ethereum"].usd;
     portfolio.savax.price = prices["avalanche-2"].usd;

    // Рассчитываем значение каждого актива и обновляем таблицу
    updatePortfolio();
}

// Функция для обновления значений портфеля и таблицы
function updatePortfolio() {
    let totalValue = 0;

    // Получаем значения из полей ввода
    portfolio.rune.quantity = parseFloat(document.getElementById('rune-quantity-input').value);
    portfolio.btc.quantity = parseFloat(document.getElementById('btc-quantity-input').value);
    portfolio.cbeth.quantity = parseFloat(document.getElementById('cbeth-quantity-input').value);
    portfolio.wsteth.quantity = parseFloat(document.getElementById('wsteth-quantity-input').value);
    portfolio.eth.quantity = parseFloat(document.getElementById('eth-quantity-input').value);
    portfolio.usdc.quantity = parseFloat(document.getElementById('usdc-quantity-input').value);
    portfolio.savax.quantity = parseFloat(document.getElementById('savax-quantity-input').value);

    debt.aave = parseFloat(document.getElementById('aave-debt-input').value);
    debt.compound = parseFloat(document.getElementById('compound-debt-input').value);

    // Обновляем значение каждого актива
    for (const [asset, data] of Object.entries(portfolio)) {
        data.value = data.quantity * data.price;
        totalValue += data.value;

        // Обновляем данные в таблице
        document.getElementById(`${asset}-quantity`).innerText = data.quantity.toFixed(2);
        document.getElementById(`${asset}-price`).innerText = data.price.toFixed(2);
        document.getElementById(`${asset}-value`).innerText = data.value.toFixed(2);
    }

    // Рассчитываем общую стоимость портфеля
    document.getElementById('total-value').innerText = totalValue.toFixed(2);

    // Рассчитываем стоимость портфеля за вычетом долгов
    const totalDebt = debt.aave + debt.compound;
    const totalValueAfterDebt = totalValue - totalDebt;
    document.getElementById('total-value-after-debt').innerText = totalValueAfterDebt.toFixed(2);

    // Расчитываем общую сумму долга
    document.getElementById('total-debt').innerText = totalDebt.toFixed(2);
}

// Добавляем обработчик клика для кнопки обновления цен
document.getElementById('update-prices-btn').addEventListener('click', fetchAssetPrices);

// Инициализация данных при загрузке страницы
fetchAssetPrices();