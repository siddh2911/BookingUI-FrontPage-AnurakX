const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('Starting automated review scraper (User-Defined Strategy with UPDATED SELECTORS + LOCATION + NAME)...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
        defaultViewport: { width: 1280, height: 800 }
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        console.log('Navigating to profile...');
        await page.goto('https://www.airbnb.co.in/users/profile/1463882883975202392?previous_page_name=PdpHomeMarketplace', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // 1. Click "Show all <number> reviews"
        console.log('Looking for "Show all reviews" button...');
        await page.waitForSelector('button', { timeout: 5000 });
        const buttonClicked = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const showAllBtn = buttons.find(b => b.textContent.includes('Show all') && b.textContent.includes('reviews'));
            if (showAllBtn) {
                showAllBtn.click();
                return true;
            }
            return false;
        });

        if (!buttonClicked) {
            console.error('Could not find "Show all reviews" button.');
            await browser.close();
            return;
        }

        console.log('Clicked "Show all reviews". Waiting for popup...');

        // 2. Pop up open with class that start with "bqtf19k"
        try {
            await page.waitForFunction(() => {
                const divs = Array.from(document.querySelectorAll('div'));
                return divs.some(d => d.className.includes('bqtf19k'));
            }, { timeout: 10000 });
            console.log('Popup detected (class bqtf19k).');
        } catch (e) {
            console.log('Timeout waiting for specific class bqtf19k, checking for generic dialog...');
            await page.waitForSelector('[role="dialog"]');
        }

        // Get the modal handle
        const modalHandle = await page.evaluateHandle(() => {
            const specific = Array.from(document.querySelectorAll('div')).find(d => d.className.includes('bqtf19k'));
            return specific || document.querySelector('[role="dialog"]');
        });

        const allReviewsMap = new Map();
        let noChangeCount = 0;
        const MAX_NO_CHANGE = 5;

        // Loop: Capture -> Click Button -> Scroll
        for (let i = 0; i < 100; i++) {

            // A. Capture reviews one by one
            const extracted = await page.evaluate((modal) => {
                const items = [];
                // UPDATED STRATEGY: Find containers by role="group" and aria-labelledby containing "review"
                const reviewCards = Array.from(modal.querySelectorAll('div[role="group"]')).filter(div => {
                    const label = div.getAttribute('aria-labelledby');
                    return label && label.includes('review');
                });

                if (reviewCards.length > 0) {
                    reviewCards.forEach(card => {
                        // 1. TEXT
                        const textId = card.getAttribute('aria-labelledby');
                        const textContainer = card.querySelector(`[id="${textId}"]`) || card.querySelector(`div[dir="ltr"]`);
                        const text = textContainer ? textContainer.innerText : "";

                        // 2. RATING
                        let rating = 5;
                        const ratingText = card.innerText.match(/Rating (\d+) out of 5/);
                        if (ratingText) {
                            rating = parseInt(ratingText[1]);
                        }

                        // 3. IMAGE
                        let image = '';
                        let pictureElement = card.querySelector('picture[class*="p1lr305w"]');
                        if (!pictureElement) {
                            pictureElement = card.querySelector('picture');
                        }

                        if (pictureElement) {
                            const source = pictureElement.querySelector('source');
                            if (source && source.srcset) {
                                image = source.srcset.split(',')[0].trim().split(' ')[0];
                            } else {
                                const img = pictureElement.querySelector('img');
                                if (img) image = img.src;
                            }
                        }
                        if (!image) {
                            const imgs = Array.from(card.querySelectorAll('img'));
                            const profileImg = imgs.find(img => img.alt && img.alt.includes('User Profile'));
                            if (profileImg) {
                                image = profileImg.src || profileImg.getAttribute('data-original-uri');
                            }
                        }

                        // 4. LOCATION: User Strict Selector "div class starts with s17vloqa -> span"
                        let location = "India";
                        const locContainer = card.querySelector('div[class*="s17vloqa"]');
                        if (locContainer) {
                            const subSpan = locContainer.querySelector('span');
                            if (subSpan) {
                                location = subSpan.innerText;
                            } else {
                                location = locContainer.innerText;
                            }
                        }

                        if (location === 'Airbnb') {
                            location = 'India';
                        }

                        // 5. NAME: User Strict Selector "div class starts with t126ex63"
                        let name = "Airbnb Guest";
                        const nameContainer = card.querySelector('div[class*="t126ex63"]');
                        if (nameContainer) {
                            name = nameContainer.innerText;
                        }

                        items.push({
                            text: text,
                            type: 'div-text',
                            rating: rating,
                            image: image,
                            location: location,
                            name: name
                        });
                    });
                }
                return items;
            }, modalHandle);

            let added = 0;
            extracted.forEach(item => {
                const key = item.text.trim().substring(0, 50);
                if (item.text.length > 20 && !allReviewsMap.has(key)) {
                    allReviewsMap.set(key, item);
                    added++;
                }
            });
            console.log(`Iteration ${i}: Found ${extracted.length} candidates. Added ${added} new. Total Unique: ${allReviewsMap.size}`);

            // B. Click "Show more reviews" inside class "lqsm05"
            // AND C. Scroll
            const actionResult = await page.evaluate(async (modal) => {
                const containers = Array.from(modal.querySelectorAll('div, span, section'));
                const lqsmContainer = containers.find(d => d.className.includes('lqsm05'));

                let clicked = false;
                if (lqsmContainer) {
                    const btn = lqsmContainer.querySelector('button') || Array.from(lqsmContainer.querySelectorAll('div')).find(d => d.getAttribute('role') === 'button');

                    if (btn && (btn.innerText.includes('Show more') || btn.innerText.includes('reviews'))) {
                        btn.click();
                        clicked = true;
                    }
                    else if (lqsmContainer.innerText.includes('Show more')) {
                        lqsmContainer.click();
                        clicked = true;
                    }
                }

                const prevScroll = modal.scrollTop;
                modal.scrollTop += 1000;

                if (modal.scrollTop === prevScroll) {
                    const scrollable = Array.from(modal.querySelectorAll('div')).find(Expected => {
                        const style = window.getComputedStyle(Expected);
                        return (style.overflowY === 'auto' || style.overflowY === 'scroll') && Expected.scrollHeight > Expected.clientHeight;
                    });
                    if (scrollable) {
                        scrollable.scrollTop += 1000;
                    }
                }

                return { clicked };
            }, modalHandle);

            if (actionResult.clicked) {
                console.log('Clicked "Show more" button in .lqsm05 sequence.');
                await new Promise(r => setTimeout(r, 2000));
            } else {
                console.log('No "Show more" button found this step. Just scrolled.');
                await page.keyboard.press('PageDown');
                await new Promise(r => setTimeout(r, 1000));
            }

            if (added === 0 && !actionResult.clicked) {
                noChangeCount++;
            } else {
                noChangeCount = 0;
            }

            if (noChangeCount >= MAX_NO_CHANGE) {
                console.log('No new items and no button for 5 steps. Stopping.');
                break;
            }
        }

        const finalReviews = Array.from(allReviewsMap.values())
            .map((r, idx) => ({
                id: `scraped-${idx}`,
                quote: r.text,
                rating: r.rating || 5,
                image: r.image || '',
                name: r.name || "Airbnb Guest", // Use extracted name
                location: r.location && r.location !== "Airbnb" ? r.location : "India"
            }));

        console.log(`Total Extracted: ${finalReviews.length}`);
        fs.writeFileSync(path.join(__dirname, '../src/data/airbnb_reviews_dom.json'), JSON.stringify(finalReviews, null, 2));

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
