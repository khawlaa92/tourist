# TourAssist AI - Component API Reference

## Core Components

### CustomButton

```javascript
import { CustomButton } from './src/components';

<CustomButton
  // Required
  title="Click Me"
  onPress={() => console.log('pressed')}
  
  // Optional
  variant="filled"          // 'filled' | 'outlined' | 'ghost' | 'text'
  size="md"                 // 'sm' | 'md' | 'lg'
  icon="🚀"                 // Left icon
  rightIcon="→"             // Right icon
  loading={false}           // Show loading spinner
  disabled={false}          // Disable button
  fullWidth={false}         // Stretch to full width
  style={{}}                // Custom styles
/>
```

**Variants Example:**
```javascript
// Primary action with loading
<CustomButton variant="filled" title="Save" loading={isSaving} />

// Secondary action
<CustomButton variant="outlined" title="Cancel" />

// Tertiary/minimal
<CustomButton variant="ghost" title="More options" />

// Text-only link
<CustomButton variant="text" title="Forgot password?" />
```

---

### CustomInput

```javascript
import { CustomInput } from './src/components';

<CustomInput
  // Required
  placeholder="Enter text"
  value={text}
  onChangeText={(text) => setText(text)}
  
  // Optional
  label="Email"                          // Field label
  errorMessage="Invalid email"           // Error state
  helperText="We'll never share it"     // Helper text below
  icon="📧"                              // Left icon
  rightIcon="✓"                          // Right icon
  secureTextEntry={false}                // Password field
  maxLength={100}                        // Character limit
  keyboardType="email-address"           // Keyboard type
  editable={true}                        // Enable/disable
  onBlurValidate={() => validate()}      // Validation callback
  style={{}}                             // Custom styles
/>
```

**Example - Email Input:**
```javascript
<CustomInput
  label="Email Address"
  placeholder="your@email.com"
  value={email}
  onChangeText={setEmail}
  icon="📧"
  errorMessage={emailError}
  helperText="Used for login and notifications"
  keyboardType="email-address"
  maxLength={254}
/>
```

**Example - Password Input:**
```javascript
<CustomInput
  label="Password"
  placeholder="Enter password"
  value={password}
  onChangeText={setPassword}
  icon="🔐"
  secureTextEntry={true}
  errorMessage={passwordError}
  helperText="Minimum 8 characters"
/>
```

---

### CustomHeader

```javascript
import { Header } from './src/components';

<Header
  title="Screen Title"                    // Header text
  onPressBack={() => navigation.goBack()} // Back button handler
  showThemeToggle={true}                  // Show theme switcher
  rightComponent={<CustomView />}         // Custom right content
/>
```

---

### LocationCard

```javascript
import { LocationCard } from './src/components';

<LocationCard
  title="Medina of Tunis"
  description="Historic old town with souks and traditional architecture"
  emoji="🕌"
  category="MONUMENT"           // MONUMENT | BEACH | DESERT | CITY | NATURE
  rating="4.8"
  distance="2.3 km away"
  onPress={() => {}}
/>
```

---

### MessageCard

```javascript
import { MessageCard } from './src/components';

// Simple format
<MessageCard 
  message="Hello, how can I help?"
  isUserMessage={false}
/>

// With timestamp
<MessageCard 
  message={{
    content: "What's nearby?",
    timestamp: new Date().toISOString()
  }}
  isUserMessage={true}
/>
```

---

## New Utility Components

### LoadingSpinner

```javascript
import { LoadingSpinner } from './src/components';

// Inline spinner
<LoadingSpinner text="Loading..." size="large" />

// Fullscreen loader
<LoadingSpinner fullscreen={true} text="Fetching places..." />

// Just spinner
<LoadingSpinner />
```

---

### Badge

```javascript
import { Badge } from './src/components';

// Primary badge
<Badge label="Featured" variant="primary" />

// With icon
<Badge label="New" variant="primary" icon="⭐" size="md" />

// Different variants
<Badge label="Success" variant="success" />
<Badge label="Warning" variant="warning" />
<Badge label="Error" variant="error" />

// Subtle badge
<Badge label="Info" variant="subtle" />
```

---

### Divider

```javascript
import { Divider } from './src/components';

// Simple horizontal line
<Divider />

// With text
<Divider text="Or continue with" />

// Dashed line
<Divider type="dashed" />

// Vertical divider
<Divider orientation="vertical" />

// Custom margin
<Divider text="Section break" margin={24} />
```

---

### Card

```javascript
import { Card } from './src/components';

<Card elevated={true} padding={16}>
  <Text>Card content</Text>
  <Text>Multiple items</Text>
</Card>

// Custom styling
<Card 
  elevated={true} 
  padding={24}
  borderRadius={16}
  style={{ marginHorizontal: 16 }}
>
  <LocationCard {...locationProps} />
</Card>
```

---

### Logo

