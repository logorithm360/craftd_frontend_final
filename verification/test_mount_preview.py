from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.on("console", lambda msg: print(f"PAGE CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err.message}"))

    page.goto("http://localhost:4173")
    time.sleep(3)
    print("Page Title:", page.title())
    print("Page Body HTML:", page.locator("body").inner_html())
    page.screenshot(path="verification/screenshots/test_mount_preview.png")
    browser.close()
