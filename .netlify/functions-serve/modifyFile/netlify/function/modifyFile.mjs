
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/function/modifyFile.ts
var modifyFile_default = async (request) => {
  const formData = await request.formData();
  const fileId = formData.get("fileId");
  if (typeof fileId !== "string" || fileId.trim() === "") {
    return new Response("Invalid or missing fileId", { status: 400 });
  }
  const token = formData.get("token");
  if (typeof token !== "string" || token.trim() === "") {
    return new Response("Invalid or missing token", { status: 400 });
  }
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
        "Content-Type": "application/json"
        // or adjust as needed if the content should be raw
      },
      body: file
      // Send the file directly as the body
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
export {
  modifyFile_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbi9tb2RpZnlGaWxlLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgeyBnb29nbGUgfSBmcm9tIFwiZ29vZ2xlYXBpc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHJlcXVlc3Q6IFJlcXVlc3QpID0+IHtcclxuICAvLyBQYXJzZSB0aGUgRm9ybURhdGEgZnJvbSB0aGUgcmVxdWVzdFxyXG4gIGNvbnN0IGZvcm1EYXRhID0gYXdhaXQgcmVxdWVzdC5mb3JtRGF0YSgpO1xyXG5cclxuICAvLyBSZXRyaWV2ZSBhbmQgdmFsaWRhdGUgdGhlIGZpbGVJZFxyXG4gIGNvbnN0IGZpbGVJZCA9IGZvcm1EYXRhLmdldChcImZpbGVJZFwiKTtcclxuICBpZiAodHlwZW9mIGZpbGVJZCAhPT0gXCJzdHJpbmdcIiB8fCBmaWxlSWQudHJpbSgpID09PSBcIlwiKSB7XHJcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiSW52YWxpZCBvciBtaXNzaW5nIGZpbGVJZFwiLCB7IHN0YXR1czogNDAwIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gUmV0cmlldmUgYW5kIHZhbGlkYXRlIHRoZSB0b2tlblxyXG4gIGNvbnN0IHRva2VuID0gZm9ybURhdGEuZ2V0KFwidG9rZW5cIik7XHJcbiAgaWYgKHR5cGVvZiB0b2tlbiAhPT0gXCJzdHJpbmdcIiB8fCB0b2tlbi50cmltKCkgPT09IFwiXCIpIHtcclxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJJbnZhbGlkIG9yIG1pc3NpbmcgdG9rZW5cIiwgeyBzdGF0dXM6IDQwMCB9KTtcclxuICB9XHJcblxyXG4gIC8vIFJldHJpZXZlIGFuZCB2YWxpZGF0ZSB0aGUgZmlsZVxyXG4gIGNvbnN0IGZpbGUgPSBmb3JtRGF0YS5nZXQoXCJmaWxlXCIpO1xyXG4gIGlmICghKGZpbGUgaW5zdGFuY2VvZiBCbG9iKSkge1xyXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIkludmFsaWQgb3IgbWlzc2luZyBmaWxlXCIsIHsgc3RhdHVzOiA0MDAgfSk7XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3VwbG9hZC9kcml2ZS92My9maWxlcy8ke2ZpbGVJZH1gO1xyXG5cclxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgQXV0aG9yaXphdGlvbjogYEJlYXJlciAke3Rva2VufWAsXHJcbiAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsIC8vIG9yIGFkanVzdCBhcyBuZWVkZWQgaWYgdGhlIGNvbnRlbnQgc2hvdWxkIGJlIHJhd1xyXG4gICAgICB9LFxyXG4gICAgICBib2R5OiBmaWxlLCAvLyBTZW5kIHRoZSBmaWxlIGRpcmVjdGx5IGFzIHRoZSBib2R5XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIHVwbG9hZCBmaWxlOiAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG4gICAgY29uc29sZS5sb2coXCJGaWxlIHVwbG9hZGVkIHN1Y2Nlc3NmdWxseTpcIiwgcmVzdWx0KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB1cGxvYWRpbmcgZmlsZTpcIiwgZXJyb3IpO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59O1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBRUEsSUFBTyxxQkFBUSxPQUFPLFlBQXFCO0FBRXpDLFFBQU0sV0FBVyxNQUFNLFFBQVEsU0FBUztBQUd4QyxRQUFNLFNBQVMsU0FBUyxJQUFJLFFBQVE7QUFDcEMsTUFBSSxPQUFPLFdBQVcsWUFBWSxPQUFPLEtBQUssTUFBTSxJQUFJO0FBQ3RELFdBQU8sSUFBSSxTQUFTLDZCQUE2QixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDbEU7QUFHQSxRQUFNLFFBQVEsU0FBUyxJQUFJLE9BQU87QUFDbEMsTUFBSSxPQUFPLFVBQVUsWUFBWSxNQUFNLEtBQUssTUFBTSxJQUFJO0FBQ3BELFdBQU8sSUFBSSxTQUFTLDRCQUE0QixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDakU7QUFHQSxRQUFNLE9BQU8sU0FBUyxJQUFJLE1BQU07QUFDaEMsTUFBSSxFQUFFLGdCQUFnQixPQUFPO0FBQzNCLFdBQU8sSUFBSSxTQUFTLDJCQUEyQixFQUFFLFFBQVEsSUFBSSxDQUFDO0FBQUEsRUFDaEU7QUFFQSxNQUFJO0FBQ0YsVUFBTSxNQUFNLG9EQUFvRCxNQUFNO0FBRXRFLFVBQU0sV0FBVyxNQUFNLE1BQU0sS0FBSztBQUFBLE1BQ2hDLFFBQVE7QUFBQSxNQUNSLFNBQVM7QUFBQSxRQUNQLGVBQWUsVUFBVSxLQUFLO0FBQUEsUUFDOUIsZ0JBQWdCO0FBQUE7QUFBQSxNQUNsQjtBQUFBLE1BQ0EsTUFBTTtBQUFBO0FBQUEsSUFDUixDQUFDO0FBRUQsUUFBSSxDQUFDLFNBQVMsSUFBSTtBQUNoQixZQUFNLElBQUksTUFBTSwwQkFBMEIsU0FBUyxVQUFVLEVBQUU7QUFBQSxJQUNqRTtBQUVBLFVBQU0sU0FBUyxNQUFNLFNBQVMsS0FBSztBQUNuQyxZQUFRLElBQUksK0JBQStCLE1BQU07QUFDakQsV0FBTztBQUFBLEVBQ1QsU0FBUyxPQUFPO0FBQ2QsWUFBUSxNQUFNLHlCQUF5QixLQUFLO0FBQzVDLFdBQU87QUFBQSxFQUNUO0FBQ0Y7IiwKICAibmFtZXMiOiBbXQp9Cg==
