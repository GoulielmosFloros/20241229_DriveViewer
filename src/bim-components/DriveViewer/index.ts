import * as OBC from "@thatopen/components";
import * as WEBIFC from "web-ifc";

// Interfaces to keep things consistent
export interface AuthData {
  clientId: string;
  clientSecret: string;
  scopes: string[];
  env: string;
  code?: string;
}

export interface Params {
  authCode: string | null;
  fileId: string | null;
}

export class DriveViewer extends OBC.Component {
  enabled = false;
  static readonly uuid = "49ef0b61-ba7b-4b69-a428-4284d89e7b50";
  private authData: AuthData;
  // These below will be imported from the .env file
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;
  readonly ENV: string;
  scopes: string[];

  constructor(components: OBC.Components) {
    super(components);
    components.add(DriveViewer.uuid, this);

    // These must match the scopes we added in the Cloud Console

    this.scopes = [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.install",
    ];

    // These are already set in the Netlify site
    // Here create a .env file in the root folder and
    // VITE_ENV to localhost:8888
    this.CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    this.ENV = import.meta.env.VITE_ENV;
    this.CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

    // This will be an object that will be used in multiple netlify functions
    this.authData = {
      clientId: this.CLIENT_ID,
      clientSecret: this.CLIENT_SECRET,
      env: this.ENV,
      scopes: this.scopes,
    };
  }

  // First step in the process, to tell Google that our app will access Drive data
  // Look in the next step for the functions implementation
  async authorize() {
    const response = await fetch("/.netlify/functions/googleAuth", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.authData),
    });

    const callback = await response.text();
    // The callback URI will be returned with double quotes,
    // we need to get rid of them to set the location
    const fixedCallback = callback.replace(/"/g, "");

    // This will basically redirect us to the new URL
    window.location.href = fixedCallback;
  }

  // This function will be used dinamically
  // in the main file to know in which step we are
  getQueryParams(): Params {
    const urlParams = new URLSearchParams(window.location.search);
    // The code will be returned by google after authorizing our app
    // The state is returned by google after we open a file from the Drive UI Integration
    // aka Open With option
    const code = urlParams.get("code");
    const state = urlParams.get("state") || "";
    if (state) {
      const stateValues = JSON.parse(decodeURIComponent(state));
      // The id contains the id of the file to be opened.
      const ids = stateValues?.ids;
      return { authCode: null, fileId: ids };
    }

    // Depending on what parameters are returned by google we will return
    // them accordingly

    if (code) {
      return { authCode: code, fileId: null };
    }

    return { authCode: null, fileId: null };
  }

  // This function will be executed when the code parameter is returned
  async setCode(authCode: string) {
    if (!this.authData) return;
    this.authData.code = authCode;

    const response = await fetch("/.netlify/functions/accessToken", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.authData),
    });

    const token = await response.text();

    // The result of the call is a token, which is basically an API Key
    // This will be needed later, so we have to store it.
    localStorage.setItem("googleToken", token);
  }

  // This function will be called when we use Open With in the Drive.
  async getDriveFile(fileId: string): Promise<string | undefined> {
    try {
      const token = localStorage.getItem("googleToken") || undefined;

      const response = await fetch(
        // In the URL below, the alt=media makes the content of the file
        // appear in the body of the response.
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error(
          `Could not fetch file: ${response.status}, ${response.statusText}`,
        );
      }

      const fileData = await response.text();
      return fileData;
    } catch (error) {
      console.error(`Error in getDriveFile ${error}`);
      return undefined;
    }
  }

  async modifyDriveFile(
    fileId: string,
    typedArray: Uint8Array,
  ): Promise<string | undefined> {
    try {
      const token = localStorage.getItem("googleToken") || undefined;

      const fragments = this.components.get(OBC.FragmentsManager);
      const propsManager = this.components.get(OBC.IfcPropertiesManager);

      for (const [_, model] of fragments.groups.entries()) {
        const properties = await model.getAllPropertiesOfType(WEBIFC.IFCSITE);

        if (!properties) continue;
        for (const [_, data] of Object.entries(properties)) {
          if (!data) continue;

          const { RefLatitude, RefLongitude } = data;
          if (!RefLatitude || !RefLongitude) continue;

          const latitude = [0, 0, 0, 0];
          const longitude = [0, 0, 0, 0];

          RefLatitude.value = latitude;
          RefLongitude.value = longitude;

          await propsManager.setData(model, data);
        }

        const modifiedBuffer = await propsManager.saveToIfc(model, typedArray);
        const file = new File([modifiedBuffer], "model.ifc");

        const formData = new FormData();
        formData.append("fileId", fileId); // Add the file ID
        if (token) formData.append("token", token); // Add the token if it exists
        formData.append("file", file); // Add the file object

        const response = await fetch("/.netlify/functions/modifyFile", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: formData,
        });

        if (!response.ok) {
          console.error(
            `Could not fetch file: ${response.status}, ${response.statusText}`,
          );
        }
        const fileData = await response.text();
        return fileData;
      }
      return undefined;
    } catch (error) {
      console.error(`Error in getDriveFile ${error}`);
      return undefined;
    }
  }
}

export * from "./src";
