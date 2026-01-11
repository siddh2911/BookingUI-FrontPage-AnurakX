const fs = require('fs');
const path = require('path');

const reviewsPath = path.join(__dirname, '../src/data/reviews.json');
const reviews = require(reviewsPath);

const uniqueReviews = [];
const seenQuotes = new Set();

reviews.forEach(r => {
    
    const navQuote = r.quote.replace(/\s+/g, ' ').trim().toLowerCase();
    if (!seenQuotes.has(navQuote)) {
        seenQuotes.add(navQuote);
        uniqueReviews.push(r);
    }
});

console.log(`Original: ${reviews.length}, Unique: ${uniqueReviews.length}`);
fs.writeFileSync(reviewsPath, JSON.stringify(uniqueReviews, null, 2));
