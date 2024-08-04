import PuppeteerScrapper from "../wrappers/puppeteer_provider.js";
import { TrustProfileSelectors, TrustSearchResultSelectors } from "../lib/selectors.js";
import fs from "node:fs"
import { profileEnd } from "console";
// TODO: Please add the Type for profile 
//
export default class TrustTrader extends PuppeteerScrapper {
  private readonly urls: Array<string>
  public ProfileAvaliable: Array<any>
  constructor(private readonly url: string) {
    super(false,
      { headless: false })
    this.urls = []
    this.ProfileAvaliable = []
  }
  private async GetProfileUrl() {
    if (this.$page !== null) {
      await this.$page.goto(this.url, { timeout: 0, waitUntil: "networkidle2" })
      const Page_count: number = await this.$page.evaluate(() => {
        let ele = document.querySelector('p.pagination__page-count')
        return ele ? eval((ele as HTMLParamElement).innerText.split(' of ')[1]) : 1
      })
      for (var i = 1; i <= Page_count; i++) {
        await this.$page.goto(this.url + `&page=${i}`, { timeout: 0, waitUntil: "networkidle2" })
        const Links = await this.$page.evaluate((trustTraderSelectors) => {
          return Array.from(document.querySelectorAll(trustTraderSelectors.profile_cards)).map((card) => {
            return (card.querySelector(trustTraderSelectors.name) as HTMLAnchorElement).href
          })
        }, TrustSearchResultSelectors)
        Links.map((Profile_link) => { this.urls.push(Profile_link) })
      }
    } else {
      this.logger.info('Chrome Page did not load')
    }

  }
  async $extract() {
    try {
      await this.GetProfileUrl()
      //TODO: Please make the loop to fix urls.lengh
      for (let index = 0; index < this.urls.length; index++) {
        const ele = this.urls[index];


        await this.$page?.goto(ele, { timeout: 0, waitUntil: "networkidle2" });
        const profile = await this.$page?.evaluate((TrustProfileSelectors) => {
          let CompanyType: string = ""
          let ownerName: string = ""
          let Mob: string | null = null
          let Tel: string | null = null
          const company = document.querySelector(TrustProfileSelectors.company_name)
            ? (document.querySelector(TrustProfileSelectors.company_name) as HTMLHeadingElement).innerText
            : null;

          const phones = Array.from(document.querySelectorAll(TrustProfileSelectors.phones)).map((li) => {
            return {
              [(li as HTMLLIElement).innerText.split(':\n')[0]]: (li as HTMLLIElement).innerText.split(':\n')[1]
            }
          }).map((item) => {
            // item.Mob ? Mob = item.Mob : Mob = null
            // item.Tel ? Tel = item.Tel : Tel = null
            if (item.Mob) {
              Mob = item.Mob
            } else if (item.Tel) {
              Tel = item.Tel

            }
          })

          const website = document.querySelector(TrustProfileSelectors.website) ? (document.querySelector(TrustProfileSelectors.website) as HTMLAnchorElement).href : null

          const owner = Array.from(document.querySelectorAll(TrustProfileSelectors.company_detail))

          if (owner.length > 1) {
            owner.map((element) => {
              let Text = (element as HTMLDivElement).innerText;
              if (Text.includes('Owned by')) {
                ownerName = Text.split('Owned by ')[1].trim()
              }
            })
            CompanyType = (document.querySelectorAll(TrustProfileSelectors.company_detail)[1] as HTMLDivElement).innerText
          } else if (owner.length === 1) {
            let avalible_data = (document.querySelectorAll(TrustProfileSelectors.company_detail)[0] as HTMLDivElement).innerText
            if (avalible_data.includes('Owned by')) {
              ownerName = avalible_data.split('Owned by ')[1].trim()
            } else {
              // cant really do a check if its company or not 
              CompanyType = avalible_data
            }

          }

          return {
            Mob, Tel,
            CompanyType,
            ownerName,
            website,
            company
          }
        }, TrustProfileSelectors)

        console.log(profile)
        this.ProfileAvaliable.push(profile)
      }
      fs.writeFileSync('tempoutput.json', JSON.stringify(this.ProfileAvaliable))
    } catch (error) {
      console.log(error)
    }
  }
}
