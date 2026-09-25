import styles from "./Avatar.module.css"

function getInitials(name: string) {
  const isPascalCase = /^([A-Z][a-z]*){2,}$/.test(name)

  if (isPascalCase) {
    return (name.match(/[A-Z]/g) ?? []).slice(0, 2).join("")
  }

  return name.charAt(0).toUpperCase()
}

interface AvatarProps {
  name: string
}

export default function Avatar({ name }: AvatarProps) {
  return (
    <div className={styles.avatar} role="img" aria-label={name}>
      {getInitials(name)}
    </div>
  )
}
