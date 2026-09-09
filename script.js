/* =====================================================
   HORARIO DE NENA
===================================================== */


const DIAS = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo"
];


let horario = cargarDatos();

let diaSeleccionado = obtenerDiaActual();

let materiaSeleccionada = null;

let indiceMateriaEditando = null;


/* =====================================================
   CARGAR DATOS
===================================================== */

function cargarDatos() {

    const datosGuardados =
        localStorage.getItem("horarioNenaEntrega");


    if (!datosGuardados) {

        return {
            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: [],
            sabado: [],
            domingo: [],
            recordatorios: []
        };

    }


    try {

        const datos =
            JSON.parse(datosGuardados);


        DIAS.forEach(dia => {

            if (!Array.isArray(datos[dia])) {

                datos[dia] = [];

            }


            datos[dia].forEach(materia => {

                if (!Array.isArray(materia.tareas)) {

                    materia.tareas = [];

                }


                if (!materia.color) {

                    materia.color = "rosa";

                }


                materia.tareas.forEach(tarea => {

                    if (!tarea.prioridad) {

                        tarea.prioridad = "media";

                    }


                    if (
                        typeof tarea.completada !==
                        "boolean"
                    ) {

                        tarea.completada = false;

                    }

                });

            });

        });


        if (
            !Array.isArray(
                datos.recordatorios
            )
        ) {

            datos.recordatorios = [];

        }


        datos.recordatorios.forEach(
            recordatorio => {

                if (
                    typeof
                    recordatorio.completado !==
                    "boolean"
                ) {

                    recordatorio.completado =
                        false;

                }

            }
        );


        return datos;

    } catch (error) {

        console.error(
            "Error al cargar los datos:",
            error
        );


        return {

            lunes: [],
            martes: [],
            miercoles: [],
            jueves: [],
            viernes: [],
            sabado: [],
            domingo: [],

            recordatorios: []

        };

    }

}


/* =====================================================
   GUARDAR
===================================================== */

function guardarDatos() {

    localStorage.setItem(
        "horarioNenaEntrega",
        JSON.stringify(horario)
    );

}


/* =====================================================
   DÍA ACTUAL
===================================================== */

function obtenerDiaActual() {

    const numeroDia =
        new Date().getDay();


    const conversion = {

        0: "domingo",
        1: "lunes",
        2: "martes",
        3: "miercoles",
        4: "jueves",
        5: "viernes",
        6: "sabado"

    };


    return conversion[numeroDia];

}


/* =====================================================
   NOMBRE DÍA
===================================================== */

function nombreBonitoDia(dia) {

    const nombres = {

        lunes: "Lunes",
        martes: "Martes",
        miercoles: "Miércoles",
        jueves: "Jueves",
        viernes: "Viernes",
        sabado: "Sábado",
        domingo: "Domingo"

    };


    return nombres[dia] || dia;

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHTML(texto) {

    if (
        texto === undefined ||
        texto === null
    ) {

        return "";

    }


    return String(texto)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   HORA
===================================================== */

function formatearHora(hora) {

    if (!hora) {

        return "";

    }


    const partes =
        hora.split(":");


    if (partes.length < 2) {

        return hora;

    }


    let horas =
        parseInt(partes[0]);


    const minutos =
        partes[1];


    const periodo =
        horas >= 12
        ? "PM"
        : "AM";


    horas =
        horas % 12;


    if (horas === 0) {

        horas = 12;

    }


    return `${horas}:${minutos} ${periodo}`;

}


/* =====================================================
   MOSTRAR DÍA
===================================================== */

function mostrarDia(dia) {

    diaSeleccionado = dia;


    document
        .querySelectorAll(".dia")
        .forEach(boton => {

            boton.classList.toggle(
                "activo",
                boton.dataset.dia === dia
            );

        });


    document.getElementById(
        "titulo-dia"
    ).textContent =
        nombreBonitoDia(dia);


    mostrarMaterias();

}


/* =====================================================
   SELECCIONAR DÍA
===================================================== */

function seleccionarDia() {

    document
        .querySelectorAll(".dia")
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    cerrarPanelTareas();

                    mostrarDia(
                        boton.dataset.dia
                    );

                }
            );

        });

}


/* =====================================================
   MOSTRAR MATERIAS
===================================================== */

