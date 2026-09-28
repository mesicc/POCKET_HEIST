import styles from "./Button.module.css";

interface ButtonProps {
  type?: "button" | "submit";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({
  type = "submit",
  children,
  onClick,
  disabled,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${styles.button}`}
    >
      {children}
    </button>
  );
}
