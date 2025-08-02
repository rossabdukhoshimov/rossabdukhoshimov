# Playwright + Cucumber BDD Framework 🚀

![Playwright](https://img.shields.io/badge/Playwright-Testing-green)
![Cucumber](https://img.shields.io/badge/Cucumber-BDD-orange)
![Node.js](https://img.shields.io/badge/Node.js-16+-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

## 📌 About the Project
This repository contains a **Playwright + Cucumber BDD test automation framework** designed for both **UI** and **API testing**. It provides a scalable structure for integrating end-to-end tests with behavior-driven development principles.

### ✅ Key Highlights
- **Supports UI & API Tests** in a single framework
- **Cucumber BDD** for human-readable scenarios
- **Parallel Execution** for faster test runs
- **Environment-based Configurations** using `.env` files
- **Dockerized Setup** for CI/CD (GitHub Actions ready)
- **Video Recording & Screenshots** for UI test failures

---

## 🗂 Project Structure

```
tests/
 ├── api/               # API tests, step definitions, utilities
 ├── web/               # UI tests, page objects, step definitions
 ├── playwright-bdd/    # Core BDD framework files
 └── features/          # Gherkin feature files
```

**Feature files** should ideally follow the stack-based structure.  
Example:
```
frontEnd/
 └── landing/
      └── integration_tests/
           └── sample.feature
```

---

## ⚡ Setup & Installation

Clone this repository into your `tests/` directory:

```bash
git clone https://github.com/your-username/playwright-bdd.git
cd playwright-bdd
```

Install dependencies:

```bash
npm install
npx -y playwright@1.45.0 install --with-deps
```

---

## 🐳 Docker Support (CI/CD)

The `Dockerfile` is primarily used in **GitHub Actions** for seamless browser dependency handling.  
Playwright browsers are pre-installed to avoid conflicts during pipeline execution.

Run tests inside Docker:

```bash
docker build -t playwright-bdd .
docker run --rm playwright-bdd
```

---

## 🔐 Environment Setup

Create a `.env.local` file inside the `playwright-bdd` folder:

```
BASEURL=http://localhost:3000
SYSTEM=system_name
LOCAL_TOKEN="bearer token here for local api test runs"

# Execution Configurations
TEST_ENV=dev
BROWSER=chrome
TEST_TIMEOUT=20
WAIT_TIMEOUT=1
PARALLEL_THREAD=5
RECORD_VIDEO=true
```

---

## ✅ Features

✔ UI & API test automation  
✔ Gherkin-based feature files for readability  
✔ Parallel execution & retry logic  
✔ Dockerized execution for CI/CD pipelines  
✔ Extensible for multiple environments  

---

## 👨‍💻 About Me

Hi! I'm **Khamroz Abdukhoshimov**, a **QA Automation Engineer** with 10+ years of experience in building robust automation frameworks using **Playwright, Selenium, Nightwatch and BDD tools**.  
I love leveraging **AI-driven testing solutions** to reduce flakiness and improve reliability.  
Connect with me:  
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/rossabdukhoshimov)  

---

## 📜 License
This project is licensed under the **MIT License**.
