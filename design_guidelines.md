# Design Guidelines: Fishtail Cuisine of India and Nepal

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium restaurant websites with cultural authenticity. Combining elements from modern dining experiences (OpenTable-featured restaurants) with vibrant Indian/Nepalese visual identity.

**Core Principle**: Create an immersive, appetizing experience that celebrates the fusion of Indian and Nepalese cuisine through rich imagery, warm colors, and elegant menu presentation.

---

## Color Palette

### Primary Colors
- **Deep Terracotta**: 15 75% 45% - Primary brand color, cultural warmth
- **Rich Gold**: 40 85% 55% - Accent for highlights, premium feel
- **Warm Cream**: 35 40% 95% - Light background, soft contrast

### Dark Mode
- **Dark Charcoal**: 20 15% 12% - Primary background
- **Warm Dark**: 15 20% 20% - Card backgrounds
- **Soft Gold**: 40 60% 70% - Accent text in dark mode

### Functional Colors
- **Sage Green**: 140 40% 50% - Vegetarian/Vegan indicators
- **Amber**: 25 90% 55% - Gluten-free indicators
- **Soft Blue**: 210 60% 60% - Dairy-free indicators

---

## Typography

**Font Families**:
- **Headings**: 'Playfair Display' (serif) - Elegant, restaurant-quality
- **Body & UI**: 'Inter' (sans-serif) - Clean, highly readable
- **Menu Prices**: 'DM Mono' (monospace) - Clear, structured pricing

**Type Scale**:
- Hero Headline: text-6xl md:text-7xl font-bold
- Section Headers: text-4xl md:text-5xl font-bold
- Menu Categories: text-2xl md:text-3xl font-semibold
- Menu Items: text-lg md:text-xl font-medium
- Descriptions: text-base leading-relaxed
- Body Text: text-sm md:text-base

---

## Layout System

**Spacing Units**: Consistent use of 4, 6, 8, 12, 16, 20, 24 for padding/margins (p-4, p-6, p-8, py-12, py-16, py-20, py-24)

**Container Strategy**:
- Full-width hero: w-full
- Content sections: max-w-7xl mx-auto px-6
- Menu grid: max-w-6xl mx-auto
- Text content: max-w-4xl

**Grid Patterns**:
- Menu items: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Feature sections: grid-cols-1 md:grid-cols-2 gap-8
- Dietary filters: flex flex-wrap gap-3

---

## Component Library

### Hero Section
- Full-width background with overlay (gradient from transparent to dark)
- Restaurant name in Playfair Display, very large
- Location and phone prominently displayed
- "View Menu" and "Order Online" CTAs with blurred backgrounds
- Tagline: "Authentic Flavors of India and Nepal"

### Navigation
- Sticky header with transparent-to-solid transition on scroll
- Links: Menu, About, Location, Contact, Order Online
- Mobile: Hamburger menu with slide-out drawer
- Logo/name on left, navigation center, phone number on right (desktop)

### Menu Display System
**Category Headers**: 
- Large, bold titles with decorative underline (border-b-4 border-gold)
- Optional category description in lighter text

**Menu Item Cards**:
- White/dark cards with subtle shadow and hover lift effect
- Item name in bold, large text
- Description in 2-3 lines with text-gray-600/text-gray-400
- Price positioned top-right in DM Mono font
- Dietary badges as small pills (rounded-full px-3 py-1) at bottom
- Optional: Small decorative icon/pattern in corner

**Dietary Filter Bar**:
- Sticky below navigation when scrolling menu
- Toggle buttons for: Vegetarian, Vegan, Gluten-Free, Dairy-Free, All
- Active state: filled background with white text
- Inactive: outline with hover effect

### Section Designs

**About Section**:
- Two-column layout (text left, image right on desktop)
- Story of India/Nepal fusion cuisine
- Chef's philosophy or restaurant history
- Decorative mandala or cultural pattern as background element

**Specialties Highlight**:
- Three-column feature cards
- Icons: Tandoor/Clay Oven, Himalayan Spices, Fresh Ingredients
- Short descriptions emphasizing authenticity

**Location/Contact**:
- Embedded Google Maps (h-96)
- Address, phone, hours in styled card overlay
- "Get Directions" and "Call Now" action buttons

**Footer**:
- Restaurant info, quick links, social media
- Operating hours
- Newsletter signup (optional)
- Cultural pattern/motif as footer decoration

---

## Visual Enhancements

**Decorative Elements**:
- Subtle mandala/paisley patterns as section dividers
- Repeating border patterns inspired by Indian textiles
- Soft gradient overlays on image sections

**Menu Photography Placeholders**:
- Each category could have a hero image showcasing signature dish
- Maintain 16:9 or 4:3 aspect ratio
- Use warm color grading to enhance appetite appeal

**Micro-interactions**:
- Menu cards: subtle lift on hover (translate-y-1)
- Dietary filter: smooth color transition
- CTA buttons: gentle scale on hover
- Minimal, purposeful animations

---

## Images

**Hero Image**: 
- Large, vibrant hero image showcasing signature dishes or restaurant ambiance
- Warm, inviting food photography with shallow depth of field
- Overlay: dark gradient (from transparent to rgba(0,0,0,0.6))

**Menu Category Images** (optional but recommended):
- Small banner images for each major category
- Examples: Steaming momos, colorful biryani, tandoori platter
- Aspect ratio: 21:9 or similar wide format

**About Section Image**:
- Restaurant interior, chef, or cultural imagery
- Should convey authenticity and warmth

**Placeholder Strategy**: Use food photography from Unsplash/Pexels with keywords: "Indian food close-up", "Nepalese dumplings", "tandoori chicken", "biryani", "curry"

---

## Accessibility & Responsiveness

- Maintain minimum 4.5:1 contrast ratio for all text
- Focus states clearly visible with outline-offset-2 ring-2
- Touch targets minimum 44x44px on mobile
- Menu cards stack to single column on mobile (sm:grid-cols-1)
- Font sizes scale down appropriately on smaller screens
- Ensure all dietary indicators are both color-coded AND labeled

---

## Key Design Principles

1. **Appetizing First**: Every visual decision should make the food look irresistible
2. **Cultural Authenticity**: Indian/Nepalese design elements without being cliché
3. **Clarity in Complexity**: Extensive menu presented in digestible, filterable sections
4. **Warmth & Welcome**: Color and imagery should feel inviting and hospitable
5. **Mobile Excellence**: Many users will browse menus on phones—optimize for touch