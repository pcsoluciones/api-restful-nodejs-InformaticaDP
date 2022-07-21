var express = require('express')
var mysql = require('mysql')
var cors = require('cors')

var app = express()     // para acceder a todos los métodos y propiedades de express

app.use(express.json())   // especificamos q usaremos JSON

app.use(cors())         // utilizamos cors para poder utilizar nuestra API

// Establecemos los parámetros de conexión a mysql
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
})

// probamos la conexión
conexion.connect( function(error){
    if (error){
        throw error
    } else {
        console.log("¡Conexión exitosa a la base de datos!")
    }
})



// Configuramos las rutas
app.get('/', function(req, res) {
    res.send('Ruta de Inicio en Navegador')
})

// Mostrar todos los artículos
app.get('/api/articulos', (req, res) => {
    conexion.query('SELECT * FROM articulos', (error, filas) => {
        if (error){
            throw error
        } else {
            res.send(filas)
        }
    })
})

// Mostrar un SOLO artículo
app.get('/api/articulos/:id', (req, res) => {
    conexion.query('SELECT * FROM articulos WHERE id = ? ', [req.params.id], (error, fila) => {
        if (error){
            throw error
        } else {
            res.send(fila)
            // res.send(fila[0].descripcion)   // si queremos mostrar un campo específico
        }
    })
})


// Agregar un articulo
app.post('/api/articulos', (req, res) => {
    let data = {
        descripcion: req.body.descripcion,
        precio: req.body.precio,
        stock: req.body.stock
    }
    let sql = "INSERT INTO articulos SET ?"

    conexion.query(sql, data, function(error, results) {
        if (error) {
            throw error 
        } else {
            res.send(results)
        }
    })
})


// Editar un artículo
app.put('/api/articulos/:id', (req, res) => {
    let id = req.params.id
    let descripcion = req.body.descripcion
    let precio = req.body.precio
    let stock = req.body.stock

    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?"

    conexion.query(sql, [descripcion, precio, stock, id], (error, results) => {
        if (error) {
            throw error 
        } else {
            console.log("Editado correctamente")
            res.send(results)
        }
    })
})



// Eliminar artículo
app.delete('/api/articulos/:id', (req, res) => {
    conexion.query('DELETE FROM articulos WHERE id = ? ', [req.params.id], (error, fila) => {
        if (error){
            throw error
        } else {
            console.log("Eliminado correctamente")
            res.send(fila)
        }
    })
})


const puerto = process.env.PUERTO || 3000       // en caso no este disponible PUERTO se ejecuta en 3000

app.listen(puerto, function() {      
    console.log("Servidor Ok en puerto: "+puerto)
})

