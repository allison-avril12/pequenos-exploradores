let estadoUsuario = {
    estrellas: 0,
    nivel: 1,
    nombre: "Explorador",
    edad: "--",
    grado: "Sin Grado",
    genero: "",
    codigo_qr: "EXPLORADOR-0000000000",
    nino_id: null
};

let juegoMate = { n1: 0, n2: 0, op: '+', resp: 0 };

const materiasData = {
    espanol: {
        titulo: "Español, Ortografía, Gramática y Acentuación",
        desc: "Aprende jugando con ejercicios interactivos, sopas de letras, ordenamiento de oraciones y clasificación de palabras.",
        icono: "fa-book"
    },
    ciencias: {
        titulo: "Ciencias Naturales y Biología",
        desc: "Explora la fotosíntesis, el ciclo del agua, el cuerpo humano y la preservación de los ecosistemas.",
        icono: "fa-flask"
    },
    geografia: {
        titulo: "Geografía y el Planeta Tierra",
        desc: "Descubre los continentes, océanos, orografía, climas del mundo y representación de mapas.",
        icono: "fa-earth-americas"
    },
    historia: {
        titulo: "Historia Universal y Nacional",
        desc: "Viaja a través del tiempo conociendo las civilizaciones antiguas y grandes hitos históricos.",
        icono: "fa-landmark"
    },
    civica: {
        titulo: "Formación Cívica y Ética",
        desc: "Comprende los derechos de la infancia, las reglas comunitarias y la vida en armonía.",
        icono: "fa-scale-balanced"
    }
};

const lecturasLargas = [
    {
        id: 1,
        titulo: "El Viaje del Pequeño Colibrí y el Secreto del Bosque",
        texto: "Había una vez en un frondoso bosque un pequeño colibrí llamado Tito. Tito era famoso porque sus alas brillaban con hermosos tonos esmeralda. Un verano caluroso, el arroyo principal del bosque comenzó a secarse rápidamente. Los animales estaban muy preocupados. Tito no se rindió y voló hacia la cima de la montaña más alta para pedir ayuda a las nubes. Con amabilidad, respeto y perseverancia, les explicó la situación. Las nubes, conmocionadas por la dedicación de Tito, volaron hacia el valle y dejaron caer una suave lluvia fresca que llenó de nuevo el arroyo, salvando a todo el bosque.",
    }
];

const valoresLista = [
    { titulo: "La Empatía", desc: "Comprender y sentir lo que otra persona experimenta.", tip: "Ponte en el lugar del otro antes de opinar." },
    { titulo: "El Respeto", desc: "Tratar con amabilidad y valorar las diferencias individuales.", tip: "Escucha a los demás cuando expresen sus ideas." },
    { titulo: "La Honestidad", desc: "Decir la verdad y actuar con sinceridad siempre.", tip: "Admite tus errores con valor y rectifica." },
    { titulo: "La Responsabilidad", desc: "Cumplir tus compromisos y tareas con esmero.", tip: "Termina tus deberes escolares antes de ir a jugar." }
];

// INICIALIZACIÓN DE LA APLICACIÓN
document.addEventListener("DOMContentLoaded", () => {
    cargarMateria('espanol');
    renderizarValores();
    renderizarLecturas();
    renderizarRecompensas();

    // COMPROBAR SI SE ESCANEO EL QR DEL CARNET PARA VER LA FICHA PÚBLICA
    const urlParams = new URLSearchParams(window.location.search);
    const verFichaToken = urlParams.get('ver_ficha');

    if (verFichaToken) {
        mostrarFichaPublica(verFichaToken);
    }
});

// CONSULTA Y MUESTRA DE FICHA PÚBLICA AL ESCANEAR EL CARNET
async function mostrarFichaPublica(token) {
    try {
        const res = await fetch(`/api/nino/ficha-publica/${token}`);
        const data = await res.json();
        if (data.success) {
            document.getElementById('modal-ficha-nombre').textContent = data.nino.nombre;
            document.getElementById('modal-ficha-grado').textContent = data.nino.grado_escolar;
            document.getElementById('modal-ficha-estrellas').textContent = data.nino.estrellas;
            document.getElementById('modal-ficha-nivel').textContent = data.nino.nivel;
            document.getElementById('modal-ficha-edad').textContent = data.nino.edad + " años";
            document.getElementById('modal-ficha-qr').textContent = data.nino.codigo_qr;

            document.getElementById('modal-ficha-publica').classList.add('active');
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            alert("Credencial de Explorador no encontrada.");
        }
    } catch (err) {
        console.error("Error consultando ficha pública:", err);
    }
}

