/* Requires e Imports */
const e = require("express");
const express = require("express");
const { Router } = express;
const router = Router();


let productos = [{
    nombre: "Lionel Messi",
    precio: 1000,
    thumbnail: "https://pbs.twimg.com/media/E5_Q6jQWUAEZKa4.jpg:large",
    id: 0,
    timestamp: Date.now()
  },{
    nombre: "Neymar Jr",
    precio: 300,
    thumbnail: "https://dtvsportsimages.akamaized.net/images/3cefc25b-9a1e-4808-bacf-afce53222823?width=726",
    id: 1,
    timestamp: Date.now()
  },
  {
    nombre: "Cristiano Ronaldo",
    precio: 500,
    thumbnail: "https://phantom-marca.unidadeditorial.es/4fce064c5042ee0c9e5c2877e34cc8ff/resize/1320/f/jpg/assets/multimedia/imagenes/2022/05/14/16525197338667.png",
    id: 2,
    timestamp: Date.now()
  }
]

  let i = 3;

let admin = true


/* Get */
router
.get('/', (req, res) => {
    try {
        res.render("partials/main")
    } catch (e) {
        res.send({error : e.message})
    }
})
router
    .route('/productos')
    .get((req, res) => {
        if (productos.length > 0) {
            res.render("partials/productos", {productos})
        } else {
            res.render('partials/error')
        }
    })
    .post((req, res) =>{
        
        const {nombre, precio, thumbnail} = req.body
        if (admin) {
            productos.push({'nombre': nombre, 'precio': precio, 'thumbnail': thumbnail, 'id': i++})
            console.log(productos);
            res.status(201).redirect('/')
            
        }else {
            res.render('partials/errorProd')
        }
        
    });

router
    .route('/productos/:id')
    .get((req, res) => {
        if (admin) {
            
            try {
                let numero = Number(req.params.id)
                if (isNaN(numero) || numero <= 0) {
                    throw new Error('Error, producto no encontrado')
                    
                } else {
                    let producto = productos.find(x => x.id === numero)
                    res.status(200).json(producto)
                    
                }
            } catch (e) {
                res.send({error: e.message})
            }
            
        }else{
            res.render('partials/errorProd')
        }
    })
    .put((req, res) => {
        if (admin) {
            
            try {
                //Destructuro
                const {nombre, precio, thumbnail} = req.body
                //Convierto el id a numero
                let numero = Number(req.params.id)
                //Busco si el id pertenece a algun producto
                let product = productos.find (x => x.id === numero)
                //Si el id pertenece a algun producto
                if (product != undefined){
                    if (nombre != undefined) {
                        //Actualizo el nombre
                        product.nombre = nombre
                        //Mando la respuesta
                        res.status(200).json(product)
                    }
                    if (precio != undefined) {
                        //Actualizo el precio
                        product.precio = precio
                        //Mando la respuesta
                        res.status(200).json(product)
                    }
                    if(thumbnail != undefined){
                         //Actualizo el thumbnail
                         product.thumbnail = thumbnail
                         //Mando la respuesta
                         res.status(200).json(product)
                    }
                } else {
                    throw new Error('Error, producto no encontrado')
                }
            } catch (error) {
                res.send({ error: e.message})
            }
            
        } else {
            res.render('partials/errorProd')
        }
        
    })
    .delete((req, res) => {
        if (admin) {
            //Convierto el id a numero
            let numero = Number(req.params.id)
            //Creo el array de productos que voy a modificar para luego mostrar
            let newProductos = [...productos]
            //Busco el index con el id que me llego
            let index = productos.findIndex(x => x.id === numero)
            //Si el index es mayor o igual a 0
            if (index >= 0){
                //Elimino el producto
                newProductos.splice(index, 1)
                //Envio la respuesta
                res.status(200).json(newProductos)
            }else {
                throw new Error('Error, producto no encontrado')
            }
            
        } else {
            res.render('partials/errorProd')
        }
        
    })




/* Carrito */

let carritos = []
let o = 1

router
    .route('/carrito')
    .post((req, res) => {
        const {nombre, precio, thumbnail, descripcion, stock} = req.body
        let carrito = {id: o++, timestamp: Date.now(), productos: [{id: i++, timestamp: Date.now(), nombre: nombre, precio: precio, thumbnail: thumbnail, descripcion: descripcion, stock: stock}]}
        carritos.push(carrito)
        res.send('El id de tu carrito es: ' + carrito.id)
        
    })
router    
    .route('/carrito/:id')
    .delete((req, res) => {
        let carritoId = Number(req.params.id);
        let newCarritos = [...carritos]
        let index = carritos.findIndex(x => x.id === carritoId)
        if (index >= 0){
            newCarritos.splice(index, 1)
            res.status(200).json(newCarritos)
        }else {
            throw new Error('Error, carrito no encontrado')
        }
    })
router
    .route('/carrito/:id/productos')
    .get((req, res) => {
        let carritoId = Number(req.params.id);
        let carrito = carritos.find(x => x.id === carritoId)
        if (carrito != undefined){
            res.send(carrito.productos)
        }else{
            throw new Error('Error, carrito no encontrado')
        }

    })
router
    .route('/carrito/:id/productos/:id_prod')
    .post((req, res) => {
        const {id, id_prod} = req.params
        let carritoId = Number(id)
        let prodId = Number(id_prod)
        let carrito = carritos.find(x => x.id === carritoId)
        let producto = productos.find(x => x.id === prodId)
        let newProductos = [...carrito.productos, producto]
        carrito.productos = newProductos
        res.send(carrito)
        
    })
    .delete((req, res) => {
        const {id, id_prod} = req.params
        let carritoId = Number(id)
        let prodId = Number(id_prod)
        let carrito = carritos.find(x => x.id === carritoId)
        let newCarritoProd = carrito.productos
        let index = newCarritoProd.findIndex(x => x.id === prodId)
        
        if (index >= 0){
            newCarritoProd.splice(index, 1)
            carrito.productos = newCarritoProd
            res.send(carrito)
        }else {
            throw new Error('Error, producto no encontrado')
        }
    })
   



module.exports = {router, productos}