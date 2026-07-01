/*=========================================================
    ARUANI STORE V6
    APP.JS
==========================================================*/

"use strict";

/*=========================================================
CONFIGURACIÓN
=========================================================*/

const CONFIG = {

    archivoProductos: "data/productos.json",

    imagenPorDefecto: "imagenes/productos/sin-foto.webp",

    whatsapp: "5492610000000",

    velocidadSlider: 4000,

    animacionTarjetas: 60

};

/*=========================================================
ESTADO DE LA APLICACIÓN
=========================================================*/

const APP = {

    productos: [],

    productosFiltrados: [],

    productoActual: null,

    filtros:{

        texto:"",

        marca:"Todas",

        categoria:"Todas",

        ordenar:"nombre"

    }

};

/*=========================================================
ELEMENTOS DEL DOM
=========================================================*/

const DOM = {

    productos: document.getElementById("productos"),

    destacados: document.getElementById("sliderDestacados"),

    buscador: document.getElementById("buscar"),

    contador: document.getElementById("contador"),

    ordenar: document.getElementById("ordenar"),

    modal: document.getElementById("lightbox"),

    modalContenido: document.getElementById("lightboxContenido"),

    btnTop: document.getElementById("btnTop"),

    loader: document.getElementById("loader"),

    btnMenu: document.getElementById("btnMenu"),

    menu: document.getElementById("menu"),

    overlayMenu: document.getElementById("overlayMenu")

};

/*=========================================================
UTILIDADES
=========================================================*/

const Utils={

    formatearTexto(texto){

        if(!texto) return "";

        return texto.toString().toLowerCase().trim();

    },

    mostrarLoader(){

        if(DOM.loader){

            DOM.loader.style.display="flex";

        }

    },

    ocultarLoader(){

        if(DOM.loader){

            DOM.loader.style.display="none";

        }

    },

    mostrarToast(texto){

        const toast=document.getElementById("toast");

        const span=document.getElementById("toastTexto");

        if(!toast || !span) return;

        span.textContent=texto;

        toast.classList.add("mostrar");

        setTimeout(()=>{

            toast.classList.remove("mostrar");

        },2500);

    }

};

/*=========================================================
INICIO
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    console.clear();

    console.log("%cARUANI STORE V6",

        "color:#f39c12;font-size:18px;font-weight:bold;");

    console.log("Inicializando sistema...");

});
/*=========================================================
CARGAR PRODUCTOS
=========================================================*/

async function cargarProductos() {

    Utils.mostrarLoader();

    try {

        const respuesta = await fetch(CONFIG.archivoProductos);

        if (!respuesta.ok) {

            throw new Error("No se pudo leer productos.json");

        }

        APP.productos = await respuesta.json();

        APP.productosFiltrados = [...APP.productos];

        console.log("Productos cargados:", APP.productos.length);

        renderCatalogo();

        renderDestacados();

        actualizarContador();

    } catch (error) {

        console.error(error);

        mostrarErrorCatalogo();

    } finally {

        Utils.ocultarLoader();

    }

}

/*=========================================================
RENDER CATÁLOGO
=========================================================*/

function renderCatalogo() {

    if (!DOM.productos) return;

    if (APP.productosFiltrados.length === 0) {

        DOM.productos.innerHTML = `

            <div class="sin-resultados">

                <i class="fas fa-box-open"></i>

                <h2>No encontramos productos</h2>

                <p>Prueba otra búsqueda.</p>

            </div>

        `;

        return;

    }

    DOM.productos.innerHTML = APP.productosFiltrados

        .map(crearTarjetaProducto)

        .join("");

}

/*=========================================================
RENDER DESTACADOS
=========================================================*/

function renderDestacados() {

    if (!DOM.destacados) return;

    const destacados = APP.productos.filter(

        producto => producto.destacado

    );

    DOM.destacados.innerHTML = destacados

        .map(crearTarjetaProducto)

        .join("");

}

/*=========================================================
CONTADOR
=========================================================*/

