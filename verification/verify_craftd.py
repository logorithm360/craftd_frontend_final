from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    # Log console messages
    page.on("console", lambda msg: print(f"PAGE CONSOLE: {msg.text}"))
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err.message}"))

    # 1. Go to Landing Page
    print("Navigating to Landing Page...")
    page.goto("http://localhost:5173", wait_until="networkidle")
    print(f"Page Title: {page.title()}")

    anchors = [el.inner_text() for el in page.query_selector_all("a")]
    print(f"Available Anchor Links: {anchors}")

    # Capture Landing Page Screenshot
    page.screenshot(path="verification/screenshots/landing_page.png")

    # 2. Go to Login Page
    print("Navigating to Login Page...")
    # Find link that contains "Log In" or "Log"
    page.click("a:has-text('Log In')")
    page.wait_for_timeout(800)

    # Fill in Admin credentials
    print("Filling in login credentials...")
    page.fill("input[id='email']", "admin@craftd.sh")
    page.wait_for_timeout(400)
    page.fill("input[id='password']", "password")
    page.wait_for_timeout(400)

    # Submit login form
    print("Submitting login form...")
    page.click("button:has-text('Sign In to Workspace')")
    page.wait_for_timeout(2000) # Wait for simulation delay + redirect

    # Capture Projects Dashboard Screenshot
    page.screenshot(path="verification/screenshots/projects_dashboard.png")
    page.wait_for_timeout(800)

    # 3. Create a Project
    print("Creating a project container...")
    page.click("button:has-text('Create Project')")
    page.wait_for_timeout(600)

    page.fill("input[placeholder='e.g. CLI Sync Library']", "CLI Telemetry Node")
    page.wait_for_timeout(400)
    page.fill("textarea[placeholder='Summarize project context...']", "Automated sync loops for local VS Code integration files.")
    page.wait_for_timeout(400)
    page.fill("input[placeholder='React 19, TypeScript, AWS']", "CLI, Rust, Automation")
    page.wait_for_timeout(400)

    page.click("button:has-text('Initialize')")
    page.wait_for_timeout(1200)

    # 4. Navigate to Tasks Workspace
    print("Navigating to Tasks Workspace...")
    page.click("text=Tasks")
    page.wait_for_timeout(1000)

    # Create a Task ticket
    print("Creating a task ticket...")
    page.click("button:has-text('Add Task')")
    page.wait_for_timeout(600)

    page.select_option("select[id='projectId']", label="CLI Telemetry Node")
    page.wait_for_timeout(400)
    page.fill("input[id='title']", "Establish local Rust sync pipelines")
    page.wait_for_timeout(400)
    page.fill("textarea[id='description']", "Develop lightning fast watchers for active workspaces.")
    page.wait_for_timeout(400)
    page.select_option("select[id='priority']", value="high")
    page.wait_for_timeout(400)

    page.click("button:has-text('Publish Ticket')")
    page.wait_for_timeout(1200)

    # 5. Advance task ticket status
    print("Advancing a task ticket to In Progress...")
    page.click("button:has-text('Advance →')")
    page.wait_for_timeout(1200)

    # Capture Tasks Workspace Screenshot
    page.screenshot(path="verification/screenshots/tasks_workspace.png")
    page.wait_for_timeout(500)

    # 6. Go to Settings
    print("Navigating to Settings...")
    page.click("text=Settings")
    page.wait_for_timeout(800)

    # Go to Sync Settings tab
    page.click("button:has-text('sync Settings')")
    page.wait_for_timeout(1000)

    # Capture Settings Screenshot
    page.screenshot(path="verification/screenshots/settings.png")
    page.wait_for_timeout(500)

    # 7. Go to Profile
    print("Navigating to Profile...")
    page.click("text=Profile")
    page.wait_for_timeout(1000)

    # Capture Profile Screenshot (This will serve as our final terminal state)
    page.screenshot(path="verification/screenshots/verification.png")
    page.wait_for_timeout(1000)
    print("Verification journey complete!")

if __name__ == "__main__":
    os.makedirs("verification/screenshots", exist_ok=True)
    os.makedirs("verification/videos", exist_ok=True)

    with sync_playwright() as p:
        print("Launching headless Chromium...")
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
