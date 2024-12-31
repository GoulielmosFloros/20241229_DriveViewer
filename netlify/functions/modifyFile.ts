import { google } from "googleapis";

export default async (request: Request) => {
  // Parse the FormData from the request
  const formData = await request.formData();

  // Retrieve and validate the fileId
  const fileId = formData.get("fileId");
  if (typeof fileId !== "string" || fileId.trim() === "") {
    return new Response("Invalid or missing fileId", { status: 400 });
  }

  // Retrieve and validate the token
  const token = formData.get("token");
  if (typeof token !== "string" || token.trim() === "") {
    return new Response("Invalid or missing token", { status: 400 });
  }

  // Retrieve and validate the file
  const file = formData.get("file");
  if (!(file instanceof Blob)) {
    return new Response("Invalid or missing file", { status: 400 });
  }

  try {
    const url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // or adjust as needed if the content should be raw
      },
      body: file, // Send the file directly as the body
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("File uploaded successfully:", result);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};
