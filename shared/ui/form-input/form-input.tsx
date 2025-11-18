'use client';

import { ReactNode } from 'react';

interface FormInputProps {
  id: string;
  name: string;
  type?: 'text' | 'email' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
  required?: boolean;
}

export function FormInput({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  required,
}: FormInputProps) {
  return (
    <div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all ${
            error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
          }`}
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1 animate-fade-in">{error}</p>
      )}
    </div>
  );
}

