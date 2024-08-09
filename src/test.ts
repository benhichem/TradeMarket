import fs from "node:fs"
import { LOCATION_PATH } from "./lib/config.js"

const dirs = fs.readdirSync('./results')
console.log(dirs)


let locations = fs.readFileSync(LOCATION_PATH).toString().split('\n').map((line) => {
  if (line !== "") return line.trim()
})

console.log(locations.length)
dirs.map((folder) => {
  let x = fs.readdirSync(`./results/${folder}`).map((location) => { return location.split('.csv')[0] })
  if (x.length === locations.length) { return }
  else {
    // we need to find what's missing
    let missingLocations = [...new Set([...locations, ...x]).values()].filter(item => locations.includes(item) !== x.includes(item!))

    console.log(missingLocations.length)
    console.log(x.length)
  }
})
