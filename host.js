/**
 * HOST - Sistema POS y Gestión de Restaurantes (Lógica de Conversión)
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. MODAL DE SOLICITUD DE DEMO (VENTA CONSULTIVA)
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
  // 2. RETROALIMENTACIÓN DE FORMULARIO DE DEMO
  // ==========================================================================
  const hostForm = document.getElementById('hostDemoForm');

  if (hostForm) {
    hostForm.addEventListener('submit', function () {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.innerHTML = '<span>Agendando Demo...</span>';
      }
    });
  }

  // ==========================================================================
  // 3. NAVEGACIÓN Y LOGIN EXTERNO
  // ==========================================================================
  const btnProbarGratis = document.getElementById('btn-probar-gratis-host');
  const LOGIN_URL = 'https://ashy-hill-0b8ff710f.7.azurestaticapps.net/login';

  if (btnProbarGratis) {
    btnProbarGratis.addEventListener('click', () => {
      window.open(LOGIN_URL, '_blank', 'noopener,noreferrer');
    });
  }

  // ==========================================================================
  // 4. ANIMACIONES AL SCROLL Y MICROINTERACCIONES
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

  // Dynamic Navbar Shadow
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    });
  }

  // ==========================================================================
  // 5. CONTROL DE LÍMITE DE CARACTERES
  // ==========================================================================
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

  setupCharacterLimit('lead-notes', 'hostNotesCount', 150);
});