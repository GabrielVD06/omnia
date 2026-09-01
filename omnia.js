/**
 * OMNIA Suite - Script de Interacción, Enrutamiento y Efectos Visuales
 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Enrutamiento dinámico para tarjetas de producto
  const systemRoutes = {
    'btn-restaurantes': 'host.html',
    'btn-copropiedades': 'home.html'
  };

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.system-card-btn');
    if (!card) return;

    const route = systemRoutes[card.id];
    if (route && card.tagName !== 'A') {
      window.location.href = route;
    }
  });

  // 2. Transición del Navbar al hacer Scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            navbar.classList.add('navbar-scrolled');
          } else {
            navbar.classList.remove('navbar-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // 3. Revelación Progresiva (Reveal on Scroll)
  document.documentElement.classList.add('js-enabled');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
  elementsToReveal.forEach(el => revealObserver.observe(el));
});
/**
 * OMNIA Suite - Restricción de Caracteres y Retroalimentación UX
 */
document.addEventListener('DOMContentLoaded', () => {
  
  // Función reutilizable para gestionar el conteo y límites de input
  const setupCharacterLimit = (inputId, counterId, maxLength) => {
    const inputField = document.getElementById(inputId);
    const counterDisplay = document.getElementById(counterId);

    if (!inputField || !counterDisplay) return;

    inputField.addEventListener('input', (e) => {
      let currentLength = e.target.value.length;

      // Truncado estricto por seguridad en cliente
      if (currentLength > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
        currentLength = maxLength;
      }

      // Actualizar contador
      counterDisplay.textContent = currentLength;

      // Estado visual cuando se alcanza el límite máximo
      if (currentLength >= maxLength) {
        inputField.classList.add('limit-reached');
      } else {
        inputField.classList.remove('limit-reached');
      }
    });
  };

  // Inicialización exclusiva para el formulario final de OMNIA
  setupCharacterLimit('c-description', 'descriptionCount', 150);

  // Agregar este bloque dentro del DOMContentLoaded en host.js
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navbarHeight = document.querySelector('.navbar').offsetHeight || 70;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

});