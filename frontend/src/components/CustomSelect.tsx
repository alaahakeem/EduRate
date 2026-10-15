import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  dir?: 'rtl' | 'ltr';
}

export default function CustomSelect({ options, value, onChange, placeholder, icon, dir = 'rtl' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value.toString() === value.toString());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef} dir={dir}>
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-4 py-3 bg-white/50 border border-white rounded-xl text-slate-900 cursor-pointer hover:bg-white/80 transition-all shadow-sm"
      >
        {icon && (
          <div className={`flex items-center justify-center ${dir === 'rtl' ? 'ml-3' : 'mr-3'} text-emerald-500`}>
            {icon}
          </div>
        )}
        <span className={`flex-1 text-sm ${!selectedOption ? 'text-slate-400' : 'text-slate-900'} ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Menu Options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-1 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-xl shadow-2xl max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value.toString());
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                value.toString() === option.value.toString() 
                  ? 'bg-emerald-50/80 text-emerald-700 font-bold' 
                  : 'text-slate-700 hover:bg-slate-100/50 hover:text-slate-900'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
