/**
 * OMNIA Suite - Script Unificado de Interacción, Enrutamiento y UX
 */
document.addEventListener('DOMContentLoaded', () => {

  // 1. Enrutamiento Dinámico de Tarjetas de Producto
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

  // 2. Transición Visual del Navbar al hacer Scroll (Throttle via RAF)
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

  // 3. Revelación Progresiva (Reveal on Scroll con Observer)
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

  // 4. Conteo de Caracteres y Control de Límites
  const setupCharacterLimit = (inputId, counterId, maxLength) => {
    const inputField = document.getElementById(inputId);
    const counterDisplay = document.getElementById(counterId);

    if (!inputField || !counterDisplay) return;

    inputField.addEventListener('input', (e) => {
      let currentLength = e.target.value.length;

      if (currentLength > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength);
        currentLength = maxLength;
      }

      counterDisplay.textContent = currentLength;

      if (currentLength >= maxLength) {
        inputField.classList.add('limit-reached');
      } else {
        inputField.classList.remove('limit-reached');
      }
    });
  };

  setupCharacterLimit('c-description', 'descriptionCount', 150);

  // 5. Desplazamiento Suave (Smooth Scroll)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (!targetId || targetId === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
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
/* ==========================================================================
5. SISTEMA DE NOTIFICACIÓN TOAST (Función Global)
========================================================================== */
function showToast(message) {
const toast = document.getElementById('toastNotification');
if (!toast) return;

const toastSpan = toast.querySelector('span');
if (toastSpan && message) {
 toastSpan.textContent = message;
}

toast.classList.remove('hidden');

// Ocultar notificación tras 3.5 segundos
setTimeout(() => {
 toast.classList.add('hidden');
}, 3500);
}