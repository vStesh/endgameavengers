'use strict'
window.onload = function () {
    let startbutton = document.querySelector('#startgamebutton');
    if (startbutton) {
        startbutton.addEventListener('click', (e) => startGame(e));
    }
    let joinbutton = document.querySelector('#joingamebutton');
    if (joinbutton) {
        joinbutton.addEventListener('click', (e) => joinGame(e));
    }
    document.querySelector('#end-game').addEventListener('click', endGame);
    if (document.querySelector('.modal__close')) {
        document.querySelector('.modal__close').addEventListener('click', closeModal);
    }

    const startGameBtn = document.querySelector('#start-game');
    const endGameBtn = document.querySelector('#end-game');
    const modalBlock = document.querySelector('.modal-w');
    const cardShirt = '<div class="block" draggable="false"></div>';
    startGameBtn.addEventListener('click', backToStart)


    let socket = io('/game');
    let game = {};
    let autoTurnId;
    let turnEnemy = true;

    socket.emit('getStatus', document.cookie);
    socket.on('getStatus', (message) => {
        console.log(message);
        if (message.status) {
            game = JSON.parse(JSON.stringify(message.game));
            game.hand = JSON.parse(message.game.hand);
            game.room = message.room;
            let enemy = message.game.enemy;
            let iam = message.game.iam;
            document.querySelector('.img-box').innerHTML = `<img src="${enemy.avatar}" alt="{{text}}" class="avatar" draggable="false">`;
            document.querySelector('.login2').innerHTML = enemy.login;
            document.querySelector('.life-enemy').innerHTML = enemy.life;
            document.querySelector('.life-iam').innerHTML = iam.life;
            document.querySelector('.pl_2 .health').value = enemy.life;
            document.querySelector('.pl_1 .health').value = iam.life;
            document.querySelector('.cardNumber').innerHTML = message.game.cards;
            if (!iam.coin) {
                document.querySelector('#coin').outerHTML = '';
            }
            document.querySelector('#render-start').outerHTML = '';

            renderCards(JSON.parse(message.game.hand));
            initSy1();
        }
    });

    socket.on('joinGame', (message) => {
        if (message.status) {
            console.log(message);
            document.cookie = `gameToken=${message.gameToken} ; path=/; max-age=3600`;
            window.location.assign('/');
        }
        console.log('Message from server: ', message);

    });

    socket.on('firstTurn', (message) => {

        console.log(message);
        if (message.turn) {
            myTurn();
        } else {
            enemyTurn();
        }
        console.log('Message from server: ', message);

    });

    socket.on('turn', (message) => {
        console.log(message);
        game = message.game;
        clearInterval(timerInterval);

        if(game.battle.enemy && turnEnemy) {
            showEnemyCard(message.game.battle.enemy);
            turnEnemy = false;
        }
        if(game.battle.lose) {
            turnEnemy = true;
        }
        if(message.game.battle.enemy && message.game.battle.iam) {
            console.log('show battle');
            showBattle();
            setTimeout(() => {
                changeUserInfo();
                if(game.result?.status === 'gameOver') {
                    console.log('----> Game Over!!!');
                    if(game.result.winner === 'iam') {
                        alert('Game Over!! YOU WINN!!!!');
                    } else {
                        alert('Game Over!! YOU LOOOOOOOOOOSER!!!!');
                    }
                    window.location.assign('/');
                } else {
                    trashCards();
                    addCards();
                    setTimeout(() => nextTurn(message), 1000);
                }
            }, 3000);
        } else {
            nextTurn(message);
        }
    });

    // Визуальная раздача карт противнику и себе
    function addCards() {
        document.querySelectorAll('.cardField_1').forEach(item => {
            item.insertAdjacentHTML('beforeend', cardShirt);
        });
        document.querySelectorAll('.cardField_2').forEach(item => {
            if(item.children.length === 0) {
                console.log('show card');
                console.log(getHtmlCard(game.hand, 2));
                item.insertAdjacentHTML('beforeend', getHtmlCard(game.hand[2], 2));
            };
            console.log(item.children);
        });
        initCards();
    }

    // Визуальный сброс карт с поля битвы
    function trashCards() {
            document.querySelector('.battleField_1').innerHTML = 'Enemy card for battle';
            // document.querySelector('.battleField_1').firstElementChild.outerHTML = '';
            document.querySelector('.battleField_2').innerHTML = 'You card for battle';
            // document.querySelector('.battleField_2').firstElementChild.outerHTML = '';
    }

    function showBattle() {
        document.querySelector('.battle-gif').classList.toggle('hidden');
        setTimeout(() => {
            document.querySelector('.battle-gif').classList.toggle('hidden');
        }, 3000);
    }

    function nextTurn(message) {
        if(!message.myTurn){
            console.log(message.myTurn);
            document.querySelector('.glass').classList.remove('hidden');
            document.querySelector('.glass').classList.add('show');
            document.querySelector('.countdown p').innerHTML = `<b>Enemy's</b> turn`;
        }
        if(message.myTurn){
            document.querySelector('.glass').classList.remove('add');
            document.querySelector('.glass').classList.add('hidden');
            document.querySelector('.countdown p').innerHTML = `<b>Your</b> turn`;
        }
        startTimer();
    }
    function showEnemyCard(card) {
        let randCard = Math.floor(Math.random() * (3));
        document.querySelectorAll('.cardField_1').forEach((item, key) => {
            if(randCard === key) {
                item.innerHTML = '';
            }
        });
        let div = `
            <div class="block">
                <div class="hero_id" style='display:none'>${card.id}</div>
                <div class="hero_name" style='display:none'>${card.name}</div>
                <div class="cost">$${card.cost}</div>
                <img src="/images/${card.image}">
                <div class="power">
                    <div class="attack">${card.attack}</div>
                    <div class="defence">${card.defence}</div>
                </div>
            </div>`;
        document.querySelector('.battleField_1').insertAdjacentHTML('beforeend', div);
    }

    function endGame(e) {
        e.preventDefault()
        socket.emit('endGame', document.cookie);
        document.cookie = `gameToken=1 ; path=/; max-age=0`;
        window.location.assign('/');
    }

    function closeModal() {
        modalBlock.classList.add('hidden');
        endGameBtn.classList.add('hidden');
        startGameBtn.classList.remove('hidden');
        startGameBtn.classList.add('show');

    }
    function backToStart() {
        window.location.assign('/');
    }

    async function startGame(e) {

        console.log(e.target.dataset.token);
        socket.emit('startgame', e.target.dataset.token);

        await socket.on('startgame', (message) => {
            if (message.status) {
                document.querySelector('#render-start-w').innerHTML = `
                <div class="please-text">Please <b>Copy</b> link</div>
                <div>Waiting for enemy...</div>
                <div class="copy-text">${window.location + 'game/join?token=' + message.game.id + ':' + message.game.token}</div>
                <p class="par-copy"></p>
                `;
                //Создать куки - userToken= e.target.dataset.token
                // document.querySelector('.copy-btn').addEventListener('click', copyLink);
            }
            console.log('Message from server: ', message);
        });
    }


    document.querySelector('#render-start-w').onclick = (e) => {
        const elem = e.target;
        if (elem.classList.contains('copy-text')) {
            navigator.clipboard.writeText(elem.innerHTML)
                .then(() => {
                    document.querySelector('.copy-text').innerHTML = '';
                    document.querySelector('.please-text').innerHTML = '<b>Send</b> link to your enemy'
                    document.querySelector('.par-copy').innerHTML = 'copied';
                })
                .catch(err => console.log(err));
        }
    }


    async function joinGame(e) {
        console.log(e.target.dataset.token);
        socket.emit('joinGame', e.target.dataset.token);
    }


    //рендер карт
    function renderCards(hand) {
        hand.forEach((hero) => {
            card += `
            <div class="block" draggable="true" data-card="${hero.id}">
                <div class="hero_id" style='display:none'>${hero.id}</div>
                <div class="hero_name" style='display:none'>${hero.name}</div>
                <div class="cost">$${hero.cost}</div>
                <img src="/images/${hero.image}">
                <div class="power">
                    <div class="attack">${hero.attack}</div>
                    <div class="defence">${hero.defence}</div>
                </div>
            </div>`;
        });
        root.innerHTML = card;
    }

    function getHtmlCard(hero) {
        return `
            <div class="block" draggable="true" data-card="${hero.id}">
                <div class="hero_id" style='display:none'>${hero.id}</div>
                <div class="hero_name" style='display:none'>${hero.name}</div>
                <div class="cost">$${hero.cost}</div>
                <img src="/images/${hero.image}">
                <div class="power">
                    <div class="attack">${hero.attack}</div>
                    <div class="defence">${hero.defence}</div>
                </div>
            </div>`;
    }

    function sendFirstTurn(firstTurn) {
        socket.emit('firstTurn', { game: game, turn: firstTurn ? game.iam.id : game.enemy.id });
    }

    function myTurn(){
        // console.log(turn(arrBattle_2))
        if(document.querySelector('.base-timer__label').innerHTML == 30){
            document.querySelector('.countdown p').innerHTML = `<b>Your</b> turn`;
            startTimer();
            autoTurnId = setTimeout(autoTurn, 30000);
        }
        // enemyTurn()
       
    }

    function enemyTurn() {
        if(document.querySelector('.base-timer__label').innerHTML == 30){
            document.querySelector('.countdown p').innerHTML = `<b>Enemy's</b> turn`;
            startTimer();
            document.querySelector('.glass').classList.remove('hidden');
            document.querySelector('.glass').classList.add('show');
            
        }
        // myTurn()
        
    }

    function autoTurn(){
        let randCard = 0;
        turn(randCard);
    }

    function turn(card) {
        clearInterval(autoTurnId);
        console.log(card);
        // game.turn = game.hand[+card];
        game.hand.forEach(item => {
            if(item.id === + card) {
                game.turn = item;
            }
        });
        // return card
        console.log(game);
        socket.emit('turn', game);
    }

    //flip
    let coin = document.querySelector('#coin');
    coin.addEventListener('click', function () {
        let firstTurn;
        let flipResult = Math.random();
        coin.classList.remove();

        setTimeout(function () {
            if (flipResult <= 0.5) {
                coin.classList.add('heads');
                console.log('It is player 1');
                firstTurn = 1;
            }
            else {
                coin.classList.add('tails');
                console.log('It is player 2');
                firstTurn = 0;
            }
        }, 100)

        setTimeout(function () {
            coin.style.transition = '1s';
            coin.style.left = '-100px';
        }, 5000);

        setTimeout(function () {
            coin.style.display = 'none';
            sendFirstTurn(firstTurn);
        }, 6000);
    });

    function initSy1() {
        initCards();

        //драгон-дроп
        // let block = document.querySelectorAll(".block");
        // let cardField_2 = document.querySelectorAll('.cardField_2');
        // let cardField_1 = document.querySelectorAll('.cardField_1');
        let battleField_2 = document.querySelector('.battleField_2');



        // Карту в бой
        battleField_2.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        battleField_2.addEventListener('drop', function (e) {

            this.append(current[0]);
            console.log(e.target.firstElementChild.dataset.card);
            turn(e.target.firstElementChild.dataset.card);
            console.log(`Карти в руках [${arrPlayer_2}]`);
            console.log(`Карти в бою [${arrBattle_2}]`);
        })
    };

    function initCards() {
        if(game.turn) {
            document.querySelectorAll('.cardField_2').forEach(item => {
                let idCard = item.firstElementChild.dataset.card;
                game.hand.forEach(it => {
                    if(it.id === +idCard) {

                        item.firstElementChild.remove();
                        item.insertAdjacentHTML('beforeend', getHtmlCard(it));
                    }
                });
            });
        }


        //драгон-дроп
        let block = document.querySelectorAll(".block");
        let cardField_2 = document.querySelectorAll('.cardField_2');
        // let cardField_1 = document.querySelectorAll('.cardField_1');
        // let battleField_2 = document.querySelector('.battleField_2');

        //перетягування карток
        block.forEach((item, num) => {
            item.addEventListener("dragstart", function (event) {
                current = [this, this.innerHTML.match(/\d{1,36}/)];
            })

            //івенти на поле гри гравці
            cardField_2.forEach((field) => {
                field.addEventListener('dragover', function (e) {
                    e.preventDefault();
                });

                field.addEventListener('drop', function (e) {
                    this.append(current[0]);
                    if (arrPlayer_2.length > 3) {
                        arrPlayer_2.length = 3
                        box.append(current[0]);
                    }
                    field.style.boxShadow = 'none'
                });
                field.style.boxShadow = '0px 0px 20px 1px lawngreen'
            });
        });
    }

    function changeUserInfo() {

        document.querySelector('.life-enemy').innerHTML = game.enemy.life;
        document.querySelector('.life-iam').innerHTML = game.iam.life;
        document.querySelector('.pl_2 .health').value = game.enemy.life;
        document.querySelector('.pl_1 .health').value = game.iam.life;
        document.querySelector('.cardNumber').innerHTML = game.cards;

    }
     
}
