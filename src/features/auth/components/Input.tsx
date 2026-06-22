import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <div className="mb-4">
            {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
            <input
                className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' :
                        'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    } shadow-sm focus:outline-none focus:ring-1`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;