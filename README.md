# 🚀 Modern Portfolio Website

A stunning, fully-responsive portfolio website built with Next.js 14, React, TypeScript, and Tailwind CSS. This portfolio showcases professional experience, skills, projects, and certifications with beautiful animations and modern UI components.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **🎨 Modern UI/UX**: Clean, professional design with smooth animations using Framer Motion
- **🌓 Dark/Light Mode**: Theme switching with next-themes and persistent user preference
- **📱 Fully Responsive**: Optimized for all devices from mobile to desktop
- **⚡ Performance Optimized**: Built with Next.js 14 for optimal performance and SEO
- **🎯 Interactive Components**: 
  - Animated navigation with reveal effects
  - Particle system background with tsParticles
  - Hover effects and smooth transitions
  - Interactive project and certification cards
- **🎓 Dynamic Sections**:
  - Hero section with contact options
  - Skills showcase with technology icons
  - Project portfolio with "Show More/Less" functionality
  - Professional experience timeline
  - Certifications gallery
  - Education history
- **📧 Contact Integration**: Quick access to email, WhatsApp, LinkedIn, and GitHub
- **🔧 Modern Tech Stack**: Radix UI components with shadcn/ui styling

## 🛠️ Tech Stack

### Core Technologies
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework for production
- **UI Library**: [React 18](https://react.dev/) - JavaScript library for building user interfaces
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

### UI Components & Libraries
- **Component Library**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library
- **Icons**: [Lucide React](https://lucide.dev/) & [Radix Icons](https://icons.radix-ui.com/)
- **Particles**: [tsParticles](https://particles.js.org/) - Lightweight particle animations
- **Command Menu**: [cmdk](https://cmdk.paco.me/) - Fast command menu component
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) - Dark mode support

### Utilities
- **Class Management**: [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- **Variants**: [class-variance-authority](https://cva.style/docs) - CVA for component variants

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: Version 18.0.0 or higher
- **npm** or **yarn** or **pnpm**: Package manager

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/my-portfolio.git
cd my-portfolio
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### 4. Build for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## 📁 Project Structure

```
my-portfolio/
├── public/              # Static assets (images, icons, logos)
│   ├── icons/          # Technology and social media icons
│   └── *.jpg/*.png     # Company logos and personal images
├── src/
│   ├── app/            # Next.js 14 app directory
│   │   ├── layout.tsx  # Root layout with metadata
│   │   ├── page.tsx    # Main portfolio page
│   │   └── globals.css # Global styles
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── reveal-navbar.tsx
│   │   │   └── ...
│   │   ├── hero.tsx
│   │   ├── skills-section.tsx
│   │   ├── sidebar.tsx
│   │   └── mobile-navbar.tsx
│   └── lib/            # Utility functions and constants
├── components.json     # shadcn/ui configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## 🎨 Customization

### Update Personal Information

1. **Hero Section**: Edit `src/components/hero.tsx`
   - Update name, bio, and contact links

2. **Skills**: Modify `src/components/skills-section.tsx`
   - Add or remove skills and technology icons

3. **Projects**: Edit the `projects` array in `src/app/page.tsx`
   - Add your own projects with descriptions and tech stack

4. **Experience**: Update the experience section in `src/app/page.tsx`
   - Add your work experience with company details

5. **Certifications**: Modify the certifications section
   - Add your own certifications with logos and links

### Add New Icons

Place SVG icons in `public/icons/` and reference them in your components.

### Theme Customization

Edit `tailwind.config.js` to customize colors, spacing, and other theme variables.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Remove build artifacts |
| `npm run build:gh-pages` | Build for GitHub Pages |

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Vercel will automatically detect Next.js and deploy

### Other Platforms

This project can be deployed on:
- **Netlify**
- **AWS Amplify**
- **GitHub Pages** (using `npm run build:gh-pages`)
- **Cloudflare Pages**
- Any platform that supports Node.js

## 🎯 Key Features Explained

### Animated Navigation
The navbar uses a reveal animation that appears on scroll, providing a clean browsing experience.

### Theme Switching
Users can toggle between light and dark modes, with preferences saved locally.

### Interactive Cards
Project and certification cards feature hover effects, smooth transitions, and technology stack displays.

### Responsive Design
Breakpoints are optimized for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/my-portfolio/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Youmbi Leo**

- LinkedIn: [@yll0rd](https://www.linkedin.com/in/yll0rd)
- GitHub: [@yll0rd](https://github.com/yll0rd)
- Email: leoyoumbi83@gmail.com

## 🙏 Acknowledgments

- Design inspiration from [fernand3z](https://github.com/fernand3z)
- Icons from [Lucide](https://lucide.dev/) and various SVG sources
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animation library [Framer Motion](https://www.framer.com/motion/)

---

⭐ If you found this project helpful, please consider giving it a star!

**Built with ❤️ using Next.js and TypeScript**
