# Instructions for Building My Business Website

## CONTEXT
I'm a web developer who creates custom business pages for clients. I need a professional website for MY OWN business to show potential clients when I cold call them. This should be completely separate from the client page builder system.

## PROJECT REQUIREMENTS

### 1. CREATE A NEW NEXT.JS PROJECT
Create a modern, professional business website for a web development/digital services company.

**Tech Stack:**
- Next.js 16.1.2
- React 19.2.3
- TypeScript 5.x
- Tailwind CSS 4.x
- Lucide React icons (for icons)
- @supabase/supabase-js 2.90.1 (for contact form submissions)

### 2. PROJECT STRUCTURE
```
my-business-site/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── about/
│   │   │   └── page.tsx        # About page
│   │   ├── services/
│   │   │   └── page.tsx        # Services page
│   │   ├── portfolio/
│   │   │   └── page.tsx        # Portfolio/Examples page
│   │   ├── contact/
│   │   │   └── page.tsx        # Contact page
│   │   ├── globals.css         # Global styles
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts    # Contact form API
│   └── components/
│       ├── Navigation.tsx      # Main navigation
│       ├── Footer.tsx          # Footer component
│       ├── Hero.tsx            # Hero section
│       └── ContactForm.tsx     # Contact form
├── package.json
├── tsconfig.json
├── .env.local
├── .gitignore
└── README.md
```

### 3. SETUP INSTRUCTIONS

#### Step 1: Initialize Project
```bash
npx create-next-app@latest my-business-site --typescript --tailwind --app --src-dir --import-alias "@/*"
cd my-business-site
```

#### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js@^2.90.1 lucide-react@^0.562.0
```

#### Step 3: Create Environment Variables
Create `.env.local` file with:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://kknyxyohnwoovsyrxhes.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrbnl4eW9obndvb3ZzeXJ4aGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NDc3MTYsImV4cCI6MjA4NDAyMzcxNn0.70nXEzedoPsdQl9AQxO30SLUpv-f0_8RnI895gzeJ2A
```

### 4. DATABASE SETUP (SUPABASE)

Create a new table in Supabase for contact form submissions:

```sql
-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for contact form)
CREATE POLICY "Anyone can submit contact form"
ON contact_submissions FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can view submissions (for future admin panel)
CREATE POLICY "Only authenticated users can view submissions"
ON contact_submissions FOR SELECT
TO authenticated
USING (true);
```

### 5. DESIGN REQUIREMENTS

#### Color Scheme
- **Primary Color**: #2563eb (blue-600) - professional, trustworthy
- **Secondary Color**: #1e40af (blue-700) - darker accent
- **Success**: #10b981 (green-500)
- **Background**: #ffffff (white) with #f9fafb (gray-50) for sections
- **Text**: #111827 (gray-900) for headings, #6b7280 (gray-600) for body

#### Typography
- **Headings**: Bold, large, clear hierarchy
- **Body**: Readable, well-spaced (leading-relaxed)
- **Font**: Use default Next.js fonts (Geist Sans)

#### Layout Style
- **Clean and Modern**: Generous white space
- **Responsive**: Mobile-first design
- **Professional**: Not overly creative, focus on clarity
- **Fast**: Optimized images, minimal animations

### 6. PAGE CONTENT

#### Homepage (/)
**Hero Section:**
- Headline: "Professional Business Websites That Convert"
- Subheadline: "Custom-designed landing pages that help local businesses get more customers online"
- CTA Button: "Get Started" (links to /contact)
- Secondary CTA: "View Examples" (links to /portfolio)

**Features Section (3 columns):**
1. **Fast Setup** - "Get your business online in days, not months"
2. **Mobile Optimized** - "Looks perfect on every device"
3. **Easy Updates** - "Full admin panel to manage your content"

**Social Proof Section:**
- "Trusted by local businesses across the country"
- Show placeholder for client logos or testimonials

**CTA Section:**
- "Ready to grow your business online?"
- Button: "Schedule a Free Consultation"

#### About Page (/about)
**Content:**
- Brief introduction about you and your services
- Why you started this business
- Your approach to building business websites
- Your commitment to client success

**Keep it concise** - 3-4 short paragraphs max

#### Services Page (/services)
**List of Services (cards):**

1. **Custom Business Website**
   - Single-page or multi-page design
   - Mobile-responsive
   - Fast loading speeds
   - SEO optimized
   - Starting at: $XXX

2. **Admin Dashboard**
   - Full content management
   - Update photos, text, testimonials
   - No technical skills needed
   - Add-on: $XXX

3. **Ongoing Maintenance**
   - Content updates
   - Technical support
   - Hosting included
   - Monthly: $XXX

4. **Custom Features**
   - Contact forms
   - Google Maps integration
   - Photo galleries
   - Quote/estimate requests
   - Custom pricing

**Each service card should have:**
- Icon
- Title
- Description (3-4 bullet points)
- Price or "Custom pricing"
- "Learn More" or "Get Started" button

#### Portfolio Page (/portfolio)
**Content:**
- Introduction: "See What We've Built"
- Grid of example business pages (can use placeholder images initially)
- Each example shows:
  - Screenshot/thumbnail
  - Business type (e.g., "Plumbing Services", "Roofing Company")
  - Key features
  - "View Live Site" button (optional)

**Note:** You can use placeholder content here initially. Once real client sites exist, these can be updated.

