// Is the visitor on a slow or data-saving connection? (Network Information API; unsupported browsers count as "not slow".)
export function isSlowConnection() {
  if (typeof navigator === 'undefined') return false;
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return false;
  if (c.saveData) return true;
  if (['slow-2g', '2g'].includes(c.effectiveType)) return true;
  return typeof c.downlink === 'number' && c.downlink > 0 && c.downlink < 0.7;
}
