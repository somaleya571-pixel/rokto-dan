import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X, Building2, MapPin } from 'lucide-react';

export interface DropdownOption {
  label: string;
  value: string;
  sublabel?: string;
  badge?: string;
}

interface SearchableDropdownProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  value: string;
  options: (string | DropdownOption)[];
  onChange: (value: string) => void;
  disabled?: boolean;
  allowCustom?: boolean;
  icon?: React.ReactNode;
  hint?: string;
}

export const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  label,
  required = false,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  value,
  options,
  onChange,
  disabled = false,
  allowCustom = false,
  icon,
  hint
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalize options to DropdownOption format
  const normalizedOptions: DropdownOption[] = options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt };
    }
    return opt;
  });

  // Find currently selected option
  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Filter options based on user search query
  const filtered = normalizedOptions.filter((opt) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const matchLabel = opt.label.toLowerCase().includes(q);
    const matchSub = opt.sublabel ? opt.sublabel.toLowerCase().includes(q) : false;
    const matchVal = opt.value.toLowerCase().includes(q);
    return matchLabel || matchSub || matchVal;
  });

  // Sync search input value when closed or value changes externally
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    if (searchTerm.trim()) {
      onChange(searchTerm.trim());
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
        {label} {required && <span className="text-[#E31828]">*</span>}
      </label>

      {/* Main Interactive Search Combobox Input */}
      <div
        className={`relative flex items-center bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl transition-all focus-within:border-[#E31828] focus-within:ring-2 focus-within:ring-[#E31828]/20 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#E31828]/50'
        }`}
      >
        {/* Left Icon (Search / Pin / Hospital) */}
        <div className="pl-3 pr-2 text-[#8C7D6B] shrink-0">
          {icon || <Search className="w-4 h-4 text-[#E31828]" />}
        </div>

        {/* Search Input / Display */}
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          placeholder={value ? (selectedOption ? selectedOption.label : value) : placeholder}
          value={isOpen ? searchTerm : (selectedOption ? selectedOption.label : value)}
          onFocus={() => {
            setIsOpen(true);
            setSearchTerm('');
          }}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (allowCustom && searchTerm.trim() && filtered.length === 0) {
                handleApplyCustom();
              } else if (filtered.length > 0) {
                handleSelect(filtered[0].value);
              }
            }
          }}
          className="w-full py-2.5 pr-8 bg-transparent text-xs sm:text-sm text-[#1E1B18] placeholder-[#9C8E7E] focus:outline-none font-medium truncate"
        />

        {/* Action Controls: Clear button and Dropdown toggle */}
        <div className="absolute right-2.5 flex items-center gap-1">
          {(value || searchTerm) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              className="w-5 h-5 rounded-full flex items-center justify-center text-[#8C7D6B] hover:text-[#1E1B18] hover:bg-[#F1E4B8]/60 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setIsOpen((prev) => !prev);
              if (!isOpen) {
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            aria-label="Toggle dropdown options"
            className="w-6 h-6 flex items-center justify-center text-[#8C7D6B] hover:text-[#E31828] transition-colors cursor-pointer"
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-150 ${
                isOpen ? 'rotate-180 text-[#E31828]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {hint && <p className="text-[11px] text-[#6B5E4F] mt-1">{hint}</p>}

      {/* Dropdown Results Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl shadow-xl overflow-hidden max-h-72 flex flex-col animate-in fade-in zoom-in-95 duration-100">
          {/* Quick Search Header with Count */}
          <div className="px-3 py-2 border-b border-[#F1E4B8] bg-[#FFFEEA] flex items-center justify-between text-[11px] text-[#6B5E4F]">
            <span className="flex items-center gap-1 font-semibold text-[#1E1B18]">
              <Search className="w-3 h-3 text-[#E31828]" />
              {searchTerm ? `Searching "${searchTerm}"` : 'Select from options below:'}
            </span>
            <span className="tabular-nums font-bold text-[#E31828]">
              {filtered.length} {filtered.length === 1 ? 'match' : 'matches'}
            </span>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#F1E4B8]/30 p-1">
            {/* Custom Option: If typing a custom hospital name */}
            {allowCustom && searchTerm.trim() && !filtered.some((f) => f.label.toLowerCase() === searchTerm.toLowerCase()) && (
              <button
                type="button"
                onClick={handleApplyCustom}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#A80012] bg-[#FEECEE]/70 hover:bg-[#FEECEE] rounded-xl transition-colors flex items-center justify-between my-0.5 cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <Building2 className="w-4 h-4 text-[#E31828] shrink-0" />
                  <span className="truncate">
                    Use custom: <strong>&quot;{searchTerm.trim()}&quot;</strong>
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold bg-[#E31828] text-white px-2 py-0.5 rounded-md shrink-0">
                  Select Custom
                </span>
              </button>
            )}

            {filtered.length === 0 && !allowCustom ? (
              <div className="p-4 text-center text-xs text-[#8C7D6B]">
                <p className="font-semibold text-[#1E1B18]">No matches found</p>
                <p className="text-[11px] mt-0.5">Try typing another district or spelling</p>
              </div>
            ) : (
              filtered.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onMouseDown={(e) => {
                      // Prevent input blur before click registers
                      e.preventDefault();
                    }}
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2.5 text-xs rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#E31828] text-white font-bold'
                        : 'text-[#1E1B18] hover:bg-[#FFF4D4]'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="truncate font-semibold">{opt.label}</div>
                      {opt.sublabel && (
                        <div
                          className={`text-[10px] truncate mt-0.5 ${
                            isSelected ? 'text-white/80' : 'text-[#6B5E4F]'
                          }`}
                        >
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
