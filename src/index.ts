import fs from "node:fs"
import { TRADETYPES_PATH, LOCATION_PATH } from "./lib/config.js"
import ScrapeProfiles from "./components/cheerio_trust_trader.js"
import { Profile } from "./types/index.js"
import { writeCsv } from "./lib/files.js"


let TRADETYPE = []

try {
  // READING TRADETYPES AND ONLY RETURNIG THE FIRST ONE
  const TradeTypeComplete = fs.readFileSync(TRADETYPES_PATH)
    .toString()
    .split('\n')
    .map((line) => {
      if (line !== "") return line.trim()
    })
  const Locations = fs.readFileSync(LOCATION_PATH)
    .toString()
    .split('\n')
    .map((location) => {
      return location.trim()
    })

  

  for (let index = 0; index < 1; index++) {
    const TradeType = TradeTypeComplete[index]
    console.log(`[+] Selected :: ${TradeType}`)
    console.log('[+] Building TradeType with Locations ... ')
    fs.mkdirSync(`./results/${TradeType}`)
    const Locations = fs.readFileSync(LOCATION_PATH)
      .toString()
      .split('\n')
      .map((location) => {
        return location.trim()
      })
    for (let index = 0; index < 3; index++) {
      const location = Locations[index];
      console.log(`[+] Selected :: ${location} `)
      let url = `https://www.trustatrader.com/search?trade_name=${TradeType}&location_str=${location}`
      let Profiles_Location = await ScrapeProfiles(url);
      // we save output into trade_name/location.csv
      writeCsv(Profiles_Location, `./results/${TradeType}/${location}.csv`)
    }
  }
} catch (error) {
  console.log(error)
}

