import { useEffect } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible focus trap and scroll lock for the mobile modal sheet.
 * On desktop (isMobileModal === false), only handles the Escape key and focus return.
 *
 * @param {Object} options
 * @param {React.RefObject} options.containerRef - Ref of the dialog container
 * @param {boolean} options.isOpen - Whether dialog is currently open
 * @param {boolean} options.isMobileModal - Whether the modal trap + body lock should be engaged (<640px)
 * @param {Function} options.onClose - Close callback (for Escape key)
 */
export function useFocusTrap({ containerRef, isOpen, isMobileModal, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock on mobile
    let originalOverflow = '';
    if (isMobileModal) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      // Tab trapping only on mobile modal
      if (isMobileModal && e.key === 'Tab' && containerRef.current) {
        const focusables = Array.from(
          containerRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
        ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (isMobileModal) {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [isOpen, isMobileModal, onClose, containerRef]);
}

export default useFocusTrap;
