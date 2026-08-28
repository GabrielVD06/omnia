/**
 * OMNIA Suite - Script Principal de Interacción, Enrutamiento y Modales CRO
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. ENRUTAMIENTO DINÁMICO Y DASHBOARD
  // ==========================================================================
  const systemButtons = document.querySelectorAll('.system-card-btn');

  const systemRoutes = {
    'btn-restaurantes': 'host.html',
    'btn-copropiedades': 'home.html'
  };

  systemButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const currentButton = e.currentTarget;
      const systemId = currentButton.id;

      if (systemRoutes[systemId] && currentButton.tagName !== 'A') {
        window.location.href = systemRoutes[systemId];
      }
    });
  });


  // ==========================================================================
  // 2. CONTROL CONTROLADO DE MODAL (ACCESIBILIDAD Y CRO)
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

  // Asignar evento a todos los botones con la clase de apertura
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
  // 3. RETROALIMENTACIÓN DE FORMULARIOS (FEEDBACK VISUAL CRO)
  // ==========================================================================
  const forms = document.querySelectorAll('.demo-form');

  forms.forEach(form => {
    form.addEventListener('submit', function () {
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.innerHTML = '<span>Procesando Solicitud...</span>';
      }
    });
  });

  // ==========================================================================
  // 4. FLUJO INDEPENDIENTE PARA "PROBAR GRATIS"
  // ==========================================================================
  // Esta lógica captura al usuario que desea probar por su cuenta,
  // separándolo del flujo de venta consultiva (Agendar Demo).
  const btnProbarGratisHome = document.getElementById('btn-probar-home-gratis');

  if (btnProbarGratisHome) {
    btnProbarGratisHome.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Aquí puedes colocar la redirección hacia tu vista de registro o trial
      // Ejemplo: window.location.href = 'registro-free-trial.html';
      
      // Feedback temporal de consola para asegurar que funciona correctamente
      console.log('Navegando hacia el flujo de prueba gratuita de HOME...');
      alert('Se iniciará el proceso de registro para la prueba gratuita.');
    });
  }

});