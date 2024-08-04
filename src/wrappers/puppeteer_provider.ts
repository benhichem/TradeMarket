import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Page, Browser } from 'puppeteer'
import { Logger } from '@destruct/logger'
import { ScrapperInterface } from '../types/index.js'

puppeteer.use(StealthPlugin())

type LaunchOptions = Parameters<typeof puppeteer.launch>[0]

export default class PuppeteerScrapper implements ScrapperInterface {
  public $page: Page | null
  private _browser: Browser | null
  protected payload: Array<any>
  public logger: Logger
  private browser_option: LaunchOptions
  private close: boolean

  constructor(close: boolean, browser_options?: LaunchOptions) {
    this.$page = null
    this._browser = null
    this.payload = []
    this.logger = new Logger('puppeteer_provider')
    this.browser_option = browser_options
      ? browser_options
      : {
        headless: true,
      }

    this.close = close
  }

  public async navigate(url: string): Promise<void> {
    if (this.$page !== null) {
      await this.$page
        .goto(url, { timeout: 0, waitUntil: 'networkidle2' })
        .catch((err) => {
          throw err
        })
    }
  }
  private async _setup() {
    try {
      this.logger.info('Initiating Browser ... ')
      this._browser = await puppeteer.launch(this.browser_option)
      this.$page = await this._browser.newPage()
      if (this.$page) {
        await this.$page.setViewport({
          height: 900,
          width: 1600,
        })
      }
      this.logger.info('Browser started successfully ...')
    } catch (error) {
      if (error instanceof Error) {
        console.log(error)
        throw new Error('Puppeteer Failed To start')
      }
    }
  }

  public async _cleanup() {
    this.logger.info('Clean up process started ...')
    if (this.$page && this._browser) {
      await this.$page.close()
      this.$page = null
      await this._browser.close()
      this._browser = null
    }
  }

  public async exists(selector: string): Promise<boolean> {
    return await this.$page!.waitForSelector(selector, { timeout: 1000 })
      .then(() => {
        this.logger.info('Selector Exists ...')
        return true
      })
      .catch((err) => {
        this.logger.info('Selector does not exist ...')
        return false
      })
  }
  async restart() {
    this.logger.info('Restarting The puppeteer session ...')
    await this._cleanup()
    await this._setup()
  }
  protected async $extract() { }

  async exec() {
    await this._setup()
    await this.$extract()
    this.close
      ? await this._cleanup()
      : this.logger.info('Browser needs to be manually closed ')
    return this.payload
  }
}
