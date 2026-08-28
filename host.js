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
});