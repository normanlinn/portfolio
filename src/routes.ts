/** A labelled illustration. No live location or arrival information is simulated. */
export function initRoutes(): void {
  const map = document.querySelector<SVGSVGElement>('#route-map');
  const line = document.querySelector<SVGPathElement>('#route-line');
  const motion = document.querySelector<SVGAnimateMotionElement>('#bus-motion');
  const circle = document.querySelector<SVGCircleElement>('.map-bus circle');
  const coverage = document.querySelector<HTMLElement>('#route-coverage');
  if (!map || !line || !motion || !circle || !coverage) return;
  const routes = {
    east: { label: 'Terminals 1–3 + Terminal B · via South lot', color: '#304bff', path: 'M455 65L355 25L104 25L125 60L205 50L285 68L320 135L425 260L510 260L510 65Z' },
    west: { label: 'Terminals 4–7 · via South lot', color: '#8856ab', path: 'M455 165L360 190L280 210L205 228L130 212L85 159Q45 224 124 260L425 260L500 236L455 165' },
    south: { label: 'All terminals + Terminal B', color: '#ac5728', path: 'M425 260L280 210L205 228L130 212L85 159Q58 100 125 60L205 50L285 68L320 135L380 208L425 260' }
  } as const;
  type RouteKey = keyof typeof routes;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  function syncMotion(): void {
    if (!map || typeof map.pauseAnimations !== 'function') return;
    if (preference.matches) map.pauseAnimations(); else map.unpauseAnimations();
  }
  document.querySelectorAll<HTMLButtonElement>('[data-route]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.route;
    if (!key || !(key in routes)) return;
    const route = routes[key as RouteKey];
    document.querySelectorAll<HTMLButtonElement>('[data-route]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    line.setAttribute('d', route.path);
    line.style.stroke = route.color;
    motion.setAttribute('path', route.path);
    circle.setAttribute('fill', route.color);
    coverage.textContent = route.label;
    if (typeof map.setCurrentTime === 'function') map.setCurrentTime(0);
    syncMotion();
  }));
  preference.addEventListener('change', syncMotion);
  syncMotion();
}
