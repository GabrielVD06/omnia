/**
 * HOST - Sistema POS y Gestión de Restaurantes (Lógica Frontend)
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
  // 2. REDIRECCIONES EXTERNAS ("Probar HOST Gratis" / "Demo Interactiva")
  // ==========================================================================
  const LOGIN_URL = 'https://ashy-hill-0b8ff710f.7.azurestaticapps.net/login';
  const loginButtons = document.querySelectorAll('#btn-probar-gratis-host, .btn-open-login');

  loginButtons.forEach(button => {
    button.addEventListener('click', () => {
      window.open(LOGIN_URL, '_blank', 'noopener,noreferrer');
    });
  });

  // Estado visual de envío en el Formulario de Demo
  const hostDemoForm = document.getElementById('hostDemoForm');
  if (hostDemoForm) {
    hostDemoForm.addEventListener('submit', function () {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.innerHTML = '<span>Agendando Demo...</span>';
      }
    });
  }

  // Contador de caracteres dinámico para formulario inferior
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

  // ==========================================================================
  // 3. REVELACIÓN PROGRESIVA DE ELEMENTOS (REVEAL ON SCROLL)
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
  // 4. DESPLAZAMIENTO SUAVE Y LOGO TOPE (SMOOTH SCROLL)
  // ==========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      // Clic en el logo o en "#" vacíos te lleva directo al tope
      if (!targetId || targetId === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbar = document.querySelector('.navbar');
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