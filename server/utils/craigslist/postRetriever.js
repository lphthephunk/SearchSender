const craigslist = require("node-craigslist");

const searchCraigslist = async (
  city,
  keywords,
  category = "sss" /* all */,
  hasPic = true,
  searchTitlesOnly = false
) => {
  let client = new craigslist.Client({
    city: city
  });

  const options = {
    hasPic,
    searchTitlesOnly,
    category
  };

  try {
    let posts = [];
    console.log("options: ", options);
    console.log("keywords: ", keywords);
    const result = await client.search(options, keywords);
    result.forEach(({ price, date, title, url }) => {
      posts.push(
        `<b>Title: ${title}</b><br/>Price: ${price}<br/>Posting Date: ${date}<br/>Link: ${url}`
      );
    });
    console.log(posts);
    return posts;
  } catch (err) {
    console.error(err);
  }
};

module.exports = searchCraigslist;
