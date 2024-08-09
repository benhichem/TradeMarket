import cheerio from "cheerio"
import axios from "axios"
import { TrustSearchResultSelectors, TrustProfileSelectors } from "../lib/selectors.js"
import { Profile } from "src/types/index.js"
import GetEmails from "./email_collector.js"


async function GetPagesUrl(url: string): Promise<Array<string>> {
  try {
    const urls: Array<string> = []
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const cards = $(TrustSearchResultSelectors.profile_cards)
    for (let index = 0; index < cards.length; index++) {
      const element = cards[index];
      urls.push(`https://www.trustatrader.com${$(element).find(TrustSearchResultSelectors.name).attr('href')}`)
    }
    return urls

  } catch (error) {
    console.log('[-] Failed to scrape ', url)
    return []
  }
}

//DONE : No return type set yet
async function ScrapeTrustUrlPage(url: string): Promise<Profile | null> {
  try {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    let Mob = null;
    let Tel = null;
    let ownerName = null;
    let CompanyType = null;
    let website = null;
    let companyName = null

    const companyNameElement = $(TrustProfileSelectors.company_name)

    if (companyNameElement.length > 0) {
      companyName = companyNameElement.text().trim()
    }
    const websiteElement = $(TrustProfileSelectors.website)

    if (websiteElement.length > 0) {
      website = websiteElement.attr('href')?.trim();
    }

    $(TrustProfileSelectors.phones).each((index, element) => {
      const text = $(element).text().trim().trim();
      const [key, value] = text.split(':\n');

      if (key === 'Mob') {
        Mob = value.trim();
      } else if (key === 'Tel') {
        Tel = value.trim();
      }
    });
    const ownerElements = $(TrustProfileSelectors.company_detail);

    if (ownerElements.length > 1) {
      ownerElements.each((index, element) => {
        const text = $(element).text();
        if (text.includes('Owned by')) {
          ownerName = text.split('Owned by ')[1].trim();
        }
      });
      CompanyType = $(ownerElements[1]).text();
    } else if (ownerElements.length === 1) {
      const availableData = $(ownerElements[0]).text();
      if (availableData.includes('Owned by')) {
        ownerName = availableData.split('Owned by ')[1].trim();
      } else {
        // Can't really do a check if it's company or not
        CompanyType = availableData;
      }
    }

    // Now Mob and Tel variables contain the respective values, if found
    return {
      CompanyType: CompanyType ? CompanyType.trim() : null,
      CompanyName: companyName ? companyName.trim() : null,
      Website: website ? website : null,
      OwnerName: ownerName ? ownerName.trim() : null,
      Mob: Mob,
      Tel: Tel,
      emails: []
    }
  } catch (error) {
    console.log(error)
    console.log('[-] Failed to scrape Url', url)
    return null
  }
}






/*
 * what does this function do ? 
 * this function will scrape The TrustATrader website for entries and then scrape each entry's wesbite if avaliable for the email 
 * how does it do it ? 
 * it uses cheerio and axios for both stages 
 * any other features ? 
 * TODO: proxy not yet implemented ...
 * @params URL: string 
 * @return Promise<Array<Profile>>
 * */
export default async function ScrapeProfiles(Url: string): Promise<Array<Profile>> {
  try {
    console.log('[+] scraping :: ', Url)
    let Profiles: Array<Profile> = []
    const response = await axios.get(Url)
    const $ = cheerio.load(response.data)
    const Avaliable_results = $(TrustSearchResultSelectors.profile_cards)
    if (Avaliable_results.length === 0) {
      console.log('[-] No results Found ...')
      return []
    } else {
      const pages_text = $(TrustSearchResultSelectors.pages).text()
      if (pages_text === "") {
        console.log("only one page")
        const urls = await GetPagesUrl(Url)
        for (var x = 0; x < urls.length; x++) {
          const profile = await ScrapeTrustUrlPage(urls[x])
          if (profile) Profiles.push(profile)
        }
      } else {
        const pages_number = pages_text.split(' of ') ? eval(pages_text.split(' of ')[1]) : 1
        console.log('[+] Pages Found ', pages_number)
        for (var i = 1; i <= pages_number; i++) {
          const urls = await GetPagesUrl(`${Url}&page=${i}`)
          for (var j = 0; j < urls.length; j++) {
            const Profile = await ScrapeTrustUrlPage(urls[j])
            if (Profile) Profiles.push(Profile)
          }
        }

      }
      console.log(`[+] Collecting emails for ${Profiles.length} Profile ...`)

      let results = await GetEmails(Profiles)
      return results
    }
  } catch (error) {
    console.log(error)
    return []
  }
}


// console.log(await ScrapeProfiles("https://www.trustatrader.com/search?trade_name=Aerial+%26+Satellite+Installation&search_trade_id=5b4cbdca8811d346b846d91a&location_str=Stockport&lat=&lon=&trader=&search_trader_id="))
