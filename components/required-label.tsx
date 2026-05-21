import type React from "react"

interface RequiredLabelProps {
  children: React.ReactNode
  icon?: React.ReactNode
}

export default function RequiredLabel({ children, icon }: RequiredLabelProps) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-3">
      <span className="flex items-center gap-2">
        {icon}
        {children}
        <span className="text-red-500">*</span>
      </span>
    </label>
  )
}
