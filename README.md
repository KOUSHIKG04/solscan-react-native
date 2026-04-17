# SolScan

A modern, high-performance Solana blockchain explorer and wallet management application built with React Native and Expo. SolScan provides a seamless interface for exploring the Solana ecosystem on mobile devices.

## 🚀 Features

- **Wallet Explorer**: Search and view any Solana wallet address to see its SOL balance and token holdings.
- **Transaction History**: Real-time transaction history with detailed status and timestamps.
- **Multi-Network Support**: Seamlessly toggle between **Mainnet-Beta** and **Devnet**.
- **Wallet Integration**: Support for Solana Mobile Wallet Adapter (MWA) to connect with popular wallets like Phantom (requires Dev Build).
- **Recent Searches**: Persistent history of explored addresses for quick access.
- **Favorites**: Bookmark addresses to your watchlist for easy monitoring.
- **SolSwap (Coming Soon)**: Swap tokens directly within the application (currently under development).
- **Dark/Light Mode**: Full theme customization with system-wide consistency.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 55+) with [Expo Router](https://docs.expo.dev/router/introduction/)
- **UI & Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Backend/Development**: Node.js (for package management and build tools)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Solana Integration**: 
  - `@solana/web3.js`
  - `@solana-mobile/mobile-wallet-adapter-protocol`
- **Fonts**: Poppins & Manrope (Google Fonts)
- **Icons**: Expo Vector Icons (Ionicons)

## 📂 Project Structure

```text
SolScan/
├── app/                  # Expo Router directory (Tabs & Page routing)
│   ├── (tabs)/          # Main tab navigation (Scanner, Swap, Settings)
│   ├── token/           # Token detail screens
│   └── watchlist/       # Watchlist/Favorites screens
├── src/
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom hooks (useWallet, useTheme, etc.)
│   ├── screens/         # Main screen component logic
│   ├── stores/          # Zustand state management
│   ├── theme/           # Color palettes and theme hooks
│   └── utils/           # Helper functions and API logic
├── assets/              # Static images, icons, and splash screens
└── tailwind.config.js   # NativeWind/Tailwind configuration
```

## 🏁 Getting Started

### Prerequisites

- Node.js (Latest LTS)
- Expo Go (for basic preview) or a Development Build (for Wallet connectivity)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/solscan-react-native.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

- **Development Build (Required for Wallet functions):**
  ```bash
  npx expo run:android
  # or
  npx expo run:ios
  ```
- **Expo Go (Basic explorer functions only):**
  ```bash
  npx expo start
  ```

---
Built with ❤️ for the Solana Community.
