import * as OBC from "@thatopen/components";

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
  private CLIENT_ID: string;
  private CLIENT_SECRET: string;
  readonly ENV: string;
  scopes: string[];

  constructor(components: OBC.Components) {
    super(components);
    components.add(DriveViewer.uuid, this);

    this.scopes = [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.install",
    ];
    this.CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    this.ENV = import.meta.env.VITE_ENV;
    this.CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

    this.authData = {
      clientId: this.CLIENT_ID,
      clientSecret: this.CLIENT_SECRET,
      env: this.ENV,
      scopes: this.scopes,
    };
  }

  async authorize() {
    const response = await fetch("/.netlify/functions/googleAuth", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.authData),
    });

    const callback = await response.text();
    const fixedCallback = callback.replace(/"/g, "");

    window.location.href = fixedCallback;
  }

  getQueryParams(): Params {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state") || "";
    if (state) {
      const stateValues = JSON.parse(decodeURIComponent(state));
      const ids = stateValues?.ids;
      return { authCode: null, fileId: ids };
    }

    if (code) {
      return { authCode: code, fileId: null };
    }

    return { authCode: null, fileId: null };
  }

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

    localStorage.setItem("googleToken", token);
  }

  async getDriveFile(fileId: string): Promise<string | undefined> {
    try {
      const token = localStorage.getItem("googleToken") || undefined;

      const response = await fetch(
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
}

export * from "./src";
