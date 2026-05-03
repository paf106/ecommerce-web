export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'No se ha podido completar la acción. Inténtalo de nuevo.'
}
