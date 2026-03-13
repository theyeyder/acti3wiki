// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const navLinks = document.querySelectorAll('.nav-menu li a');
    const currentDateElement = document.getElementById('currentDate');
    const currentYearElement = document.getElementById('currentYear');
    const fechaPlaceholder = document.getElementById('fechaPlaceholder');
    const autoresPlaceholder = document.getElementById('autoresPlaceholder');
    const authorsGrid = document.getElementById('authorsGrid');
    const addAuthorBtn = document.getElementById('addAuthorBtn');
    const authorNameInput = document.getElementById('authorName');
    const authorRoleInput = document.getElementById('authorRole');

    // ========== FECHAS ==========
    // Fecha actual para el hero
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    if (currentDateElement) {
        currentDateElement.textContent = today.toLocaleDateString('es-ES', options);
    }

    // Año actual para el footer
    if (currentYearElement) {
        currentYearElement.textContent = today.getFullYear();
    }

    // Fecha para el placeholder del artículo
    if (fechaPlaceholder) {
        fechaPlaceholder.textContent = today.toLocaleDateString('es-ES', options);
    }

    // ========== AUTORES ==========
    // Array inicial de autores (incluyendo los investigadores principales)
let autores = [
    { nombre: 'Eyder de Jesús Arroyo Vega', rol: 'Investigador Principal - Redacción y análisis' },
    { nombre: 'Cristian Andrés Bacca Uribe', rol: 'Investigador Principal - Diseño y desarrollo' },
    { nombre: 'Magda Fernández', rol: 'Docente - Orientación y revisión' },
    { nombre: 'Ana María González', rol: 'Redacción y edición' },
    { nombre: 'Carlos Eduardo Pérez', rol: 'Investigación y referencias' },
    { nombre: 'Laura Patricia Sánchez', rol: 'Diseño conceptual' }
];
    // Actualizar el placeholder de autores en el encabezado
    function actualizarPlaceholderAutores() {
        if (autoresPlaceholder) {
            const nombresAutores = autores.map(a => a.nombre).join(', ');
            autoresPlaceholder.textContent = nombresAutores;
        }
    }

    // Renderizar tarjetas de autores
    function renderizarAutores() {
        if (!authorsGrid) return;

        authorsGrid.innerHTML = '';
        
        autores.forEach((autor, index) => {
            const iniciales = autor.nombre
                .split(' ')
                .map(p => p[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

            const authorCard = document.createElement('div');
            authorCard.className = 'author-card';
            authorCard.innerHTML = `
                <div class="author-avatar">${iniciales}</div>
                <h4>${autor.nombre}</h4>
                <p class="author-role">${autor.rol}</p>
                <button class="delete-author" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            authorsGrid.appendChild(authorCard);
        });

        // Añadir event listeners a los botones de eliminar
        document.querySelectorAll('.delete-author').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const index = this.getAttribute('data-index');
                eliminarAutor(index);
            });
        });

        actualizarPlaceholderAutores();
    }

    // Añadir nuevo autor
    function añadirAutor(nombre, rol) {
        if (!nombre || !rol) {
            alert('Por favor, completa todos los campos');
            return false;
        }

        autores.push({ nombre, rol });
        renderizarAutores();
        
        // Limpiar inputs
        if (authorNameInput) authorNameInput.value = '';
        if (authorRoleInput) authorRoleInput.value = '';

        // Mostrar mensaje de éxito
        mostrarNotificacion('Autor añadido correctamente', 'success');
        return true;
    }

    // Eliminar autor
    function eliminarAutor(index) {
        if (confirm('¿Estás seguro de eliminar este autor?')) {
            autores.splice(index, 1);
            renderizarAutores();
            mostrarNotificacion('Autor eliminado', 'info');
        }
    }

    // Event listener para botón añadir autor
    if (addAuthorBtn) {
        addAuthorBtn.addEventListener('click', function() {
            const nombre = authorNameInput ? authorNameInput.value.trim() : '';
            const rol = authorRoleInput ? authorRoleInput.value.trim() : '';
            añadirAutor(nombre, rol);
        });
    }

    // Permitir añadir con Enter
    if (authorNameInput && authorRoleInput) {
        authorRoleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addAuthorBtn.click();
            }
        });
    }

    // Renderizar autores iniciales
    renderizarAutores();

    // ========== FUNCIONES ==========
    // Mostrar notificación
    function mostrarNotificacion(mensaje, tipo = 'success') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${mensaje}</span>
        `;
        
        // Estilos para la notificación
        notificacion.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${tipo === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            font-family: 'Inter', sans-serif;
        `;

        document.body.appendChild(notificacion);

        // Añadir animaciones
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Eliminar después de 3 segundos
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    // ========== MENÚ MÓVIL ==========
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle?.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // ========== NAVBAR SCROLL ==========
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========== SCROLL TO TOP ==========
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== ACTIVE LINK ON SCROLL ==========
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ========== CONTADOR DE PALABRAS ==========
    function contarPalabras() {
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            const texto = articleContent.textContent;
            const palabras = texto.trim().split(/\s+/).length;
            console.log(`El artículo tiene aproximadamente ${palabras} palabras.`);
        }
    }
    contarPalabras();

    // ========== GUARDAR AUTORES EN LOCALSTORAGE ==========
    function guardarAutoresEnStorage() {
        localStorage.setItem('blogAutores', JSON.stringify(autores));
    }

    function cargarAutoresDeStorage() {
        const autoresGuardados = localStorage.getItem('blogAutores');
        if (autoresGuardados) {
            try {
                autores = JSON.parse(autoresGuardados);
                renderizarAutores();
            } catch (e) {
                console.error('Error al cargar autores del localStorage');
            }
        }
    }

    // Guardar autores cuando se modifiquen
    function guardarYRenderizar() {
        guardarAutoresEnStorage();
        renderizarAutores();
    }

    // Sobrescribir funciones para guardar en storage
    const añadirAutorOriginal = añadirAutor;
    añadirAutor = function(nombre, rol) {
        const resultado = añadirAutorOriginal(nombre, rol);
        if (resultado) {
            guardarAutoresEnStorage();
        }
        return resultado;
    };

    const eliminarAutorOriginal = eliminarAutor;
    eliminarAutor = function(index) {
        eliminarAutorOriginal(index);
        guardarAutoresEnStorage();
    };

    // Cargar autores al iniciar
    cargarAutoresDeStorage();

    // ========== ANIMACIONES AL HACER SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.article-card, .author-card, .technique-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========== COMPARTIR EN REDES SOCIALES ==========
    function compartirEnTwitter() {
        const titulo = 'Más Allá del Chip: Estrategias para Convertir la Creatividad en un Manantial Inagotable de Ideas';
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(titulo)}&url=${encodeURIComponent(url)}`, '_blank');
    }

    function compartirEnLinkedIn() {
        const url = window.location.href;
        const titulo = 'Más Allá del Chip - Blog sobre Creatividad';
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }

    // Añadir event listeners a botones de compartir si existen
    const twitterBtn = document.querySelector('.fa-twitter')?.parentElement;
    const linkedinBtn = document.querySelector('.fa-linkedin')?.parentElement;

    if (twitterBtn) {
        twitterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            compartirEnTwitter();
        });
    }

    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            compartirEnLinkedIn();
        });
    }

    // ========== PROGRESS BAR DE LECTURA ==========
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 80px;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});