const socket = io.connect();



function renderizarTabla(data) {
    const html = data
    .map((elem) =>{
        return `<tr>
        <th>${elem.nombre}</th>
        <th>${elem.precio}</th>
        <th><img src=${elem.thumbnail} width='60px' height="40px"></th>
    </tr>`
    }).join(" ");
    document.getElementById('productos').innerHTML = html
}

socket.on('producto', function(data) {renderizarTabla(data);});


//Mensajeria

function renderizarMensajes(data) {
    let dt = new Date()
    const html = data.map((elem) => {
        return(`<div>
        <p style="color:green;font-style: italic"><strong style="color:blue">${elem.email}</strong>
        <span style="color:brown">[${
            (dt.getMonth()+1).toString().padStart(2, '0')}/${
            dt.getDate().toString().padStart(2, '0')}/${
            dt.getFullYear().toString().padStart(4, '0')} ${
            dt.getHours().toString().padStart(2, '0')}:${
            dt.getMinutes().toString().padStart(2, '0')}:${
            dt.getSeconds().toString().padStart(2, '0')}]</span>
            ${elem.message}</p>
            `)
    }).join(" ")
    document.getElementById('mensajes').innerHTML = html
}

socket.on('messages', function(data){renderizarMensajes(data)});

function addMessage(e) {
    const mensaje = {
        email: document.getElementById('username').value,
        message: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);
    return false;
}
