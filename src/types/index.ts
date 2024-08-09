export interface ScrapperInterface {
  navigate(url: string): Promise<void>
  exists(selector: string): Promise<boolean>
  restart(): Promise<void>
}


export interface Profile {
  CompanyName: string | null;
  Website: string | null;
  OwnerName: string | null;
  CompanyType: string | null
  Mob:string | null; 
  Tel:string | null; 
  emails:Array<string>


}
