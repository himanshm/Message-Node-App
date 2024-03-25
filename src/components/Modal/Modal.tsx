import ReactDOM from 'react-dom';
import Button from '../Button/Button';
import './Modal.css';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onCancelModal: () => void;
  onAcceptModal: () => void;
  acceptEnabled?: boolean;
  isLoading?: boolean;
}

const Modal = ({
  title,
  children,
  onCancelModal,
  onAcceptModal,
  acceptEnabled = true, // Assuming a default value of true for acceptEnabled
  isLoading = false, // Assuming a default value of false for isLoading
}: ModalProps) =>
  ReactDOM.createPortal(
    <div className='modal'>
      <header className='modal__header'>
        <h1>{title}</h1>
      </header>
      <div className='modal__content'>{children}</div>
      <div className='modal__actions'>
        <Button design='danger' mode='flat' onClick={onCancelModal}>
          Cancel
        </Button>
        <Button
          mode='raised'
          onClick={onAcceptModal}
          disabled={!acceptEnabled}
          loading={isLoading}
        >
          Accept
        </Button>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement // Type assertion to ensure non-null
  );

export default Modal;
