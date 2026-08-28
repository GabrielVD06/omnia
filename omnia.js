/**
 * OMNIA Suite - Script de Interacción y Enrutamiento General
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // ENRUTAMIENTO DINÁMICO DE TARJETAS DE SISTEMAS
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

});