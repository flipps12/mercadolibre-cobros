const nickname = document.getElementById('nickname');
const planContainer = document.getElementById('planContainer');
const comprasDiv = document.getElementById('compras');
const listPlayer = document.getElementById('listPlayer');
const whiteListPlayer = document.getElementById('whiteListPlayer');

const protected = async () => {
    const resultProtected = await fetch(`/api/protected`);
    const data = await resultProtected.json();

    console.log(resultProtected, 'a')

    console.log(data)
    if (data.nickname) {
        nickname.textContent = data.nickname;
    } else {
        window.location.href = '/login'
        console.log('Nickname no encontrado en la respuesta');
    }
    return data;
};

const products = async () => {
    const resultProducts = await fetch(`/api/products`);
    const data = await resultProducts.json();
    console.log(data)
    for (i in data) {
        console.log(data[i][0])
        let planSubContainer = document.createElement('div');
        planSubContainer.setAttribute('class', 'payContainer');
        let button = document.createElement('button');
        let precio = document.createElement('div');
        let name = document.createElement('div');
        button.textContent = 'Comprar';
        button.setAttribute('onclick', `checkout(${data[i][0].id})`);
        button.setAttribute('class', 'payButton');
        name.textContent = data[i][0].title;
        name.setAttribute('class', 'payTitle');
        precio.textContent = `${data[i][0].unit_price} ${data[i][0].currency_id}`;
        precio.setAttribute('class', 'payPrecio');
        planSubContainer.appendChild(name);
        planSubContainer.appendChild(precio);
        planSubContainer.appendChild(button);
        planContainer.appendChild(planSubContainer);
    };
    return data;
};

const compras = async () => {
    const nicknameValue = await protected();
    const resultProducts = await fetch(`/api/compras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ nickname: await nicknameValue.nickname }),
    });
    const data = await resultProducts.json();
    console.log(data.data[0].plan)
    for (i in data.data[0].plan) {
        console.log(data.data[0].plan[i])
        let exp = new Date(data.data[0].plan[i].exp);
        let hoy = new Date();
        console.log(exp.getDate(), exp.getMonth(), exp.getFullYear());
        let SubContainer = document.createElement('div');
        SubContainer.setAttribute('class', 'compraContainer');
        //     let button = document.createElement('button');
        let expiracion = document.createElement('div');
        let name = document.createElement('div');
        let status = document.createElement('div');
        //     button.textContent = 'Comprar';
        //     button.setAttribute('onclick', `checkout(${data[i][0].id})`);
        //     button.setAttribute('class', 'payButton');
        name.textContent = 'Plan: ' + data.data[0].plan[i].plan;
        status.textContent = exp > hoy ? 'Estado: En uso' : 'Estado: Expirado'
        //     name.setAttribute('class', 'payTitle');
        expiracion.textContent = `Exp: ${exp.getDate()}/${exp.getMonth() + 1}/${exp.getFullYear()}`;
        //     precio.setAttribute('class', 'payPrecio');
        SubContainer.appendChild(name);
        SubContainer.appendChild(expiracion);
        SubContainer.appendChild(status);
        comprasDiv.appendChild(SubContainer);
    };
    return data;
};

const checkout = async (id) => {
    const nicknameValue = await protected();
    const result = await fetch(`/process_payment/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ nickname: await nicknameValue.nickname }),
    });
    console.log(await nicknameValue.nickname)
    const data = await result.json();
    console.log(data)
    window.location.href = data.init_point
}

const statusPlayer = async () => {
    const result = await fetch(`/api/dataplayer`);
    const data = await result.json();
    console.log(data)
    whiteListPlayer.textContent = `Whitelist: ${data[1] ? 'Dentro' : 'Fuera'}`
    listPlayer.textContent = `En server: ${data[0] ? 'Online' : 'Offline'}`
}

statusPlayer();
protected();
products();
compras();