function actualizarContador() {

    if (!DOM.contador) return;

    DOM.contador.innerHTML = `

        Mostrando

        <strong>${APP.productosFiltrados.length}</strong>

        de

        ${APP.productos.length}

        productos

    `;

}

/*=========================================================
ERROR CATÁLOGO
=========================================================*/

function mostrarErrorCatalogo() {

    if (!DOM.productos) return;

    DOM.productos.innerHTML = `

        <div class="sin-resultados">

            <i class="fas fa-circle-exclamation"></i>

            <h2>Error al cargar productos</h2>

            <p>

                Verifica el archivo

                <strong>productos.json</strong>

            </p>

        </div>

    `;

}
/*=========================================================
CREAR TARJETA DE PRODUCTO
=========================================================*/

function crearTarjetaProducto(producto){

    const imagen = producto.imagen && producto.imagen !== ""
        ? producto.imagen
        : CONFIG.imagenPorDefecto;

    const destacado = producto.destacado
        ? `<span class="badge-destacado">
                <i class="fas fa-star"></i>
                Destacado
           </span>`
        : "";

    return `

    <article class="producto fade-in">

        ${destacado}

        <div class="producto-imagen">

            <img
                src="${imagen}"
                alt="${producto.nombre}"
                loading="lazy"
                onerror="this.src='${CONFIG.imagenPorDefecto}'">

        </div>

        <div class="producto-info">

            <span class="producto-marca">

                ${producto.marca}

            </span>

            <h3>

                ${producto.nombre}

            </h3>

            <p class="producto-codigo">

                Código: ${producto.codigo}

            </p>

            <p class="producto-categoria">

                ${producto.categoria}

            </p>

            <div class="producto-botones">

                <button
                    class="btn-ver"
                    onclick="abrirProducto(${producto.id})">

                    <i class="fas fa-eye"></i>

                    Ver Detalle

                </button>

                <button
                    class="btn-whatsapp"
                    onclick="consultarWhatsApp(${producto.id})">

                    <i class="fab fa-whatsapp"></i>

                    Consultar

                </button>

            </div>

        </div>

    </article>

    `;

}

/*=========================================================
BUSCAR PRODUCTO POR ID
=========================================================*/

function obtenerProducto(id){

    return APP.productos.find(producto=>producto.id==id);

}

/*=========================================================
PRODUCTOS DESTACADOS
=========================================================*/

function obtenerDestacados(){

    return APP.productos.filter(producto=>producto.destacado);

}

/*=========================================================
TOTAL PRODUCTOS
=========================================================*/

function totalProductos(){

    return APP.productos.length;

}
/*=========================================================
BUSCADOR
=========================================================*/

function buscarProductos(texto){

    APP.filtros.texto = Utils.formatearTexto(texto);

    aplicarFiltros();

}

/*=========================================================
APLICAR TODOS LOS FILTROS
=========================================================*/

function aplicarFiltros(){

    APP.productosFiltrados = APP.productos.filter(producto=>{

        const coincideTexto =

            APP.filtros.texto === "" ||

            Utils.formatearTexto(producto.nombre).includes(APP.filtros.texto) ||

            Utils.formatearTexto(producto.codigo).includes(APP.filtros.texto) ||

            Utils.formatearTexto(producto.marca).includes(APP.filtros.texto);

        const coincideMarca =

            APP.filtros.marca === "Todas" ||

            producto.marca === APP.filtros.marca;

        const coincideCategoria =

            APP.filtros.categoria === "Todas" ||

            producto.categoria === APP.filtros.categoria;

        return coincideTexto && coincideMarca && coincideCategoria;

    });

    ordenarProductos(APP.filtros.ordenar);

}

/*=========================================================
ORDENAR PRODUCTOS
=========================================================*/

