//FUNÇÃO PARA NAVEGAÇÃO DAS TABS...
function TabNavigation() {
    const html = {
        buttons: [...document.querySelector('.tab-links').children],
        contents: [...document.querySelector('.tab-content').children],
        openTab: document.querySelector('[data-open]')
    }

    function hideAllContent() {
        html.contents.forEach(section => {
            section.style.display = 'none'
        });
    };

    function removeAllActiveClass() {
        html.buttons.forEach(tab => {
            tab.className = tab.className.replace(" active", "");
        })
    };

    function showCurrentTab(id) {
        const tabContent = document.getElementById(id);
        tabContent.style.display = 'block';
    };

    function selectTab(event) {
        hideAllContent();
        removeAllActiveClass();

        const target = event.currentTarget;
        showCurrentTab(target.dataset.id);

        target.className += " active";
    }

    function linstenForChange() {
        html.buttons.forEach(tabs => {
            tabs.addEventListener('click', selectTab)
        })
    };

    function init() {
        hideAllContent();
        linstenForChange();

        html.openTab.click();
    };

    return {
        init
    }
};


//FAÇA SEU PEDIDO
const makeOrder = document.querySelector('.icons-nav button');
makeOrder.addEventListener('click' , ()=>{
    window.location.href = '#cardapio'
});


// PREENCHER TABELA COM PEDIDO
const pedidos = [];
var cartQntd = document.querySelector('.icons-nav .fa-shopping-cart span');
function fillTable(pedido, valor) {
    //get table
    const tbody = document.getElementById('tbody');
    tbody.innerText = '';

    pedidos.push({
        qntd: 1,
        pedido: pedido,
        valor: valor,
    });


    pedidos.forEach(e => {
        let tr = tbody.insertRow();
        let td_qnted = tr.insertCell();
        let td_pedido = tr.insertCell();
        let td_valor = tr.insertCell();
        let td_acao = tr.insertCell();

        td_qnted.innerHTML = 1;
        td_pedido.innerText = e.pedido;
        td_valor.innerText = e.valor;
        td_acao.innerHTML = '<i class="fas fa-minus-circle"></i>';
    })
    const buttonRemove = document.querySelectorAll('.cardapio .box-order table tbody i');
    buttonRemove.forEach(e => e.addEventListener('click', () => {
        removePedido(e)
    }))

    function removePedido(element) {
        const linha = element.closest('tr');
        const indexLinha = [...linha.parentNode.children].indexOf(linha);
        linha.parentNode.removeChild(linha);
        let qntdCart = parseInt(cartQntd.textContent);
        cartQntd.innerText = qntdCart - 1;
        pedidos.splice(indexLinha, 1);
    }

    const total = somarPedido(pedidos);
    const spanTotal = document.querySelector('.cardapio .box-order #total');

    spanTotal.innerText = total;


    return pedidos;
}


