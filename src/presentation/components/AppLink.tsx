import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { useRouter, type AppPath } from '../router/routerContext'

interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: AppPath
  children: ReactNode
}

export function AppLink({ to, children, onClick, ...props }: AppLinkProps) {
  const { navigate } = useRouter()

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      props.target
    ) {
      return
    }

    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
