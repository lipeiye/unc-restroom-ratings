// UNC Restroom seed data - Sitterson, Davis Library, UL only
const UNC_RESTROOMS = [
  // Sitterson Hall - Floors 1-3
  {
    name: "Floor 1 Restroom",
    building: "Sitterson Hall",
    floor: "1F",
    location: { lat: 35.9099, lng: -79.0532 },
    description: "Ground floor CS building restroom.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: true, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 2 Restroom",
    building: "Sitterson Hall",
    floor: "2F",
    location: { lat: 35.9100, lng: -79.0531 },
    description: "Second floor near robotics lab.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 3 Restroom",
    building: "Sitterson Hall",
    floor: "3F",
    location: { lat: 35.9101, lng: -79.0530 },
    description: "Third floor, usually quiet.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: false }
  },

  // Davis Library - Floors 1-8
  {
    name: "Floor 1 Restroom",
    building: "Davis Library",
    floor: "1F",
    location: { lat: 35.9109, lng: -79.0479 },
    description: "Main entrance level, high traffic.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: true, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 2 Restroom",
    building: "Davis Library",
    floor: "2F",
    location: { lat: 35.9110, lng: -79.0478 },
    description: "Second floor study area.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: true, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 3 Restroom",
    building: "Davis Library",
    floor: "3F",
    location: { lat: 35.9111, lng: -79.0477 },
    description: "Third floor, quieter option.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 4 Restroom",
    building: "Davis Library",
    floor: "4F",
    location: { lat: 35.9108, lng: -79.0476 },
    description: "Fourth floor research area.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: false }
  },
  {
    name: "Floor 5 Restroom",
    building: "Davis Library",
    floor: "5F",
    location: { lat: 35.9107, lng: -79.0475 },
    description: "Fifth floor, low traffic.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: false, airDryer: false, paperTowels: true }
  },
  {
    name: "Floor 6 Restroom",
    building: "Davis Library",
    floor: "6F",
    location: { lat: 35.9106, lng: -79.0474 },
    description: "Sixth floor archives area.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 7 Restroom",
    building: "Davis Library",
    floor: "7F",
    location: { lat: 35.9105, lng: -79.0473 },
    description: "Seventh floor, rarely used.",
    amenities: { handicapAccessible: false, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: false }
  },
  {
    name: "Floor 8 Restroom",
    building: "Davis Library",
    floor: "8F",
    location: { lat: 35.9104, lng: -79.0472 },
    description: "Top floor, best views, quiet.",
    amenities: { handicapAccessible: false, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: true }
  },

  // Undergraduate Library (UL) - Floors 1-3
  {
    name: "Floor 1 Restroom",
    building: "Undergraduate Library",
    floor: "1F",
    location: { lat: 35.9091, lng: -79.0493 },
    description: "Ground floor near coffee shop, very busy.",
    amenities: { handicapAccessible: true, changingTable: true, freePadsTampons: true, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 2 Restroom",
    building: "Undergraduate Library",
    floor: "2F",
    location: { lat: 35.9092, lng: -79.0492 },
    description: "Second floor study zone.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: true, airDryer: true, paperTowels: true }
  },
  {
    name: "Floor 3 Restroom",
    building: "Undergraduate Library",
    floor: "3F",
    location: { lat: 35.9093, lng: -79.0491 },
    description: "Third floor, usually less crowded.",
    amenities: { handicapAccessible: true, changingTable: false, freePadsTampons: false, airDryer: true, paperTowels: true }
  }
];

module.exports = { UNC_RESTROOMS };
