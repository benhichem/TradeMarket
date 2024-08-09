import axios from "axios";
import cheerio from "cheerio";
import { Profile } from "src/types";

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

/**
 * what this function will do ? 
 * it will make an axios get request to then load the data into cheerio then using an email regex to get the email 
 * if an email was found great if not it will look for contact page and then create the link and make the checks for page email 
 *
 * @param Profiles[] 
 * @returns Promise<Profiles[]>
 */
export default async function GetEmails(Profiles: Array<Profile>): Promise<Array<Profile>> {
  for (let index = 0; index < Profiles.length; index++) {
    const element = Profiles[index];
    if (element === undefined) continue;
    if (element.Website !== null) {
      let initialSearch = await GetPageEmail(element.Website)
      element['emails'] = [...new Set(initialSearch)]
      if (initialSearch === null) {
        const buttons = await getContactButton(element.Website)
        if (buttons !== null) {
          if (buttons.href!.includes('http')) {
            const SecondSearch = await GetPageEmail(buttons.href!)
            element['emails'] = [...new Set(SecondSearch)]
          } else if (buttons.href!.includes('contact')) {
            console.log(buttons)
            console.log(`${element.Website.replace(/\/$/, '')}/${buttons.href}`)
            const SecondSearch2 = await GetPageEmail(`${element.Website.replace(/\/$/, '')}/${buttons.href}`)
            console.log(SecondSearch2)
            element['emails'] = [...new Set(SecondSearch2)]
          } else {
            const SecondSearch3 = await GetPageEmail(buttons.href!)
            element['emails'] = [...new Set(SecondSearch3)]
          }
        }
      }
    }
    console.log(element)
  }
  return Profiles
}





// await GetEmails('https://www.uslgroup.co.uk/')

// // Usage
// getContactButton("")
//     .then(result => console.log(result));





