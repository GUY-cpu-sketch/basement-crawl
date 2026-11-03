# iOS

Basement Crawl is structured for Capacitor 8. Current Capacitor iOS tooling requires Node 22+, macOS, Xcode 26+, and supports iOS 15+ according to the current official documentation.

Typical setup:
1. npm install
2. npx cap add ios
3. npx cap sync ios
4. npx cap open ios
5. Choose an iPhone Simulator or physical iPhone in Xcode and Run.

The repository includes .github/workflows/ios-prepare.yml, which generates the native iOS project as a workflow artifact. Signing/distribution is intentionally left for the developer's Apple Team credentials.
