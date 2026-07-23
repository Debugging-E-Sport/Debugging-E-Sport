export { ToastProvider, useToast } from '../context/ToastContext'

/**
 * Re-export for convenience. The Toast system is powered by ToastContext.
 *
 * Usage:
 *   import { useToast } from '../components/Toast'
 *   ...
 *   const toast = useToast()
 *   toast.error('Something went wrong')
 *   toast.success('Room created!')
 *   toast.info('Round 3 starting...')
 *   toast.warning('Connection slow')
 */
export default function Toast() {
  // Toast renders through ToastProvider — nothing to render at the component level
  return null
}
