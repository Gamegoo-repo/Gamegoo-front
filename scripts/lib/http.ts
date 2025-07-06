import fs from "fs-extra";
import https from "node:https";

import { API_CONSTANTS } from "./constants";

export interface ServerStatus {
  success: boolean;
  status: number | string;
}

export async function checkServerStatus(url: string): Promise<ServerStatus> {
  return new Promise((resolve) => {
    const request = https.get(url, (response) => {
      resolve({
        success: response.statusCode === 200,
        status: response.statusCode || "UNKNOWN",
      });
    });

    request.on("error", () => {
      resolve({ success: false, status: "NETWORK_ERROR" });
    });

    request.setTimeout(API_CONSTANTS.TIMEOUT.SERVER_CHECK, () => {
      request.destroy();
      resolve({ success: false, status: "TIMEOUT" });
    });
  });
}

export async function downloadFile(
  url: string,
  outputPath: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.destroy();
        reject(
          new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`)
        );
        return;
      }

      response.pipe(file);

      file.on("finish", () => {
        file.close();
        resolve();
      });

      file.on("error", (error) => {
        file.destroy();
        fs.unlink(outputPath).catch(() => {});
        reject(error);
      });
    });

    request.on("error", (error) => {
      file.destroy();
      fs.unlink(outputPath).catch(() => {});
      reject(error);
    });

    request.setTimeout(API_CONSTANTS.TIMEOUT.DOWNLOAD, () => {
      request.destroy();
      reject(new Error("Download timeout"));
    });
  });
}
