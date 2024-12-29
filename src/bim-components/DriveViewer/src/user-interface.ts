import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import { DriveViewer } from "..";

export function DriveViewerUI(components: OBC.Components) {
  const driver = components.get(DriveViewer);
  return BUI.html`
   <bim-toolbar-section label="Google Drive" icon="simple-icons:googledrive">
        <bim-button label="Authorize" icon="hugeicons:authorized" @click=${() => driver.authorize()}></bim-button>
   </bim-toolbar-section>`;
}
