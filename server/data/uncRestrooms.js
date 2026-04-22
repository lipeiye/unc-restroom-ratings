export const UNC_RESTROOMS = [
  {
    name: "Main Floor Restroom",
    building: "Davis Library",
    floor: "1F",
    location: { lat: 35.9109, lng: -79.0479 },
    description: "High-traffic restroom near the main entrance. Recently renovated.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["clean", "well-stocked"]
  },
  {
    name: "2nd Floor Restroom",
    building: "Davis Library",
    floor: "2F",
    location: { lat: 35.9111, lng: -79.0478 },
    description: "Quieter option on the upper floor.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: false
    },
    tags: ["quiet", "clean"]
  },
  {
    name: "Ground Floor Restroom",
    building: "Undergraduate Library (UL)",
    floor: "G",
    location: { lat: 35.9091, lng: -79.0493 },
    description: "Popular spot near the coffee shop. Can get busy during peak hours.",
    amenities: {
      handicapAccessible: true,
      changingTable: true,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["busy", "well-stocked", "central"]
  },
  {
    name: "West Wing Restroom",
    building: "Student Union",
    floor: "1F",
    location: { lat: 35.9101, lng: -79.0474 },
    description: "Near the food court. Convenient but often crowded.",
    amenities: {
      handicapAccessible: true,
      changingTable: true,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["crowded", "central", "accessible"]
  },
  {
    name: "East Wing Restroom",
    building: "Student Union",
    floor: "2F",
    location: { lat: 35.9103, lng: -79.0472 },
    description: "Less crowded than the west wing. Good alternative.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: true
    },
    tags: ["clean", "less-crowded"]
  },
  {
    name: "Basement Restroom",
    building: "Hamilton Hall",
    floor: "B",
    location: { lat: 35.9093, lng: -79.0461 },
    description: "Hidden gem. Usually empty between classes.",
    amenities: {
      handicapAccessible: false,
      changingTable: false,
      freePadsTampons: false,
      airDryer: false,
      paperTowels: true
    },
    tags: ["hidden-gem", "quiet", "no-wait"]
  },
  {
    name: "3rd Floor Restroom",
    building: "Hamilton Hall",
    floor: "3F",
    location: { lat: 35.9095, lng: -79.0460 },
    description: "Recently upgraded fixtures.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: true
    },
    tags: ["modern", "clean"]
  },
  {
    name: "Main Restroom",
    building: "Hanes Hall",
    floor: "1F",
    location: { lat: 35.9103, lng: -79.0465 },
    description: "Standard departmental building restroom.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: true
    },
    tags: ["standard", "clean"]
  },
  {
    name: "Lobby Restroom",
    building: "Carroll Hall",
    floor: "1F",
    location: { lat: 35.9108, lng: -79.0491 },
    description: "Convenient for journalism and media classes.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: false
    },
    tags: ["convenient", "average"]
  },
  {
    name: "North Wing Restroom",
    building: "Phillips Hall",
    floor: "2F",
    location: { lat: 35.9095, lng: -79.0488 },
    description: "Math department building. Clean but basic.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: false,
      paperTowels: true
    },
    tags: ["basic", "clean", "quiet"]
  },
  {
    name: "Ground Floor Restroom",
    building: "Sitterson Hall",
    floor: "G",
    location: { lat: 35.9099, lng: -79.0532 },
    description: "CS building restroom. Usually clean and well-maintained.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["tech-building", "clean", "well-stocked"]
  },
  {
    name: "2nd Floor Restroom",
    building: "Sitterson Hall",
    floor: "2F",
    location: { lat: 35.9101, lng: -79.0530 },
    description: "Near the robotics lab. Less foot traffic.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: true
    },
    tags: ["quiet", "clean", "low-traffic"]
  },
  {
    name: "Main Restroom",
    building: "Genome Sciences Building",
    floor: "1F",
    location: { lat: 35.9096, lng: -79.0502 },
    description: "Modern building with excellent facilities.",
    amenities: {
      handicapAccessible: true,
      changingTable: true,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["modern", "excellent", "accessible"]
  },
  {
    name: "Basement Restroom",
    building: "Manning Hall",
    floor: "B",
    location: { lat: 35.9090, lng: -79.0485 },
    description: "Older building but regularly cleaned.",
    amenities: {
      handicapAccessible: false,
      changingTable: false,
      freePadsTampons: false,
      airDryer: false,
      paperTowels: true
    },
    tags: ["older", "basic"]
  },
  {
    name: "1st Floor Restroom",
    building: "Murphey Hall",
    floor: "1F",
    location: { lat: 35.9092, lng: -79.0490 },
    description: "History department. Cozy but small.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: true
    },
    tags: ["small", "cozy", "quiet"]
  },
  {
    name: "Main Restroom",
    building: "Wilson Library",
    floor: "1F",
    location: { lat: 35.9097, lng: -79.0495 },
    description: "Historic building restroom. Recently updated while preserving character.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["historic", "updated", "character"]
  },
  {
    name: "South Entrance Restroom",
    building: "Graham Student Center",
    floor: "1F",
    location: { lat: 35.9094, lng: -79.0468 },
    description: "Convenient for events and gatherings.",
    amenities: {
      handicapAccessible: true,
      changingTable: true,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["event-space", "accessible", "well-stocked"]
  },
  {
    name: "Gym Floor Restroom",
    building: "Fetzer Hall",
    floor: "1F",
    location: { lat: 35.9091, lng: -79.0463 },
    description: "Gym adjacent. High traffic during peak hours.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: true
    },
    tags: ["gym", "high-traffic", "sweaty"]
  },
  {
    name: "Poolside Restroom",
    building: "Woollen Gym",
    floor: "1F",
    location: { lat: 35.9085, lng: -79.0455 },
    description: "Near the pool. Can be humid but functional.",
    amenities: {
      handicapAccessible: true,
      changingTable: false,
      freePadsTampons: false,
      airDryer: true,
      paperTowels: true
    },
    tags: ["pool", "humid", "functional"]
  },
  {
    name: "Arena Restroom",
    building: "Carmichael Arena",
    floor: "1F",
    location: { lat: 35.9082, lng: -79.0448 },
    description: "Event venue restroom. Gets very crowded during games.",
    amenities: {
      handicapAccessible: true,
      changingTable: true,
      freePadsTampons: true,
      airDryer: true,
      paperTowels: true
    },
    tags: ["arena", "crowded-events", "large"]
  }
];

export const TAG_OPTIONS = [
  "clean",
  "dirty",
  "well-stocked",
  "no-supplies",
  "quiet",
  "crowded",
  "no-wait",
  "long-wait",
  "accessible",
  "modern",
  "older",
  "spacious",
  "small",
  "hidden-gem"
];

export const BUILDINGS = [...new Set(UNC_RESTROOMS.map(r => r.building))].sort();
