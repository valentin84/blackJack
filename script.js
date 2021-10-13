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
let sessionId;
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
    betValue = e.target.textContent;
    if(((sitJson.currentBalance >= betValue) || (typeof sitJson.currentBalance === "undefined")) ) {
        deal();
        cards.style.display = 'block';
        placeBet.style.display = 'none';
    } else {
        alert("no more cash")
        sitContainer.style.display = 'flex';
        newRound.style.display = 'none';
        endGameInfo.style.display = 'flow-root';
        placeBet.style.display = 'none';
        cards.style.display = 'none';
        stand();
    }
    

    

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
    endGameInfo.style.display = 'flow-root';
    stand()
}

// API calls

async function sit() {
    const sitResponse = await fetch(`${url}/sit`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "balance": 100
        })
    }).catch(handleError);
    sitJson = await sitResponse.json();
    sessionId = sitJson.sessionId
}

async function deal() {
    const dealResponse = await fetch(`${url}/deal`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "bet": betValue,
            "sessionId": sessionId
        })
    }).catch(handleError);
    sitJson = await dealResponse.json();
    // Display Both Players Cards
    dealerCards.innerHTML = ""
    const firstLine = document.createElement('p');
    firstLine.textContent = JSON.stringify(sitJson.dealerCards);
    dealerCards.appendChild(firstLine);
   
    playerCards.innerHTML = ""
    const secondLine = document.createElement('p');
    secondLine.textContent = JSON.stringify(sitJson.playerCards)
    playerCards.appendChild(secondLine);
}
async function turn() {
    const turnResponse = await fetch(`${url}/turn`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "action": actionValue,
            "sessionId": sessionId
        })
    }).catch(handleError);
    sitJson = await turnResponse.json();
    console.log(sitJson);
    // Add cards 

    const firsLine = document.createElement('p');
    firsLine.textContent = JSON.stringify(sitJson.dealerCards)
    dealerCards.appendChild(firsLine);
    const secondLine = document.createElement('p');
    secondLine.textContent = JSON.stringify(sitJson.playerCard)
    playerCards.appendChild(secondLine);

    // if round ended
    if(sitJson.roundEnded == true) {
        newRound.style.display = 'flex';
        cards.style.display = 'none';
        balanceContainer.style.display = 'block';
        balanceValue.textContent = sitJson.currentBalance
    }

}
async function stand() {
    const turnResponse = await fetch(`${url}/stand`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "sessionId": sessionId
        })
    }).catch(handleError);
    sitJson = await turnResponse.json();

    //Populate Round and Balance

    roundsPlayed.textContent = sitJson.roundsPlayed;
    standBalance.textContent = sitJson.winAmount;
}

//Function calls
sitButton.onclick = sitAction;
dealButton.onclick = dealAction;
betOptions.addEventListener("click", setBetValue);
actionsContainer.addEventListener("click", doAction);
standButton.onclick = standAction;