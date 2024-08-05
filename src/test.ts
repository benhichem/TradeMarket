import axios from "axios";
import cheerio from "cheerio";


async function GetEmails(url: string) {
  axios.get(url).then(async (res) => {
    const $ = cheerio.load(res.data)
    const bodyText = $('body').text()
    // fs.writeFileSync('dom.txt', bodyText.toString())
    // console.log(bodyText.match(regext))
    let emails = bodyText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
    console.log("from normal", emails)
    if (emails === null) {
      let contactusbuttons = await getContactButton(url)
      console.log("contactusbuttons", contactusbuttons)
      if (contactusbuttons !== null) {
        await axios.get(contactusbuttons.href!).then((res) => {
          const $ = cheerio.load(res.data)
          const bodyText = $('body').text()
          // fs.writeFileSync('dom.txt', bodyText.toString())
          // console.log(bodyText.match(regext))
          let emails = bodyText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
          console.log('from contact us', emails)
        }).catch((err) => {
          if (err instanceof Error) {
            console.log(err.name)
          }
        })
      } else {
        console.log("cant load contact us buttons")
      }
    }

  })

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
    console.error('Error:', error);
    return null;
  }
}

// await GetEmails('https://www.uslgroup.co.uk/')

// // Usage
// getContactButton("")
//     .then(result => console.log(result));

import fs from "node:fs"
let x = fs.readFileSync('TrustTraderProfiles.json')
const Profiles = JSON.parse(x.toString())

for (let index = 0; index < Profiles.length; index++) {
  const element = Profiles[index];
  if (element.website !== null) {
    await GetEmails(element.website)
  }
}
