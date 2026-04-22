# 🚻 UNC Restroom Ratings

A real-time restroom rating platform for UNC Chapel Hill buildings. Like Yelp, but for bathrooms.

![UNC Campus](https://img.shields.io/badge/UNC-Chapel%20Hill-7BAFD4?style=flat)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)

## Features

- 🗺️ **Interactive Map** - Browse restrooms across UNC campus with Leaflet
- ⭐ **Real-time Ratings** - Star ratings, reviews, and helpful tags
- 🏷️ **Smart Tags** - "Clean", "Well-stocked", "No wait", "Accessible", etc.
- 🔍 **Filter & Search** - Find restrooms by building, rating, or amenities
- ⚡ **Live Updates** - New reviews appear instantly via Socket.io
- 📱 **Mobile Friendly** - Fully responsive design

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Leaflet
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB Atlas
- **Deployment**: AWS Elastic Beanstalk (Docker)

## Quick Start

### Prerequisites

- Node.js 20+
- MongoDB Atlas account (free tier works)

### Installation

```bash
# Clone the repository
git clone git@github.com:lipeiye/unc-restroom-ratings.git
cd unc-restroom-ratings

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start development servers (run in separate terminals)
cd ../server && npm run dev
cd ../client && npm run dev
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for AWS Elastic Beanstalk setup instructions.

## Contributing

Pull requests welcome! Please follow the existing code style.

## License

MIT
