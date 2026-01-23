# litivo-wrapper-js

A **Node.js + TypeScript wrapper** around **Litivo**.

This project is intended for **personal use and learning purposes**.

> ⚠️ **Disclaimer**: I am **not responsible for any misuse** of Litivo or this wrapper. This project is independent and unofficial. I am open to collaborating with the original author of Litivo if any issues arise.

---

## ✨ Purpose

- Provide a simple JavaScript/TypeScript wrapper around **Litivo**
- Make Litivo easier to interact with from Node.js

---

## 🧰 Tech Stack

- **Node.js**
- **TypeScript**
- **TSX** (for running TypeScript directly)
- **playwright** (browser automation library)
- **@playwright/test** (testing framework for E2E tests)
- **Vitest** (for unit testing)

---

## 📦 Requirements

- Node.js **24+**
- pnpm

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/CesarZHX/litivo-wrapper-js.git
cd litivo-wrapper-js
```

Install dependencies:

```bash
pnpm install
```

Install Playwright browsers (required for E2E tests):

```bash
pnpm exec playwright install
```

---

## 🧪 Testing

This project includes both **unit tests** (Vitest) and **E2E tests** (Playwright).

### Run E2E tests (Playwright)

```bash
pnpm exec playwright test
```

Or use the UI mode for interactive testing:

```bash
pnpm exec playwright test --ui
```

### Run unit tests (Vitest)

```bash
pnpm exec vitest
```

Or run tests once without watch mode:

```bash
pnpm exec vitest run
```

### Run all tests

```bash
pnpm test
```

---

## ▶️ Running the project

This project uses **tsx** to execute TypeScript directly without a build step.

```bash
tsx src/litivo
```

---

## 🤝 Collaboration

- This wrapper is **unofficial**
- No ownership is claimed over Litivo
- I am willing to **collaborate or make changes** if the Litivo author has concerns

---

## ⚖️ License

This project is licensed under the **Apache License 2.0**.

You are free to use, modify, and distribute it under the terms of that license.

---

## 📌 Final Notes

This project exists to simplify my personal workflow and experimentation.
Use responsibly.
