## User Story
Scraper Brief – TrustATrader

We require a scraper to be built that will use a list of search URLS to individually go into each business profile found and scrape specific information. When all the data has been scraped we then need to create a scraper to scrape the contact information (e-mail address) from the business website.

Example search URL:

https://www.trustatrader.com/search?trade_name=Locksmith&search_trade_id=5b4cbdcb8811d346b846da5f&location_str=Hastings&lat=&lon=&trader=&search_trader_id=

Example business profile URL:

https://www.trustatrader.com/traders/locks-and-glass-ltd-locksmith-dartford

Data to scrape:

• Company name
• Tel
• Mob
• Website
• Owner name
• Company type i.e. Limited company
• Email
 


## initial thoughts: 
breaking down the scraper into two parts 

1. first to scrape the tradesMarket website for every profile avaliable with website 
2. then to find a way to scrape template the emails from the websites usually have a form contact us since its only a landing page. 


## Steps 

### step 1 
- [ ] scrape TradesMarket 
    - [ ] collect every profile avaliable 
        the information needed 
        * Company_name: string 
        * Tel : string 
        * Mob : string 
        * Website : URL 
        * Owner_name : string 
        * Company_type :string 
    - [ ] save input into a temporary json file 

### step 2
- [ ] read from temporary json file
- [ ] Visit the website.
- [ ] away to always locate the contact form.
- [ ] scrape email if its publicly avaliable. 
- [ ] Save output to csv.

### cleanup Process 
- [ ] delete the temporary json file after all objects finished. 




