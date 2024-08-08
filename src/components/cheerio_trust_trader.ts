import cheerio, { AnyNode, Cheerio } from "cheerio"
import axios from "axios"
import { TrustSearchResultSelectors, TrustProfileSelectors } from "../lib/selectors.js"
import { Profile } from "src/types/index.js"
import GetEmails from "./email_collector.js"

const TrustTraderUrl = "https://www.trustatrader.com/search?trade_name=Locksmith&search_trade_id=5b4cbdcb8811d346b846da5f&location_str=Hastings&lat=&lon=&trader=&search_trader_id"

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

//TODO : No return type set yet
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
    console.log('Mob:', Mob);
    console.log('Tel:', Tel);
    console.log(companyName)
    console.log(website)
    console.log(ownerName?.trim())
    console.log(CompanyType?.trim())
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



try {
  let Profiles: Array<Profile> = []
  const response = await axios.get(TrustTraderUrl)
  const $ = cheerio.load(response.data)
  const Avaliable_results = $(TrustSearchResultSelectors.profile_cards)
  if (Avaliable_results.length === 0) {
    console.log('[-] No results Found ...')
  } else {
    const pages_text = $(TrustSearchResultSelectors.pages).text()
    const pages_number = pages_text.split(' of ') ? eval(pages_text.split(' of ')[1]) : 1
    console.log('[+] Pages Found ', pages_number)
    for (var i = 1; i <= pages_number; i++) {
      const urls = await GetPagesUrl(`${TrustTraderUrl}&page=${i}`)
      for (var j = 0; j < urls.length; j++) {
        const Profile = await ScrapeTrustUrlPage(urls[j])
        if (Profile) Profiles.push(Profile)
      }
    }

    console.log('[+] Collecting emails ...')
    await GetEmails(Profiles,"cherioTest.csv")
  }
} catch (error) {
  console.log(error)
}
