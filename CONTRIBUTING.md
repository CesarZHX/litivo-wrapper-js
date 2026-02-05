## Contributing

Thanks for your interest in contributing to this project! This file contains information to get the project running locally and how to contribute.

### Development setup

Clone the repository:

```bash
git clone https://github.com/CesarZHX/litivo-wrapper-js.git
cd litivo-wrapper-js
```

Install dependencies:

```bash
pnpm install
```

Install Playwright browsers (required to run the example and the E2E tests):

```bash
pnpm exec playwright install
```

### Playwright Setup in VSCode (Optional)

For instructions on setting up and running Playwright tests in VSCode,
please refer to the official guide: [Getting Started with Playwright in VSCode](https://playwright.dev/docs/getting-started-vscode)

### Example usage

This repository includes an `example/` folder that demonstrates how to use the library in practice.

To run the example:

1. Link the library:

```bash
pnpm link
```

This allows you to test changes to the library locally without publishing it.

2. Run the example:

```bash
pnpm example
```

Now you can see a working example of how the library is used in practice.
Any changes made to the library source will be immediately reflected in the example project.

### Tests

```bash
pnpm test
```

- Run unit tests (Vitest):

```bash
pnpm exec vitest
```

- Run E2E tests (Playwright):

```bash
pnpm exec playwright test
```

### How to contribute

1. Open an issue to discuss larger changes or features before implementing them.
2. Fork the repository and create a descriptive branch name: `feature/...` or `fix/...`.
3. Keep changes focused and add tests where appropriate.
4. Run the test suite locally before opening a PR:

```bash
pnpm test
```

5. Open a pull request against `main` with a clear description of the change and any testing notes.

If you're unsure about any step, open an issue and we'll discuss the best approach.

Thanks — contributions are welcome!
