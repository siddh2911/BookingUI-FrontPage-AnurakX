const fs = require('fs');
const path = require('path');

const rawPath = path.join(__dirname, '../src/data/airbnb_reviews_raw.json');
// Handle missing raw file
let rawData = {};
try {
    rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
} catch (e) {
    // ignore
}

// Updated to handle array of responses
const extractReviews = (dataRoot) => {
    let allReviews = [];
    const processJSON = (json) => {
        if (!json || !json.data) return;
        const data = json.data;
        if (data.contextualUser && data.contextualUser.reviewHighlightsFromGuests) {
            allReviews = allReviews.concat(data.contextualUser.reviewHighlightsFromGuests);
        }
    };
    if (dataRoot.all_responses && Array.isArray(dataRoot.all_responses)) {
        dataRoot.all_responses.forEach(processJSON);
    } else if (dataRoot.data) {
        processJSON(dataRoot);
    }
    return allReviews;
};

let reviewsArray = extractReviews(rawData);

// Deduplicate by comment content
const uniqueReviews = Array.from(new Map(reviewsArray.map(item => [item.commentV2, item])).values());

const cleanReviews = uniqueReviews
    .filter(r => r.displayRating === 5)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((r, index) => {
        return {
            id: index + 1,
            name: r.contextualReviewer?.displayFirstName || 'Airbnb Guest',
            location: r.contextualReviewer?.location || 'Airbnb',
            image: r.contextualReviewer?.userRepresentationUrl?.profilePictureUrl || '',
            quote: r.commentV2 || '',
            rating: r.displayRating,
            type: 'Guest Review'
        };
    })
    .filter(r => r.quote && r.quote.length > 2);

console.log(`Found ${cleanReviews.length} 5-star reviews form network data.`);

// Merge with DOM data
const domPath = path.join(__dirname, '../src/data/airbnb_reviews_dom.json');
if (fs.existsSync(domPath)) {
    try {
        const domData = JSON.parse(fs.readFileSync(domPath, 'utf8'));

        const domProcessed = domData.map((d, i) => {
            let fullText = d.quote || d.text || '';
            let rating = d.rating;
            let name = d.name || 'Airbnb Guest';
            let location = d.location || 'Airbnb';
            let image = d.image || '';

            // 1. Parse Rating
            const ratingMatch = fullText.match(/Rating (\d+) out of 5/);
            if (ratingMatch) {
                rating = parseInt(ratingMatch[1]);
            }

            // 2. Parse Name/Location
            const lines = fullText.split('\n');
            if (lines.length >= 3 && fullText.includes('Rating')) {
                if (!lines[0].includes('Rating')) name = lines[0];
                if (!lines[1].includes('Rating')) location = lines[1];
            }

            // 3. Clean Quote (Remove Header)
            let cleanQuote = fullText;
            if (ratingMatch) {
                // Split by "Rating X out of 5"
                const parts = cleanQuote.split(/Rating \d+ out of 5/);
                if (parts.length > 1) {
                    const suffix = parts[1];
                    const suffixLines = suffix.split('\n');
                    // Find start of content
                    const contentStartIndex = suffixLines.findIndex(l => {
                        const t = l.trim();
                        return t.length > 0 && t !== ',' && t !== '·' && !t.match(/^[A-Z][a-z]+ \d{4}$/) && !t.includes('ago') && !t.includes('weeks') && !t.includes('months');
                    });

                    if (contentStartIndex !== -1) {
                        cleanQuote = suffixLines.slice(contentStartIndex).join('\n').trim();
                    }
                }
            }

            return {
                id: `dom-${i}`,
                name: name,
                location: location,
                image: image,
                quote: cleanQuote,
                rating: rating,
                type: 'Guest Review'
            };
        })
            .filter(r => r && r.rating === 5 && r.quote.length > 2);

        // Merge logic with normalization
        const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

        domProcessed.forEach(r => {
            const rNorm = normalize(r.quote);

            const existingIndex = cleanReviews.findIndex(existing => {
                const existingNorm = normalize(existing.quote);
                return existingNorm.includes(rNorm) || rNorm.includes(existingNorm);
            });

            if (existingIndex !== -1) {
                // Match found. Logic to pick the best one.
                const existing = cleanReviews[existingIndex];

                // 1. Prefer one with an image
                if (!existing.image && r.image) {
                    cleanReviews[existingIndex] = r;
                }
                // 2. If same image status, prefer longer text (likely more complete)
                else if ((!!existing.image === !!r.image) && existing.quote.length < r.quote.length) {
                    cleanReviews[existingIndex] = r; // Upgrade
                }
                // Else keep existing
            } else {
                cleanReviews.push(r);
            }
        });

        console.log(`Total after merging DOM data: ${cleanReviews.length}`);
    } catch (e) {
        console.log('Error processing DOM data:', e.message);
    }
}

const outputPath = path.join(__dirname, '../src/data/reviews.json');
fs.writeFileSync(outputPath, JSON.stringify(cleanReviews, null, 2));
console.log(`Saved processed reviews to ${outputPath}`);
