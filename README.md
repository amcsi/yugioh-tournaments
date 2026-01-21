# Yu-Gi-Oh! Tournaments in Hungary

A web application that lists upcoming Yu-Gi-Oh! tournaments in Hungary. The app fetches tournament data from the Konami Card Game Network API and displays it in an easy-to-browse format with filtering capabilities.

**Note**: This web app was developed with the help of [Cursor](https://cursor.sh), an AI-powered code editor.

## Features

- **Tournament Listings**: View all upcoming Yu-Gi-Oh! tournaments in Hungary
- **Store Filtering**: Filter tournaments by store location (Metagame, Remetebarlang, SAS és KOS, etc.)
- **Event Category Filtering**: Filter by tournament type (Local, OTS, Regional, Nemzeti)
- **Week Organization**: Tournaments are grouped by week with clear separators
- **Detailed Information**: Each tournament card shows:
  - Tournament name and number
  - Event type and structure
  - Date and time (with day of week in Hungarian)
  - Location and address (clickable Google Maps link)
  - Player count and reservation status
  - Store type badges

## Live Demo

🌐 **Live Site**: [https://yugiohverseny.hu](https://yugiohverseny.hu)

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Axios** for API requests
- Modern CSS with gradients and animations

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
