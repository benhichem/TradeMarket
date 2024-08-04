export const TrustSearchResultSelectors = {
  profile_cards: "li.profile-card",
  name: "a.profile-card__heading-link",
  trust_trader_profile_url: "a.profile-card__heading-link",
  phones: "ul.profile-card__tels",

  // TODO: only after navigating to trust_trader_profile 
  website: "a.profile-opening__cta-link--website"
}


export const TrustProfileSelectors = {
  company_name: "h1[itemprop='name']",
  // this selector had both Tel and Mob in li's so i will have to loop thru and see 
  phones: "ul.profile-opening__tels > li",
  website: "a.profile-opening__cta-link--website",
  // this selector also has a bunch of information like name, company type ...
  company_detail: 'div.profile-checks__detail'

}