//FUNÇÃO PARA INTERAÇÃO COM A BOX PARA O PEDIDO DO CLIENTE...
function orderBox() {
    //VARIAVEIS
    const html = {
        cart: document.querySelector('.icons-nav .fa-shopping-cart'),
        tr: document.querySelectorAll('section table tr'),
        buttons: document.querySelectorAll('section table td > button'),
        boxOrder: document.querySelector('.cardapio .content-order'),
        boxChange: document.querySelector('.cardapio .content-change'),
        Btn_boxChange: document.querySelectorAll('.cardapio .content-change button'),
        finishOrder: document.querySelectorAll('.cardapio .box-order .btn-box'),
        clientOrder: '',
    }
    //BATATAS E YAKISOBA
    const adicionais ={
        btnBatatas: document.querySelector('#barca table tr td #addBatata'),
        btnYakisoba: document.querySelector('#barca table tr td #addYakisoba'),
        batatas: document.querySelector('section .add-batata'),
        yakisoba: document.querySelector('section .add-yakisoba'),
        batatasClose: document.querySelector('section .add-batata span'),
        yakisobaClose: document.querySelector('section .add-yakisoba span'),
    }

    var pedido, valorP, valorG;

    //EVENTO AO CLICAR NA LINHA (PEDIDO)
    html.tr.forEach(e => e.addEventListener('click', () => {
        const promotion = JSON.parse(localStorage.getItem('1a65ll3536'));
        if(promotion != null){
            if(promotion.orders == 4){
                alert('PARABENS!!! Esse será seu pedido de numero 5 , ao finalizar seu pedido você irá ganhar uma porção de batata inteiramente grátis!')
                fillTable('Batata Frita (PROMOÇÃO)', 'Grátis')
                let qntdCart = parseInt(cartQntd.textContent);
                cartQntd.innerText = ++qntdCart;
                html.boxOrder.className += ' show';
                html.cart.classList.add('scale');
                setTimeout(() => {
                    html.boxOrder.classList.remove('show');
                    html.cart.classList.remove('scale');
                }, 700);
            }
        }


        if (e.childElementCount == 4 || e.childElementCount == 5) {
            //salva os valores
            pedido = e.children[0].children[0].textContent;
            valorP = e.children[1].textContent;
            valorG = e.children[2].textContent;
            //define valores nos botões da box change
            html.Btn_boxChange[0].children[0].innerText = 'R$' + valorG.replace('G:', '');
            html.Btn_boxChange[1].children[0].innerText = 'R$' + valorP.replace('P:', '');
            //aplica efeito no botão + e faz apaprecer a box change
            html.boxChange.style.display = 'grid';
        } else {
            //salva os valores
            pedido = e.children[0].children[0].textContent;
            var valor = e.children[1].textContent;
            var valor = valor.replace('R$', '')
            //aplica efeito no botão + e faz apaprecer a box change
            html.clientOrder = fillTable(pedido, valor);
            html.boxOrder.className += ' show';
            html.cart.classList.add('scale');
            let qntdCart = parseInt(cartQntd.textContent);
            cartQntd.innerText = ++qntdCart;
            setTimeout(() => {
                html.boxOrder.classList.remove('show');
                html.cart.classList.remove('scale');
            }, 700);
        }
    }));

    //EVENTOS DA BOX PARA ESCOLHER O TAMANHO DO ITEM

    html.Btn_boxChange[0].addEventListener('click', () => {
        //aplica efeito no botão + e faz apaprecer a box change
        if(pedido == 'Batata Frita'){
            adicionais.batatas.style.display = 'block'
        }else if(pedido == 'Prato padrão'){
            adicionais.yakisoba.style.display = 'block'
        }
        html.boxChange.style.display = 'none'
        pedido += ' (G)';
        var valor = valorG.replace('G:', '')
        html.clientOrder = fillTable(pedido, valor);
        html.boxOrder.className += ' show';
        html.cart.classList.add('scale');
        let qntdCart = parseInt(cartQntd.textContent);
        cartQntd.innerText = ++qntdCart;
        setTimeout(() => {
            html.boxOrder.classList.remove('show');
            html.cart.classList.remove('scale');
        }, 700);
        
    })
    html.Btn_boxChange[1].addEventListener('click', () => {
        //aplica efeito no botão + e faz apaprecer a box change
        if(pedido == 'Batata Frita'){
            adicionais.batatas.style.display = 'block'
        }else if(pedido == 'Prato padrão'){
            adicionais.yakisoba.style.display = 'block'
        }
        html.boxChange.style.display = 'none'
        pedido += ' (P)';
        var valor = valorP.replace('P:', '')
        html.clientOrder = fillTable(pedido, valor);
        html.boxOrder.className += ' show';
        html.cart.classList.add('scale');
        let qntdCart = parseInt(cartQntd.textContent);
        cartQntd.innerText = ++qntdCart;
        setTimeout(() => {
            html.boxOrder.classList.remove('show');
            html.cart.classList.remove('scale');
        }, 700);
        
    })

    //ADICIONAIS BATATAS/YAKISOBA
    adicionais.batatasClose.addEventListener('click' , ()=>{
        adicionais.batatas.style.display = 'none'
    })
    adicionais.yakisobaClose.addEventListener('click' , ()=>{
        adicionais.yakisoba.style.display = "none";
    })



    //COMBOS
    const combo = {
        btnCombo: document.querySelectorAll('#combos .content div button'),
        pedidoCombo: document.querySelectorAll('#combos .content div h3'),
    }

    combo.btnCombo.forEach(e => e.addEventListener('click', () => {
        //salva os valores
        pedido = e.closest('div').children[0].textContent;
        var valor = e.closest('div').children[4].textContent.replace('R$', '');
        html.boxOrder.className += ' show';
        html.cart.classList.add('scale');
        let qntdCart = parseInt(cartQntd.textContent);
        cartQntd.innerText = ++qntdCart;
        setTimeout(() => {
            html.boxOrder.classList.remove('show');
            html.cart.classList.remove('scale');
        }, 700);
        html.clientOrder = fillTable(pedido, valor);
    }));


    html.cart.addEventListener('click', () => {
        html.boxOrder.className += ' show2';
    })

    html.finishOrder.forEach(e => e.addEventListener('click', () => {
        const select = document.querySelector('#select');
        if (html.clientOrder != '') {
            if(select.options[select.selectedIndex].textContent == 'Entregar'){
                window.location.href = './src/delivery/delivery.html';
            }else{
                window.location.href = './src/removeLocal/removeLocal.html';
            }
            localStorage.setItem('order', JSON.stringify(html.clientOrder))
        } else {
            alert('Você não fez nenhum pedido')
        }
    }))

    var closeBoxOrder = document.querySelector('.cardapio .box-order #closeBoxOrder');
    closeBoxOrder.addEventListener('click', () => {
        html.boxOrder.classList.remove('show')
        html.boxOrder.classList.remove('show2')
    })

}


//FUNÇÃO SOMA PEDIDO
function somarPedido (pedidos){
    let valorTotal = 0;
    pedidos.forEach(e => {
        if(e.valor == 'Grátis'){
            valorTotal += 0;
        }else{
            valorTotal += parseFloat(e.valor.replace(',' , '.'))
        }
    })
    return valorTotal.toFixed(2);
}


// REDE SOCIAIS
const iconSocial = document.querySelectorAll('.rede-sociais i');
iconSocial.forEach(e => e.addEventListener('click' , ()=>{
    if(e.getAttribute('name') == 'face'){
        window.open('https://www.facebook.com/guiih.phellippe.1');
    }else if(e.getAttribute('name') == 'insta'){
        window.open('https://www.instagram.com/guilherme.phellippe/');
    }
}));


// BOX DICA
const tips = document.querySelector('.cardapio > main .tips');
const btnTips = document.getElementById('confirm');
window.addEventListener('load', () => {
    tips.style.transform = 'scale(1)';
    btnTips.addEventListener('click' , ()=>{
        tips.style.transform = 'scale(.1)';
        setTimeout(()=>{
            tips.closest('.content-tips').classList.toggle('show')
        },200)
    })
    const tabNavigation = TabNavigation();
    orderBox();
    tabNavigation.init();
});


