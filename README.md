# Nuvia

Next.js project with TypeScript, Tailwind CSS, and FSD architecture.

## Features

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Multi-language support (English, Russian, Armenian)
- Feature-Sliced Design (FSD) architecture
- Routing: home, gallery, products, contacts, order
- **Black theme design**
- **Hero slider with 5 product categories**
- **NUVIA logo support (clickable, navigates to home)**
- **Product catalog with JSON data structure**
- **Product cards with images, prices, and order buttons**
- **Product detail pages with dynamic routing**

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
nuvia/
├── app/                    # Next.js app directory
│   ├── [locale]/          # Localized routes
│   └── globals.css        # Global styles (black theme)
├── shared/                # Shared UI components and utilities
│   └── ui/               # Reusable UI components
│       ├── logo/         # NUVIA logo component
│       ├── nav-link/     # Navigation link
│       └── language-switcher/ # Language switcher
├── widgets/               # Complex UI blocks
│   ├── header/           # Header widget with logo
│   ├── footer/           # Footer widget
│   └── hero-slider/      # Hero slider with 5 slides
├── pages/                 # Page components
│   ├── home/             # Home page with slider
│   ├── gallery/
│   ├── products/
│   ├── contacts/
│   └── order/
├── public/                # Static assets
│   ├── logo.png          # NUVIA logo (add your logo here)
│   └── images/           # Slider images (optional)
├── messages/              # i18n translation files
│   ├── en.json
│   ├── ru.json
│   └── arm.json
└── i18n.ts               # i18n configuration
```

## Hero Slider

The home page features a hero slider with 5 product categories:
1. **Mugs** - Custom mugs with your design
2. **T-Shirts** - Clothing printing
3. **Metal Business Cards / Badges** - Metal cards with engraving
4. **Gift Sets** - Gift ideas for any occasion
5. **Photo Frames, Pillows, Magnets** - Souvenirs wholesale and retail

Each slide has an "Order" button that navigates to the products page.

## Adding Assets

### Logo
Place your NUVIA logo as `public/logo.png`. The logo should be a PNG file with transparent background (recommended size: 240x120px or similar aspect ratio).

### Slider Images
You can add custom images for the slider:
- `public/images/mugs.jpg`
- `public/images/tshirts.jpg`
- `public/images/badges.jpg`
- `public/images/gifts.jpg`
- `public/images/souvenirs.jpg`

If images are not provided, the slider will use a gradient background with NUVIA text as a placeholder.

### Product Images
Product images should be placed in `public/images/products/`:
- `mug-1.jpg`, `mug-2.jpg` - For mugs
- `tshirt-1.jpg`, `tshirt-2.jpg` - For t-shirts
- `badge-1.jpg`, `badge-2.jpg` - For badges
- `gift-1.jpg`, `gift-2.jpg` - For gift sets
- `frame-1.jpg`, `frame-2.jpg` - For photo frames
- `pillow-1.jpg` - For pillows
- `magnet-1.jpg` - For magnets

If images are not provided, product cards will show a gradient placeholder with NUVIA text.

## Products

The project includes a product catalog system:

### Product Data
Products are fetched from the NestJS backend API. The API layer is located in `shared/api/` and uses Zustand stores for state management (`shared/store/`).

Each product includes:
- `id` - Unique product identifier
- `category` - Product category (mugs, tshirts, badges, gifts, souvenirs)
- `name` - Multilingual product name (en, ru, arm)
- `description` - Multilingual product description
- `price` - Product price in USD
- `image` - Main product image path
- `images` - Array of additional product images

### Product Pages
- **Products List** (`/products`) - Displays all products in a grid of cards
- **Product Detail** (`/products/[id]`) - Shows detailed information about a specific product

### Future Backend Integration
The code includes comments showing where to replace JSON imports with API calls:
```typescript
// Example: const products = await fetch('/api/products').then(res => res.json());
```

## Languages

The project supports three languages:
- English (en) - default
- Russian (ru)
- Armenian (arm)

Language switcher is available in the header. All slider content is fully translated.

## Contact Form

The contact form includes:
- **Icons** from `react-icons` library
- **Validation** for all required fields (Name, Email, Message)
- **Phone number validation** with country flags using `react-phone-number-input`
- **XSS protection** - all inputs are sanitized to prevent HTML/JS injection
- **Email sending** via API route to `nuviaPrint@gmail.com`

### Email Configuration

**⚠️ IMPORTANT:** Email sending requires SMTP configuration. If you see "Failed to send message" error, you need to set up SMTP.

1. Create a `.env.local` file in the root directory:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=nuviaPrint@gmail.com
SMTP_PASSWORD=your_app_password_here
```

2. For Gmail, you need to create an App Password:
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Navigate to **Security** > **2-Step Verification** > **App passwords**
   - Generate a new app password for "Mail"
   - Use this 16-character password in `SMTP_PASSWORD` (no spaces)

3. **Restart the development server** after creating `.env.local`:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

4. Check the server console for detailed error messages if email still doesn't work.

📖 **Detailed setup instructions:** See `EMAIL_SETUP.md` file in the project root.

### Form Validation

- **Name**: Required, only letters and spaces allowed
- **Email**: Required, must be a valid email format
- **Phone**: Optional, validated with country code support
- **Message**: Required, sanitized to prevent XSS attacks

All form data is sanitized on both client and server side before sending.

