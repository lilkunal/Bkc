import { expect, test } from "@playwright/test";
import { parseCsv, productsFromSheet } from "../src/data/sheet";

const ctx = {
  fonts: { anton: "'Anton', sans-serif", rozha: "'Rozha One', serif" },
  defaultFont: "anton",
  categoryInfo: { humour: { label: "Desi Humour", note: "Group-chat lines." } },
};

test.describe("product sheet", () => {
  test("reads Excel-style CSV: BOM, semicolons and quoted commas", () => {
    const rows = parseCsv('﻿name;price\r\n"Chai, Always";699\r\n');
    expect(rows).toEqual([
      ["name", "price"],
      ["Chai, Always", "699"],
    ]);
  });

  test("builds a product and fills sensible defaults", () => {
    const csv = 'id,Name,Price,MRP,Color,Category,print_lines,rating\nA1,Chai Always,"₹699","₹999",Haldi Mustard,humour|Monsoon Specials,CHAI|ALWAYS,4.5\n';
    const { products, categories, errors, warnings } = productsFromSheet(csv, ctx);
    expect(errors).toEqual([]);
    expect(warnings).toEqual([]);
    const p = products[0];
    expect(p).toMatchObject({ id: "A1", type: "tee", price: 699, mrp: 999, color: "mustard", fit: "oversized", fontKey: "anton", rating: 4.5, reviews: null });
    expect(p.sizes).toEqual(["S", "M", "L", "XL", "XXL", "3XL"]);
    expect(p.printLines).toEqual(["CHAI", "ALWAYS"]);
    expect(categories.map((c) => [c.key, c.label])).toEqual([
      ["humour", "Desi Humour"],
      ["monsoon-specials", "Monsoon Specials"],
    ]);
  });

  test("skips broken rows, keeps good ones and explains every problem", () => {
    const csv = [
      "id,name,type,price,compare_at_price,colour,fit",
      "S1,Good Shirt,shirt,1299,999,#123abc,slim",
      "S1,Duplicate,tee,499,,white,",
      "S2,No Price,tee,,,white,",
      "S3,Hoodie,hoodie,1999,,white,",
      "S4,Odd Colour,tee,599,,sparkly,huge",
    ].join("\n");
    const { products, errors, warnings } = productsFromSheet(csv, ctx);

    expect(products.map((p) => p.id)).toEqual(["S1", "S4"]);
    expect(products[0]).toMatchObject({ type: "shirt", fit: "slim", mrp: 1299, teeHex: "#123ABC" });
    expect(errors.map((e) => [e.row, e.column])).toEqual([
      [3, "id"],
      [4, "price"],
      [5, "type"],
    ]);
    expect(warnings.map((w) => [w.row, w.column])).toEqual([
      [2, "compare_at_price"],
      [6, "colour"],
      [6, "fit"],
    ]);
  });

  test("reports missing required columns", () => {
    const { products, errors } = productsFromSheet("id,title\nX1,Tee\n", ctx);
    expect(products).toEqual([]);
    expect(errors[0]).toMatchObject({ row: 1, column: "price" });
  });
});