function ordenarProductos(tipo){

    APP.filtros.ordenar = tipo;

    switch(tipo){

        case "nombre":

            APP.productosFiltrados.sort((a,b)=>

                a.nombre.localeCompare(b.nombre));

            break;

        case "marca":

            APP.productosFiltrados.sort((a,b)=>

                a.marca.localeCompare(b.marca));

            break;

        case "codigo":

            APP.productosFiltrados.sort((a,b)=>

                a.codigo.localeCompare(b.codigo));

            break;

        case "destacados":

            APP.productosFiltrados =

                APP.productosFiltrados.filter(p=>p.destacado);

            break;

    }

    renderCatalogo();

    actualizarContador();

}

/*=========================================================
EVENTOS DEL BUSCADOR
=========================================================*/

if(DOM.buscador){

    DOM.buscador.addEventListener("input",(e)=>{

        buscarProductos(e.target.value);

    });

}

/*=========================================================
EVENTOS CATEGORÍAS
=========================================================*/

document.querySelectorAll(".filtros li").forEach(item=>{

    item.addEventListener("click",()=>{

        document.querySelectorAll(".filtros li")

            .forEach(li=>li.classList.remove("activo"));

        item.classList.add("activo");

        APP.filtros.categoria = item.dataset.categoria;

        aplicarFiltros();

    });

});

/*=========================================================
EVENTOS MARCAS
=========================================================*/

document.querySelectorAll(".marca-card").forEach(card=>{

    card.addEventListener("click",()=>{

        APP.filtros.marca = card.dataset.marca;

        aplicarFiltros();

    });

});

/*=========================================================
SELECT ORDENAR
=========================================================*/

if(DOM.ordenar){

    DOM.ordenar.addEventListener("change",(e)=>{

        ordenarProductos(e.target.value);

    });

}
/*=========================================================
MODAL PRODUCTO
=========================================================*/

function abrirProducto(id){

    const producto = obtenerProducto(id);

    if(!producto) return;

    APP.productoActual = producto;

    const imagen = producto.imagen && producto.imagen !== ""
        ? producto.imagen
        : CONFIG.imagenPorDefecto;

    DOM.modalContenido.innerHTML = `

        <div class="modal-grid">

            <div class="modal-imagen">

                <img
                    src="${imagen}"
                    alt="${producto.nombre}"
                    onerror="this.src='${CONFIG.imagenPorDefecto}'">

            </div>

            <div class="modal-info">

                <span class="modal-marca">

                    ${producto.marca}

                </span>

                <h2>

                    ${producto.nombre}

                </h2>

                <p>

                    <strong>Código:</strong>

                    ${producto.codigo}

                </p>

                <p>

                    <strong>Categoría:</strong>

                    ${producto.categoria}

                </p>

                <p>

                    ${producto.descripcion || "Sin descripción disponible."}

                </p>

                <div class="modal-botones">

                    <button
                        class="btn-whatsapp"
                        onclick="consultarWhatsApp(${producto.id})">

                        <i class="fab fa-whatsapp"></i>

                        Consultar este producto

                    </button>

                </div>

            </div>

        </div>

    `;

    DOM.modal.classList.add("mostrar");

    document.body.style.overflow="hidden";

}

/*=========================================================
CERRAR MODAL
=========================================================*/

function cerrarProducto(){

    DOM.modal.classList.remove("mostrar");

    document.body.style.overflow="auto";

}

/*=========================================================
CERRAR CON ESC
=========================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        cerrarProducto();

    }

});

/*=========================================================
CLICK FUERA DEL MODAL
=========================================================*/

if(DOM.modal){

    DOM.modal.addEventListener("click",(e)=>{

        if(e.target===DOM.modal){

            cerrarProducto();

        }

    });

}
/*=========================================================
WHATSAPP
=========================================================*/

function consultarWhatsApp(id){

    const producto = obtenerProducto(id);

    if(!producto) return;

    const mensaje = encodeURIComponent(

`Hola, vi este producto en su catálogo web.

*Producto:* ${producto.nombre}

*Código:* ${producto.codigo}

*Marca:* ${producto.marca}

¿Está disponible?`

    );

    window.open(

        `https://wa.me/${CONFIG.whatsapp}?text=${mensaje}`,

        "_blank"

    );

}