```javascript
import { Logo } from './src/components';

// Full logo with text
<Logo size="lg" variant="full" color="#c41e3a" />

// Just icon
<Logo size="md" variant="icon" />

// Just text
<Logo size="sm" variant="text" />

// Different sizes
<Logo size="sm" variant="icon" />    // 24px
<Logo size="md" variant="icon" />    // 32px
<Logo size="lg" variant="icon" />    // 48px
<Logo size="xl" variant="icon" />    // 64px
```

**Usage in Header:**
```javascript
<View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <Logo size="md" variant="icon" />
  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>TourAssist</Text>
</View>
```

---

## Theme Usage

```javascript
import { useContext } from 'react';
import { ThemeContext } from './src/context/ThemeContext';
import { shadows, spacings, fontSizes } from './constants/theme';

export function MyComponent() {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <View style={{
      backgroundColor: theme.background,
      padding: spacings.lg,
    }}>
      <Text style={{
        color: theme.text,
        fontSize: fontSizes.lg,
      }}>
        Hello!
      </Text>
      <CustomButton
        title="Toggle Theme"
        onPress={toggleTheme}
      />
    </View>
  );
}
```

---

## Design Tokens

### Spacings
```javascript
import { spacings } from './constants/theme';

spacings.xs    // 4px
spacings.sm    // 8px
spacings.md    // 12px
spacings.lg    // 16px
spacings.xl    // 20px
spacings.xxl   // 24px
spacings.xxxl  // 32px
```

### Font Sizes
```javascript
import { fontSizes } from './constants/theme';

fontSizes.xs         // 12px
fontSizes.sm         // 14px
fontSizes.md         // 16px
fontSizes.lg         // 18px
fontSizes.xl         // 20px
fontSizes.xxl        // 24px
fontSizes.xxxl       // 32px
fontSizes.displayLg  // 36px
fontSizes.displayXl  // 48px
```

### Font Weights
```javascript
import { fontWeights } from './constants/theme';

fontWeights.light      // 300
fontWeights.normal     // 400
fontWeights.medium     // 500
fontWeights.semibold   // 600
fontWeights.bold       // 700
fontWeights.extrabold  // 800
```

### Border Radius
```javascript
import { borderRadius } from './constants/theme';

borderRadius.none    // 0
borderRadius.sm      // 4
borderRadius.md      // 8
borderRadius.lg      // 12
borderRadius.xl      // 16
borderRadius.xxl     // 24
borderRadius.full    // 100 (fully rounded)
```

### Shadows
```javascript
import { shadows } from './constants/theme';

// Use with spread operator
style={{
  ...shadows.none,
  ...shadows.xs,
  ...shadows.sm,
  ...shadows.md,  // Most common
  ...shadows.lg,
  ...shadows.xl,
}}
```

### Animation Timing
```javascript
import { animations } from './constants/theme';

animations.fast      // 150ms
animations.normal    // 300ms
animations.slow      // 500ms
animations.slower    // 700ms
```

---

## Common Patterns

### Button Group
```javascript
<View style={{ flexDirection: 'row', gap: spacings.md }}>
  <CustomButton 
    variant="filled" 
    title="Save" 
    onPress={onSave}
    style={{ flex: 1 }}
  />
  <CustomButton 
    variant="outlined" 
    title="Cancel" 
    onPress={onCancel}
    style={{ flex: 1 }}
  />
</View>
```

### Form Section
```javascript
<Card padding={spacings.lg}>
  <CustomInput 
    label="Name"
    placeholder="Enter name"
    value={name}
    onChangeText={setName}
    icon="👤"
  />
  <Divider margin={spacings.md} />
  <CustomInput 
    label="Email"
    placeholder="Enter email"
    value={email}
    onChangeText={setEmail}
    icon="📧"
  />
  <CustomButton 
    variant="filled" 
    title="Continue" 
    fullWidth={true}
    disabled={!name || !email}
  />
</Card>
```

### Empty State
```javascript
<View style={{ 
  flex: 1, 
  justifyContent: 'center', 
  alignItems: 'center',
  padding: spacings.xl 
}}>
  <Text style={{ fontSize: 48 }}>📍</Text>
  <Text style={{ 
    fontSize: fontSizes.lg, 
    fontWeight: fontWeights.bold,
    marginTop: spacings.md 
  }}>
    No places found
  </Text>
  <Text style={{ 
    color: theme.textSecondary,
    marginTop: spacings.sm 
  }}>
    Try searching in a different area
  </Text>
  <CustomButton 
    variant="outlined" 
    title="Search Again" 
    style={{ marginTop: spacings.lg }}
  />
</View>
```

---

## Migration Guide

### From Old Button System
```javascript
// Old (still works but deprecated)
<CustomButton title="Save" variant="primary" />

// New (recommended)
<CustomButton title="Save" variant="filled" size="md" />
```

### From Old Input System
```javascript
// Old
<CustomInput label="Email" value={email} onChangeText={setEmail} />

// New
<CustomInput 
  label="Email" 
  value={email} 
  onChangeText={setEmail}
  icon="📧"
  helperText="We'll send updates here"
  errorMessage={error}
/>
```

---

**API Version**: 2.0  
**Last Updated**: April 2026
