# CO₂ Reduction Planner - Style Guidelines

Based on the New Day Climate main website design principles.

## Color Palette

### Primary Colors
- **Primary Text**: `#163E64` - Navy blue, used for ALL text (headings, body, navigation)
- **Accent/Highlight**: `#FF5B35` - Coral orange, used for CTAs and emphasis
- **Background White**: `#ffffff` - Clean white for main sections
- **Light Background**: `#f0f0f0` - Subtle gray for alternating sections
- **Dark Background**: `#163E64` - Navy blue for footer and dark sections

### Secondary Colors
- **Subtle Text**: `#5a6c6f` - Muted teal for secondary text
- **Border/Divider**: `#d4dfe0` - Light gray for borders
- **Success**: `#4caf50` - Green for success states
- **Error**: `#ef4444` - Red for error states
- **Warning**: `#f59e0b` - Amber for warnings

## Typography

### Font Family
- **Primary Font**: System fonts with fallbacks
  ```css
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, sans-serif
  ```
- **Target Weight**: 700 (Bold) for headings, mimicking ff-real-text-pro style

### Type Scale
- **Heading 1**: 48px (3rem) - Bold, #163E64
- **Heading 2**: 36px (2.25rem) - Bold, #163E64
- **Heading 3**: 24px (1.5rem) - Semibold, #163E64
- **Body Large**: 20px (1.25rem) - Regular, #163E64
- **Body**: 16px (1rem) - Regular, #163E64
- **Small**: 14px (0.875rem) - Regular, #5a6c6f

### Line Height
- **Headings**: 1.2 - Tight, impactful
- **Body**: 1.6 - Comfortable reading

## Layout Principles

### Spacing
- **Section Padding**: 80px vertical, 24px horizontal on mobile
- **Card Gap**: 32px between elements
- **Component Spacing**: 16px for related items, 32px for sections

### Containers
- **Max Width**: 1200px for content
- **Breakpoints**:
  - Mobile: 640px
  - Tablet: 768px
  - Desktop: 1024px
  - Wide: 1280px

## Components

### Buttons
**Primary (CTA)**
- Background: `#FF5B35` (orange)
- Text: `#ffffff` (white)
- Hover: `#E54A24` (darker orange)
- Padding: 16px 32px
- Border Radius: 8px (rounded corners, not fully rounded)
- Font Weight: 700
- **IMPORTANT**: All orange buttons MUST have white text

**Secondary**
- Background: `#163E64` (navy blue)
- Text: `#ffffff` (white)
- Hover: `#0f2940` (darker navy)
- Padding: 16px 32px
- Border Radius: 8px (rounded corners, not fully rounded)
- Font Weight: 700
- **IMPORTANT**: Secondary buttons use dark blue background with white text

**Tertiary/Ghost**
- Background: transparent
- Text: `#163E64`
- Border: 2px solid `#163E64`
- Hover: Background `#f0f0f0`

### Cards
- Background: `#ffffff`
- Border: 1px solid `#d4dfe0` or none
- Shadow: Subtle (0 1px 3px rgba(0,0,0,0.1))
- Padding: 32px
- Border Radius: 8px

### Forms
- Input Border: 1px solid `#d4dfe0`
- Input Focus: 2px solid `#f1613a`
- Input Padding: 12px 16px
- Label: `#163E64`, font-weight 600
- Placeholder: `#9ca3af`

### Navigation
- Background: `#ffffff` or `#f0f0f0`
- Border: 1px solid `#d4dfe0`
- Link Color: `#163E64`
- Link Hover: `#FF5B35`
- Active: `#FF5B35` with underline

## Design Philosophy

### Visual Principles
1. **Professional & Serious**: No emojis or playful graphics
2. **Clean & Minimal**: Ample white space, clear hierarchy
3. **Purpose-Driven**: Every element serves the user's goal
4. **Trust-Building**: Professional color palette, consistent branding

### Content Guidelines
1. Use clear, direct language
2. Focus on value and outcomes
3. Avoid jargon unless necessary
4. Keep descriptions concise but informative

### Imagery
- Use professional photography or clean illustrations
- Avoid decorative elements that don't add value
- Maintain consistent image treatment across pages

## Accessibility

- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Clear 2px outline in accent color
- **Alt Text**: All images must have descriptive alt text
- **Keyboard Navigation**: All interactive elements accessible via keyboard

## Implementation Notes

### Tailwind Configuration
Update `tailwind.config.ts` with custom colors:
```typescript
colors: {
  primary: {
    DEFAULT: '#163E64',
    light: '#5a6c6f',
  },
  accent: {
    DEFAULT: '#FF5B35',
    hover: '#E54A24',
  },
  background: {
    DEFAULT: '#ffffff',
    light: '#f0f0f0',
    dark: '#163E64',
  },
  border: '#d4dfe0',
}
```

### Global CSS
Apply base styles to body:
```css
body {
  color: #163E64;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  color: #163E64;
  font-weight: 700;
}
```

## Version History
- **v1.0** (Oct 2025) - Initial style guidelines based on New Day Climate main website
