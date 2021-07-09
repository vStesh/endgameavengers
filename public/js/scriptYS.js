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


function initSy() {
//драгон-дроп
let block = document.querySelectorAll(".block");
let cardField_2 = document.querySelectorAll('.cardField_2');
let cardField_1 = document.querySelectorAll('.cardField_1');
let battleField_2 = document.querySelector('.battleField_2');

//перетягування карток
block.forEach((item, num) => {
   item.addEventListener("dragstart", function (event) {
      current = [this, this.innerHTML.match(/\d{1,36}/)];
   })

   //івенти на поле гри гравці
   cardField_2.forEach((field) => {
      field.addEventListener('dragover', function (e) {
         e.preventDefault();
      })

      field.addEventListener('drop', function (e) {
         if (arrPlayer_2.includes(+current[1])) {
         } else {
            arrPlayer_2.push(+current[1]);
         }
         this.append(current[0]);

         if (arrPlayer_2.length > 3) {
            arrPlayer_2.length = 3
            box.append(current[0]);
         }

         if (arrPlayer_2.length === 3) {

            battleField_2.addEventListener('dragover', function (e) {
               e.preventDefault();
            })
            battleField_2.addEventListener('drop', function (e) {

               if (arrBattle_2.length < 1) {

                  if (arrBattle_2.includes(+current[1])) {
                  } else {
                     arrBattle_2.push(+current[1]);
                  }

                  if (arrPlayer_2.includes(+current[1])) {
                     let pos = arrPlayer_2.indexOf(+current[1]);
                     arrPlayer_2.splice(pos, 1);
                  }
                  this.append(current[0]);
               }
               console.log(`Карти в руках [${arrPlayer_2}]`);
               console.log(`Карти в бою [${arrBattle_2}]`);
            })

         }

         if (arrBattle_2.includes(+current[1])) {
            let pos = arrBattle_2.indexOf(+current[1]);
            arrBattle_2.splice(pos, 1);
         }
         field.style.boxShadow = 'none'
         console.log(`Карти в руках [${arrPlayer_2}]`);
         console.log(`Карти в бою [${arrBattle_2}]`);
      });

      // cardField[0].append(block[rand_0])                  //random cards
      // cardField[1].append(block[rand_1])
      // cardField[2].append(block[rand_2])

      field.style.boxShadow = '0px 0px 20px 1px lawngreen'
   })

   //івенти на колоду карт
   box.addEventListener('dragover', function (e) {
      e.preventDefault();
   })
   box.addEventListener('drop', function (e) {
      if (arrBattle_2.includes(+current[1])) {
         let pos = arrBattle_2.indexOf(+current[1]);
         arrBattle_2.splice(pos, 1);
      }

      if (arrPlayer_2.includes(+current[1])) {
         let pos = arrPlayer_2.indexOf(+current[1]);
         arrPlayer_2.splice(pos, 1);
      }
      this.append(current[0]);
   })
})

}



//таймер
let time = 1;
let countDownEl = document.querySelector('#countdown')
let timer;

function updateCountup() {
   let minutes = Math.floor(time / 60);
   let seconds = time % 60;
   minutes = minutes < 10 ? '0' + minutes : minutes;
   seconds = seconds < 10 ? '0' + seconds : seconds;
   countDownEl.innerHTML = `${minutes}:${seconds}`;
   time++;

   if (seconds === 31) {
      time = 1;
      countDownEl.innerHTML = `00:00`;
      btn.textContent = 'Start';
      stop(timer)
   }
}

btn.addEventListener('click', () => {
   if (btn.textContent === 'Start') {
      updateCountup();
      btn.textContent = 'Complete';
      timer = setInterval(updateCountup, 1000);
   } else if (btn.textContent === 'Complete') {
      time = 1;
      countDownEl.textContent = `hi`;
      countDownEl.innerHTML = `00:00`;
      btn.textContent = 'Start';
      stop(timer);
   }

})

function stop(item) {
   clearInterval(item);
}

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

