const tbody = document.getElementById('end-order');



function fill_table() {
    var order = JSON.parse(localStorage.getItem('order'))
    order.forEach(e => {
        let tr = tbody.insertRow();
        let td_qnted = tr.insertCell();
        let td_pedido = tr.insertCell();
        let td_valor = tr.insertCell();
        td_qnted.innerHTML = `<input type='number' value='${e.qntd}' max='99' min='1'>`;
        td_pedido.innerText = e.pedido;
        td_valor.innerText = e.valor;
    });
    localStorage.removeItem('order');

}

function calcValor() {
    var valor = 0;
    for (let n = 0; n < tbody.children.length; n++) {
        valor += parseFloat(tbody.children[n].children[2].textContent.replace(',' , '.'))
    }
    document.querySelector('.total p span').innerHTML = valor.toFixed(2);
    return parseFloat(valor).toFixed(2);
}

fill_table();
const valor = calcValor();

//EVENTO RAIDO BUTTON

var radio = document.querySelectorAll('input[name="pay"]');
var opt_payments = document.querySelector('.options-payments')

var retorno = 'nullo'; 
function payments() {
    radio.forEach(e => e.addEventListener('change', () => {
        if (opt_payments.classList.value == 'options-payments') {
            opt_payments.classList.add('show-payments')
        }
        if (e.value == 'Dinheiro') {
            opt_payments.style.flexFlow = 'column nowrap'
            opt_payments.innerHTML = ''
            var trocado = document.createElement('h3');
            var trocadoInput = document.createElement('input');
            opt_payments.appendChild(trocado);
            opt_payments.appendChild(trocadoInput);
            opt_payments.children[0].innerHTML = 'Precisa de troco?'
            opt_payments.children[1].setAttribute('placeholder', "Deixe em branco caso não precise")
            opt_payments.children[1].setAttribute('type', "number")
            opt_payments.children[1].style.width = "70%"
            opt_payments.children[1].style.height = "40px"
            opt_payments.children[1].style.textAlign = "center"
            opt_payments.children[1].addEventListener('focusout' , ()=>{
                localStorage.setItem('trc', opt_payments.children[1].value);
            })
            retorno = 'dinheiro'
            
        } else if (e.value == 'Cartão') {
            opt_payments.style.flexFlow = 'row nowrap'
            opt_payments.innerHTML = ''
            var credito = document.createElement('a');
            var debito = document.createElement('a');
            var outro = document.createElement('a');
            opt_payments.appendChild(credito);
            opt_payments.appendChild(debito);
            opt_payments.appendChild(outro);
            opt_payments.children[0].innerHTML = '<i class="far fa-credit-card"></i>' + ' Crédito'
            opt_payments.children[1].innerHTML = '<i class="fas fa-credit-card"></i>' +' Débito'
            opt_payments.children[2].innerHTML = '<i class="fab fa-cc-apple-pay"></i>' +' Outro'
            retorno = ''
        }
        else {
            opt_payments.innerHTML = ''
            opt_payments.style.flexFlow = 'column nowrap'
            var textChave = document.createElement('h3');
            var tipoChave = document.createElement('p');
            var nomeChave = document.createElement('p');
            var comprov = document.createElement('span');

            opt_payments.appendChild(textChave);
            opt_payments.appendChild(tipoChave);
            opt_payments.appendChild(nomeChave);
            opt_payments.appendChild(comprov);
            
            opt_payments.children[0].innerHTML = 'Chave: '
            opt_payments.children[1].innerHTML = 'CNPJ = 25.111.399/0001-09'
            opt_payments.children[2].innerHTML = 'charles humberto de melo'
            opt_payments.children[3].innerHTML = 'Envie o comprovante no whatsapp para confirmar seu pedido.'
            retorno = ' (aguarde o comprovante)'
        }
    }))
}
payments();

//FUNÇÃO QUE VALIDA OS PEDIDOS
function validaOrder(number) {
    if (number != null) {
        let total = parseInt(number.totalOrders);
        return ++total
    } else {
        return 1;
    }
}

// ENVIA O PEDIDO PARA O WHATSAPP DO SHARKS
function sendMenssage() {
    if(retorno == 'dinheiro'){
        retorno = "(R$" + localStorage.getItem('trc')+ ")"
    }
    var number = JSON.parse(localStorage.getItem('1a65ll3536'));
    const formDado = {
        nome: document.querySelector('.formulario form fieldset:first-child input:first-of-type').value,
        telefone: document.querySelector('.formulario form fieldset:first-child .tell ').value,
        telefoneOpcional: document.querySelector('.formulario form fieldset:first-child .tell:last-of-type ').value,
        orders: validaOrder(number),
    }
    const formPedido = {
        qntd: tbody.children[0].children[0].children[0].value,
        pedido: tbody.children[0].children[1].textContent,
        pagamento: document.querySelector('input[name="pay"]:checked').value  + retorno,
        valor: 'R$' + valor,
        obs: document.querySelector('.formulario form fieldset textarea').value,
        enviar: document.querySelector('.formulario form fieldset:first-child input[type="button"]')
    }

    const allOrder = [];
    for (let n = 0; n < tbody.childElementCount; n++) {
        allOrder.push('%0A' + tbody.children[n].children[0].children[0].value + " " + tbody.children[n].children[1].textContent)
    }
    var date = new Date();
    let nmrOrders = 0;
    if (number != null) {
        if(number.orders == 4) nmrOrders = 0
        else nmrOrders = number.orders; 
    }
    localStorage.setItem('1a65ll3536', JSON.stringify({ totalOrders: formDado.orders, orders: nmrOrders, promotion: true }));

    if (formDado.nome != '' && formDado.telefone != '') {
        const menssage = `
------------------------------%0A\n
*SHARKS BURGUER* - ${date.getHours()}:${date.getMinutes()}%0A\n
Número de pedido(s): ${formDado.orders}%0A\n
------------------------------%0A\n
*PEDIDO:*${allOrder}%0A%0A\n
*VALOR:* ${formPedido.valor}%0A\n
*PAGAMENTO:* ${formPedido.pagamento}%0A\n
*OBS:* %0A\n${formPedido.obs}%0A\n
------------------------------%0A\n
*DADOS DO CLIENTE*%0A\n
------------------------------%0A\n
Retirar no local%0A\n
------------------------------%0A\n
*NOME:*%0A\n${formDado.nome}%0A\n
*TELEFONE:*%0A\n${formDado.telefone} - ${formDado.telefoneOpcional}%0A\n
--------------------------------`;
        window.open("https://api.whatsapp.com/send?phone=553588848379&text=" + menssage);
    } else {
        alert('preencha todos os campos com seus dados')
    }

    function init() {
    }

    return {
        init
    };
}

if (window.location.href.indexOf('removeLocal.html') >= 0) {
    document.querySelector('.formulario form fieldset input[type="button"]').
        addEventListener('click', sendMenssage);
}
