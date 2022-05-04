var dealerHand = new Array();
var playerHand = new Array();
var dealer;
var player;
var cardValueAbbr;
var cardSuitAbbr;
var dealerTotalScore;
var playerTotalScore;
var hand;
var showHoleCard;
var dealerStatus;
var playerStatus;

//Creates the cards
function Card(cardValue, cardSuit) {
    this.cardValue = cardValue;
    this.cardSuit = cardSuit;
}

//Creates the deck of cards
function DeckCards() {
    this.nextcard = 0;
    this.deck = new Array(52);
    for (i = 0; i < 52; i++) {
        cardValue = (i % 13) + 1;
        cardSuit = Math.floor(((i / 13) % 13) + 1);
        this.deck[i] = new Card(cardValue, cardSuit);
    }
    return this;
}

// Shuffles the deck of cards
function Shuffle() {
    for (i = 0; i < 1000; i++) {
        //Get Card 1
        card1Index = Math.floor(Math.random() * 52);
        card1 = cardDeck.deck[card1Index];
        //Get Card 2
        card2Index = Math.floor(Math.random() * 52);
        card2 = cardDeck.deck[card2Index];
        //Swap
        cardDeck.deck[card1Index] = card2;
        cardDeck.deck[card2Index] = card1;
    }
}

// Gives the cards values: Ace, Jack, Queen or King
function GetCardValue(cardValueAbbr) {
    cardValueAbbr = cardValueAbbr;
    var cardNameValue = "";
    switch (cardValueAbbr) {
        case 1:
            cardNameValue = "Ace";
            break;
        case 11:
            cardNameValue = "Jack";
            break;
        case 12:
            cardNameValue = "Queen";
            break;
        case 13:
            cardNameValue = "King";
            break;
        default:
            cardNameValue = cardValueAbbr.toString();
    }
    return cardNameValue;
}

// Gives the cards suits: Club, Spade, Heart or Diamond
function GetCardSuit(cardSuitAbbr) {
    var cardNameSuit = "";
    switch (cardSuitAbbr) {
        case 1:
            cardNameSuit = "Club";
            break;
        case 2:
            cardNameSuit = "Spade";
            break;
        case 3:
            cardNameSuit = "Heart";
            break;
        case 4:
            cardNameSuit = "Diamond";
    }
    return cardNameSuit;
}

// Prints shuffled cards - Test Script
function PrintCards() {
    for (i = 0; i < 52; i++) {
        document.write(i + 1 + ": " + GetCardValue(cardDeck.deck[i].cardValue) + " of " + GetCardSuit(cardDeck.deck[i].cardSuit) + "<br>");
    }
}

// Starts new game - Calls for DeckCards(), Shuffle() and Deal()
function NewGame() {
    // Clears the dealer and player hands to start new game
    dealerHand = new Array();
    playerHand = new Array();
    showHoleCard = false;
    // Creates the deck of cards
    cardDeck = DeckCards();
    // Shuffles the deck of cards
    Shuffle();

    dealerHand[0] = Deal();
    playerHand[0] = Deal();
    dealerHand[1] = Deal();
    playerHand[1] = Deal();

    DisplayHands();
}

// Deals the cards to dealer and/or player
function Deal() {
    if (cardDeck.nextcard < 51)
        return cardDeck.deck[cardDeck.nextcard++];
    else
        return "No card left.";
}