function cerrarModalFicha() {
    document.getElementById('modal-ficha-publica').classList.remove('active');
}

function actualizarEstadoNiñoGlobal(nino) {
    estadoUsuario.nino_id = nino.id;
    estadoUsuario.nombre = nino.nombre;
    estadoUsuario.edad = nino.edad;
    estadoUsuario.grado = nino.grado_escolar;
    estadoUsuario.genero = nino.genero;
    estadoUsuario.codigo_qr = nino.codigo_qr;
    estadoUsuario.estrellas = nino.estrellas;
    estadoUsuario.nivel = nino.nivel;

    document.getElementById('nombre-nino-activo').textContent = nino.nombre;
    document.getElementById('contador-estrellas').textContent = nino.estrellas;
    document.getElementById('nivel-usuario').textContent = `Nivel ${nino.nivel}`;
    
    const lblSesion = document.getElementById('lbl-sesion');
    if (lblSesion) lblSesion.textContent = `Explorador: ${nino.nombre}`;
}

function mostrarPantalla(id) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.bottom-nav .nav-item').forEach(n => n.classList.remove('active'));
    
    const targetSec = document.getElementById(`sec-${id}`);
    if (targetSec) targetSec.classList.add('active');
    
    const btnNav = document.getElementById(`btn-nav-${id}`);
    if (btnNav) btnNav.classList.add('active');

    if (id === 'perfil-nino') {
        actualizarVistaPerfilNino();
    }
}