function mostrarMaterias() {

    const contenedor =
        document.getElementById(
            "lista-materias"
        );


    const materias =
        horario[diaSeleccionado];


    if (materias.length === 0) {

        contenedor.innerHTML = `

            <p class="mensaje-vacio">

                Todavía no tienes materias este día.

                <br><br>

                ¡Agrega tu primera clase! 💗

            </p>

        `;

        return;

    }


    materias.sort(
        (a, b) =>
            a.horaInicio.localeCompare(
                b.horaInicio
            )
    );


    contenedor.innerHTML = "";


    materias.forEach(
        (materia, indice) => {

            const tarjeta =
                document.createElement(
                    "div"
                );


            tarjeta.className =
                `materia ${
                    materia.color ||
                    "rosa"
                }`;


            tarjeta.innerHTML = `

                <div class="materia-info">

                    <h3>
                        ${escaparHTML(
                            materia.nombre
                        )}
                    </h3>

                    <p class="materia-hora">

                        ⏰
                        ${formatearHora(
                            materia.horaInicio
                        )}

                        -

                        ${formatearHora(
                            materia.horaFinal
                        )}

                    </p>

                    ${
                        materia.profesor
                        ? `
                            <p>
                                👨‍🏫
                                ${escaparHTML(
                                    materia.profesor
                                )}
                            </p>
                        `
                        : ""
                    }

                    ${
                        materia.aula
                        ? `
                            <p>
                                🏫
                                ${escaparHTML(
                                    materia.aula
                                )}
                            </p>
                        `
                        : ""
                    }

                    ${
                        materia.descripcion
                        ? `
                            <p class="materia-descripcion">
                                💬 ${escaparHTML(
                                    materia.descripcion
                                )}
                            </p>
                        `
                        : ""
                    }

                </div>


                <div class="materia-acciones">

                    <button
                        class="boton-icono editar-materia"
                        title="Editar"
                    >
                        ✏️
                    </button>

                    <button
                        class="boton-icono eliminar-materia"
                        title="Eliminar"
                    >
                        🗑️
                    </button>

                </div>

            `;


            tarjeta.addEventListener(
                "click",
                evento => {

                    if (
                        evento.target.closest(
                            ".materia-acciones"
                        )
                    ) {

                        return;

                    }


                    abrirTareas(
                        indice
                    );

                }
            );


            tarjeta
                .querySelector(
                    ".editar-materia"
                )
                .addEventListener(
                    "click",
                    evento => {

                        evento.stopPropagation();

                        editarMateria(
                            indice
                        );

                    }
                );


            tarjeta
                .querySelector(
                    ".eliminar-materia"
                )
                .addEventListener(
                    "click",
                    evento => {

                        evento.stopPropagation();

                        eliminarMateria(
                            indice
                        );

                    }
                );


            contenedor.appendChild(
                tarjeta
            );

        }
    );

}


/* =====================================================
   FORMULARIO MATERIA
===================================================== */

const formularioMateria =
    document.getElementById(
        "formulario-materia"
    );


const formMateria =
    document.getElementById(
        "form-materia"
    );


document
    .getElementById(
        "boton-agregar-materia"
    )
    .addEventListener(
        "click",
        abrirFormularioMateria
    );


document
    .getElementById(
        "cerrar-formulario-materia"
    )
    .addEventListener(
        "click",
        cerrarFormularioMateria
    );


function abrirFormularioMateria() {

    indiceMateriaEditando = null;


    document.getElementById(
        "titulo-formulario-materia"
    ).textContent =
        "Agregar materia";


    formMateria.reset();


    document.getElementById(
        "color-materia"
    ).value =
        "rosa";


    formularioMateria.classList.remove(
        "oculto"
    );

}


function cerrarFormularioMateria() {

    formularioMateria.classList.add(
        "oculto"
    );


    formMateria.reset();

    indiceMateriaEditando = null;

}


/* =====================================================
   GUARDAR MATERIA
===================================================== */

formMateria.addEventListener(
    "submit",
    evento => {

        evento.preventDefault();


        const nombre =
            document.getElementById(
                "nombre-materia"
            ).value.trim();


        const horaInicio =
            document.getElementById(
                "hora-inicio"
            ).value;


        const horaFinal =
            document.getElementById(
                "hora-final"
            ).value;


        const profesor =
            document.getElementById(
                "profesor"
            ).value.trim();


        const aula =
            document.getElementById(
                "aula"
            ).value.trim();


        const descripcion =
            document.getElementById(
                "descripcion-materia"
            ).value.trim();


        const color =
            document.getElementById(
                "color-materia"
            ).value;


        if (
            horaFinal <=
            horaInicio
        ) {

            alert(
                "La hora de finalización debe ser después de la hora de inicio."
            );

            return;

        }


        if (
            indiceMateriaEditando !==
            null
        ) {

            const materia =
                horario[diaSeleccionado]
                [indiceMateriaEditando];


            materia.nombre =
                nombre;

            materia.horaInicio =
                horaInicio;

            materia.horaFinal =
                horaFinal;

            materia.profesor =
                profesor;

            materia.aula =
                aula;

            materia.descripcion =
                descripcion;

            materia.color =
                color;

        } else {

            horario[diaSeleccionado].push({

                nombre:
                    nombre,

                horaInicio:
                    horaInicio,

                horaFinal:
                    horaFinal,

                profesor:
                    profesor,

                aula:
                    aula,

                descripcion:
                    descripcion,

                color:
                    color,

                tareas: []

            });

        }


        guardarDatos();

        cerrarFormularioMateria();

        mostrarMaterias();

        actualizarDashboard();

    }
);


/* =====================================================
   EDITAR MATERIA
===================================================== */

function editarMateria(indice) {

    const materia =
        horario[diaSeleccionado]
        [indice];


    indiceMateriaEditando =
        indice;


    document.getElementById(
        "titulo-formulario-materia"
    ).textContent =
        "Editar materia";


    document.getElementById(
        "nombre-materia"
    ).value =
        materia.nombre;


    document.getElementById(
        "hora-inicio"
    ).value =
        materia.horaInicio;


    document.getElementById(
        "hora-final"
    ).value =
        materia.horaFinal;


    document.getElementById(
        "profesor"
    ).value =
        materia.profesor || "";


    document.getElementById(
        "aula"
    ).value =
        materia.aula || "";


    document.getElementById(
        "descripcion-materia"
    ).value =
        materia.descripcion || "";


    document.getElementById(
        "color-materia"
    ).value =
        materia.color ||
        "rosa";


    formularioMateria.classList.remove(
        "oculto"
    );

}


