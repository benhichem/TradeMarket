import axios from "axios";
import cheerio from "cheerio";
import fs from "node:fs"

async function GetPageEmail(url: string) {
  try {
    const res = await axios.get(url)
    const $ = cheerio.load(res.data)
    const bodyText = $('body').text()
    let emails = bodyText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
    return emails
  } catch (error) {
    if (error instanceof Error) {
      return null
    }
    return null
  }
}

async function getContactButton(url: string) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Look for elements that might be a "Contact Us" button
    const contactButton = $('a, button').filter(function() {
      return /contact\s*(us)?/i.test($(this).text());
    }).first();

    if (contactButton.length) {
      return {
        text: contactButton.text().trim(),
        href: contactButton.attr('href') || null,
        type: contactButton.prop('tagName').toLowerCase()
      };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

//TODO: Please update Profile Type here

export default async function GetEmails(Profiles: Array<any>,output:string) {
  for (let index = 0; index < Profiles.length; index++) {
    const element = Profiles[index];
    if (element === undefined) return
    if (element.website !== null) {
      let initialSearch = await GetPageEmail(element.website)
      element['emails'] = [...new Set(initialSearch)]
      if (initialSearch === null) {
        const buttons = await getContactButton(element.website)
        if (buttons !== null) {
          if (buttons.href!.includes('http')) {
            const SecondSearch = await GetPageEmail(buttons.href!)
            element['emails'] = [...new Set(SecondSearch)]
          } else if (buttons.href!.includes('contact')) {
            console.log(buttons)
            console.log(`${element.website.replace(/\/$/, '')}/${buttons.href}`)
            const SecondSearch2 = await GetPageEmail(`${element.website.replace(/\/$/, '')}/${buttons.href}`)
            console.log(SecondSearch2)
            element['emails'] = [...new Set(SecondSearch2)]
          }else{
            const SecondSearch3 = await GetPageEmail(buttons.href!)
            element['emails'] = [...new Set(SecondSearch3)]
          }
        }
      }
    }
    console.log(element)
  }


  const csvString = [
    [
      "Mob",
      "Tel",
      "CompanyType",
      "ownerName",
      "website",
      "company",
      "emails"
    ],
    ...Profiles.map(item => [
      item.Mob,
      item.Tel,
      item.CompanyType,
      item.ownerName,
      item.website,
      item.company,
      item.emails
    ])
  ]
    .map(e => e.join(","))
    .join("\n");
  fs.writeFileSync(output, csvString)
  console.log('File written ')
}





// await GetEmails('https://www.uslgroup.co.uk/')

// // Usage
// getContactButton("")
//     .then(result => console.log(result));





