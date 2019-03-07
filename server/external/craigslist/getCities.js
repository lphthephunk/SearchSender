import cheerio from "cheerio";
import request from "request-promise";

export default async () => {
  try {
    const result = await request("https://geo.craigslist.org/iso/us");
    if (result) {
      const $ = cheerio.load(result);
      const cities = [];

      $(".geo-site-list")
        .find("li")
        .map(function(i, li) {
          const cityName = $(this).text();
          const refSplit = $(this)
            .find("a")
            .attr("href")
            .split(".");
          // we want the info in between http:// and .craigslist
          // this should be at the 0th index
          const ref = refSplit[0].replace("https://", "");
          cities.push({ cityName, ref });
        });

      return cities;
    } else {
      throw "No cities found";
    }
  } catch (err) {
    throw err;
  }
};
