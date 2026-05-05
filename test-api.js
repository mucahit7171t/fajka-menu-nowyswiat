const BASE = "http://localhost:3001";

async function test() {
  console.log("Testing API...");

  const menu = await fetch(`${BASE}/api/menu`);
  const menuData = await menu.json();
  console.log("/api/menu:", menu.status, Array.isArray(menuData) ? "OK" : "BAD");

  const adminMenu = await fetch(`${BASE}/api/admin/menu`);
  const adminMenuData = await adminMenu.json();
  console.log("/api/admin/menu:", adminMenu.status, Array.isArray(adminMenuData) ? "OK" : "BAD");

  const create = await fetch(`${BASE}/api/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: { pl: "Test Produkt", en: "Test Product" },
      desc: { pl: "Test opis", en: "Test description" },
      price: "1zł",
      badge: "New",
      categoryId: "snacks",
      image: "",
      prices: [],
    }),
  });

  const created = await create.json();
  console.log("POST /api/admin/products:", create.status, created._id ? "OK" : "BAD");

  if (created._id) {
    const update = await fetch(`${BASE}/api/admin/products/${created._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: "2zł", badge: "Best Seller" }),
    });

    console.log("PUT product:", update.status, update.ok ? "OK" : "BAD");

    const del = await fetch(`${BASE}/api/admin/products/${created._id}`, {
      method: "DELETE",
    });

    console.log("DELETE product:", del.status, del.ok ? "OK" : "BAD");
  }
}

test().catch(console.error);