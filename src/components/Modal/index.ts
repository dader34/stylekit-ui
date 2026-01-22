/**
 * Modal Component
 *
 * A comprehensive, accessible modal dialog component for the @stylekit/ui library.
 *
 * Features:
 * - Compound component pattern (Modal, ModalOverlay, ModalContent, etc.)
 * - Portal rendering for proper stacking
 * - Focus trapping for accessibility
 * - Keyboard navigation (ESC to close)
 * - Close on overlay click (configurable)
 * - Size variants (sm, md, lg, xl, full)
 * - Blur backdrop option
 * - Scroll lock when open
 * - Animation on open/close
 * - Full TypeScript support
 * - Theme-aware styling via CSS variables
 *
 * @example
 * ```tsx
 * import {
 *   Modal,
 *   ModalOverlay,
 *   ModalContent,
 *   ModalHeader,
 *   ModalBody,
 *   ModalFooter,
 * } from '@stylekit/ui';
 *
 * function MyComponent() {
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>Open Modal</button>
 *
 *       <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
 *         <ModalOverlay blur />
 *         <ModalContent>
 *           <ModalHeader>Modal Title</ModalHeader>
 *           <ModalBody>
 *             <p>Modal content goes here...</p>
 *           </ModalBody>
 *           <ModalFooter>
 *             <button onClick={() => setIsOpen(false)}>Cancel</button>
 *             <button onClick={handleSave}>Save</button>
 *           </ModalFooter>
 *         </ModalContent>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 */

export {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from './Modal';

export type {
  ModalProps,
  ModalOverlayProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseButtonProps,
  ModalSize,
  ModalContextValue,
} from './Modal';

export { default } from './Modal';
