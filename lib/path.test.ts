import { assertEquals } from "$lib/test_deps.ts";
import { folderName, resolve } from "./path.ts";

Deno.test("Path functions", () => {
  assertEquals(folderName(""), "");
  assertEquals(folderName("page"), "");
  assertEquals(folderName("folder/page"), "folder");

  assertEquals(resolve("", "page"), "page");
  assertEquals(resolve("folder", "page"), "folder/page");
});
