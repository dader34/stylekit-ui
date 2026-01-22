import React from 'react';
import { ThemeProvider, useTheme } from '../src/hooks/useTheme';
import { ThemeName } from '../src/types/theme';
import { themes } from '../src/themes';
import './App.css';

// Import components (these will be created by parallel agents)
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../src/components/Card';
import { Badge } from '../src/components/Badge';
import { Alert } from '../src/components/Alert';
import { Avatar, AvatarGroup } from '../src/components/Avatar';
import { Checkbox } from '../src/components/Checkbox';
import { Radio, RadioGroup } from '../src/components/Radio';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '../src/components/Tabs';

const themeDescriptions: Record<ThemeName, string> = {
  cupertino: 'Clean Apple-inspired design with SF Pro aesthetics',
  roseGold: 'Elegant and warm with sophisticated blush tones',
  glass: 'Ethereal glassmorphism with frosted translucency',
  brutalist: 'Bold and raw with sharp edges and stark contrasts',
  minimal: 'Ultra-refined with maximum white space',
  retrowave: '80s synthwave with neon colors and chrome',
  darkLuxe: 'Premium dark mode with gold accents',
  forest: 'Organic and calming with earthy greens',
};

function ThemeSwitcher() {
  const { themeName, setTheme, availableThemes } = useTheme();

  return (
    <div className="theme-switcher">
      <h2 className="theme-switcher-title">Select Theme</h2>
      <div className="theme-grid">
        {availableThemes.map((name) => {
          const theme = themes[name];
          const isActive = name === themeName;
          return (
            <button
              key={name}
              className={`theme-card ${isActive ? 'active' : ''}`}
              onClick={() => setTheme(name)}
              style={{
                '--preview-bg': theme.colors.background,
                '--preview-surface': theme.colors.surface,
                '--preview-primary': theme.colors.primary,
                '--preview-text': theme.colors.text,
                '--preview-border': theme.colors.border,
              } as React.CSSProperties}
            >
              <div className="theme-preview">
                <div className="preview-header" />
                <div className="preview-content">
                  <div className="preview-button" />
                  <div className="preview-lines">
                    <div className="preview-line" />
                    <div className="preview-line short" />
                  </div>
                </div>
              </div>
              <div className="theme-info">
                <span className="theme-name">{theme.displayName}</span>
                <span className="theme-description">
                  {themeDescriptions[name]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ComponentShowcase() {
  const [radioValue, setRadioValue] = React.useState('option1');
  const [checkboxValues, setCheckboxValues] = React.useState({
    option1: true,
    option2: false,
    option3: false,
  });

  return (
    <div className="showcase">
      <section className="showcase-section">
        <h2>Buttons</h2>
        <div className="component-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="component-row">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
        <div className="component-row">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button fullWidth>Full Width Button</Button>
        </div>
      </section>

      <section className="showcase-section">
        <h2>Inputs</h2>
        <div className="component-grid">
          <Input label="Default Input" placeholder="Enter text..." />
          <Input
            label="With Helper"
            placeholder="Enter email..."
            helperText="We'll never share your email"
          />
          <Input
            label="Error State"
            placeholder="Enter password..."
            error
            errorMessage="Password is required"
          />
          <Input
            label="Success State"
            placeholder="Username"
            success
            defaultValue="available_user"
          />
          <Input label="Disabled" placeholder="Disabled..." disabled />
          <Input variant="filled" label="Filled Variant" placeholder="Filled input..." />
        </div>
      </section>

      <section className="showcase-section">
        <h2>Cards</h2>
        <div className="card-grid">
          <Card variant="elevated">
            <CardHeader
              title="Elevated Card"
              subtitle="With shadow and depth"
            />
            <CardBody>
              <p>This card uses elevation (shadow) to create depth and hierarchy in the interface.</p>
            </CardBody>
            <CardFooter>
              <Button variant="ghost" size="sm">Cancel</Button>
              <Button variant="primary" size="sm">Confirm</Button>
            </CardFooter>
          </Card>

          <Card variant="outlined">
            <CardHeader
              title="Outlined Card"
              subtitle="Border only, no shadow"
            />
            <CardBody>
              <p>A more subtle card style using borders instead of shadows for definition.</p>
            </CardBody>
            <CardFooter>
              <Button variant="outline" size="sm">Learn More</Button>
            </CardFooter>
          </Card>

          <Card variant="filled" interactive>
            <CardHeader
              title="Interactive Card"
              subtitle="Hover to see effect"
            />
            <CardBody>
              <p>This card responds to hover interactions, making it suitable for clickable items.</p>
            </CardBody>
          </Card>
        </div>
      </section>

      <section className="showcase-section">
        <h2>Badges</h2>
        <div className="component-row">
          <Badge>Default</Badge>
          <Badge color="primary">Primary</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="error">Error</Badge>
          <Badge color="info">Info</Badge>
        </div>
        <div className="component-row">
          <Badge variant="solid" color="primary">Solid</Badge>
          <Badge variant="subtle" color="primary">Subtle</Badge>
          <Badge variant="outline" color="primary">Outline</Badge>
        </div>
        <div className="component-row">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </section>

      <section className="showcase-section">
        <h2>Alerts</h2>
        <div className="alert-stack">
          <Alert status="info" title="Information">
            This is an informational alert to keep you updated.
          </Alert>
          <Alert status="success" title="Success!">
            Your changes have been saved successfully.
          </Alert>
          <Alert status="warning" title="Warning">
            Please review your input before proceeding.
          </Alert>
          <Alert status="error" title="Error" dismissible>
            Something went wrong. Please try again.
          </Alert>
        </div>
      </section>

      <section className="showcase-section">
        <h2>Avatars</h2>
        <div className="component-row">
          <Avatar size="xs" name="John Doe" />
          <Avatar size="sm" name="Jane Smith" />
          <Avatar size="md" name="Bob Wilson" />
          <Avatar size="lg" name="Alice Brown" />
          <Avatar size="xl" name="Charlie Davis" />
          <Avatar size="2xl" src="https://i.pravatar.cc/150?img=3" name="User" />
        </div>
        <div className="component-row">
          <AvatarGroup max={4}>
            <Avatar name="John Doe" src="https://i.pravatar.cc/150?img=1" />
            <Avatar name="Jane Smith" src="https://i.pravatar.cc/150?img=2" />
            <Avatar name="Bob Wilson" src="https://i.pravatar.cc/150?img=3" />
            <Avatar name="Alice Brown" src="https://i.pravatar.cc/150?img=4" />
            <Avatar name="Charlie Davis" src="https://i.pravatar.cc/150?img=5" />
            <Avatar name="Eve Johnson" src="https://i.pravatar.cc/150?img=6" />
          </AvatarGroup>
        </div>
        <div className="component-row">
          <Avatar name="Online" status="online" />
          <Avatar name="Offline" status="offline" />
          <Avatar name="Busy" status="busy" />
          <Avatar name="Away" status="away" />
        </div>
      </section>

      <section className="showcase-section">
        <h2>Checkboxes</h2>
        <div className="component-row vertical">
          <Checkbox
            checked={checkboxValues.option1}
            onChange={(e) =>
              setCheckboxValues({ ...checkboxValues, option1: e.target.checked })
            }
          >
            Option 1 (checked)
          </Checkbox>
          <Checkbox
            checked={checkboxValues.option2}
            onChange={(e) =>
              setCheckboxValues({ ...checkboxValues, option2: e.target.checked })
            }
          >
            Option 2
          </Checkbox>
          <Checkbox
            checked={checkboxValues.option3}
            onChange={(e) =>
              setCheckboxValues({ ...checkboxValues, option3: e.target.checked })
            }
          >
            Option 3
          </Checkbox>
          <Checkbox disabled>Disabled option</Checkbox>
          <Checkbox indeterminate>Indeterminate</Checkbox>
        </div>
      </section>

      <section className="showcase-section">
        <h2>Radio Buttons</h2>
        <RadioGroup
          value={radioValue}
          onChange={setRadioValue}
          name="demo-radio"
        >
          <Radio value="option1">Option 1</Radio>
          <Radio value="option2">Option 2</Radio>
          <Radio value="option3">Option 3</Radio>
          <Radio value="option4" disabled>Disabled Option</Radio>
        </RadioGroup>
      </section>

      <section className="showcase-section">
        <h2>Tabs</h2>
        <Tabs defaultValue="tab1">
          <TabList>
            <Tab value="tab1">Account</Tab>
            <Tab value="tab2">Notifications</Tab>
            <Tab value="tab3">Security</Tab>
            <Tab value="tab4" disabled>Billing</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="tab1">
              <Card variant="ghost">
                <CardBody>
                  <h3>Account Settings</h3>
                  <p>Manage your account details, profile information, and preferences.</p>
                  <div className="tab-content-demo">
                    <Input label="Display Name" placeholder="Enter your name" />
                    <Input label="Email" placeholder="Enter your email" />
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel value="tab2">
              <Card variant="ghost">
                <CardBody>
                  <h3>Notification Preferences</h3>
                  <p>Choose what notifications you want to receive.</p>
                  <div className="tab-content-demo vertical">
                    <Checkbox defaultChecked>Email notifications</Checkbox>
                    <Checkbox defaultChecked>Push notifications</Checkbox>
                    <Checkbox>SMS notifications</Checkbox>
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel value="tab3">
              <Card variant="ghost">
                <CardBody>
                  <h3>Security Settings</h3>
                  <p>Keep your account secure with these settings.</p>
                  <div className="tab-content-demo">
                    <Button variant="outline">Change Password</Button>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardBody>
              </Card>
            </TabPanel>
            <TabPanel value="tab4">
              <Card variant="ghost">
                <CardBody>
                  <p>Billing content would go here.</p>
                </CardBody>
              </Card>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>
    </div>
  );
}

function DemoContent() {
  return (
    <div className="demo-app">
      <header className="demo-header">
        <div className="header-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--sk-color-primary)" />
              <path
                d="M8 12L16 8L24 12V20L16 24L8 20V12Z"
                stroke="var(--sk-color-text-on-primary)"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="16" cy="16" r="3" fill="var(--sk-color-text-on-primary)" />
            </svg>
            <span className="logo-text">StyleKit UI</span>
          </div>
          <p className="header-tagline">
            A React component library with 8 beautiful, distinct themes
          </p>
        </div>
      </header>

      <main className="demo-main">
        <ThemeSwitcher />
        <ComponentShowcase />
      </main>

      <footer className="demo-footer">
        <p>
          Built with React + TypeScript. Open source on GitHub.
        </p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider defaultTheme="cupertino">
      <DemoContent />
    </ThemeProvider>
  );
}
