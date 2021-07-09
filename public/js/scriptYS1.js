let box = document.querySelector('#box');//колода карт
let card = '';//кожна карта
let id;//знайдений id картки яку перемістили в 1 з 3 ячейок
let current;//блок(карта) який перетягується
let root = document.querySelector('#root');//місце куди пушаться карти
let playingField = document.querySelector('#playingField');//ігрове поле
let btn = document.querySelector('.btn');//кнопка
let arrPlayer_1 = [];//масив карт гравця1
let arrPlayer_2 = [];//масив карт гравця2
let arrBattle_1 = [];//масив карт поля бою 1
let arrBattle_2 = [];//масив карт поля бою 2
let glass = document.querySelector('.glass');//скло


//timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
   info: {
      color: "green"
   },
   warning: {
      color: "orange",
      threshold: WARNING_THRESHOLD
   },
   alert: {
      color: "red",
      threshold: ALERT_THRESHOLD
   }
};

const TIME_LIMIT = 30;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("countdown").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
   timeLeft
)}</span>
</div>
`;


function onTimesUp() {
   timeLeft = 30;
   timePassed = 0;
   document.getElementById("countdown").innerHTML = `
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
      timeLeft
   )}</span>
</div>
`;
   clearInterval(timerInterval);

}

function startTimer() {
   // timeLeft = 30;
   timePassed = 0;
   timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed;
      document.getElementById("base-timer-label").innerHTML = formatTime(
         timeLeft
      );
      setCircleDasharray();
      setRemainingPathColor(timeLeft);

      if (timeLeft === 0) {
         onTimesUp();
      }
   }, 1000);

}

function formatTime(time) {
   let seconds = time % 60;

   if (seconds < 10) {
      seconds = `0${seconds}`;
   }

   return `${seconds}`;
}

function setRemainingPathColor(timeLeft) {
   const { alert, warning, info } = COLOR_CODES;
   if (timeLeft <= alert.threshold) {
      document
         .getElementById("base-timer-path-remaining")
         .classList.remove(warning.color);
      document
         .getElementById("base-timer-path-remaining")
         .classList.add(alert.color);
   } else if (timeLeft <= warning.threshold) {
      document
         .getElementById("base-timer-path-remaining")
         .classList.remove(info.color);
      document
         .getElementById("base-timer-path-remaining")
         .classList.add(warning.color);
   }
}

function calculateTimeFraction() {
   const rawTimeFraction = timeLeft / TIME_LIMIT;
   return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
   const circleDasharray = `${(
      calculateTimeFraction() * FULL_DASH_ARRAY
   ).toFixed(0)} 283`;
   document
      .getElementById("base-timer-path-remaining")
      .setAttribute("stroke-dasharray", circleDasharray);
}


// btn.addEventListener('click', () => {
//    if (btn.textContent === 'Start') {
//       glass.style.display = 'none'
//       btn.innerHTML = 'Complete';
//       startTimer()
//    } else if (btn.textContent === 'Complete') {
//       glass.style.display = 'block'
//       btn.innerHTML = 'Start';
//       onTimesUp();
//    }
// })

//flip
let coin = document.querySelector('#coin');
coin.addEventListener('click', function () {

   let flipResult = Math.random();
   coin.classList.remove();

   setTimeout(function () {
      if (flipResult <= 0.5) {
         coin.classList.add('heads');
         console.log('It is player 1');
      }
      else {
         coin.classList.add('tails');
         console.log('It is player 2');
      }
   }, 100)

   setTimeout(function () {
      coin.style.transition = '1s';
      coin.style.left = '-100px';
   }, 5000);

   setTimeout(function () {
      coin.style.display = 'none';
   }, 6000);
});

//carta
let carta = document.querySelector('#carta');
carta.addEventListener('click', function () {
   carta.classList.add('tails');

});

