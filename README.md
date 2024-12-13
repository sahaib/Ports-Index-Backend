# Ports Index Backend 🚢

Backend service for the Ports Index application, providing UN/LOCODE data, distance calculations, and geospatial services.

## Features 🌟

- 📊 UN/LOCODE Database with Real-time Updates
- 🔍 Advanced Port Search & Lookup API
- 📏 Maritime Distance Calculation Service
- 🗺️ Geocoding & Reverse Geocoding
- 📦 Bulk Operations Support
- 🌐 Nearby Ports Discovery
- 🔄 Data Synchronization Service

## Tech Stack 💻

- ⚡ Node.js + TypeScript
- 🛠️ Express.js
- 🗄️ Prisma ORM
- 📀 PostgreSQL
- 🗺️ MapBox API Integration
- 🔐 JWT Authentication
- 📝 Winston Logger
- 🚦 Rate Limiting

## API Documentation 📚

### Port Operations

```http
# Get port by UN/LOCODE
GET /api/ports/:locode

# Search ports
GET /api/ports/search
Query params:
  - name: string
  - countryCode: string
  - limit: number
  - offset: number

# Find nearby ports
GET /api/ports/nearby
Query params:
  - lat: number
  - lon: number
  - radius: number (nautical miles)

# Bulk port lookup
POST /api/ports/bulk
Body: { locodes: string[] }
```

### Distance Calculations

```http
# Calculate port-to-port distance
POST /api/distance/calculate
Body: {
  origin: string (LOCODE),
  destination: string (LOCODE)
}

# Bulk distance calculation
POST /api/distance/bulk
Body: {
  calculations: Array<{
    origin: string,
    destination: string
  }>
}
```

## Environment Variables 🔐

```env
# Required
DATABASE_URL="postgresql://..."
MAPBOX_TOKEN="your_mapbox_token"
PORT=3000

# Optional
LOG_LEVEL="info"
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
CACHE_TTL=3600
NODE_ENV="development"
```

## Getting Started 🚀

1. Clone and install dependencies:
```bash
git clone https://github.com/yourusername/ports-index-backend.git
cd ports-index-backend
npm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Set up database:
```bash
npx prisma generate
npx prisma migrate dev
npm run seed # Optional: Seed initial data
```

4. Start development server:
```bash
npm run dev
```

## Database Schema 📊

```prisma
model Port {
  locode            String    @id
  name              String
  nameWoDiacritics  String?
  latitude          Float?
  longitude         Float?
  function          String?
  status            String?
  countryCode       String
  subdivision       String?
  unlocodeDate      String?
  isMaritime        Boolean   @default(false)
  isCommercial      Boolean   @default(false)
  lastUpdated       DateTime  @default(now())

  @@index([countryCode])
  @@index([nameWoDiacritics])
}

// Add other models as needed
```

## API Rate Limiting 🚦

- Default: 100 requests per 15 minutes
- Bulk endpoints: 10 requests per minute
- Configurable via environment variables

## Caching Strategy 🔄

- In-memory caching for frequent requests
- Redis support for distributed setups
- Configurable TTL per endpoint

## Error Handling 🎯

Standardized error responses:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

## Monitoring & Logging 📊

- Winston logging integration
- Log levels: error, warn, info, debug
- Performance metrics tracking
- Request/Response logging

## Development 👨‍💻

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run test       # Run tests
npm run lint       # Lint code
npm run format     # Format code
```

### Testing

```bash
npm run test:unit      # Run unit tests
npm run test:e2e       # Run E2E tests
npm run test:coverage  # Generate coverage report
```

## Deployment 🌐

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Docker Deployment

```bash
docker build -t ports-index-backend .
docker run -p 3000:3000 ports-index-backend
```

## Contributing 🤝

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License 📄

MIT License - See [LICENSE](LICENSE)

## Support 🆘

- GitHub Issues
- Email: hello@sahaibsingh.com

---

Made with ❤️ by [Sahaib Singh](https://work.sahaibsingh.com)
