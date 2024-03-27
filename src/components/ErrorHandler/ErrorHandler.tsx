import Backdrop from '../Backdrop/Backdrop';
import Modal from '../Modal/Modal';

interface ErrorHandlerProps {
  error: Error | null;
  onHandle: () => void;
}

const ErrorHandler = ({ error, onHandle }: ErrorHandlerProps) => (
  <>
    {error && <Backdrop onClick={onHandle} />}
    {error && (
      <Modal
        title='An Error Occurred'
        onCancelModal={onHandle}
        onAcceptModal={onHandle}
        acceptEnabled
      >
        <p>{error.message}</p>
      </Modal>
    )}
  </>
);

export default ErrorHandler;
