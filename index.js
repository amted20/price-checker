import * as cheerio from "cheerio";
import sendEmail from "./email.js";

const products = [
  { company: "sony", url: process.env.SONY_URL },
  { company: "best-buy", url: process.env.BEST_BUY_URL },
];

async function scrapeParagraph(product) {
  try {
    const response = await fetch(product.url);
    const html = await response.text();

    const $ = cheerio.load(html);

    if (product.company === "sony") {
      const paragraph = $("p.product-pricing__amount");
      const prices = [];

      const textContents = paragraph.text().trim().split(" ");
      textContents.forEach((price) => {
        const priceText = price.replace("$", "").replace(",", "");
        if (priceText) prices.push(parseFloat(priceText));
      });
      return prices[0];
    }

    if (product.company === "best-buy") {
      const visiblePrice = $('div[data-testid="customer-price"] span:not(.sr-only)').text().trim();

      const numericPrice = parseFloat(visiblePrice.replace(/[$,]/g, ""));
      return numericPrice;
    }

    if (product.company === "amazon") {
      const offscreenPrice = $("span.aok-offscreen").first().text().trim();
      const numericOffscreen = parseFloat(offscreenPrice.replace(/[$,]/g, ""));
      return numericOffscreen;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const priceList = [];
for (const product of products) {
  const res = await scrapeParagraph(product);
  priceList.push({
    company: product.company,
    price: Math.round(res),
    url: product.url,
  });
}

const reducePriceList = [];
if (priceList.length) {
  for (const price of priceList) {
    if (price.price < Number(process.env.PRODUCT_PRICE)) {
      reducePriceList.push(price);
    }
  }
}

if (reducePriceList.length) {
  sendEmail(reducePriceList);
} else {
  console.log(`Pice was not lower than...`)
}
