# playwright-bdd

In your project repo, you need to have 'tests/' folder in the root level. Inside this folder, you need to create 'api/' folder where you can have api test specific files and folders, including your step definitions. Create inside the tests/ folder 'web/' folder, where you can have your page objects, ui step definitions and more.

You actual feature files should reside, ideally, within the stack folder. If you have frontEnd > landing stack, then your feature files for this stack can reside in this path: frontEnd > landing > integration_tests > *.feature

Clone 'playwright-bdd' repo directly into your 'tests/' folder. Go to playwright-bdd folder and run 'npm i' followed by 'npx -y playwright@1.45.0 install --with-deps' to install packages.

There is a Dockerfile, which is meant to be used primarily within the GithubActions workflow. While installing playwright browsers with dependencies in the GHA, it throws an error. Because ubuntu already has its own browser dependencies. And during installation, when dependency versions don't match, it results in error at apt update step. Therefore we build docker image, run the container with pre-installed browser dependencies and then run our tests in this docker container.

Create .env.local file inside playwright-bdd folder. Contents of this file can be something like this:
=================================================================================================================================================
BASEURL=http://localhost:3000
# BASEURL=https://
SYSTEM=system_name
LOCAL_TOKEN="bearer token here for local api test runs"

# before running api tests, comment out below two parameters
TEST_ENV=dev
BROWSER=chrome

# These timeouts are set in minutes
TEST_TIMEOUT=20
BROWSER_LAUNCH_TIMEOUT=0
WAIT_TIMEOUT=1

# Execution configurations
RETRIES=1
PARALLEL_THREAD=5

RECORD_VIDEO=true

=================================================================================================================================================
