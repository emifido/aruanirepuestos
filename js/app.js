/*=========================================================
 ARUANI STORE V5
 APP.JS
 PARTE 1
=========================================================*/

/*=========================================================
 CONFIGURACIÓN
=========================================================*/

const CONFIG = {

    archivoProductos: "data/productos.json",

    imagenPorDefecto: "imagenes/productos/sin-foto.webp",

    whatsapp: "5492610000000"

};

/*=========================================================
 VARIABLES GLOBALES
=========================================================*/

let productos = [];

let productosFiltrados = [];

let marcaSeleccionada = "Todas";

let categoriaSeleccionada = "Todas";

/*=========================================================
 ELEMENTOS DEL DOM
=========================================================*/

const contenedorProductos = document.getElementById("productos");

const buscador = document.getElementById("buscar");

const contador = document.getElementById("contador");

const sliderDestacados = document.getElementById("sliderDestacados");

/*=========================================================
 CARGAR PRODUCTOS
=========================================================*/

async function cargarProductos(){

    try{

        const respuesta = await fetch(CONFIG.archivoProductos);

        if(!respuesta.ok){

            throw new Error("No se pudo cargar productos.json");

        }

        productos = await respuesta.json();

        productosFiltrados = [...productos];

        mostrarProductos(productosFiltrados);

        actualizarContador();

        mostrarDestacados();

        console.log("Productos cargados:", productos.length);

    }

    catch(error){

        console.error(error);

        contenedorProductos.innerHTML=`

        <div class="sin-resultados">

            <h2>Error al cargar el catálogo</h2>

            <p>Verifica el archivo productos.json</p>

        </div>

        `;

    }

}

/*=========================================================
 CREAR TARJETA
=========================================================*/

function crearTarjeta(producto){

    const imagen = producto.imagenes?.length

        ? producto.imagenes[0]

        : CONFIG.imagenPorDefecto;

    return `

<div class="producto fade-up">

    ${producto.destacado ? '<div class="badge">DESTACADO</div>' : ""}

    <div class="producto-imagen">

        <img

            src="${imagen}"

            alt="${producto.nombre}"

            loading="lazy"

            onerror="this.src='${CONFIG.imagenPorDefecto}'"

        >

    </div>

    <div class="producto-info">

        <span>

            ${producto.marca}

        </span>

        <h3>

            ${producto.nombre}

        </h3>

        <p>

            ${producto.descripcion}

        </p>

        <div class="producto-datos">

            <div>

                <strong>Código</strong>

                <span>${producto.codigo}</span>

            </div>

            <div>

                <strong>Categoría</strong>

                <span>${producto.categoria}</span>

            </div>

        </div>

        <button

            class="btn-producto"

            data-id="${producto.id}">

            Ver Producto

        </button>

    </div>

</div>

`;

}

/*=========================================================
 MOSTRAR PRODUCTOS
=========================================================*/

function mostrarProductos(lista){

    if(lista.length===0){

        contenedorProductos.innerHTML=`

        <div class="sin-resultados">

            <h2>No encontramos productos.</h2>

            <p>Prueba otra búsqueda.</p>

        </div>

        `;

        return;

    }

    contenedorProductos.innerHTML=

        lista.map(crearTarjeta).join("");

}

/*=========================================================
 CONTADOR
=========================================================*/

function actualizarContador(){

    contador.innerHTML=`

        Mostrando

        <strong>

            ${productosFiltrados.length}

        </strong>

        de

        ${productos.length}

        productos

    `;

}

/*=========================================================
 PRODUCTOS DESTACADOS
=========================================================*/

function mostrarDestacados(){

    if(!sliderDestacados) return;

    const destacados=

        productos.filter(p=>p.destacado);

    sliderDestacados.innerHTML=

        destacados.map(crearTarjeta).join("");

}

/*=========================================================
 INICIO
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    cargarProductos();

});
