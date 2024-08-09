import fs, { createReadStream, link, readFileSync } from "node:fs";
import { PROXY_FILE_PATH, SEARCH_LINKS_PATH } from "./config.js";
import { Profile } from "src/types/index.js";

// createResultsFolder()
/*
 * what will this function do ?
 * this function will read proxies from a file where the path is taken as "a global variable" in the config file
 * features ?
 * reads a file and returns an array of objects 
 * @param 
 * @return Array of proxies {host:string; port:number; username:string; password:string}  
 */
export function readProxies(): Array<{ host: string; port: number; username: string; password: string }> {
  try {
    let fileExists = checkFile(PROXY_FILE_PATH)
    if (fileExists) {
      return readFileSync(PROXY_FILE_PATH).toString().trim().split('\n').map((proxy) => {
        let proxy_split = proxy.split(':')
        return {
          host: proxy_split[0],
          port: eval(proxy_split[1]),
          username: proxy_split[2],
          password: proxy_split[3]
        }
      })
    } else {
      console.log("[-] Program did not find ", PROXY_FILE_PATH, " file")
      throw new Error("File doesn't exist")
    }
  } catch (error) {
    throw error
  }
}



/*
 * what this function do ? 
 * this will check if a file exists 
 * @param filepath: the path to the file you would like to check if it exists 
 * @return boolean
 * */
function checkFile(filepath: string): boolean {
  try {
    return fs.statSync(filepath).isFile();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    } else {
      console.log(err)
      return false
    }
  }
}


export function writeCsv(Profiles: Array<Profile>, path: string): void {
  const csvString = [
    [
      "Mob",
      "Tel",
      "CompanyType",
      "OwnerName",
      "Website",
      "CompanyName",
      "emails"
    ],
    ...Profiles.map(item => [
      item.Mob,
      item.Tel,
      item.CompanyType,
      item.OwnerName,
      item.Website,
      item.CompanyName,
      item.emails
    ])
  ]
    .map(e => e.join(","))
    .join("\n");
  fs.writeFileSync(path, csvString)
  console.log('File written ')
}

