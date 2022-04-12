const btnCoin = document.querySelector('.fa-donate');
const contentCoin = document.querySelector('.content-coins');
const boxCoin = document.querySelector('.content-coins .box-coins');
const closeCoin = document.querySelector('.content-coins .box-coins #closeBoxOrder');
const h3Coin = document.querySelector('.content-coins .box-coins h3')
const inputCoin = document.querySelector('.content-coins .box-coins input')
const buttonCoin = document.querySelector('.content-coins .box-coins button');
const spanCoin = document.querySelector('.content-coins .box-coins span:last-of-type');
const content_tips = document.querySelector('main .content-tips')
const i = document.querySelector('header .header .icons-nav > i:first-of-type');

const infoOrders = JSON.parse(localStorage.getItem('1a65ll3536'));
const param = new URLSearchParams(window.location.search)
if(infoOrders != null){
    i.children[0].innerHTML = parseInt(infoOrders.orders);
    //CLOSE CONTENT COIN
if (infoOrders.promotion && param.get('p') != null) {
    content_tips.classList.toggle('show')
    contentCoin.classList.toggle('showCoin');
}
closeCoin.addEventListener('click', () => {
    contentCoin.classList.toggle('showCoin');
})


buttonCoin.addEventListener('click', validaCoin)

function validaCoin() {
    //captura o valor do condigo inserido no input
    let code = inputCoin.value;

    if (code == 'sb2022' || code == 'SB2022') {
        contentCoin.classList.toggle('showCoin');
        if (infoOrders.orders <= infoOrders.totalOrders) {
            let orders = ++infoOrders.orders
            i.children[0].innerHTML = infoOrders.orders;
            localStorage.setItem('1a65ll3536', JSON.stringify({ totalOrders: infoOrders.totalOrders, orders: orders, promotion: false }));
            alert('Com 5 pedidos realizador no sharks burguer você ganha uma porção de batata frita, Você possue: ' + orders);
        } else {
            alert("Erro ao processar codigo promocionar, não temos registro suficientes de seu pedido em nosso sistema")
        }
    } else {
        alert('code errado!')
    }
    inputCoin.value = ''
}

}

