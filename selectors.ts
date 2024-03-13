export const selectors = {
  name: "//h1",
  headline: "//h2[contains(@class,'headline')]",
  subline: "//h3[contains(@class,'subline')]/div/div/span",
  summary: "//section[@data-section='summary']/div",
  posts: "//section[@data-section='posts']/div[3]/ul/li/div/div[2]",
  experiences: "//section[@data-section='experience']/div/ul/li",
  educationsDetails: "//section[@data-section='educationsDetails']/div/ul/li",
  activityPosts: "//section[@data-section='posts']/div[2]/ul/li/div/div[2]",
};

export const ui = {
    searchResults: "(//h1[contains(text(),'Search Results')]/following-sibling::div/div/div/div/div/..//a/h3)[1]",
    closeButton: "(//icon[contains(@class,'modal-dismiss')])[6]",
    googleSearch: "//textarea[@aria-label='Search']",
    googleSearchResultsPage: "//h1[contains(text(),'Search Results')]"
}
