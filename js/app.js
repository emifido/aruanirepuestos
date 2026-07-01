
/* ======================================================
   ARUANI STORE 2.0
   app.js
====================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const contenedorProductos = document.getElementById("productos");
    const contador = document.getElementById("contador");
    const buscador = document.getElementById("buscar");

    //==============================
    // Mostrar productos
    //==============================

    function mostrarProductos(lista){

        contenedorProductos.innerHTML = "";

        if(lista.length === 0){

            contenedorProductos.innerHTML = `
                <div class="sin-resultados">
                    <h2>No se encontraron productos.</h2>
                </div>
            `;

            contador.textContent = "0 Productos";

            return;

        }

        lista.forEach(producto => {

            const tarjeta = document.createElement("div");

            tarjeta.className = "producto";

            tarjeta.innerHTML = `

                <div class="producto-imagen">

                    ${
                        producto.destacado
                        ? `<div class="badge destacado">DESTACADO</div>`
                        : ""
                    }

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                    >

                </div>

                <div class="producto-info">

                    <span>${producto.marca}</span>

                    <h3>${producto.nombre}</h3>

                    <p>${producto.descripcion}</p>

                    <div class="producto-datos">

                        <div>

                            <strong>Categoría</strong>

                            <span>${producto.categoria}</span>

                        </div>

                        <div>

                            <strong>Código</strong>

                            <span>${producto.codigo}</span>

                        </div>

                        <div>

                            <strong>Stock</strong>

                            <span>

                                ${
                                    producto.stock
                                    ? "Disponible"
                                    : "Consultar"
                                }

                            </span>

                        </div>

                    </div>

                    <button
                        class="btn-producto"
                        onclick="consultarWhatsApp('${producto.nombre}','${producto.codigo}')">

                        <i class="fab fa-whatsapp"></i>

                        Consultar

                    </button>

                </div>

            `;

            contenedorProductos.appendChild(tarjeta);

        });

        contador.textContent = `${lista.length} Productos`;

    }

    //==============================
    // Buscador
    //==============================

    buscador.addEventListener("keyup", () => {

        const texto = buscador.value.toLowerCase();

        const resultado = productos.filter(producto =>

            producto.nombre.toLowerCase().includes(texto)

            ||

            producto.marca.toLowerCase().includes(texto)

            ||

            producto.categoria.toLowerCase().includes(texto)

            ||

            producto.codigo.toLowerCase().includes(texto)

        );

        mostrarProductos(resultado);

    });

    //==============================
    // Inicio
    //==============================

    mostrarProductos(productos);

});


//==========================================
// WhatsApp
//==========================================

function consultarWhatsApp(nombre,codigo){

    const mensaje =

`Hola ARUANI 👋

Estoy interesado en el siguiente repuesto.

Producto:
${nombre}

Código:
${codigo}

¿Podrían informarme disponibilidad?

Muchas gracias.`;

    const telefono = "5492610000000";

    window.open(

        `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,

        "_blank"

    );

}
