/**
 * OMNIA Suite - Main Interactive, Routing & Modal Control Script
 * Soporte Multi-Landing (HOST & HOME) con accesibilidad y retroalimentación interactiva.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. ENRUTAMIENTO DIRECTO Y DASHBOARD SIMULADO (OMNIA LANDING)
  // ==========================================================================
  const systemButtons = document.querySelectorAll('.system-card-btn');

  const systemRoutes = {
    'btn-restaurantes': 'host.html',
    'btn-copropiedades': 'home.html'
  };

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

  const updateDashboardData = (systemId) => {
    const data = dashboardData[systemId];
    if (!data) return;

    const dashBody = document.querySelector('.dash-body');
    if (!dashBody) return;

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

      dashBody.style.opacity = '1';
    }, 150);
  };

  systemButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const currentButton = e.currentTarget;
      const systemId = currentButton.id;

      if (systemRoutes[systemId]) {
        window.location.href = systemRoutes[systemId];
        return;
      }

      if (currentButton.classList.contains('active')) return;

      systemButtons.forEach(btn => btn.classList.remove('active'));
      currentButton.classList.add('active');

      updateDashboardData(systemId);
    });
  });

  // ==========================================================================
  // 2. CONTROL ACCESIBLE DE MODALES (HOST & HOME)
  // ==========================================================================
  const modal = document.getElementById('demoModal');
  const openButtons = document.querySelectorAll('.open-demo-modal');
  const closeButton = document.getElementById('closeModal');
  
  // Botones de prueba gratuita aislados (No activan el modal)
  const btnProbarHost = document.getElementById('btn-probar-gratis-host');
  const btnProbarHome = document.getElementById('btn-probar-gratis-home');

  const openModal = (e) => {
    if (e) e.preventDefault();
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  openButtons.forEach(btn => btn.addEventListener('click', openModal));

  if (btnProbarHost) {
    btnProbarHost.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Evento registrado: Clic en "Probar HOST Gratis"');
    });
  }

  if (btnProbarHome) {
    btnProbarHome.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('Evento registrado: Clic en "Probar HOME Gratis"');
    });
  }

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
  // 3. RETROALIMENTACIÓN DE ENVÍO DE FORMULARIO (HOST / HOME)
  // ==========================================================================
  const demoForm = document.querySelector('.demo-form');
  if (demoForm) {
    demoForm.addEventListener('submit', () => {
      const submitBtn = demoForm.querySelector('.modal-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
        submitBtn.innerHTML = '<span>Procesando solicitud...</span>';
      }
    });
  }

});