/*=========================================================
SLIDER DESTACADOS
=========================================================*/

let indiceSlider = 0;

function iniciarSlider(){

    if(!DOM.destacados) return;

    const tarjetas = DOM.destacados.querySelectorAll(".producto");

    if(tarjetas.length <= 1) return;

    setInterval(()=>{

        indiceSlider++;

        if(indiceSlider >= tarjetas.length){

            indiceSlider = 0;

        }

        DOM.destacados.scrollTo({

            left: tarjetas[indiceSlider].offsetLeft,

            behavior:"smooth"

        });

    },CONFIG.velocidadSlider);

}

/*=========================================================
BOTÓN VOLVER ARRIBA
=========================================================*/

window.addEventListener("scroll",()=>{

    if(!DOM.btnTop) return;

    if(window.scrollY > 400){

        DOM.btnTop.classList.add("mostrar");

    }else{

        DOM.btnTop.classList.remove("mostrar");

    }

});

if(DOM.btnTop){

    DOM.btnTop.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/*=========================================================
MENÚ MÓVIL
=========================================================*/

if(DOM.btnMenu && DOM.menu){

    DOM.btnMenu.addEventListener("click",()=>{

        DOM.menu.classList.toggle("activo");

        if(DOM.overlayMenu){

            DOM.overlayMenu.classList.toggle("activo");

        }

    });

}

if(DOM.overlayMenu){

    DOM.overlayMenu.addEventListener("click",()=>{

        DOM.menu.classList.remove("activo");

        DOM.overlayMenu.classList.remove("activo");

    });

}

/*=========================================================
ANIMACIÓN TARJETAS
=========================================================*/

const observer = new IntersectionObserver((entradas)=>{

    entradas.forEach((entrada)=>{

        if(entrada.isIntersecting){

            entrada.target.classList.add("visible");

        }

    });

},{
    threshold:0.15
});

function activarAnimaciones(){

    document.querySelectorAll(".producto").forEach(card=>{

        observer.observe(card);

    });

}
/*=========================================================
INICIALIZACIÓN GENERAL
=========================================================*/

async function iniciarAplicacion(){

    console.log("====================================");

    console.log("ARUANI STORE V6");

    console.log("Inicializando aplicación...");

    console.log("====================================");

    await cargarProductos();

    activarAnimaciones();

    iniciarSlider();

    validarImagenes();

    mostrarEstadisticas();

    console.log("Sistema listo.");

}

/*=========================================================
RECARGAR CATÁLOGO
=========================================================*/

function actualizarCatalogo(){

    renderCatalogo();

    renderDestacados();

    actualizarContador();

    activarAnimaciones();

}

/*=========================================================
OBSERVADOR DE CAMBIOS
=========================================================*/

const catalogoObserver = new MutationObserver(()=>{

    activarAnimaciones();

    validarImagenes();

});

if(DOM.productos){

    catalogoObserver.observe(

        DOM.productos,

        {

            childList:true,

            subtree:true

        }

    );

}

/*=========================================================
EVENTOS GENERALES
=========================================================*/

window.addEventListener("load",()=>{

    iniciarAplicacion();

});

/*=========================================================
REDIMENSIONAR
=========================================================*/

window.addEventListener("resize",()=>{

    activarAnimaciones();

});

/*=========================================================
VISIBILIDAD DE LA PÁGINA
=========================================================*/

document.addEventListener("visibilitychange",()=>{

    if(document.visibilityState==="visible"){

        actualizarCatalogo();

    }

});

/*=========================================================
INFORMACIÓN
=========================================================*/

console.log("%cARUANI STORE V6",

"color:#ff9800;font-size:18px;font-weight:bold;");

console.log("Desarrollado para ARUANI REPUESTOS");

console.log("Motor de catálogo iniciado correctamente.");

console.log("Versión: 6.0");
