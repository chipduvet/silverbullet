import { IndexTreeEvent } from "../../plug-api/types.ts";
import { collectNodesOfType, findNodeOfType } from "../../plug-api/lib/tree.ts";
import { ObjectValue } from "../../plug-api/types.ts";
import { indexObjects } from "./api.ts";
import { readSetting } from "$sb/lib/settings_page.ts";
import { cleanPageRef } from "$sb/lib/resolve.ts";

export type StyleObject = ObjectValue<{
  style: string;
  origin: string;
}>;

export async function indexSpaceStyle({ name, tree }: IndexTreeEvent) {
  const allStyles: StyleObject[] = [];

  // Also collect CSS from custom styles in settings
  let customStylePages = await readSetting("customStyles", []);
  if (!Array.isArray(customStylePages)) {
    customStylePages = [customStylePages];
  }
  customStylePages = customStylePages.map((page: string) => cleanPageRef(page));

  collectNodesOfType(tree, "FencedCode").map((t) => {
    const codeInfoNode = findNodeOfType(t, "CodeInfo");
    if (!codeInfoNode) {
      return;
    }

    const fenceType = codeInfoNode.children![0].text!;
    if (fenceType !== "space-style") {
      if (
        !customStylePages.includes(name) || fenceType !== "css"
      ) {
        return;
      }
    }

    const codeTextNode = findNodeOfType(t, "CodeText");
    if (!codeTextNode) {
      // Honestly, this shouldn't happen
      return;
    }
    const codeText = codeTextNode.children![0].text!;
    let codeOrigin = "";
    if (customStylePages.includes(name)) {
      codeOrigin = "settings";
    } else if (name.startsWith("Library/")) {
      codeOrigin = "library";
    } else {
      codeOrigin = "user";
    }

    allStyles.push({
      ref: `${name}@${t.from!}`,
      tag: "space-style",
      style: codeText,
      origin: codeOrigin,
    });
  });

  await indexObjects<StyleObject>(name, allStyles);
}
