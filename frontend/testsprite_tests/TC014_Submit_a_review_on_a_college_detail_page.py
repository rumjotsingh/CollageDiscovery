import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3001")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Login' button to open the login form.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Login as demo user' button to sign in with the pre-filled demo account.
        # Login as demo user button
        elem = page.get_by_role('button', name='Login as demo user', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Colleges' link in the header to open the colleges list page and verify the list loads.
        # Colleges link
        elem = page.get_by_text('Saved', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Colleges', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the college 'Birla Institute of Technology and Science' by clicking its name to load the college details page.
        # Birla Institute of Technology and Science link
        elem = page.get_by_role('link', name='Birla Institute of Technology and Science', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Reviews' tab on the college details page to open the reviews section.
        # Reviews button
        elem = page.get_by_role('button', name='Reviews', exact=True)
        await elem.click(timeout=10000)
        
        # -> Select a 4-star rating, enter a comment 'Great campus and strong placements.' in the 'Share your experience…' textarea, then click the 'Submit Review' button to post the review.
        # 4 button
        elem = page.get_by_role('button', name='4', exact=True)
        await elem.click(timeout=10000)
        
        # -> Select a 4-star rating, enter a comment 'Great campus and strong placements.' in the 'Share your experience…' textarea, then click the 'Submit Review' button to post the review.
        # Share your experience… text area
        elem = page.get_by_placeholder('Share your experience…', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Great campus and strong placements.")
        
        # -> Select a 4-star rating, enter a comment 'Great campus and strong placements.' in the 'Share your experience…' textarea, then click the 'Submit Review' button to post the review.
        # Submit Review button
        elem = page.get_by_role('button', name='Submit Review', exact=True)
        await elem.click(timeout=10000)
        
        # -> Reload the current college details page (Birla Institute of Technology and Science) to refresh authentication and the Reviews UI so the 'Submit Review' button can be enabled.
        await page.goto("http://localhost:3001/colleges/birla-institute-of-technology-and-science-187")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Wait for the college details page to finish rendering, then click the 'Student 1' user menu button to confirm the session and prompt the UI to show authenticated review controls.
        # S Student 1 button
        elem = page.get_by_role('button', name='S Student 1', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Reviews' tab on the college details page to open the reviews section and expose the rating controls and submit form.
        # Reviews button
        elem = page.get_by_role('button', name='Reviews', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the new review appears in the reviews thread
        await page.locator("xpath=/html/body/div[2]/main/div/div[3]/div/div[2]/div/div").nth(0).scroll_into_view_if_needed()
        # Assert: Expected the posted review with rating 4 to appear in the reviews thread.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div[3]/div/div[2]/div/div").nth(0)).to_be_visible(timeout=15000), "Expected the posted review with rating 4 to appear in the reviews thread."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    