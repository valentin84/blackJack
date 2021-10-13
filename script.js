const url = "https://blackjack.fuzz.me.uk";
const headers = {
    "content-type": "application/json"

}

//Buttons & Paragraphs
const sitButton = document.querySelector('#sit');
const dealButton = document.querySelector('#deal');
const standButton = document.querySelector('#stand');
const balanceValue = document.querySelector('.balanceValue');
const roundsPlayed = document.querySelector('.roundsPlayed');
const standBalance = document.querySelector('.standBalance');

//Containers
const sitContainer = document.querySelector('.sit');
const newRound = document.querySelector('.newRound');
const placeBet = document.querySelector('.placeBet');
const cards = document.querySelector('.cards');
const betOptions = document.querySelector('.betOptions');
const actionsContainer = document.querySelector('.actions');
const balanceContainer = document.querySelector('.balance');
const dealerCards = document.querySelector('.dealerCards');
const playerCards = document.querySelector('.playerCards');
const endGameInfo = document.querySelector('.endGameInfo');


// Json variables

let sitJson = {};
let betValue;
let dealJson = {}
let actionValue;
let turnJson = {};
let standJson = {}

// Actions Function Definition

function handleError(err) {
    alert(err);
}

function sitAction() {

    newRound.style.display = 'flex';
    sitContainer.style.display = 'none';
    balanceContainer.style.display = 'none';
    sit();
}

function dealAction() {
    newRound.style.display = 'none';
    placeBet.style.display = 'flex';

    if(betOptions.childElementCount  === 0) {
        for(let i = 0; i < sitJson.availableBetOptions.length; i++) {
            let place = document.querySelector(".betOptions");
            let btn = document.createElement("button");
            btn.textContent = sitJson.availableBetOptions[i];
            place.appendChild(btn);
        }
    }
}

function setBetValue(e) {
    const isButton = e.target.nodeName === 'BUTTON';
    
    if(!isButton) {
        return
    }
    betValue = e.target.textContent
    deal();

    cards.style.display = 'block';
    placeBet.style.display = 'none';

}

function doAction(e) {
    const isButton = e.target.nodeName === 'BUTTON';
    
    if(!isButton) {
        return
    }
    actionValue = e.target.textContent;
    turn();
}

function standAction() {
    sitContainer.style.display = 'flex';
    newRound.style.display = 'none';
    endGameInfo.style.display = 'flow-root'
    stand()
}

// API calls

async function sit() {
    const sitResponse = await fetch(`${url}/sit`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "balance": 500
        })
    }).catch(handleError);
    sitJson = await sitResponse.json();
}

async function deal() {
    const dealResponse = await fetch(`${url}/deal`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "bet": betValue,
            "sessionId": sitJson.sessionId
        })
    }).catch(handleError);
    dealJson = await dealResponse.json();

    // Display Both Players Cards
    dealerCards.innerHTML = ""
    const firstLine = document.createElement('p');
    firstLine.textContent = JSON.stringify(dealJson.dealerCards);
    dealerCards.appendChild(firstLine);
   
    playerCards.innerHTML = ""
    const secondLine = document.createElement('p');
    secondLine.textContent = JSON.stringify(dealJson.playerCards)
    playerCards.appendChild(secondLine);
}
async function turn() {
    const turnResponse = await fetch(`${url}/turn`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "action": actionValue,
            "sessionId": sitJson.sessionId
        })
    })
    turnJson = await turnResponse.json();

    // Add cards 

    const firsLine = document.createElement('p');
    firsLine.textContent = JSON.stringify(turnJson.dealerCards)
    dealerCards.appendChild(firsLine);
    const secondLine = document.createElement('p');
    secondLine.textContent = JSON.stringify(turnJson.playerCard)
    playerCards.appendChild(secondLine);

    // if round ended
    if(turnJson.roundEnded == true) {
        newRound.style.display = 'flex';
        cards.style.display = 'none';
        balanceContainer.style.display = 'block';
        balanceValue.textContent = turnJson.currentBalance
    }

}
async function stand() {
    const turnResponse = await fetch(`${url}/stand`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "sessionId": sitJson.sessionId
        })
    })
    standJson = await turnResponse.json();

    //Populate Round and Balance

    roundsPlayed.textContent = standJson.roundsPlayed;
    standBalance.textContent = standJson.winAmount;
}

//Function calls
sitButton.onclick = sitAction;
dealButton.onclick = dealAction;
betOptions.addEventListener("click", setBetValue);
actionsContainer.addEventListener("click", doAction);
standButton.onclick = standAction;