'use client';

import type React from 'react';

import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { MenuIcon, X } from 'lucide-react';

type MenuItem = {
  id: string;
  icon: React.ElementType;
  label: string;
};

type FloatingMenuProps = {
  menuItems: MenuItem[];
  activeMenu: string;
  onMenuSelect: (menuId: string) => void;
  useBlackTheme?: boolean;
};

export function FloatingMenuButton({ menuItems, activeMenu, onMenuSelect, useBlackTheme = true }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMenuSelect = (menuId: string) => {
    onMenuSelect(menuId);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine button gradient classes based on theme
  const buttonGradientClasses = useBlackTheme
    ? 'bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-gray-700'
    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700';

  // Determine active menu item colors based on theme
  const inactiveMenuBgClass = useBlackTheme ? 'bg-gray-900' : 'bg-purple-600';
  const inactiveIconBgClass = useBlackTheme ? 'bg-gray-800' : 'bg-purple-500';
  const activeMenuBgClass = 'bg-gray-800 text-gray-300 hover:bg-gray-700';
  const activeIconBgClass = 'bg-gray-700 group-hover:bg-gray-600';

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden" ref={menuRef}>
      {/* Main floating button */}
      <button
        onClick={toggleMenu}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full shadow-lg',
          buttonGradientClasses,
          'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-950',
          'transition-all duration-300 ease-in-out',
        )}
      >
        <div className={cn('transition-transform duration-300 ease-in-out', isOpen ? 'rotate-135' : 'rotate-0')}>
          {isOpen ? <X className="h-6 w-6 text-white" /> : <MenuIcon className="h-6 w-6 text-white" />}
        </div>
      </button>

      {/* Menu items */}
      <div
        className={cn(
          'absolute bottom-16 right-0 mb-2 transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
        )}
      >
        <ul className="flex flex-col items-end space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={item.id}
              className={cn(
                'menu-item transition-all duration-300 ease-in-out',
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0',
              )}
              style={{
                transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
              }}
            >
              <button
                onClick={() => handleMenuSelect(item.id)}
                className={cn(
                  'group flex items-center space-x-2 rounded-full px-4 py-2 shadow-md transition-all duration-200',
                  activeMenu === item.id ? `${activeMenuBgClass} text-white` : inactiveMenuBgClass,
                )}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200',
                    activeMenu === item.id ? activeIconBgClass : inactiveIconBgClass,
                  )}
                >
                  <item.icon className="h-4 w-4" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type SectionDisplayerProps<T> = {
  options: T[];
  selectedOption: T;
  setSelectedOption: React.Dispatch<React.SetStateAction<T>>;
  optionConfig?: {
    getIcon: (option: T) => React.ElementType;
    getLabel: (option: T) => string;
    getId: (option: T) => string;
  };
  useBlackTheme?: boolean;
};

const MobileSectionDisplayer = <T,>(props: SectionDisplayerProps<T>) => {
  const { options, selectedOption, setSelectedOption, optionConfig, useBlackTheme = true } = props;

  // Default functions if not provided
  const getId = optionConfig?.getId || ((option: T) => option?.toString());
  const getLabel = optionConfig?.getLabel || ((option: T) => option?.toString());
  const getIcon = optionConfig?.getIcon || (() => MenuIcon);

  // Convert options to menu items format
  const menuItems = options.map((option) => ({
    id: getId(option),
    label: getLabel(option),
    icon: getIcon(option),
  }));

  // Handle menu selection
  const handleMenuSelect = (menuId: string) => {
    const selectedOption = options.find((option) => getId(option) === menuId);
    if (selectedOption) {
      setSelectedOption(selectedOption);
    }
  };

  return (
    <FloatingMenuButton
      menuItems={menuItems as MenuItem[]}
      activeMenu={getId(selectedOption) as string}
      onMenuSelect={handleMenuSelect}
      useBlackTheme={useBlackTheme}
    />
  );
};

export default MobileSectionDisplayer;
