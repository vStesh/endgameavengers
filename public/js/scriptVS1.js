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
    startGameBtn.addEventListener('click', backToStart)


    let socket = io('/game');
    let game = {};

    // socket.emit('getStatus', document.cookie);
    // socket.on('getStatus', (message) => {
    //     console.log(message);
    //     if (message.status) {
    //         let enemy = message.game.enemy;
    //         let iam = message.game.iam;
    //         document.querySelector('.img-box').innerHTML = `<img src="${enemy.avatar}" alt="{{text}}" class="avatar" draggable="false">`;
    //         document.querySelector('.login2').innerHTML = enemy.login;
    //         document.querySelector('.life-enemy').innerHTML = enemy.life;
    //         document.querySelector('.life-iam').innerHTML = iam.life;
    //         document.querySelector('.pl_2 .health').value = enemy.life;
    //         document.querySelector('.pl_1 .health').value = iam.life;
    //         document.querySelector('#render-start').outerHTML = '';
    //
    //         renderCards(JSON.parse(message.game.hand));
    //         initSy();
    //     }
    // });

    // socket.on('joinGame', (message) => {
    //     if (message.status) {
    //         console.log(message);
    //         document.cookie = `gameToken=${message.gameToken} ; path=/; max-age=3600`;
    //         window.location.assign('/');
    //     }
    //     console.log('Message from server: ', message);
    //
    // });

    // function endGame(e) {
    //     e.preventDefault()
    //     socket.emit('endGame', document.cookie);
    //     document.cookie = `gameToken=1 ; path=/; max-age=0`;
    //     window.location.assign('/');
    // }

    // function closeModal() {
    //     modalBlock.classList.add('hidden');
    //     endGameBtn.classList.add('hidden');
    //     startGameBtn.classList.remove('hidden');
    //     startGameBtn.classList.add('show');
    //
    // }
    // function backToStart() {
    //     window.location.assign('/');
    // }




    // async function startGame(e) {
    //
    //     console.log(e.target.dataset.token);
    //     socket.emit('startgame', e.target.dataset.token);
    //
    //     await socket.on('startgame', (message) => {
    //         if (message.status) {
    //             document.querySelector('#render-start-w').innerHTML = `
    //             <div>Game is starting: id: ${message.game.id}</div>
    //             <div>Waiting for enemy</div>
    //             <div>Send link to your enemy</div>
    //             <div class="copy-text" onclick="${copyLink()}">${window.location + 'game/join?token=' + message.game.id + ':' + message.game.token}</div>
    //             <div class="copy-btn" onclick="${copyLink()}">Copy</div>
    //             `;
    //             //Создать куки - userToken= e.target.dataset.token
    //             // document.querySelector('.copy-btn').addEventListener('click', copyLink);
    //         }
    //         console.log('Message from server: ', message);
    //
    //     });
    //
    // }
    // function copyLink() {
    //     let copyText = document.querySelector('.copy-text');
    //     // copyText.focus()
    //     // copyText.select();
    //     document.execCommand('copy');
    //     console.log('fff');
    // }




    // async function joinGame(e) {
    //     console.log(e.target.dataset.token);
    //     socket.emit('joinGame', e.target.dataset.token);
    // }
    //
    let her = [{
        "id": 1,
        "name": "Wolvarine",
        "image": "Wolverine.png",
        "cost": 80,
        "attack": 50,
        "defence": 50
    },
    {
        "id": 2,
        "name": "Dazzler",
        "image": "Alison_Blaire.jpg",
        "cost": 30,
        "attack": 30,
        "defence": 20
    },
    {
        "id": 3,
        "name": "Iron Man",
        "image": "Anthony_Stark.jpg",
        "cost": 40,
        "attack": 40,
        "defence": 60
    }];
    renderCards(her)
    //
    // //рендер карт
    // function renderCards(hand) {
    //     hand.forEach(hero => {
    //         card += `
    //         <div class="block" draggable="true">
    //         <div class="hero_id" style='display:none'>${hero.id}</div>
    //         <div class="hero_name" style='display:none'>${hero.name}</div>
    //         <div class="cost">$${hero.cost}</div>
    //         <img src="/images/${hero.image}">
    //         <div class="power">
    //         <div class="attack">${hero.attack}</div>
    //         <div class="defence">${hero.defence}</div>
    //         </div></div>`;
    //     });
    //     root.innerHTML = card;
    // }

}
