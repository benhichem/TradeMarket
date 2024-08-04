import TrustTrader from "./components/trust_trader.js"

console.log('Start')
const url = "https://www.trustatrader.com/search?trade_name=Locksmith&search_trade_id=5b4cbdcb8811d346b846da5f&location_str=Hastings&lat=&lon=&trader=&search_trader_id"


try {
  console.log(await new TrustTrader(url).exec())
} catch (error) {
  console.log(error)
}
