import { filterAndSortProducts } from "../features/products/productUtils";
import { products } from "../mocks/db";

describe("filterAndSortProducts", () => {
  test("filters by search text (case-insensitive)", () => {
    const result = filterAndSortProducts(products, "WATCH", "featured");
    expect(result.map(p => p.title)).toEqual(["Smart Watch"]);
  });

  test("sorts by price ascending without mutating the input", () => {
    const copy = [...products];
    const result = filterAndSortProducts(products, "", "price-asc");
    expect(result[0].price).toBeLessThanOrEqual(result[1].price);
    expect(products).toEqual(copy);
  });
});
