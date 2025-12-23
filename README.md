# Me.Dash - Personalized Dashboard Platform

A modern Vue.js application that allows users to create, customize, and share personalized dashboards with drag-and-drop panels, dynamic resizing, theming, and user accounts.

## Features

✨ **Dashboard Management**
- Create and manage multiple personalized dashboards
- Edit dashboard names and descriptions
- Delete dashboards with confirmation

🎨 **Customization**
- Light/Dark theme toggle
- Customizable color palette with live preview
- Panel-based architecture with multiple panel types

📦 **Panel Types**
- **Notes**: Rich text editor for quick notes
- **Stats**: Colorful statistics cards with trend indicators
- **Charts**: Visual bar charts for data representation
- **Calendar**: Month calendar view with highlighting
- **Weather**: Weather information display

🎯 **Drag & Drop**
- Repositionable panels (coming with full drag-drop support)
- Resizable panels via edit mode
- Grid-based layout system

👥 **User Features**
- User authentication (demo mode)
- User profiles with avatar
- Session management

🔗 **Sharing**
- Share dashboards with unique tokens
- Public dashboard links
- Toggle sharing on/off

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Pinia** - Vue state management
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend tooling
- **Axios** - HTTP client library

## Project Structure

```
src/
├── components/
│   ├── DashboardGrid.vue      # Main dashboard grid container
│   ├── DashboardPanel.vue     # Panel wrapper component
│   ├── DashboardList.vue      # Dashboard listing and management
│   ├── Login.vue              # Authentication screen
│   ├── Navbar.vue             # Top navigation bar
│   ├── Settings.vue           # Theme and color settings
│   └── panels/
│       ├── NotesPanel.vue     # Notes panel
│       ├── StatsPanel.vue     # Statistics display
│       ├── ChartPanel.vue     # Chart visualization
│       ├── CalendarPanel.vue  # Calendar view
│       └── WeatherPanel.vue   # Weather display
├── stores/
│   └── dashboard.ts           # Pinia dashboard store
├── App.vue                    # Root component
├── main.ts                    # Application entry point
└── style.css                  # Global styles with Tailwind

```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Login**: Use any email/password combination (demo mode)
2. **Create Dashboard**: Click "+ New Dashboard" to create a new dashboard
3. **Add Panels**: Enter edit mode and click "+ Add Panel" to add panels
4. **Customize Panels**: Edit panel size and position in edit mode
5. **Change Theme**: Go to Settings and toggle Light/Dark mode
6. **Customize Colors**: Adjust the color palette in Settings
7. **Share Dashboard**: Click the "Share" button on a dashboard to generate a share link

## Features in Detail

### Dashboard Management
- Create unlimited dashboards with custom names and descriptions
- Switch between dashboards using the My Dashboards view
- Edit panel layout in edit mode
- Save changes automatically

### Panel System
Each panel is independently customizable:
- **Title**: Custom panel titles
- **Position**: Set X, Y coordinates on the grid
- **Size**: Configure width (1-12) and height
- **Type**: Choose from multiple panel types
- **Content**: Edit panel-specific content

### Theming
- Toggle between light and dark themes
- Persistent theme preference
- Automatic CSS variable application

### Color Customization
- Customize Primary, Secondary, and Accent colors
- Set background and text colors
- Live preview of changes
- Reset to default colors

### Data Persistence
- Dashboards stored in localStorage
- Automatic saving on state changes
- Manual save triggers in edit mode

## Authentication (Demo Mode)

The application includes a demo authentication system:
- No backend required
- Use any email/password combination
- User profile shown in navbar
- Logout clears session

## Future Enhancements

- [ ] Full drag-and-drop implementation with vue-grid-layout
- [ ] Backend API integration for data persistence
- [ ] Real-time collaboration features
- [ ] Advanced charting with Chart.js or D3.js
- [ ] Export dashboards as PDF
- [ ] Dashboard templates
- [ ] Widget marketplace
- [ ] Team/workspace support
- [ ] API integrations for live data
- [ ] Mobile responsive improvements

## Development

### Creating New Panel Types

1. Create a new component in `src/components/panels/MyPanel.vue`
2. Import it in `src/components/DashboardPanel.vue`
3. Add it to the `panelComponents` object
4. Add the type to the `DashboardPanel` interface in `src/stores/dashboard.ts`
5. Update the panel type select dropdown in `DashboardGrid.vue`

### Adding Features

All state management is centralized in the Pinia store (`src/stores/dashboard.ts`). To add new features:

1. Add methods/state to the store
2. Use `useDashboardStore()` in components
3. Call store methods to update state

## License

MIT

## Support

For issues and feature requests, please create an issue in the repository.

---

Made with ❤️ for personalized dashboard enthusiasts
