# Ports Index Backend 🚢

Backend service for the Ports Index application, providing UN/LOCODE data and distance calculation services.

## Features 🌟

- UN/LOCODE Database Integration
- Port Search & Lookup API
- Distance Calculation Service
- Geocoding Integration
- Bulk Operations Support

## Tech Stack 💻

- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- MapBox API Integration

## API Endpoints 🛣️

### Port Lookup

```
http
GET /api/ports/:locode
```
Retrieves port information by UN/LOCODE

### Port Search

```
http
GET /api/ports?name={name}&countryCode={countryCode}
```

Searches ports by name and country code

### Distance Calculation
```
http
POST /api/calculate-distance
```
Calculates distance between two ports

## Environment Variables 🔐
```
DATABASE_URL="postgresql://..."
MAPBOX_TOKEN="your_mapbox_token"
PORT=3000
```

## Getting Started 🚀

1. Clone the repository
```
git clone https://github.com/sahaib/Ports-Index-Backend.git
cd Ports-Index-Backend
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
```
cp .env.example .env
```

4. Start the server
```
npm run dev
```

5. Access the API at http://localhost:3000/api/ports
```
npm run dev
```

## Database Schema 📊

```
prisma
model Port {
locode String @id
name String
nameWoDiacritics String?
latitude Float?
longitude Float?
function String?
status String?
countryCode String
// ... other fields
}
```

## Deployment 🌐

### Vercel Deployment
1. Install Vercel CLI
```
npm install -g vercel
```

2. Deploy to Vercel
```
vercel
```