#### Contact Page (/contact)
**Two-column layout:**

**Left Column - Contact Form:**
- Fields:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Company Name (optional)
  - Message (required, textarea)
- Submit button
- Success message after submission
- Form validation

**Right Column - Contact Info:**
- Email: [your email]
- Phone: [your phone]
- Business Hours: "Monday-Friday, 9am-6pm EST"
- "Serving businesses nationwide"

**Form Behavior:**
- On submit, save to Supabase `contact_submissions` table
- Show success message
- Clear form
- Optional: Send email notification (can add later)

### 7. COMPONENT SPECIFICATIONS

#### Navigation Component
```tsx
// Features:
- Sticky header
- Logo/business name on left
- Nav links: Home, About, Services, Portfolio, Contact
- "Get Started" CTA button (highlighted)
- Mobile: Hamburger menu
- Responsive
```

#### Footer Component
```tsx
// Include:
- Business name and tagline
- Quick links (same as nav)
- Contact information
- Social media icons (optional, can be placeholders)
- Copyright notice: "© 2025 [Business Name]. All rights reserved."
```

#### Hero Component
```tsx
// Features:
- Full-width background (gradient or solid color)
- Centered content
- Large heading
- Subheading
- Two CTA buttons (primary and secondary)
- Optional: Background pattern or subtle animation
```

#### ContactForm Component
```tsx
// Features:
- Form validation (client-side)
- Submit handler (sends to API route)
- Loading state during submission
- Success/error messages
- Accessible (proper labels, ARIA attributes)
- Styled form inputs matching design system
```

### 8. API ROUTE SPECIFICATION

**File:** `src/app/api/contact/route.ts`

```typescript
// Functionality:
1. Accept POST requests with form data
2. Validate required fields (name, email, message)
3. Save to Supabase contact_submissions table
4. Return success/error response
5. Include error handling
6. Return proper HTTP status codes (200, 400, 500)
```

### 9. STYLING GUIDELINES

**Use Tailwind CSS classes:**
- Consistent spacing (p-6, p-8, py-12, etc.)
- Responsive breakpoints (sm:, md:, lg:, xl:)
- Hover states on interactive elements
- Focus states for accessibility
- Smooth transitions

**Example Component Styling:**
```tsx
// Button Primary
className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"

// Button Secondary
className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"

// Section Container
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"

// Card
className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
```

### 10. CONFIGURATION FILES

#### tsconfig.json
Use the following configuration:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### .gitignore
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### 11. DEPLOYMENT TO VERCEL

**After building the site locally:**

1. **Initialize Git:**
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Push to GitHub:**
- Create a new repository on GitHub (e.g., "my-business-website")
- Follow GitHub's instructions to push your code

3. **Deploy to Vercel:**
- Go to https://vercel.com
- Sign in with GitHub
- Click "New Project"
- Import your GitHub repository
- Vercel will auto-detect Next.js
- Add environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Click "Deploy"

4. **Custom Domain (Optional):**
- In Vercel project settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

### 12. TESTING CHECKLIST

Before considering the site complete, test:

- [ ] All pages load correctly
- [ ] Navigation works on all pages
- [ ] Contact form submits successfully
- [ ] Form validation works
- [ ] Data appears in Supabase
- [ ] Responsive on mobile, tablet, desktop
- [ ] All links work
- [ ] No console errors
- [ ] Page load speed is fast
- [ ] SEO meta tags are present

### 13. CONTENT PLACEHOLDERS

Use these placeholders for content I'll fill in later:

**Business Name:** "[Your Business Name]"
**Tagline:** "Professional Business Websites"
**Phone:** "(555) 123-4567"
**Email:** "contact@yourbusiness.com"
**Prices:** Use "$XXX" or "Contact for pricing"

### 14. OPTIONAL ENHANCEMENTS (FOR LATER)

Don't implement these now, but keep in mind for future:
- Email notifications when contact form is submitted
- Blog section
- Client login portal
- Analytics integration
- Live chat widget
- Appointment booking
- Payment integration

### 15. IMPORTANT NOTES

**DO:**
✅ Keep design clean and professional
✅ Make it fully responsive
✅ Use semantic HTML
✅ Include proper meta tags for SEO
✅ Make forms accessible
✅ Test on different screen sizes
✅ Optimize images
✅ Add loading states
✅ Include error handling

**DON'T:**
❌ Make it too flashy or creative
❌ Use complex animations
❌ Include unnecessary features
❌ Copy the client page builder design
❌ Hardcode any sensitive information
❌ Forget mobile optimization

### 16. SUCCESS CRITERIA

The website is complete when:
1. All 5 pages are functional and look professional
2. Contact form successfully saves to Supabase
3. Site is fully responsive (mobile, tablet, desktop)
4. No console errors
5. Clean, professional design that inspires trust
6. Fast page load times
7. All navigation works properly
8. Can be deployed to Vercel without issues

---

## FINAL INSTRUCTION TO CLAUDE

Please build this complete Next.js website following all the specifications above. Start by:
1. Creating the project structure
2. Setting up all configuration files
3. Building the components
4. Creating all pages
5. Implementing the contact form and API
6. Styling everything with Tailwind CSS
7. Testing that everything works

Ask me questions if anything is unclear, but try to make reasonable decisions based on the context provided. The goal is a clean, professional, conversion-focused website for a web development business.