/* =====================================================
   ELIMINAR MATERIA
===================================================== */

function eliminarMateria(indice) {

    const materia =
        horario[diaSeleccionado]
        [indice];


    if (
        !confirm(
            `¿Seguro que quieres eliminar "${materia.nombre}"?\n\nTambién se eliminarán sus tareas.`
        )
    ) {

        return;

    }


    horario[diaSeleccionado].splice(
        indice,
        1
    );


    guardarDatos();

    mostrarMaterias();

    actualizarDashboard();

}


/* =====================================================
   TAREAS
===================================================== */

function abrirTareas(indice) {

    materiaSeleccionada =
        indice;


    const materia =
        horario[diaSeleccionado]
        [indice];


    document.getElementById(
        "nombre-materia-tareas"
    ).textContent =
        materia.nombre;


    let informacion =
        `⏰ ${formatearHora(
            materia.horaInicio
        )} - ${formatearHora(
            materia.horaFinal
        )}`;


    if (materia.profesor) {

        informacion +=
            ` · 👨‍🏫 ${materia.profesor}`;

    }


    if (materia.aula) {

        informacion +=
            ` · 🏫 ${materia.aula}`;

    }


    document.getElementById(
        "info-materia-tareas"
    ).textContent =
        informacion;


    document.getElementById(
        "contenido-horario"
    ).classList.add(
        "oculto"
    );


    document.getElementById(
        "selector-dias"
    ).classList.add(
        "oculto"
    );


    document.getElementById(
        "dashboard"
    ).classList.add(
        "oculto"
    );


    document.getElementById(
        "panel-tareas"
    ).classList.remove(
        "oculto"
    );


    mostrarTareas();

}


document
    .getElementById(
        "cerrar-tareas"
    )
    .addEventListener(
        "click",
        cerrarPanelTareas
    );


function cerrarPanelTareas() {

    document.getElementById(
        "panel-tareas"
    ).classList.add(
        "oculto"
    );


    document.getElementById(
        "contenido-horario"
    ).classList.remove(
        "oculto"
    );


    document.getElementById(
        "selector-dias"
    ).classList.remove(
        "oculto"
    );


    document.getElementById(
        "dashboard"
    ).classList.remove(
        "oculto"
    );


    materiaSeleccionada =
        null;

}


/* =====================================================
   MOSTRAR TAREAS
===================================================== */

function mostrarTareas() {

    if (
        materiaSeleccionada ===
        null
    ) {

        return;

    }


    const materia =
        horario[diaSeleccionado]
        [materiaSeleccionada];


    const contenedor =
        document.getElementById(
            "lista-tareas"
        );


    if (
        !materia.tareas.length
    ) {

        contenedor.innerHTML = `

            <p class="mensaje-vacio">

                No tienes pendientes
                en esta materia. 🎉

            </p>

        `;

        return;

    }


    materia.tareas.sort(
        (a, b) =>
            a.fecha.localeCompare(
                b.fecha
            )
    );


    contenedor.innerHTML = "";


    materia.tareas.forEach(
        (tarea, indice) => {

            const elemento =
                document.createElement(
                    "div"
                );


            elemento.className =
                "tarea" +
                (
                    tarea.completada
                    ? " completada"
                    : ""
                );


            elemento.innerHTML = `

                <input
                    type="checkbox"
                    class="checkbox-tarea"
                    ${
                        tarea.completada
                        ? "checked"
                        : ""
                    }
                >


                <div class="tarea-contenido">

                    <div class="tarea-nombre">
                        ${escaparHTML(
                            tarea.nombre
                        )}
                    </div>


                    <div class="tarea-detalles">

                        <span class="etiqueta">
                            ${escaparHTML(
                                tarea.tipo
                            )}
                        </span>


                        <span
                            class="etiqueta ${tarea.prioridad}"
                        >
                            Prioridad
                            ${escaparHTML(
                                tarea.prioridad
                            )}
                        </span>


                        <span class="etiqueta">
                            📅
                            ${formatearFecha(
                                tarea.fecha
                            )}
                        </span>

                    </div>

                </div>


                <button
                    class="tarea-eliminar"
                    title="Eliminar"
                >
                    🗑️
                </button>

            `;


            elemento
                .querySelector(
                    ".checkbox-tarea"
                )
                .addEventListener(
                    "change",
                    evento => {

                        tarea.completada =
                            evento.target.checked;


                        guardarDatos();

                        mostrarTareas();

                        actualizarDashboard();

                    }
                );


            elemento
                .querySelector(
                    ".tarea-eliminar"
                )
                .addEventListener(
                    "click",
                    () => {

                        if (
                            !confirm(
                                "¿Quieres eliminar este pendiente?"
                            )
                        ) {

                            return;

                        }


                        materia.tareas.splice(
                            indice,
                            1
                        );


                        guardarDatos();

                        mostrarTareas();

                        actualizarDashboard();

                    }
                );


            contenedor.appendChild(
                elemento
            );

        }
    );

}


/* =====================================================
   FORMULARIO TAREA
===================================================== */

