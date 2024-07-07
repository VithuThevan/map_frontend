// Interface for navigation items
export interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
  }
  
  // Navigation items
  export const NAV_ITEMS: Array<NavItem> = [
    {
      label: "Form",
      href: "/form",
    },
    {
      label: "List",
      href: "/list",
    },
  ];
  