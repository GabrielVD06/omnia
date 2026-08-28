/**
 * OMNIA Suite - Main Interactive, Routing & Modal Control Script
 * Arquitectura modular, accesible e intencional para maximizar la conversión.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. ENRUTAMIENTO DIRECTO Y SIMULACIÓN DE DASHBOARD
  // ==========================================================================
  const systemButtons = document.querySelectorAll('.system-card-btn');

  /**
   * Mapeo de redirección hacia las landings especializadas de producto
   */
  const systemRoutes = {
    'btn-restaurantes': 'host.html',
    'btn-copropiedades': 'home.html'
  };

  /**
   * Base de datos local para la simulación de métricas en tiempo real (Fallback)
   */
  const dashboardData = {
    'btn-restaurantes': {
      ventas: '$12,480',
      ventasTrend: '↑ +14.2% vs ayer',
      pedidos: '18',
      pedidosSub: '5 en cocina • 8 listos',
      ocupacion: '12/20',
      ocupacionSub: '60% de ocupación',
      tiempo: '22 min',
      tiempoTrend: '↓ -3 min vs semana'
    },
    'btn-copropiedades': {
      ventas: '$45,800',
      ventasTrend: '↑ +8.5% este mes',
      pedidos: '142',
      pedidosSub: '12 pendientes • 130 al día',
      ocupacion: '85/90',
      ocupacionSub: '94% unidades habitadas',
      tiempo: '15 min',
      tiempoTrend: '↓ -5 min por solicitud'
    }
  };

  /**
   * Actualiza los datos visuales del dashboard con una transición suave de opacidad
   * @param {string} systemId - ID del sistema seleccionado
   */
  const updateDashboardData = (systemId) => {
    const data = dashboardData[systemId];
    if (!data) return;

    const dashBody = document.querySelector('.dash-body');
    if (!dashBody) return;

    // Transición de salida fluida para feedback visual
    dashBody.style.opacity = '0.3';
    dashBody.style.transition = 'opacity 0.15s ease-in-out';

    setTimeout(() => {
      const values = dashBody.querySelectorAll('.metric-value');
      const trends = dashBody.querySelectorAll('.metric-trend, .metric-sub');

      if (values.length >= 4) {
        values[0].textContent = data.ventas;
        values[1].textContent = data.pedidos;
        values[2].textContent = data.ocupacion;
        values[3].textContent = data.tiempo;
      }

      if (trends.length >= 4) {
        trends[0].textContent = data.ventasTrend;
        trends[1].textContent = data.pedidosSub;
        trends[2].textContent = data.ocupacionSub;
        trends[3].textContent = data.tiempoTrend;
      }

      // Restablecer opacidad
      dashBody.style.opacity = '1';
    }, 150);
  };

  /**
   * Gestor de eventos de interacción en las tarjetas del sistema
   */
  systemButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const currentButton = e.currentTarget;
      const systemId = currentButton.id;

      // Prioridad 1: Navegación directa si existe ruta registrada
      if (systemRoutes[systemId]) {
        window.location.href = systemRoutes[systemId];
        return;
      }

      // Prioridad 2: Simulación interactiva local (si no redirige)
      if (currentButton.classList.contains('active')) return;

      systemButtons.forEach(btn => btn.classList.remove('active'));
      currentButton.classList.add('active');

      updateDashboardData(systemId);
    });
  });

  // ==========================================================================
  // 2. CONTROL ACCESIBLE DEL MODAL DE DEMO EN VIVO (HOST)
  // ==========================================================================
  const modal = document.getElementById('demoModal');
  const openButtons = document.querySelectorAll('.open-demo-modal');
  const closeButton = document.getElementById('closeModal');
  const btnProbarGratis = document.getElementById('btn-probar-gratis-host');

  /**
   * Abre la ventana modal y bloquea el scroll del background para evitar desorientación
   */
  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  /**
   * Cierra el modal y restituye la interacción del documento
   */
  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  // Enlazar gatillos exclusivos para abrir la Demo
  openButtons.forEach(btn => btn.addEventListener('click', openModal));

  // Reserva de evento independiente para "Probar HOST Gratis"
  if (btnProbarGratis) {
    btnProbarGratis.addEventListener('click', (e) => {
      e.preventDefault();
      // Reservado para la futura funcionalidad personalizada (Trial / Onboarding)
      console.log('Interacción registrada: Botón "Probar HOST Gratis" presionado.');
    });
  }

  // Enlazar botón de cierre directo
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // Cierre por interacción con el fondo (Backdrop)
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Cierre mediante teclado (Accesibilidad WAI-ARIA)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ==========================================================================
  // 3. MEJORA DE UX EN FORMULARIO (SUBMIT FEEDBACK)
  // ==========================================================================
  const demoForm = document.getElementById('hostDemoForm');
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      const submitBtn = demoForm.querySelector('.modal-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.innerHTML = '<span>Procesando solicitud...</span>';
      }
    });
  }

});