const formularioTarea =
    document.getElementById(
        "formulario-tarea"
    );


const formTarea =
    document.getElementById(
        "form-tarea"
    );


document
    .getElementById(
        "boton-agregar-tarea"
    )
    .addEventListener(
        "click",
        () => {

            formularioTarea.classList.remove(
                "oculto"
            );


            formTarea.reset();


            document.getElementById(
                "prioridad-tarea"
            ).value =
                "media";

        }
    );


document
    .getElementById(
        "cerrar-formulario-tarea"
    )
    .addEventListener(
        "click",
        () => {

            formularioTarea.classList.add(
                "oculto"
            );


            formTarea.reset();

        }
    );


formTarea.addEventListener(
    "submit",
    evento => {

        evento.preventDefault();


        if (
            materiaSeleccionada ===
            null
        ) {

            return;

        }


        const materia =
            horario[diaSeleccionado]
            [materiaSeleccionada];


        const nombre =
            document.getElementById(
                "nombre-tarea"
            ).value.trim();


        const fecha =
            document.getElementById(
                "fecha-tarea"
            ).value;


        const tipo =
            document.getElementById(
                "tipo-tarea"
            ).value;


        const prioridad =
            document.getElementById(
                "prioridad-tarea"
            ).value;


        materia.tareas.push({

            nombre:
                nombre,

            fecha:
                fecha,

            tipo:
                tipo,

            prioridad:
                prioridad,

            completada:
                false

        });


        guardarDatos();


        formularioTarea.classList.add(
            "oculto"
        );


        formTarea.reset();


        mostrarTareas();

        actualizarDashboard();

    }
);


/* =====================================================
   FECHAS
===================================================== */

