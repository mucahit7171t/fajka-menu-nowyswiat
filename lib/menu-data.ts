export type MenuItem = {
  name: string;
  description: string;
  price: string;
  badge?: "Best Seller" | "Premium" | "New";
};

export type Category = {
  id: string;
  title: string;
  imageLabel: string;
  items: MenuItem[];
};

export const initialCategories: Category[] = [];