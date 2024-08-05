# TradeMarket

## Overview

TradeMarket is a web scraping tool designed to collect business information from TrustTrader.com and associated websites. The scraper operates in two parts to gather comprehensive business data, including contact details and email addresses.

## Features

- Collects profile cards from TrustTrader.com
- Navigates through multiple pages to gather extensive data
- Extracts email addresses from associated business websites
- Outputs data in CSV format for easy analysis

## How It Works

### Part One: TrustTrader Data Collection

- Navigates to the specified TrustTrader URL
- Collects profile cards from all available pages
- Aggregates data into a structured format

Example output:

```json
{
  "Mob": "+447535 511 112",
  "Tel": null,
  "CompanyType": "Sole trader",
  "ownerName": "",
  "website": "https://www.surelockhomeshastings.co.uk/",
  "company": "Surelock Homes Locksmiths"
}
```

### Part Two: Website Email Extraction

- Visits each business website collected in Part One
- Performs HTML-to-text conversion for efficient processing
- Extracts email addresses from the website content

Final output example (CSV):

```csv
Mob,Tel,CompanyType,ownerName,website,company,emails
07949 313 140,0207 2479 304,Incorporated as from 22nd June 2015,,http://sandhurstplumbing.co.uk/,Sandhurst Plumbing and Maintenance Ltd,info@sandhurstconstruction.co.uk,info@sandhurstplumbing.co.uk
```

## Prerequisites

- Node.js (v18 or above)
- Google Chrome browser
- npm (Node Package Manager)

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Run the following command:
   ```
   npm install
   ```

## Usage

To start the scraper, run:

```
npm run start
```

## Configuration

Edit the `src/index.ts` file to modify these important variables:

- `TrustTraderUrl`: The TrustTrader URL you want to scrape
- `outputFile`: The name of the output file (ensure it ends with `.csv`)