function formatearFecha(fecha) {

    if (!fecha) {

        return "";

    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 3
    ) {

        return fecha;

    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* =====================================================
   DASHBOARD
===================================================== */

function actualizarDashboard() {

    let totalMaterias = 0;

    let totalPendientes = 0;

    let totalUrgentes = 0;

    let totalCompletadas = 0;


    DIAS.forEach(dia => {

        horario[dia].forEach(
            materia => {

                totalMaterias++;


                materia.tareas.forEach(
                    tarea => {

                        if (
                            tarea.completada
                        ) {

                            totalCompletadas++;

                        } else {

                            totalPendientes++;


                            if (
                                tarea.prioridad ===
                                "alta"
                            ) {

                                totalUrgentes++;

                            }

                        }

                    }
                );

            }
        );

    });


    document.getElementById(
        "total-materias"
    ).textContent =
        totalMaterias;


    document.getElementById(
        "total-pendientes"
    ).textContent =
        totalPendientes;


    document.getElementById(
        "total-urgentes"
    ).textContent =
        totalUrgentes;


    document.getElementById(
        "total-completadas"
    ).textContent =
        totalCompletadas;


    const totalTareas =
        totalPendientes +
        totalCompletadas;


    let porcentaje = 0;


    if (
        totalTareas > 0
    ) {

        porcentaje =
            Math.round(
                (
                    totalCompletadas /
                    totalTareas
                ) * 100
            );

    }


    document.getElementById(
        "porcentaje-progreso"
    ).textContent =
        `${porcentaje}%`;


    document.getElementById(
        "barra-progreso-interna"
    ).style.width =
        `${porcentaje}%`;


    mostrarClasesHoy();

    mostrarProximasEntregas();

    mostrarRecordatorios();

    actualizarResumenSemana();

    mostrarDetalleSemana();

}


/* =====================================================
   BUSCADOR
===================================================== */

function buscarEnHorario() {
    const input = document.getElementById("buscador-principal");
    const contenedor = document.getElementById("resultados-busqueda");
    const botonLimpiar = document.getElementById("boton-limpiar-busqueda");
    if (!input || !contenedor) return;

    const termino = input.value.trim().toLowerCase();
    if (botonLimpiar) botonLimpiar.classList.toggle("oculto", termino.length === 0);

    if (!termino) {
        contenedor.innerHTML = `<p class="mensaje-busqueda">Escribe algo para buscar. 💗</p>`;
        return;
    }

    const resultados = [];
    DIAS.forEach(dia => {
        (horario[dia] || []).forEach((materia, indiceMateria) => {
            const nombre = (materia.nombre || "").toLowerCase();
            const profesor = (materia.profesor || "").toLowerCase();
            const aula = (materia.aula || "").toLowerCase();
            const descripcion = (materia.descripcion || "").toLowerCase();

            if (nombre.includes(termino) || profesor.includes(termino) || aula.includes(termino) || descripcion.includes(termino)) {
                resultados.push({ tipo: "materia", dia, indiceMateria, materia });
            }

            (materia.tareas || []).forEach((tarea, indiceTarea) => {
                const textoTarea = `${tarea.nombre || ""} ${tarea.tipo || ""} ${tarea.prioridad || ""}`.toLowerCase();
                if (textoTarea.includes(termino) || nombre.includes(termino)) {
                    resultados.push({ tipo: "tarea", dia, indiceMateria, indiceTarea, materia, tarea });
                }
            });
        });
    });

    if (resultados.length === 0) {
        contenedor.innerHTML = `<p class="mensaje-busqueda">No encontré nada con “${escaparHTML(input.value)}”. 💕</p>`;
        return;
    }

    const limite = resultados.slice(0, 12);
    contenedor.innerHTML = limite.map((r, posicion) => {
        if (r.tipo === "materia") {
            return `<button type="button" class="resultado-busqueda" data-posicion="${posicion}">
                <span class="resultado-icono">📚</span>
                <span class="resultado-info"><strong>${escaparHTML(r.materia.nombre)}</strong><small>${nombreBonitoDia(r.dia)} · ${formatearHora(r.materia.horaInicio)} - ${formatearHora(r.materia.horaFinal)}</small></span>
                <span class="resultado-etiqueta">Materia</span>
            </button>`;
        }
        return `<button type="button" class="resultado-busqueda" data-posicion="${posicion}">
            <span class="resultado-icono">${r.tarea.completada ? "✅" : "📝"}</span>
            <span class="resultado-info"><strong>${escaparHTML(r.tarea.nombre)}</strong><small>${escaparHTML(r.materia.nombre)} · ${nombreBonitoDia(r.dia)} · ${r.tarea.completada ? "Completada" : "Pendiente"}</small></span>
            <span class="resultado-etiqueta">${escaparHTML(r.tarea.tipo || "Tarea")}</span>
        </button>`;
    }).join("");

    if (resultados.length > 12) {
        contenedor.innerHTML += `<p class="nota-resultados-busqueda">Mostrando 12 resultados de ${resultados.length}. Afina tu búsqueda para encontrar algo más específico. ✨</p>`;
    }

    contenedor.querySelectorAll(".resultado-busqueda").forEach(boton => {
        boton.addEventListener("click", () => {
            const resultado = limite[Number(boton.dataset.posicion)];
            if (!resultado) return;
            diaSeleccionado = resultado.dia;
            mostrarDia(resultado.dia);
            if (resultado.tipo === "tarea") abrirTareas(resultado.indiceMateria);
        });
    });
}

function configurarBuscador() {
    const input = document.getElementById("buscador-principal");
    const botonLimpiar = document.getElementById("boton-limpiar-busqueda");
    if (!input) return;
    input.addEventListener("input", buscarEnHorario);
    if (botonLimpiar) {
        botonLimpiar.addEventListener("click", () => {
            input.value = "";
            input.focus();
            buscarEnHorario();
        });
    }
}


/* =====================================================
   RESUMEN SEMANAL
===================================================== */

function actualizarResumenSemana() {

    let materias = 0;

    let tareas = 0;

    let completadas = 0;


    DIAS.forEach(dia => {

        materias +=
            horario[dia].length;


        horario[dia].forEach(
            materia => {

                materia.tareas.forEach(
                    tarea => {

                        tareas++;


                        if (
                            tarea.completada
                        ) {

                            completadas++;

                        }

                    }
                );

            }
        );

    });


    const pendientes =
        tareas - completadas;


    let texto = "";


    if (
        materias === 0 &&
        tareas === 0
    ) {

        texto =
            "Todavía no tienes clases ni tareas registradas. ¡Vamos poco a poco! 💕";

    } else {

        texto =
            `Esta semana tienes ${materias} ${
                materias === 1
                ? "materia"
                : "materias"
            } y ${
                tareas
            } ${
                tareas === 1
                ? "pendiente"
                : "pendientes"
            }. `;


        if (
            completadas > 0
        ) {

            texto +=
                `Ya completaste ${completadas}. `;

        }


        if (
            pendientes > 0
        ) {

            texto +=
                `Te quedan ${pendientes}. ¡Tú puedes! 💗`;

        } else if (
            tareas > 0
        ) {

            texto +=
                "¡Todo está completado! 🎉";

        }

    }


    document.getElementById(
        "texto-resumen-semana"
    ).textContent =
        texto;

}


/* =====================================================
   DETALLE DE LA SEMANA
===================================================== */

function mostrarDetalleSemana() {

    const contenedor =
        document.getElementById("detalle-semana");

    if (!contenedor) {
        return;
    }

    const nombresCortos = {
        lunes: "Lun",
        martes: "Mar",
        miercoles: "Mié",
        jueves: "Jue",
        viernes: "Vie",
        sabado: "Sáb",
        domingo: "Dom"
    };

    const tarjetas = DIAS.map(dia => {

        const materias = horario[dia] || [];

        let tareas = 0;
        let completadas = 0;

        materias.forEach(materia => {
            (materia.tareas || []).forEach(tarea => {
                tareas++;

                if (tarea.completada) {
                    completadas++;
                }
            });
        });

        const porcentaje = tareas > 0
            ? Math.round((completadas / tareas) * 100)
            : 0;

        return `
            <button
                class="tarjeta-dia-semana ${dia === obtenerDiaActual() ? "hoy" : ""}"
                data-dia-semana="${dia}"
                type="button"
            >
                <strong>${nombresCortos[dia]}</strong>

                <span>
                    📚 ${materias.length}
                    ${materias.length === 1 ? "clase" : "clases"}
                </span>

                <span>
                    📝 ${tareas}
                    ${tareas === 1 ? "tarea" : "tareas"}
                </span>

                <div class="mini-progreso">
                    <div style="width: ${porcentaje}%"></div>
                </div>

                <small>${porcentaje}% completado</small>
            </button>
        `;
    }).join("");

    contenedor.innerHTML = tarjetas;

    contenedor
        .querySelectorAll(".tarjeta-dia-semana")
        .forEach(boton => {
            boton.addEventListener("click", () => {
                cerrarPanelTareas();
                mostrarDia(boton.dataset.diaSemana);
                document.getElementById("contenido-horario")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        });
}


/* =====================================================
   ESTADO DE CLASE SEGÚN LA HORA
===================================================== */

function obtenerEstadoClase(materia) {

    if (!materia.horaInicio || !materia.horaFinal) {
        return "normal";
    }

    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    const [inicioH, inicioM] = materia.horaInicio.split(":").map(Number);
    const [finalH, finalM] = materia.horaFinal.split(":").map(Number);

    const inicio = inicioH * 60 + inicioM;
    const final = finalH * 60 + finalM;

    if (minutosAhora >= inicio && minutosAhora < final) {
        return "en-curso";
    }

    if (minutosAhora < inicio) {
        return "proxima";
    }

    return "terminada";
}


function textoEstadoClase(estado) {

    const textos = {
        "en-curso": "🔴 En curso",
        "proxima": "🕐 Próxima",
        "terminada": "✓ Terminada",
        "normal": ""
    };

    return textos[estado] || "";
}


/* =====================================================
   CLASES DE HOY
===================================================== */

function mostrarClasesHoy() {

    const contenedor =
        document.getElementById(
            "clases-hoy"
        );


    const materias =
        horario[
            obtenerDiaActual()
        ];


    if (
        !materias ||
        materias.length === 0
    ) {

        contenedor.innerHTML = `

            <p class="mensaje-vacio">
                No hay clases para hoy. 😌
            </p>

        `;

        return;

    }


    const materiasOrdenadas =
        [...materias].sort(
            (a, b) =>
                a.horaInicio.localeCompare(
                    b.horaInicio
                )
        );


    contenedor.innerHTML = "";


    materiasOrdenadas.forEach(
        materia => {

            const item =
                document.createElement(
                    "div"
                );


            const estado = obtenerEstadoClase(materia);

            item.className =
                `item-dashboard clase-${estado}`;


            item.innerHTML = `

                <div class="info-clase-hoy">

                    <strong>
                        ${escaparHTML(
                            materia.nombre
                        )}
                    </strong>

                    <span>

                        ⏰
                        ${formatearHora(
                            materia.horaInicio
                        )}

                        -

                        ${formatearHora(
                            materia.horaFinal
                        )}

                    </span>

                </div>

                ${estado !== "normal"
                    ? `<small class="estado-clase">${textoEstadoClase(estado)}</small>`
                    : ""}

            `;


            item.addEventListener(
                "click",
                () => {

                    const indice =
                        horario[
                            obtenerDiaActual()
                        ].indexOf(
                            materia
                        );


                    mostrarDia(
                        obtenerDiaActual()
                    );


                    abrirTareas(
                        indice
                    );

                }
            );


            contenedor.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   PRÓXIMAS ENTREGAS
===================================================== */

function mostrarProximasEntregas() {

    const contenedor =
        document.getElementById(
            "proximas-entregas"
        );


    const tareas = [];


    DIAS.forEach(dia => {

        horario[dia].forEach(
            (materia, indiceMateria) => {

                materia.tareas.forEach(
                    tarea => {

                        if (
                            !tarea.completada
                        ) {

                            tareas.push({

                                ...tarea,

                                dia:
                                    dia,

                                materia:
                                    materia.nombre,

                                indiceMateria:
                                    indiceMateria

                            });

                        }

                    }
                );

            }
        );

    });


    tareas.sort(
        (a, b) =>
            a.fecha.localeCompare(
                b.fecha
            )
    );


    const proximas =
        tareas.slice(0, 5);


    if (
        proximas.length === 0
    ) {

        contenedor.innerHTML = `

            <p class="mensaje-vacio">
                No hay tareas pendientes. 🎉
            </p>

        `;

        return;

    }


    contenedor.innerHTML = "";


    proximas.forEach(
        tarea => {

            const item =
                document.createElement(
                    "div"
                );


            const hoy =
                new Date();


            hoy.setHours(
                0,
                0,
                0,
                0
            );


            const fechaEntrega =
                new Date(
                    `${tarea.fecha}T00:00:00`
                );


            const esVencida =
                fechaEntrega < hoy;


            const esUrgente =
                tarea.prioridad ===
                "alta";


            item.className =
                "item-dashboard " +
                (
                    esUrgente
                    ? "urgente"
                    : "normal"
                );


            item.innerHTML = `

                <strong>
                    ${escaparHTML(
                        tarea.nombre
                    )}
                </strong>

                <span>

                    ${escaparHTML(
                        tarea.materia
                    )}

                    ·

                    📅
                    ${formatearFecha(
                        tarea.fecha
                    )}

                    ${
                        esVencida
                        ? " · ⚠️ Vencida"
                        : ""
                    }

                </span>

            `;


            item.addEventListener(
                "click",
                () => {

                    diaSeleccionado =
                        tarea.dia;


                    mostrarDia(
                        tarea.dia
                    );


                    abrirTareas(
                        horario[tarea.dia]
                        .findIndex(
                            materia =>
                                materia.nombre ===
                                tarea.materia
                        )
                    );

                }
            );


            contenedor.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   RECORDATORIOS
===================================================== */

function obtenerFechaHoy() {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}


function estadoRecordatorio(recordatorio) {

    if (recordatorio.completado) {
        return "completado";
    }

    if (recordatorio.fecha) {

        const hoy = obtenerFechaHoy();

        if (recordatorio.fecha < hoy) {
            return "vencido";
        }

        if (recordatorio.fecha === hoy) {
            return "hoy";
        }
    }

    return "normal";
}


function mostrarRecordatorios() {

    const contenedor =
        document.getElementById(
            "lista-recordatorios"
        );


    if (
        !horario.recordatorios ||
        horario.recordatorios.length === 0
    ) {

        contenedor.innerHTML = `

            <p class="mensaje-vacio">
                No tienes recordatorios todavía. 💕
            </p>

        `;

        return;

    }


    const recordatorios =
        [...horario.recordatorios].sort(
            (a, b) => {

                // Los pendientes aparecen antes que los completados.
                if (a.completado !== b.completado) {
                    return a.completado ? 1 : -1;
                }

                // Dentro de cada grupo, los que tienen fecha van primero.
                if (!a.fecha && !b.fecha) {
                    return 0;
                }

                if (!a.fecha) {
                    return 1;
                }

                if (!b.fecha) {
                    return -1;
                }

                return a.fecha.localeCompare(b.fecha);

            }
        );


    contenedor.innerHTML = "";


    recordatorios.forEach(
        recordatorio => {

            const item =
                document.createElement(
                    "div"
                );

            const estado =
                estadoRecordatorio(recordatorio);


            item.className =
                "recordatorio " + estado;


            let etiquetaFecha = "";

            if (recordatorio.fecha) {

                if (estado === "vencido") {
                    etiquetaFecha = "⚠️ Vencido · ";
                } else if (estado === "hoy") {
                    etiquetaFecha = "📌 Hoy · ";
                } else {
                    etiquetaFecha = "📅 ";
                }

                etiquetaFecha += formatearFecha(
                    recordatorio.fecha
                );
            }


            item.innerHTML = `

                <input
                    type="checkbox"
                    class="checkbox-recordatorio"
                    aria-label="Completar recordatorio"
                    ${
                        recordatorio.completado
                        ? "checked"
                        : ""
                    }
                >


                <div class="contenido-recordatorio">

                    <div class="texto-recordatorio">

                        💡
                        ${escaparHTML(
                            recordatorio.texto
                        )}

                    </div>


                    ${
                        etiquetaFecha
                        ? `
                            <span
                                class="fecha-recordatorio"
                            >
                                ${escaparHTML(
                                    etiquetaFecha
                                )}
                            </span>
                        `
                        : `
                            <span
                                class="fecha-recordatorio sin-fecha"
                            >
                                Sin fecha
                            </span>
                        `
                    }

                </div>


                <button
                    class="boton-eliminar-recordatorio"
                    title="Eliminar"
                    aria-label="Eliminar recordatorio"
                >
                    🗑️
                </button>

            `;


            item
                .querySelector(
                    ".checkbox-recordatorio"
                )
                .addEventListener(
                    "change",
                    evento => {

                        recordatorio.completado =
                            evento.target.checked;

                        guardarDatos();

                        mostrarRecordatorios();

                        actualizarDashboard();

                    }
                );


            item
                .querySelector(
                    ".boton-eliminar-recordatorio"
                )
                .addEventListener(
                    "click",
                    () => {

                        if (
                            !confirm(
                                "¿Quieres eliminar este recordatorio?"
                            )
                        ) {

                            return;

                        }


                        const indice =
                            horario.recordatorios
                            .indexOf(
                                recordatorio
                            );


                        if (
                            indice !== -1
                        ) {

                            horario.recordatorios.splice(
                                indice,
                                1
                            );

                        }


                        guardarDatos();

                        mostrarRecordatorios();

                        actualizarDashboard();

                    }
                );


            contenedor.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   FORMULARIO RECORDATORIO
===================================================== */

const formularioRecordatorio =
    document.getElementById(
        "formulario-recordatorio"
    );


const formRecordatorio =
    document.getElementById(
        "form-recordatorio"
    );


document
    .getElementById(
        "boton-agregar-recordatorio"
    )
    .addEventListener(
        "click",
        () => {

            formularioRecordatorio.classList.remove(
                "oculto"
            );


            formRecordatorio.reset();

        }
    );


document
    .getElementById(
        "cerrar-formulario-recordatorio"
    )
    .addEventListener(
        "click",
        () => {

            formularioRecordatorio.classList.add(
                "oculto"
            );


            formRecordatorio.reset();

        }
    );


formRecordatorio.addEventListener(
    "submit",
    evento => {

        evento.preventDefault();


        const texto =
            document.getElementById(
                "texto-recordatorio"
            ).value.trim();


        const fecha =
            document.getElementById(
                "fecha-recordatorio"
            ).value;


        if (!texto) {

            return;

        }


        horario.recordatorios.push({

            texto:
                texto,

            fecha:
                fecha,

            completado:
                false

        });


        guardarDatos();


        formularioRecordatorio.classList.add(
            "oculto"
        );


        formRecordatorio.reset();


        mostrarRecordatorios();

    }
);


/* =====================================================
   COPIA DE SEGURIDAD / RESTAURAR
===================================================== */

const botonExportarDatos =
    document.getElementById(
        "boton-exportar-datos"
    );

const botonImportarDatos =
    document.getElementById(
        "boton-importar-datos"
    );

const archivoImportarDatos =
    document.getElementById(
        "archivo-importar-datos"
    );


function exportarDatos() {

    const copia = {
        version: 1,
        fechaCopia: new Date().toISOString(),
        datos: horario
    };

    const contenido =
        JSON.stringify(copia, null, 4);

    const archivo =
        new Blob(
            [contenido],
            { type: "application/json" }
        );

    const url =
        URL.createObjectURL(archivo);

    const enlace =
        document.createElement("a");

    const fecha =
        new Date().toISOString()
            .slice(0, 10);

    enlace.href = url;
    enlace.download =
        `horario-nena-${fecha}.json`;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);

    alert(
        "¡Copia guardada correctamente! 💗\n\nGuarda este archivo en un lugar seguro para poder restaurarlo después."
    );

}


function importarDatos(archivo) {

    if (!archivo) {
        return;
    }

    const lector =
        new FileReader();

    lector.onload = evento => {

        try {

            const copia =
                JSON.parse(
                    evento.target.result
                );

            const datos =
                copia && copia.datos
                    ? copia.datos
                    : copia;

            if (!datos || typeof datos !== "object") {
                throw new Error("Formato inválido");
            }

            const estructuraValida =
                DIAS.every(
                    dia => Array.isArray(datos[dia])
                ) &&
                (datos.recordatorios === undefined ||
                    Array.isArray(datos.recordatorios));

            if (!estructuraValida) {
                throw new Error("Estructura inválida");
            }

            const confirmar =
                confirm(
                    "¿Quieres restaurar esta copia?\n\nLos datos actuales de la página serán reemplazados por los de la copia."
                );

            if (!confirmar) {
                archivoImportarDatos.value = "";
                return;
            }

            horario = datos;

            if (!Array.isArray(horario.recordatorios)) {
                horario.recordatorios = [];
            }

            guardarDatos();

            materiaSeleccionada = null;
            indiceMateriaEditando = null;

            cerrarPanelTareas();
            cerrarFormularioMateria();

            mostrarMaterias();
            mostrarRecordatorios();
            actualizarDashboard();

            alert(
                "¡Copia restaurada correctamente! 💗"
            );

        } catch (error) {

            console.error(
                "Error al restaurar la copia:",
                error
            );

            alert(
                "No se pudo restaurar la copia. Asegúrate de seleccionar un archivo .json creado por esta página."
            );

        }

        archivoImportarDatos.value = "";

    };

    lector.onerror = () => {

        alert(
            "No se pudo leer el archivo de copia."
        );

        archivoImportarDatos.value = "";

    };

    lector.readAsText(archivo);

}


botonExportarDatos.addEventListener(
    "click",
    exportarDatos
);


botonImportarDatos.addEventListener(
    "click",
    () => archivoImportarDatos.click()
);


archivoImportarDatos.addEventListener(
    "change",
    evento => {
        const archivo =
            evento.target.files[0];

        importarDatos(archivo);
    }
);


/* =====================================================
   CARTA ESCONDIDA
===================================================== */

const cartaSecreta =
    document.getElementById(
        "carta-secreta"
    );


document
    .getElementById(
        "boton-carta"
    )
    .addEventListener(
        "click",
        () => {

            cartaSecreta.classList.remove(
                "oculto"
            );

        }
    );


document
    .getElementById(
        "cerrar-carta"
    )
    .addEventListener(
        "click",
        () => {

            cartaSecreta.classList.add(
                "oculto"
            );

        }
    );


/* =====================================================
   SORPRESA INICIAL
===================================================== */

const bienvenidaSorpresa =
    document.getElementById(
        "bienvenida-sorpresa"
    );


document
    .getElementById(
        "boton-entrar"
    )
    .addEventListener(
        "click",
        () => {

            bienvenidaSorpresa.classList.add(
                "ocultar"
            );

        }
    );


/* =====================================================
   CORAZONES FLOTANTES
===================================================== */

function crearCorazon() {

    const contenedor =
        document.getElementById(
            "corazones"
        );


    const corazon =
        document.createElement(
            "div"
        );


    corazon.className =
        "corazon-flotante";


    corazon.textContent =
        Math.random() > 0.5
        ? "♡"
        : "♥";


    corazon.style.left =
        `${Math.random() * 100}%`;


    corazon.style.fontSize =
        `${12 + Math.random() * 10}px`;


    corazon.style.animationDuration =
        `${6 + Math.random() * 4}s`;


    contenedor.appendChild(
        corazon
    );


    setTimeout(
        () => {

            corazon.remove();

        },
        10000
    );

}


setInterval(
    crearCorazon,
    2200
);


/* =====================================================
   ACTUALIZAR ESTADO DE LAS CLASES
===================================================== */

function actualizarEstadoClasesHoy() {
    if (document.getElementById("clases-hoy")) {
        mostrarClasesHoy();
    }
}


setInterval(
    actualizarEstadoClasesHoy,
    60000
);


/* =====================================================
   INICIAR
===================================================== */

function iniciar() {

    seleccionarDia();

    configurarBuscador();

    mostrarDia(
        diaSeleccionado
    );

    actualizarDashboard();

}


iniciar();