//Diaplays the dealer and player cards. Calls for GetCardValue(), GetCardSuit() and DisplayScores()
function DisplayHands() {
    dealer = document.getElementById('dealerDiv');
    player = document.getElementById('playerDiv');
    dealer.innerHTML = "";
    player.innerHTML = "";
    // Displays dealer cards - At the beginning of the game, hides one dealer card or show all dealer cards from second round
    if (showHoleCard == true) {
        for (i = 0; i < dealerHand.length; i++)
            dealer.innerHTML += GetCardValue(dealerHand[i].cardValue) + " of " + GetCardSuit(dealerHand[i].cardSuit) + "<br>";
    }
    else {
        dealer.innerHTML = "*** Hidden ***<br>";
        dealer.innerHTML += GetCardValue(dealerHand[1].cardValue) + " of " + GetCardSuit(dealerHand[1].cardSuit) + "<br>";
    }

    // Displays player cards
    for (i = 0; i < playerHand.length; i++)
        player.innerHTML += GetCardValue(playerHand[i].cardValue) + " of " + GetCardSuit(playerHand[i].cardSuit) + "<br>";
    DisplayScores();
}

// Display the dealer and player scores. Calls Score()
function DisplayScores() {
    dealerTotalScore = document.getElementById('dealerScore');
    dealerTotalScore.innerHTML = "";
    // Displays dealer score - At the beginning of the game, shows score of just one card for the dealer
    if (showHoleCard == true)
        dealerTotalScore.innerHTML = Score(dealerHand);
    else if (dealerHand[1].cardValue == 1 || dealerHand[1].cardValue == 11 || dealerHand[1].cardValue == 12 || dealerHand[1].cardValue == 13)
        dealerTotalScore.innerHTML += "More than " + 10;
    else
        dealerTotalScore.innerHTML += "More than " + dealerHand[1].cardValue;
    dealerStatus = Score(dealerHand);

    // Displays player score
    playerTotalScore = document.getElementById('playerScore');
    playerTotalScore.innerHTML = "";
    playerTotalScore.innerHTML = Score(playerHand);
    playerStatus = Score(playerHand);
    // Check for winner and looser. Calls GameStatus()
    GameStatus();
}

// Player clicks Hit button. Calls DisplayHands() and Deal()
function Hit() {
    showHoleCard = true
    playerHand[playerHand.length] = Deal();
    DisplayHands(showHoleCard);
}

// Player clicks Stand button. Calls DisplayHands() and Deal()
function Stand() {
    showHoleCard = true
    dealerHand[dealerHand.length] = Deal();
    DisplayHands(showHoleCard);
}

// Calculates the dealer and player scores
function Score(hand) {
    var total = 0;
    var ace = false;
    var cardsvalue = 0;
    for (i = 0; i < hand.length; i++) {
        //Is card Ace?
        if (hand[i].cardValue == 1) {
            ace = true;
            cardsvalue += 1;
        }
        //Force face card to have value of 10
        else if (hand[i].cardValue > 10)
            cardsvalue += 10;
        else
            cardsvalue += hand[i].cardValue;
        total = cardsvalue;
    }
    if (ace && total <= 11)
        total += 10;
    return total;
}

// Check for winner, loser or tie and shows result
function GameStatus() {
    gameFinalStatus = document.getElementById("gameStatus");
    gameFinalStatus.innerHTML = "Playing...";
    if (dealerStatus == 21 && showHoleCard == false)
        gameFinalStatus.innerHTML = "Blackjack! Dealer wins!";
    else if (playerStatus == 21 && showHoleCard == false)
        gameFinalStatus.innerHTML = "Blackjack! Player wins!";
    else if (dealerStatus == playerStatus && showHoleCard == false)
        gameFinalStatus.innerHTML = "Playing...";
    else if (dealerStatus == playerStatus && showHoleCard == true)
        gameFinalStatus.innerHTML = "Tie!";
    else if (dealerStatus == 21 && playerStatus < 21 && showHoleCard == true)
        gameFinalStatus.innerHTML = "Dealer wins!";
    else if (playerStatus == 21 && dealerStatus < 21 && showHoleCard == true)
        gameFinalStatus.innerHTML = "Player wins!";
    else if (dealerStatus > 21 && playerStatus < 21 && showHoleCard == true)
        gameFinalStatus.innerHTML = "Player wins!";
    else if (playerStatus > 21 && dealerStatus < 21 && showHoleCard == true)
        gameFinalStatus.innerHTML = "Dealer wins!";
}
