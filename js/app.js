/* ============================================
   ARUANI STORE v2
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    const grid = document.getElementById("productos");
    const buscador = document.getElementById("buscar");
    const contador = document.getElementById("contador");

    mostrarProductos(productos);

    buscador.addEventListener("input", buscarProductos);

});

function mostrarProductos(lista){

    const grid = document.getElementById("productos");

    const contador = document.getElementById("contador");

    grid.innerHTML="";

    contador.textContent=lista.length+" Productos";

    if(lista.length===0){

        grid.innerHTML=`
        <div class="sin-resultados">
            No se encontraron productos.
        </div>`;

        return;

    }

    lista.forEach(producto=>{

        grid.innerHTML+=`

<div class="producto">

<div class="producto-imagen">

${producto.destacado ? `<div class="badge destacado">DESTACADO</div>`:""}

<img src="${producto.imagen}" alt="${producto.nombre}">

</div>

<div class="producto-info">

<span class="marca">${producto.marca}</span>

<h3>${producto.nombre}</h3>

<p class="codigo">
Código: ${producto.codigo}
</p>

<p class="stock">

${producto.stock ?

`<span style="color:#2ecc71;">✔ Disponible</span>`

:

`<span style="color:#e74c3c;">Consultar Stock</span>`

}

</p>

<button

class="btn-producto"

onclick="consultar('${producto.nombre}','${producto.codigo}')">

<i class="fab fa-whatsapp"></i>

Consultar

</button>

</div>

</div>

`;

    });

}

function buscarProductos(){

    const texto=document
    .getElementById("buscar")
    .value
    .toLowerCase();

    const resultado=productos.filter(p=>{

        return(

            p.nombre.toLowerCase().includes(texto)

            ||

            p.marca.toLowerCase().includes(texto)

            ||

            p.codigo.toLowerCase().includes(texto)

            ||

            p.categoria.toLowerCase().includes(texto)

        );

    });

    mostrarProductos(resultado);

}

function consultar(nombre,codigo){

    const telefono="5492610000000";

    const mensaje=`

Hola ARUANI.

Quiero consultar por este repuesto.

Producto:

${nombre}

Código:

${codigo}

Muchas gracias.

`;

    window.open(

`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,

"_blank"

);

}
