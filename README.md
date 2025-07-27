# Simple Scribble

Effortless, minimal note-taking for web and mobile.

---

## Overview

**Simple Scribble** is a modern, minimalist note-taking application built for speed, privacy, and collaboration. It is designed for users who want a distraction-free experience, with seamless sharing and robust authentication. The app is fully responsive and works great on both desktop and mobile devices.

---

## Features

- **Create, edit, and delete notes** with instant autosave
- **Organize notes** with search and tabbed navigation
- **Share notes** with other users (view or edit access)
- **Make notes public or private** with a single click
- **Authentication** (register, login, logout) via Supabase
- **Profile management**
- **Responsive UI** for desktop and mobile
- **Dark/light/system theme switching**
- **Beautiful, accessible UI** powered by [shadcn/ui](https://ui.shadcn.com/)
- **Toast notifications** for feedback

---

## Technology Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [shadcn/ui](https://ui.shadcn.com/) (UI components)
- [Tailwind CSS](https://tailwindcss.com/) (utility-first CSS)
- [Supabase](https://supabase.com/) (auth & database)
- [@tanstack/react-query](https://tanstack.com/query/latest) (data fetching/caching)
- [Radix UI](https://www.radix-ui.com/) (accessible primitives)
- [Zod](https://zod.dev/) (form validation)
- [React Hook Form](https://react-hook-form.com/) (forms)
- [Lucide](https://lucide.dev/) (icons)
- [pnpm](https://pnpm.io/) (package manager)

---

## Project Structure

```
workspace/
└── shadcn-ui/
    ├── public/              # Static assets (favicon, robots.txt)
    ├── src/
    │   ├── components/      # All UI, layout, auth, sharing components
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Supabase client, note service, utils
    │   ├── types/           # TypeScript types
    │   ├── App.tsx          # Root React component
    │   ├── main.tsx         # App entry point
    │   └── index.css        # Tailwind & global styles
    ├── index.html           # HTML entry point
    ├── package.json         # Dependencies & scripts
    ├── tailwind.config.ts   # Tailwind CSS config
    ├── vite.config.ts       # Vite config
    ├── tsconfig*.json       # TypeScript configs
    └── ...
```

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/)

### Installation

```sh
cd workspace/shadcn-ui
pnpm install
```

### Development

```sh
pnpm run dev
```

- App runs at [http://localhost:5173](http://localhost:5173) by default.

### Build for Production

```sh
pnpm run build
```

### Preview Production Build

```sh
pnpm run preview
```

---

## Authentication & Database

- Uses [Supabase](https://supabase.com/) for authentication and as a backend database.
- All user data, notes, and sharing info are stored securely in Supabase tables.
- Auth context (`AuthProvider`) manages session, user, and profile state.
- Protected routes are enforced via `AuthGuard`.

---

## Main Components & Architecture

### App Entry
- `src/main.tsx`: Mounts the React app and applies global styles.
- `src/App.tsx`: Sets up providers (React Query, Auth, Router, Toaster) and routes.

### Layout
- `components/layout/MainLayout.tsx`: Responsive layout with sidebar (desktop) or drawer (mobile).
- `components/layout/Sidebar.tsx`: Note list, search, create/delete, tabbed navigation (My Notes/Shared).
- `components/layout/Header.tsx`: Top navigation, theme toggle, quick links.

### Notes
- `components/NoteEditor.tsx`: Edit note title/content, toggle public/private, open sharing dialog.
- `lib/note-service.ts`: All note CRUD and sharing logic.

### Sharing
- `components/sharing/ShareManagement.tsx`: Manage who can access a note, toggle public/private.
- `components/sharing/ShareNoteDialog.tsx`: Dialog to share a note with another user by email.

### Authentication
- `components/auth/AuthProvider.tsx`: Auth context, session management.
- `components/auth/AuthGuard.tsx`: Protects routes from unauthenticated access.
- `components/auth/LoginForm.tsx`, `RegisterForm.tsx`: Auth forms with validation.

### UI & Utilities
- All shadcn/ui components are in `components/ui/` (Button, Input, Card, Tabs, etc.)
- Custom hooks in `hooks/` (e.g., `use-media-query`, `useIsMobile`, `useToast`)
- Theme switching via `components/theme/ThemeProvider.tsx` and `ThemeToggle.tsx`
- Toast notifications via `sonner` and custom hooks/components

---

## Customization

- **Styling:**
  - Tailwind CSS is fully configured. Edit `tailwind.config.ts` and `src/index.css` for custom themes.
  - All color variables and radii are set via CSS custom properties for easy theming.
- **Components:**
  - All UI components are modular and reusable. Add or modify components in `components/ui/`.
- **Path Aliases:**
  - `@/` points to `src/` (see `tsconfig.json` and `vite.config.ts`).
- **Environment:**
  - Supabase keys and URLs are set in `src/lib/supabase.ts`. For production, use environment variables.

---

## Static Assets

- `public/favicon.svg`: App icon
- `public/robots.txt`: Allows all web crawlers

---

## Linting & Formatting

- ESLint is configured for TypeScript and React (`eslint.config.js`).
- Run `pnpm run lint` to check code quality.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Credits

- UI components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
- Backend: [Supabase](https://supabase.com/)

---

## Contributing

Pull requests and issues are welcome!
