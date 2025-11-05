# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Taro-based mini-program called "信缘 · 广外" (Xinyuan GDUFS), a social networking application for Guangdong University of Foreign Studies alumni. The app supports multiple platforms including WeChat Mini Program, H5, and other mini-program platforms.

## Development Commands

### Build Commands
- `npm run build:weapp` - Build for WeChat Mini Program
- `npm run build:h5` - Build for H5 web version
- `npm run build:alipay` - Build for Alipay Mini Program
- `npm run build:swan` - Build for Baidu Smart Program
- `npm run build:tt` - Build for ByteDance Mini Program
- `npm run build:qq` - Build for QQ Mini Program

### Development Commands
- `npm run dev:weapp` - Development mode for WeChat Mini Program with watch
- `npm run dev:h5` - Development mode for H5 with watch
- `npm run dev:alipay` - Development mode for Alipay Mini Program with watch
- `npm run dev:swan` - Development mode for Baidu Smart Program with watch
- `npm run dev:tt` - Development mode for ByteDance Mini Program with watch
- `npm run dev:qq` - Development mode for QQ Mini Program with watch

### Other Commands
- `npm run new` - Generate new pages or components using Taro CLI
- `npm run prepare` - Set up Husky git hooks

## Architecture Overview

### Framework & Technology Stack
- **Framework**: Taro 4.1.5 with React 18
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: @taroify/core (Taro version of Vant), @vant/weapp
- **Styling**: SCSS with pixel transformation
- **HTTP Client**: Axios with interceptors
- **TypeScript**: Full TypeScript support

### Project Structure
- **Main Pages** (`src/pages/`):
  - `index/` - Home page with activity feed
  - `alumnus/` - Alumni organizations directory
  - `my/` - User profile and settings

- **Sub-packages**:
  - `loginPkg/` - Authentication (login, register, forgot password)
  - `activityPkg/` - Activity management (list, detail)
  - `myPkg/` - Personal features (contacts, settings, profile editing)
  - `msgPkg/` - Messaging system (message list, chat)

- **Global Components** (`src/global/components/`):
  - `SearchTab/` - Tab-based search component
  - `Textarea/` - Enhanced textarea with character count
  - `VoidHint/` - Empty state component

- **API Layer** (`src/global/utils/api/`):
  - `request.ts` - Axios instance with auth interceptors
  - `usercenter/` - User, friend, message APIs
  - `activitycenter/` - Activity and organization APIs

### State Management
- **authSlice**: Manages authentication state (isLogged, isVerified, token)
- **tabBarSlice**: Controls custom tab bar state
- **Authentication Flow**: 401 responses trigger automatic logout and redirect to login

### Key Features
- Custom tab bar implementation
- Multi-platform authentication with token management
- Activity management system
- Alumni organization directory
- Messaging system
- Profile management

## Development Notes

### API Configuration
- Base URL is controlled by `process.env.TARO_APP_API` environment variable
- All requests include Bearer token authentication
- Automatic 401 handling with logout and redirect

### Styling
- Design width: 375px
- SCSS with automatic pixel transformation for different screen sizes
- Global styles in `src/app.scss`

### Component Patterns
- Page components follow Taro page structure with `.config.ts` files
- Reusable components are organized in feature directories
- Styles are co-located with components using SCSS modules