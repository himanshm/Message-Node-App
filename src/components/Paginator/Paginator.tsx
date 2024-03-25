import { ReactNode } from 'react';
import './Paginator.css';

interface PaginatorProps {
  children: ReactNode;
  currentPage: number;
  lastPage: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Paginator = ({
  children,
  currentPage,
  lastPage,
  onPrevious,
  onNext,
}: PaginatorProps) => (
  <div className='paginator'>
    {children}
    <div className='paginator__controls'>
      {currentPage > 1 && (
        <button className='paginator__control' onClick={onPrevious}>
          Previous
        </button>
      )}
      {currentPage < lastPage && (
        <button className='paginator__control' onClick={onNext}>
          Next
        </button>
      )}
    </div>
  </div>
);

export default Paginator;
