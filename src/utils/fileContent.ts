import fs from "fs";

/**
 *
 * @param path - path of the file
 * @returns data which is read from the give path file
 */
export function getTheFileContent(path: string): string | void {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      // If error occurs show the error at console and return
      console.error("Error reading file:", err);
      return;
    }
    // if not then return the data
    return data;
  });
}
