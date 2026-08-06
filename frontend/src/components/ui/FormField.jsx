import { forwardRef } from 'react'

const FormField = forwardRef(({
  label,
  name,
  type: _type = 'text',
  placeholder: _placeholder,
  error,
  icon: _icon,
  required = false,
  fullWidth = true,
  children,
  className = ''
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
})

FormField.displayName = 'FormField'

export default FormField
