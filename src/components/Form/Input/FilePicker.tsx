import './Input.css';

interface FilePickerProps {
  id: string;
  label: string;
  valid: boolean;
  touched: boolean;
  onChange: (id: string, value: string, files: FileList | null) => void;
  onBlur?: () => void;
}

const FilePicker = ({
  id,
  label,
  valid,
  touched,
  onChange,
  onBlur,
}: FilePickerProps) => (
  <div className='input'>
    <label htmlFor={id}>{label}</label>
    <input
      className={[
        !valid ? 'invalid' : 'valid',
        touched ? 'touched' : 'untouched',
      ].join(' ')}
      type='file'
      id={id}
      onChange={(e) => onChange(id, e.target.value, e.target.files)}
      onBlur={onBlur}
    />
  </div>
);

export default FilePicker;
