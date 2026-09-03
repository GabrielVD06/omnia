/**
 * HOME - Gestión Inteligente de Copropiedades (Lógica Frontend & UX de Conversión)
 * Basado en la arquitectura unificada de OMNIA Suite.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. MODAL DE SOLICITUD DE DEMO (CONVERSIÓN CONSULTIVA)
  // ==========================================================================
  const modal = document.getElementById('demoModal');
  const openButtons = document.querySelectorAll('.open-demo-modal');
  const closeButton = document.getElementById('closeModal');

  const openModal = () => {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================================================
  // 2. REDIRECCIONES EXTERNAS Y FEEDBACK DE FORMULARIO
  // ==========================================================================
  // Redirección para el botón "Probar HOME Gratis"
  const HOME_LOGIN_URL = 'https://ashy-hill-0b8ff710f.7.azurestaticapps.net/login';
  const probarGratisBtn = document.getElementById('btn-probar-home-gratis');

  if (probarGratisBtn) {
    probarGratisBtn.addEventListener('click', () => {
      window.open(HOME_LOGIN_URL, '_blank', 'noopener,noreferrer');
    });
  }

  // Feedback de carga en el envío del formulario de demo
  const homeDemoForm = document.getElementById('homeDemoForm');
  if (homeDemoForm) {
    homeDemoForm.addEventListener('submit', function () {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.innerHTML = '<span>Activando Acceso...</span>';
      }
    });
  }

  // ==========================================================================
  // 3. REVELACIÓN PROGRESIVA (REVEAL ON SCROLL CON INTERSECTION OBSERVER)
  // ==========================================================================
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

  // ==========================================================================
  // 4. TRANSICIÓN DEL NAVBAR AL HACER SCROLL
  // ==========================================================================
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

  // ==========================================================================
  // 5. DESPLAZAMIENTO SUAVE Y NAVEGACIÓN
  // ==========================================================================
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