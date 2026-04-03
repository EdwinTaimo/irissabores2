// CONFIGURAÇÃO FIREBASE (Cole seus dados aqui)
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "iris-sabores.firebaseapp.com",
  databaseURL: "https://iris-sabores-default-rtdb.firebaseio.com",
  projectId: "iris-sabores",
  storageBucket: "iris-sabores.appspot.com"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 1. FUNÇÃO DE PEDIDO (Passo 1: Cliente -> Restaurante)
function enviarPedido() {
    const pedido = {
        item: "Pizza Margarida Média",
        status: "Pendente",
        clienteConfirmou: false,
        entregaConfirmada: false,
        localizacao: { lat: -19.8315, lng: 34.8368 } // Exemplo Beira
    };
    db.ref('pedidos/').push(pedido);
    alert("Pedido enviado! Aguarde a faturação do restaurante.");
}

// 2. RASTREIO GPS (Passo 2: Delivery)
function iniciarRastreio(pedidoId) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((pos) => {
            db.ref('pedidos/' + pedidoId + '/entrega').update({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
        });
    }
}

// 3. CONFIRMAÇÃO FINAL (Passo 3: Cliente)
function confirmarRecebimento(pedidoId) {
    const estrelas = prompt("Avalie de 1 a 5 estrelas:");
    db.ref('pedidos/' + pedidoId).update({
        status: "Concluído",
        avaliacao: estrelas,
        clienteConfirmou: true
    });
}

// GESTÃO DE STOCK
function baixarStock(produtoId) {
    db.ref('stock/' + produtoId).transaction((atual) => {
        if (atual > 0) return atual - 1;
        alert("PRODUTO ACABADO!");
        return 0;
    });
}


const menuData = {
    pizzas_medias: [
        { id: 10, nome: "Pizza Margarida Média", preco: 400 },
        { id: 11, nome: "Pizza Vegetariana Média", preco: 500 },
        { id: 18, nome: "Pizza de Camarão Média", preco: 730 }
    ],
    refeicoes: [
        { nome: "1/4 Frango (Arroz, Batata e Salada)", preco: 400 },
        { nome: "Picanha (Arroz, Batata e Salada)", preco: 1100 },
        { nome: "Arroz de Marisco", preco: 2900 }
    ],
    bebidas: [
        { nome: "Redbull", preco: 120 },
        { nome: "Coca-Cola", preco: 70 },
        { nome: "Sumo de Manga (Natural)", preco: 250 }
    ]
};