// RENDERIZADO DETALLADO DE MATERIAS (INCLUYE ORTOGRAFÍA, GRAMÁTICA Y ACENTUACIÓN DE LAS IMÁGENES)
function cargarMateria(clave) {
    document.querySelectorAll('.sub-tab').forEach(btn => btn.classList.remove('active'));
    const activeSubTab = document.getElementById(`btn-subtab-${clave}`);
    if (activeSubTab) activeSubTab.classList.add('active');

    const data = materiasData[clave];
    const box = document.getElementById('materia-contenido-box');
    if (!box || !data) return;

    if (clave === 'espanol') {
        box.innerHTML = `
            <div class="subject-card">
                <h3><i class="fa-solid ${data.icono}"></i> ${data.titulo}</h3>
                <p>${data.desc}</p>
                <hr style="margin:15px 0;">

                <h4>📋 Resumen de Actividades de Ortografía, Gramática y Acentuación</h4>
                <div style="overflow-x:auto; margin-bottom:20px;">
                    <table style="width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                        <thead style="background:var(--primary, #4A90E2); color:white;">
                            <tr>
                                <th style="padding:10px; text-align:left;">Tema</th>
                                <th style="padding:10px; text-align:left;">Actividad</th>
                                <th style="padding:10px; text-align:left;">¿En qué consiste?</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Ortografía</td><td style="padding:8px;">Encuentra el error</td><td style="padding:8px;">Identificar palabras mal escritas y corregirlas.</td></tr>
                            <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Gramática</td><td style="padding:8px;">Ordena las palabras</td><td style="padding:8px;">Formar oraciones con palabras desordenadas.</td></tr>
                            <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Sujeto y predicado</td><td style="padding:8px;">Divide la oración</td><td style="padding:8px;">Identificar con colores el sujeto y el predicado.</td></tr>
                            <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Acentuación</td><td style="padding:8px;">Coloca la tilde</td><td style="padding:8px;">Escribir correctamente palabras que necesitan acento.</td></tr>
                            <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Reglas ortográficas</td><td style="padding:8px;">Completa la palabra</td><td style="padding:8px;">Elegir entre B o V, C o S, G o J.</td></tr>
                            <tr style="border-bottom:1px solid #eee;"><td style="padding:8px;">Comprensión</td><td style="padding:8px;">Corrige el texto</td><td style="padding:8px;">Leer un pequeño párrafo y corregir sus errores.</td></tr>
                            <tr><td style="padding:8px;">Acentuación</td><td style="padding:8px;">Clasifica las palabras</td><td style="padding:8px;">Separar palabras en agudas, graves, esdrújulas y sobresdrújulas.</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3>✏️ Ejercicios Prácticos Interactivos</h3>
                
                <!-- 1. Encuentra el error -->
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin-bottom:15px;">
                    <h4>1. Encuentra el error (Corrige la palabra)</h4>
                    <p>Corrige la palabra: <strong>Arvol</strong></p>
                    <input type="text" id="inp-error-1" class="input-std" placeholder="Escribe la palabra correcta" style="max-width:250px;">
                    <button class="btn-primary" onclick="validarEjercicio('inp-error-1', 'Árbol', 'fb-error-1', 2)">Comprobar</button>
                    <span id="fb-error-1" style="margin-left:10px; font-weight:bold;"></span>
                </div>

                <!-- 2. Identifica el sujeto y predicado -->
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin-bottom:15px;">
                    <h4>2. Identifica el sujeto y predicado</h4>
                    <p>Oración: <em>"El perro corre en el parque."</em></p>
                    <p>¿Cuál es el sujeto?</p>
                    <input type="text" id="inp-sujeto-1" class="input-std" placeholder="Ej. El perro" style="max-width:250px;">
                    <button class="btn-primary" onclick="validarEjercicio('inp-sujeto-1', 'El perro', 'fb-sujeto-1', 2)">Comprobar</button>
                    <span id="fb-sujeto-1" style="margin-left:10px; font-weight:bold;"></span>
                </div>

                <!-- 3. Coloca las tildes -->
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin-bottom:15px;">
                    <h4>3. Coloca las tildes</h4>
                    <p>Escribe correctamente con tilde: <strong>Cancion</strong></p>
                    <input type="text" id="inp-tilde-1" class="input-std" placeholder="Escribe la palabra acentuada" style="max-width:250px;">
                    <button class="btn-primary" onclick="validarEjercicio('inp-tilde-1', 'Canción', 'fb-tilde-1', 2)">Comprobar</button>
                    <span id="fb-tilde-1" style="margin-left:10px; font-weight:bold;"></span>
                </div>

                <!-- 4. Ordena las palabras -->
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin-bottom:15px;">
                    <h4>4. Ordena las palabras</h4>
                    <p>Palabras desordenadas: <strong>juega / parque / El / niño / en / el.</strong></p>
                    <input type="text" id="inp-ordena-1" class="input-std" placeholder="Escribe la oración ordenada" style="max-width:350px;">
                    <button class="btn-primary" onclick="validarEjercicio('inp-ordena-1', 'El niño juega en el parque.', 'fb-ordena-1', 2)">Comprobar</button>
                    <span id="fb-ordena-1" style="margin-left:10px; font-weight:bold;"></span>
                </div>

                <!-- 5. Clasifica las palabras -->
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; margin-bottom:15px;">
                    <h4>5. Clasifica las palabras (Agudas, Graves, Esdrújulas)</h4>
                    <table style="width:100%; border-collapse:collapse; background:#fff; text-align:center;">
                        <tr style="background:#eee;"><th>Agudas</th><th>Graves</th><th>Esdrújulas</th></tr>
                        <tr><td>Café</td><td>Árbol</td><td>Música</td></tr>
                        <tr><td>Canción</td><td>Lápiz</td><td>Pájaro</td></tr>
                        <tr><td>Ratón</td><td>Mesa</td><td>Matemáticas</td></tr>
                    </table>
                    <p style="margin-top:10px;">¿Qué tipo de palabra es <strong>Pájaro</strong>?</p>
                    <select id="inp-clasif-1" class="input-std" style="max-width:200px;">
                        <option value="">Selecciona...</option>
                        <option value="Aguda">Aguda</option>
                        <option value="Grave">Grave</option>
                        <option value="Esdrújula">Esdrújula</option>
                    </select>
                    <button class="btn-primary" onclick="validarEjercicio('inp-clasif-1', 'Esdrújula', 'fb-clasif-1', 2)">Comprobar</button>
                    <span id="fb-clasif-1" style="margin-left:10px; font-weight:bold;"></span>
                </div>

                <!-- Otras actividades creativas -->
                <div style="background:#eef6ff; padding:15px; border-radius:10px; margin-top:15px;">
                    <h4>🎨 Otras actividades creativas recomendadas</h4>
                    <ul style="margin-left:20px; line-height:1.8;">
                        <li>🧩 <strong>Rompecabezas de oraciones:</strong> Une bloques para armar oraciones coherentes.</li>
                        <li>🏆 <strong>Concurso de deletreo:</strong> Demuestra tu nivel letra por letra.</li>
                        <li>🎨 <strong>Colorear sujeto y predicado:</strong> Marca en azul el sujeto y en rojo el predicado.</li>
                        <li>🎲 <strong>Dados de palabras:</strong> Lanza dados virtuales para formar oraciones aleatorias.</li>
                        <li>🔍 <strong>Sopa de letras:</strong> Encuentra palabras correctamente escritas.</li>
                        <li>🧠 <strong>Trivia de ortografía y gramática:</strong> Preguntas exprés para ganar estrellas extra.</li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        box.innerHTML = `
            <div class="subject-card">
                <h3><i class="fa-solid ${data.icono}"></i> ${data.titulo}</h3>
                <p>${data.desc}</p>
                <button class="btn-primary" style="margin-top: 15px;" onclick="sumarEstrellas(2)">Completar Módulo (+2 ⭐)</button>
            </div>
        `;
    }
}

// VALIDADOR GENÉRICO PARA LOS EJERCICIOS DE ESPAÑOL
function validarEjercicio(inputId, respuestaCorrecta, feedbackId, puntos) {
    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);
    if (!input || !feedback) return;

    const val = input.value.trim();
    if (val.toLowerCase() === respuestaCorrecta.toLowerCase()) {
        feedback.style.color = "green";
        feedback.textContent = `¡Correcto! (+${puntos} ⭐)`;
        sumarEstrellas(puntos);
    } else {
        feedback.style.color = "red";
        feedback.textContent = `Incorrecto. Intenta escribir: "${respuestaCorrecta}"`;
    }
}

function renderizarValores() {
    const grid = document.getElementById('grid-valores-tarjetas');
    if (grid) {
        grid.innerHTML = valoresLista.map(v => `
            <div class="value-card">
                <h3>${v.titulo}</h3>
                <p>${v.desc}</p>
                <small style="color: var(--primary);"><strong>Consejo:</strong> ${v.tip}</small>
            </div>
        `).join('');
    }
}

function renderizarLecturas() {
    const grid = document.getElementById('grid-lecturas');
    if (grid) {
        grid.innerHTML = lecturasLargas.map(l => `
            <div class="article-card">
                <h3>${l.titulo}</h3>
                <p style="line-height:1.6; margin: 10px 0;">${l.texto}</p>
                <button class="btn-primary" onclick="sumarEstrellas(5)">¡Lectura Completada! (+5 ⭐)</button>
            </div>
        `).join('');
    }
}

function sumarEstrellas(cant) {
    estadoUsuario.estrellas = Math.max(0, estadoUsuario.estrellas + cant);
    estadoUsuario.nivel = Math.floor(estadoUsuario.estrellas / 20) + 1;
    document.getElementById('contador-estrellas').textContent = estadoUsuario.estrellas;
    document.getElementById('nivel-usuario').textContent = `Nivel ${estadoUsuario.nivel}`;
    
    fetch('/api/nino/actualizar-estrellas', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ estrellas: cant })
    }).catch(() => {});

    if(cant > 0) alert(`¡Has ganado ${cant} estrellas! ⭐`);
}

function completarHabito(btn, cant) {
    btn.disabled = true;
    btn.innerText = "¡Completado! ✓";
    sumarEstrellas(cant);
}

function renderizarRecompensas() {
    const grid = document.getElementById('grid-recompensas');
    if (grid) {
        grid.innerHTML = `
            <div class="reward-card">
                <h3>Insignia Explorador Junior</h3>
                <p>Requiere 10 Estrellas</p>
                <button class="btn-primary" onclick="canjearPremios(10)">Canjear</button>
            </div>
            <div class="reward-card">
                <h3>Trofeo Sabio Escolar</h3>
                <p>Requiere 30 Estrellas</p>
                <button class="btn-primary" onclick="canjearPremios(30)">Canjear</button>
            </div>
        `;
    }
}

function canjearPremios(costo) {
    if (estadoUsuario.estrellas >= costo) {
        sumarEstrellas(-costo);
        alert("¡Felicidades! Has canjeado tu recompensa virtual 🎉");
    } else {
        alert("¡Te faltan estrellas! Sigue completando actividades.");
    }
}

// RETOS MATEMÁTICOS
function iniciarJuegoMate(modo) {
    document.getElementById('arena-mate').classList.remove('hidden');
    juegoMate.n1 = Math.floor(Math.random() * 10) + 1;
    juegoMate.n2 = Math.floor(Math.random() * 10) + 1;

    if (modo === 'suma') { juegoMate.op = '+'; juegoMate.resp = juegoMate.n1 + juegoMate.n2; }
    else if (modo === 'resta') { 
        if(juegoMate.n1 < juegoMate.n2) [juegoMate.n1, juegoMate.n2] = [juegoMate.n2, juegoMate.n1];
        juegoMate.op = '-'; juegoMate.resp = juegoMate.n1 - juegoMate.n2; 
    }
    else if (modo === 'multiplicacion') { juegoMate.op = '×'; juegoMate.resp = juegoMate.n1 * juegoMate.n2; }
    else if (modo === 'division') { juegoMate.resp = juegoMate.n1; juegoMate.n1 = juegoMate.n1 * juegoMate.n2; juegoMate.op = '÷'; }
    else { juegoMate.op = '+'; juegoMate.resp = juegoMate.n1 + juegoMate.n2; }

    document.getElementById('pregunta-mate-txt').textContent = `${juegoMate.n1} ${juegoMate.op} ${juegoMate.n2} = ?`;
    document.getElementById('resp-mate-input').value = '';
    document.getElementById('feedback-mate').textContent = '';
}

function verificarRespuestaMate() {
    const val = parseInt(document.getElementById('resp-mate-input').value);
    const feedback = document.getElementById('feedback-mate');
    if (val === juegoMate.resp) {
        feedback.style.color = 'var(--success, green)';
        feedback.textContent = '¡Correcto! +2 estrellas ⭐';
        sumarEstrellas(2);
        setTimeout(() => iniciarJuegoMate('suma'), 1500);
    } else {
        feedback.style.color = 'var(--accent, red)';
        feedback.textContent = 'Inténtalo de nuevo.';
    }
}

// AUTENTICACIÓN Y ABCM TUTOR
function abrirModalAuth() { document.getElementById('modal-auth').classList.add('active'); }
function cerrarModalAuth() { document.getElementById('modal-auth').classList.remove('active'); }

function verTabAuth(tab) {
    document.getElementById('form-login-tutor').classList.add('hidden');
    document.getElementById('form-reg-tutor').classList.add('hidden');

    document.getElementById('tab-auth-login').classList.remove('active');
    document.getElementById('tab-auth-registro').classList.remove('active');

    if(tab === 'login') {
        document.getElementById('form-login-tutor').classList.remove('hidden');
        document.getElementById('tab-auth-login').classList.add('active');
    }
    if(tab === 'registro') {
        document.getElementById('form-reg-tutor').classList.remove('hidden');
        document.getElementById('tab-auth-registro').classList.add('active');
    }
}

async function loginTutor(e) {
    e.preventDefault();
    try {
        const res = await fetch('/api/tutor/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: document.getElementById('login-email').value,
                password: document.getElementById('login-pwd').value
            })
        });
        const data = await res.json();
        if(res.ok && data.success) {
            document.getElementById('auth-seccion-tutor').classList.add('hidden');
            document.getElementById('panel-abcm-tutor').classList.remove('hidden');
            cargarListaNinosABCM();
        } else {
            alert(data.msg || "Credenciales incorrectas.");
        }
    } catch (err) {
        alert("Error de conexión con el servidor.");
    }
}

async function registroTutor(e) {
    e.preventDefault();
    try {
        const res = await fetch('/api/tutor/registro', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                nombre: document.getElementById('reg-nombre').value,
                email: document.getElementById('reg-email').value,
                password: document.getElementById('reg-pwd').value,
                telefono: document.getElementById('reg-tel').value
            })
        });
        const data = await res.json();
        if(data.success) {
            alert("Registro exitoso. Ahora puedes ingresar.");
            verTabAuth('login');
        } else {
            alert(data.msg || "Error al registrarse.");
        }
    } catch (err) {
        alert("Ocurrió un error al enviar el registro.");
    }
}

async function cargarListaNinosABCM() {
    const res = await fetch('/api/ninos');
    const data = await res.json();
    const box = document.getElementById('lista-ninos-abcm');
    if(data.success && box) {
        box.innerHTML = data.ninos.map(n => `
            <div class="abcm-item" style="background:#f8f9fa; padding:12px; border-radius:10px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong>${n.nombre}</strong> (${n.edad} años, ${n.grado_escolar})<br>
                    <small>QR: ${n.codigo_qr} | Estrellas: ${n.estrellas}</small>
                </div>
                <div>
                    <button class="btn-primary" onclick="seleccionarNinoSesion(${n.id})">Entrar</button>
                    <button class="btn-secondary" onclick="bajaNino(${n.id})">Baja</button>
                </div>
            </div>
        `).join('');
    }
}

async function altaNino(e) {
    e.preventDefault();
    const res = await fetch('/api/ninos/alta', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            nombre: document.getElementById('alta-nombre').value,
            edad: document.getElementById('alta-edad').value,
            grado: document.getElementById('alta-grado').value,
            genero: document.getElementById('alta-genero').value
        })
    });
    const data = await res.json();
    if(data.success) {
        document.getElementById('alta-nombre').value = '';
        document.getElementById('alta-edad').value = '';
        document.getElementById('alta-grado').value = '';
        cargarListaNinosABCM();
    } else {
        alert(data.msg || "Error al dar de alta al niño.");
    }
}

async function bajaNino(id) {
    if(confirm("¿Seguro que deseas eliminar este perfil?")) {
        await fetch(`/api/ninos/baja/${id}`, { method: 'DELETE' });
        cargarListaNinosABCM();
    }
}

async function seleccionarNinoSesion(id) {
    try {
        const res = await fetch(`/api/nino/seleccionar/${id}`, { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
            actualizarEstadoNiñoGlobal(data.nino);
            cerrarModalAuth();
            mostrarPantalla('inicio');
            alert(`¡Sesión iniciada como ${data.nino.nombre}! 🎉`);
        } else {
            alert(data.msg || "No se pudo iniciar sesión.");
        }
    } catch (err) {
        alert("Error de conexión al seleccionar el perfil.");
    }
}

async function actualizarVistaPerfilNino() {
    document.getElementById('pnino-nombre').textContent = estadoUsuario.nombre;
    document.getElementById('pnino-grado').textContent = estadoUsuario.grado;
    document.getElementById('pnino-edad').textContent = estadoUsuario.edad + " años";
    document.getElementById('pnino-estrellas').textContent = estadoUsuario.estrellas;
    document.getElementById('pnino-nivel').textContent = estadoUsuario.nivel;
    document.getElementById('pnino-qr-code').textContent = estadoUsuario.codigo_qr;

    if (estadoUsuario.codigo_qr && estadoUsuario.codigo_qr !== "EXPLORADOR-0000000000") {
        try {
            const res = await fetch(`/api/nino/generar-qr-imagen/${estadoUsuario.codigo_qr}`);
            const data = await res.json();
            if (data.success) {
                document.getElementById('pnino-qr-img-box').innerHTML = `<img src="${data.qr_image}" alt="Código QR" style="max-width:140px; border-radius:8px;">`;
            }
        } catch (err) {
            console.error("Error al obtener imagen QR");
        }
    }
}

function cerrarSesionTutor() {
    fetch('/api/logout', { method: 'POST' });
    location.reload();
}