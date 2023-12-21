const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector("#score_points"),
  },
  cardSprites: {
    avatar: document.querySelector("#card-image"),
    name: document.querySelector("#card-name"),
    type: document.querySelector("#card-type"),
  },
  fieldCards: {
    player: document.querySelector("#player-field-card"),
    computer: document.querySelector("#computer-field-card"),
  },
  button: document.getElementById("next-duel"),
};

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    WinOf: [0],
    LoseOf: [2],
  },
];

const getRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
};

const drawButton = (duelResults) => {
  state.button.innerText = duelResults;
  state.button.style.display = "block";
};

const updateScore = () => {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

const resetDuel = () => {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
  state.button.style.display = "none";
  state.fieldCards.player.src = "";
  state.fieldCards.computer.src = "";
  init();
};

const drawSelectedCard = (idCard) => {
  state.cardSprites.avatar.src = cardData[idCard].img;
  state.cardSprites.name.innerText = cardData[idCard].name;
  state.cardSprites.type.innerText = "Attribute: " + cardData[idCard].type;
};

const showHiddenFieldCards = (hidden) => {
  if (hidden) {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  } else {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  }
};

const setCardsField = (cardId) => {
  removeAllCardsImages();

  const computerId = getRandomCard();

  showHiddenFieldCards(false);

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerId].img;

  let duelResults = checkDuelResults(cardId, computerId);

  updateScore();
  drawButton(duelResults);
};

const createCardImage = (idCard, fieldSide) => {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", idCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(idCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
};

const drawCards = (cardNumbers, fieldSide) => {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = getRandomCard();
    const cardImage = createCardImage(randomIdCard, fieldSide);
    document.getElementById(fieldSide).appendChild(cardImage);
  }
};

const removeAllCardsImages = () => {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.remove();
  });
};

const playAudio = (status) => {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);
  audio.play();
};

const checkDuelResults = (cardId, computerId) => {
  let duelResults = "draw";
  if (cardData[cardId].WinOf.includes(computerId)) {
    duelResults = "win";
    state.score.playerScore += 1;
  }

  if (cardData[cardId].LoseOf.includes(computerId)) {
    duelResults = "lose";
    state.score.computerScore += 1;
  }

  playAudio(duelResults);

  return duelResults.toUpperCase();
};

function init() {
  showHiddenFieldCards(true);
  drawCards(5, playerSides.computer);
  drawCards(5, playerSides.player1);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
