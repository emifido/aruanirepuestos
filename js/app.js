/* =====================================================
   ARUANI STORE V3
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.getElementById("productos");
    const buscador = document.getElementById("buscar");
    const contador = document.getElementById("contador");

    crearModal();

    mostrarProductos(productos);

    if (buscador) {
        buscador.addEventListener("input", buscarProductos);
    }

    function mostrarProductos(lista){

        contenedor.innerHTML="";

        if(contador){
            contador.textContent=`${lista.length} Productos`;
        }

        if(lista.length===0){

            contenedor.innerHTML=`
            <div class="sin-resultados">
                <h2>No se encontraron productos</h2>
            </div>
            `;

            return;

        }

        lista.forEach(producto=>{

            const card=document.createElement("div");

            card.className="producto fade-up";

            card.innerHTML=`

                <div class="producto-imagen">

                    ${producto.destacado ? `<div class="badge destacado">DESTACADO</div>` : ""}

                    <img
                        src="${producto.imagen}"
                        alt="${producto.nombre}"
                        onerror="this.src='imagenes/productos/sin-foto.png';"
                    >

                </div>

                <div class="producto-info">

                    <span>${producto.marca}</span>

                    <h3>${producto.nombre}</h3>

                    <p>Código: <strong>${producto.codigo}</strong></p>

                    <div class="producto-datos">

                        <div>

                            <strong>Categoría</strong>

                            <span>${producto.categoria}</span>

                        </div>

                        <div>

                            <strong>Stock</strong>

                            <span>

                            ${producto.stock ? "✔ Disponible" : "Consultar"}

                            </span>

                        </div>

                    </div>

                    <button class="btn-producto ver-producto">

                        Ver Producto

                    </button>

                </div>

            `;

            card.querySelector(".ver-producto").addEventListener("click",()=>{

                abrirModal(producto);

            });

            contenedor.appendChild(card);

        });

        animarCards();

    }

    function buscarProductos(){

        const texto=this.value.toLowerCase();

        const resultado=productos.filter(p=>

            p.nombre.toLowerCase().includes(texto)

            ||

            p.marca.toLowerCase().includes(texto)

            ||

            p.codigo.toLowerCase().includes(texto)

            ||

            p.categoria.toLowerCase().includes(texto)

        );

        mostrarProductos(resultado);

    }

});

function consultar(nombre,codigo){

    const telefono="5492610000000";

    const mensaje=`Hola ARUANI 👋

Estoy interesado en:

${nombre}

Código:

${codigo}

¿Podrían informarme disponibilidad?

Muchas gracias.`;

    window.open(

`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,

"_blank"

);

}

function crearModal(){

    if(document.getElementById("modalProducto")) return;

    document.body.insertAdjacentHTML("beforeend",`

<div id="modalProducto" class="lightbox">

<div class="modal-contenido">

<span class="lightbox-close">&times;</span>

<img id="modalImagen" src="">

<h2 id="modalNombre"></h2>

<p id="modalMarca"></p>

<p id="modalCategoria"></p>

<p id="modalCodigo"></p>

<button id="btnWhatsappModal" class="btn-producto">

Consultar por WhatsApp

</button>

</div>

</div>

`);

    document.querySelector(".lightbox-close").onclick=()=>{

        document.getElementById("modalProducto").classList.remove("active");

    };

    document.getElementById("modalProducto").addEventListener("click",(e)=>{

        if(e.target.id==="modalProducto"){

            e.currentTarget.classList.remove("active");

        }

    });

}

function abrirModal(producto){

    document.getElementById("modalImagen").src=producto.imagen;

    document.getElementById("modalImagen").onerror=function(){

        this.src="imagenes/productos/sin-foto.png";

    };

    document.getElementById("modalNombre").textContent=producto.nombre;

    document.getElementById("modalMarca").textContent="Marca: "+producto.marca;

    document.getElementById("modalCategoria").textContent="Categoría: "+producto.categoria;

    document.getElementById("modalCodigo").textContent="Código: "+producto.codigo;

    document.getElementById("btnWhatsappModal").onclick=()=>{

        consultar(producto.nombre,producto.codigo);

    };

    document.getElementById("modalProducto").classList.add("active");

}

function animarCards(){

    const cards=document.querySelectorAll(".fade-up");

    cards.forEach((card,index)=>{

        setTimeout(()=>{

            card.classList.add("visible");

        },index*80);

    });

}
