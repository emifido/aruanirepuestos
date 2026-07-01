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
/*=========================================================
 BUSCADOR
=========================================================*/

function buscarProductos(texto){

    texto = texto.toLowerCase().trim();

    productosFiltrados = productos.filter(producto=>{

        return (

            producto.nombre.toLowerCase().includes(texto)

            ||

            producto.codigo.toLowerCase().includes(texto)

            ||

            producto.marca.toLowerCase().includes(texto)

            ||

            producto.categoria.toLowerCase().includes(texto)

            ||

            producto.subcategoria.toLowerCase().includes(texto)

            ||

            producto.descripcion.toLowerCase().includes(texto)

            ||

            producto.modelos.join(" ").toLowerCase().includes(texto)

            ||

            producto.etiquetas.join(" ").toLowerCase().includes(texto)

        );

    });

    aplicarFiltros();

}

/*=========================================================
 FILTROS
=========================================================*/

function aplicarFiltros(){

    let lista=[...productosFiltrados];

    if(marcaSeleccionada!=="Todas"){

        lista=lista.filter(producto=>

            producto.marca===marcaSeleccionada

        );

    }

    if(categoriaSeleccionada!=="Todas"){

        lista=lista.filter(producto=>

            producto.categoria===categoriaSeleccionada

        );

    }

    mostrarProductos(lista);

    contador.innerHTML=`

        Mostrando

        <strong>${lista.length}</strong>

        de

        ${productos.length}

        productos

    `;

}

/*=========================================================
 FILTRAR POR MARCA
=========================================================*/

document.querySelectorAll(".marca-card").forEach(card=>{

    card.addEventListener("click",()=>{

        marcaSeleccionada=card.dataset.marca;

        aplicarFiltros();

    });

});

/*=========================================================
 FILTRAR POR CATEGORÍA
=========================================================*/

document.querySelectorAll(".filtros li").forEach(item=>{

    item.addEventListener("click",()=>{

        categoriaSeleccionada=item.textContent.trim();

        aplicarFiltros();

    });

});

/*=========================================================
 BUSCADOR EN TIEMPO REAL
=========================================================*/

if(buscador){

    buscador.addEventListener("keyup",(e)=>{

        buscarProductos(e.target.value);

    });

}

/*=========================================================
 ORDENAR
=========================================================*/

function ordenarProductos(tipo){

    switch(tipo){

        case "nombre":

            productosFiltrados.sort((a,b)=>

                a.nombre.localeCompare(b.nombre)

            );

        break;

        case "marca":

            productosFiltrados.sort((a,b)=>

                a.marca.localeCompare(b.marca)

            );

        break;

        case "codigo":

            productosFiltrados.sort((a,b)=>

                a.codigo.localeCompare(b.codigo)

            );

        break;

        case "destacados":

            productosFiltrados.sort((a,b)=>

                b.destacado-a.destacado

            );

        break;

    }

    aplicarFiltros();

}

/*=========================================================
 RESTABLECER FILTROS
=========================================================*/

function limpiarFiltros(){

    marcaSeleccionada="Todas";

    categoriaSeleccionada="Todas";

    productosFiltrados=[...productos];

    mostrarProductos(productos);

    actualizarContador();

    if(buscador){

        buscador.value="";

    }

}

console.log("✔ Módulo de búsqueda y filtros cargado.");
/*=========================================================
 MODAL DEL PRODUCTO
=========================================================*/

let productoSeleccionado = null;

function abrirProducto(id){

    productoSeleccionado = productos.find(p => p.id == id);

    if(!productoSeleccionado) return;

    const modal = document.getElementById("lightbox");

    const contenido = document.getElementById("lightboxContenido");

    if(!modal || !contenido) return;

    const imagenPrincipal = productoSeleccionado.imagenes?.length
        ? productoSeleccionado.imagenes[0]
        : CONFIG.imagenPorDefecto;

    contenido.innerHTML = `

        <img
            src="${imagenPrincipal}"
            alt="${productoSeleccionado.nombre}"
            onerror="this.src='${CONFIG.imagenPorDefecto}'"
        >

        <h2>${productoSeleccionado.nombre}</h2>

        <p>${productoSeleccionado.descripcion}</p>

        <hr>

        <p><strong>Código:</strong> ${productoSeleccionado.codigo}</p>

        <p><strong>Marca:</strong> ${productoSeleccionado.marca}</p>

        <p><strong>Categoría:</strong> ${productoSeleccionado.categoria}</p>

        <p><strong>Modelos:</strong> ${productoSeleccionado.modelos.join(", ")}</p>

        <div style="margin-top:30px">

            <button
                class="btn"
                onclick="consultarWhatsapp()">

                Consultar por WhatsApp

            </button>

        </div>

    `;

    modal.classList.add("active");

}

/*=========================================================
 CERRAR MODAL
=========================================================*/

function cerrarProducto(){

    const modal=document.getElementById("lightbox");

    if(modal){

        modal.classList.remove("active");

    }

}

document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("lightbox")){

        cerrarProducto();

    }

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        cerrarProducto();

    }

});

/*=========================================================
 BOTONES VER PRODUCTO
=========================================================*/

document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("btn-producto")){

        abrirProducto(

            e.target.dataset.id

        );

    }

});

/*=========================================================
 WHATSAPP
=========================================================*/

function consultarWhatsapp(){

    if(!productoSeleccionado) return;

    const mensaje=

`Hola, estoy interesado en el siguiente repuesto:

*${productoSeleccionado.nombre}*

Código: ${productoSeleccionado.codigo}

Marca: ${productoSeleccionado.marca}

¿Podrían brindarme más información?`;

    const url=

`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url,"_blank");

}

/*=========================================================
 ANIMACIÓN TARJETAS
=========================================================*/

function animarTarjetas(){

    const tarjetas=document.querySelectorAll(".producto");

    tarjetas.forEach((tarjeta,index)=>{

        tarjeta.style.opacity="0";

        tarjeta.style.transform="translateY(25px)";

        setTimeout(()=>{

            tarjeta.style.transition=".45s";

            tarjeta.style.opacity="1";

            tarjeta.style.transform="translateY(0px)";

        },index*60);

    });

}

/*=========================================================
 OBSERVER
=========================================================*/

const observer=new MutationObserver(()=>{

    animarTarjetas();

});

observer.observe(

    document.body,

    {

        childList:true,

        subtree:true

    }

);

console.log("✔ Modal y WhatsApp cargados.");
