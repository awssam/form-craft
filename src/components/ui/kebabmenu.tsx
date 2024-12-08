import React from 'react';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

import { MoreVertical } from 'lucide-react';

interface KebabMenuProps {
  renderTrigger?: () => React.ReactNode;
  items: {
    label: string;
    onClick: () => void;
    value?: string;
    seperator?: boolean;
    disabled?: boolean;
    className?: string;
  }[];
}

const Menu = ({ items, renderTrigger }: KebabMenuProps) => {
  return (
    <Menubar className="border-none p-0 bg-transparent hover:bg-transparent">
      <MenubarMenu>
        <MenubarTrigger asChild className="border-0 bg-transparent p-0">
          {renderTrigger ? (
            renderTrigger()
          ) : (
            <MoreVertical className="md:w-4 md:h-4 h-5 w-5 min-h-4 min-w-4 text-[#b6a2a2] cursor-pointer  group-hover:opacity-100 hover:scale-125" />
          )}
        </MenubarTrigger>
        <MenubarContent>
          {items.map((item) => (
            <>
              <MenubarItem key={item.value} onClick={item.onClick} disabled={item.disabled} className={item?.className}>
                {item.label}
              </MenubarItem>
              {item.seperator && <MenubarSeparator />}
            </>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default Menu;
