import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { ComboBoxOption, ComboBoxProps } from '../types/types';

const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  placeholder = 'Select an option...',
  onChange,
  defaultValue = [],
  multiSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [selectedOptions, setSelectedOptions] = useState<ComboBoxOption[]>(defaultValue);
  
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = "combobox-listbox";
  
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredOptions(options.filter(option => 
        !selectedOptions.some(selected => selected.id === option.id)
      ));
    } else {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !selectedOptions.some(selected => selected.id === option.id)
      );
      setFilteredOptions(filtered);
    }
    setHighlightedIndex(-1);
  }, [inputValue, options, selectedOptions]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const highlightedOption = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedOption) {
        highlightedOption.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };
  
  const handleInputFocus = () => {
    setIsOpen(true);
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
        
      case 'Tab':
        setIsOpen(false);
        break;
        
      default:
        break;
    }
  };
  
  const selectOption = (option: ComboBoxOption) => {
    let newSelectedOptions: ComboBoxOption[];
    
    if (multiSelect) {
      newSelectedOptions = [...selectedOptions, option];
    } else {
      newSelectedOptions = [option];
    }
    
    setSelectedOptions(newSelectedOptions);
    setInputValue('');
    setIsOpen(false);
    if (onChange) onChange(newSelectedOptions);
  };

  const removeOption = (optionToRemove: ComboBoxOption, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelectedOptions = selectedOptions.filter(
      option => option.id !== optionToRemove.id
    );
    setSelectedOptions(newSelectedOptions);
    if (onChange) onChange(newSelectedOptions);
  };
  
  return (
    <div className="w-full">
      <div 
        ref={comboboxRef}
        className="relative"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-owns={listboxId}
      >
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white">
          {selectedOptions.map(option => (
            <span
              key={option.id}
              className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
            >
              {option.label}
              <button
                onClick={(e) => removeOption(option, e)}
                className="hover:text-blue-600 focus:outline-none"
                aria-label={`Remove ${option.label}`}
              >
                <X size={14} className='cursor-pointer bg-red-500 text-white rounded hover:scale-105' />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 min-w-[120px] outline-none"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={
              highlightedIndex >= 0 ? `option-${filteredOptions[highlightedIndex].id}` : undefined
            }
          />
        </div>
        
        {isOpen && (
          <ul
            ref={listboxRef}
            id={listboxId}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
            tabIndex={-1}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li
                  key={option.id}
                  id={`option-${option.id}`}
                  className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                    highlightedIndex === index
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500 cursor-default" role="option">
                No results found
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ComboBox;