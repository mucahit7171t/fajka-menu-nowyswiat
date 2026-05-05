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

export const initialCategories: Category[] = [
  {
    id: "snacks",
    title: "Snacks",
    imageLabel: "SNACKS",
    items: [
      { name: "Paluszki Słone", description: "Salted breadsticks", price: "10zl", badge: "New" },
      { name: "Orzeszki Ziemne", description: "Roasted peanuts", price: "15zl" },
      { name: "Chipsy Paprykowe", description: "Paprika flavored chips", price: "15zl" },
      { name: "Nachos", description: "Crispy nachos with sauce", price: "20zl", badge: "Best Seller" },
      { name: "Frytki Belgijskie", description: "Belgian fries", price: "20zl" },
    ],
  },
  {
    id: "classic-shisha",
    title: "Classic Shisha",
    imageLabel: "CLASSIC SHISHA",
    items: [
      { name: "Love 66", description: "Fresh and sweet mix", price: "80zl", badge: "Best Seller" },
      { name: "Lady Killer", description: "Fruity smooth blend", price: "80zl" },
      { name: "Blue Ice", description: "Cool minty flavor", price: "80zl" },
    ],
  },
];