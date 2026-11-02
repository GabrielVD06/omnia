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

  const pageRoots = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')];
  let lastFocus = null;

  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const getFocusable = () => {
    if (!modal) return [];
    return [...modal.querySelectorAll(focusableSelector)].filter((el) => el.getClientRects().length > 0);
  };

  const setPageInert = (inert) => {
    pageRoots.forEach((el) => {
      if (el) el.inert = inert;
    });
  };

  const openModal = (opener) => {
    if (!modal) return;
    lastFocus = opener || document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setPageInert(true);
    const focusable = getFocusable();
    const firstField = modal.querySelector('#nombre');
    const target = firstField || focusable[0];
    setTimeout(() => {
      if (modal.classList.contains('active')) target?.focus();
    }, 0);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setPageInert(false);
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  };

  openButtons.forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn);
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

  document.addEventListener('focusin', (e) => {
    if (!modal || !modal.classList.contains('active')) return;
    if (modal.contains(e.target)) return;
    const focusable = getFocusable();
    if (focusable[0]) focusable[0].focus();
  });

  document.addEventListener('keydown', (e) => {
    const modalOpen = modal && modal.classList.contains('active');

    if (e.key === 'Escape' && modalOpen) {
      closeModal();
      return;
    }

    if (e.key !== 'Tab' || !modalOpen) return;

    const focusable = getFocusable();
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!modal.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
      return;
    }

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // ==========================================================================
  // 1b. MENÚ EN PANTALLAS PEQUEÑAS
  // ==========================================================================
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const navbar = document.querySelector('.navbar');

  const closeNav = () => {
    if (!navbar || !navToggle) return;
    navbar.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
  };

  const openNav = () => {
    if (!navbar || !navToggle) return;
    navbar.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
  };

  if (navToggle && siteNav && navbar) {
    navToggle.addEventListener('click', () => {
      if (navbar.classList.contains('nav-open')) closeNav();
      else openNav();
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('nav-open') && !(modal && modal.classList.contains('active'))) {
        closeNav();
        navToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) closeNav();
    });
  }

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

  // Envío de los formularios sin salir de la página
  async function enviarFormulario(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const payload = new URLSearchParams(new FormData(form));

    try {
      const response = await fetch('https://formsubmit.co/fd4b7a3ed336c6765375f7dcf10bce60', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        },
        body: payload
      });

      const text = await response.text();
      let result = {};
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        result = {};
      }
      const accepted = response.ok && !/needs Activation/i.test(text) && result.success !== false && result.success !== 'false';
      if (!accepted) throw new Error('send failed');

      form.reset();
      if (form.closest('#demoModal')) closeModal();
      showToast('Mensaje enviado. Te contactamos pronto.');
    } catch (error) {
      showToast('No pudimos enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  [document.getElementById('hostDemoForm'), document.getElementById('hostLeadBottomForm')].forEach((form) => {
    if (!form) return;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      enviarFormulario(form);
    });
  });

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

let toastTimer;

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  const toastSpan = toast.querySelector('span');
  if (toastSpan && message) {
    toastSpan.textContent = message;
  }

  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}