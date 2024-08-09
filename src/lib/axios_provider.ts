import axios from "axios"
import https from "node:https"

const TrustTraderUrl = "https://www.trustatrader.com/search?trade_name=Locksmith&search_trade_id=5b4cbdcb8811d346b846da5f&location_str=Hastings&lat=&lon=&trader=&search_trader_id"
//import axios from "axios-proxy-fix"

// const instance = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false,
//   }),

//   proxy: {

//   },
//   auth: {
//     username: "spd1dfuztu",
//     password: "2gXmuk3v5lZaVCbb3p"
//   }
// })


// await instance.get("https://api.myip.com").then((res) => {
//   console.log(res.data)
// }).catch((err) => {
//   console.log(err)
// })

//@ts-ignore



// ERROR: getting 403 status error 
axios.get('https://www.trustatrader.com/search?trade_name=Decking&search_trade_id=5b4cbdcb8811d346b846da57&location_str=Londonderry&lat=&lon=&trader=&search_trader_id=', {
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  }),

  // httpAgent: new http.Agent({
  // }),

  // "45.127.248.127:5128:ouufxrgm:kusn3a8bzs2n"
  proxy: {
    protocol: "https",
    host: "64.64.118.149",
    port: 6732,
    auth: {
      username: "benbenben",
      password: "doodoodoo"
    }
  }
}).then((res) => { console.log(res.data) }).catch((err) => { console.log(err) })



