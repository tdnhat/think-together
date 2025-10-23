import { UseFormSetError, FieldValues, Path } from 'react-hook-form'

/**
 * Maps API validation errors to react-hook-form errors
 * Converts PascalCase field names from backend to camelCase for frontend
 * @param apiErrors Validation errors from API response
 * @param setError Function to set form errors in react-hook-form
 */
export function mapApiErrorsToForm<T extends FieldValues>(
  apiErrors: Record<string, string[]> | undefined,
  setError: UseFormSetError<T>
): void {
  if (!apiErrors) return

  Object.entries(apiErrors).forEach(([field, messages]) => {
    const camelCaseField = toCamelCase(field) as Path<T>
    const message = Array.isArray(messages) ? messages[0] : messages

    setError(camelCaseField, {
      type: 'server',
      message,
    })
  })
}

/**
 * Converts PascalCase to camelCase
 * Example: "FirstName" -> "firstName"
 */
function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

/**
 * Extracts the first error message from validation errors
 */
export function getFirstErrorMessage(
  apiErrors: Record<string, string[]> | undefined
): string | undefined {
  if (!apiErrors) return undefined

  const firstKey = Object.keys(apiErrors)[0]
  const messages = apiErrors[firstKey]

  return Array.isArray(messages) ? messages[0] : messages
}

