export interface ScrapperInterface {
  navigate(url: string): Promise<void>
  exists(selector: string): Promise<boolean>
  restart(): Promise<void>
}
