import styles from "./Input.module.css";

interface InputProps {
  id: string;
  name: string;
  type: "text" | "email";
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  id,
  name,
  type,
  label,
  placeholder,
  required,
  disabled,
  value,
  onChange,
}: InputProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={styles.input}
      />
    </div>
  );
}
