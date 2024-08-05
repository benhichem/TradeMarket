import { profile } from "console"
import TrustTrader from "./components/trust_trader.js"
import GetEmails from "./components/email_collector.js"

const TrustTraderUrl = "https://www.trustatrader.com/search?trade_name=Locksmith&search_trade_id=5b4cbdcb8811d346b846da5f&location_str=Hastings&lat=&lon=&trader=&search_trader_id"
const outputFile = "finalTest2.csv"

try {
  console.log('[+] Starting With Part one :: Scraping TrustTrader.com ')
  let profiles = await new TrustTrader(TrustTraderUrl).exec()
  console.log(`[+] Colleted ${profiles.length} Profile `)
  console.log('[+] Starting With Part Two :: Email collection ')
  await GetEmails(profiles, outputFile)
  console.log('[+] Done')
} catch (error) {
  console.log('[-] Something happen please contact support for more help')
  console.log(error)
}
