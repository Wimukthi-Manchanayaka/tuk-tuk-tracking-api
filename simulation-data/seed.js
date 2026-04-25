require('dotenv').config();
const mongoose = require('mongoose');
const Province = require('../src/models/Province');
const District = require('../src/models/District');
const PoliceStation = require('../src/models/PoliceStation');
const Vehicle = require('../src/models/Vehicle');
const LocationPing = require('../src/models/LocationPing');
const User = require('../src/models/User');

// ===== SRI LANKA DATA =====

const provinces = [
  { name: 'Western Province', code: 'WP' },
  { name: 'Central Province', code: 'CP' },
  { name: 'Southern Province', code: 'SP' },
  { name: 'Northern Province', code: 'NP' },
  { name: 'Eastern Province', code: 'EP' },
  { name: 'North Western Province', code: 'NWP' },
  { name: 'North Central Province', code: 'NCP' },
  { name: 'Uva Province', code: 'UP' },
  { name: 'Sabaragamuwa Province', code: 'SGP' }
];

const districtData = [
  // Western Province
  { name: 'Colombo', code: 'COL', provinceName: 'Western Province' },
  { name: 'Gampaha', code: 'GAM', provinceName: 'Western Province' },
  { name: 'Kalutara', code: 'KAL', provinceName: 'Western Province' },
  // Central Province
  { name: 'Kandy', code: 'KAN', provinceName: 'Central Province' },
  { name: 'Matale', code: 'MAT', provinceName: 'Central Province' },
  { name: 'Nuwara Eliya', code: 'NUW', provinceName: 'Central Province' },
  // Southern Province
  { name: 'Galle', code: 'GAL', provinceName: 'Southern Province' },
  { name: 'Matara', code: 'MTR', provinceName: 'Southern Province' },
  { name: 'Hambantota', code: 'HAM', provinceName: 'Southern Province' },
  // Northern Province
  { name: 'Jaffna', code: 'JAF', provinceName: 'Northern Province' },
  { name: 'Kilinochchi', code: 'KIL', provinceName: 'Northern Province' },
  { name: 'Mannar', code: 'MAN', provinceName: 'Northern Province' },
  { name: 'Vavuniya', code: 'VAV', provinceName: 'Northern Province' },
  { name: 'Mullaitivu', code: 'MUL', provinceName: 'Northern Province' },
  // Eastern Province
  { name: 'Trincomalee', code: 'TRI', provinceName: 'Eastern Province' },
  { name: 'Batticaloa', code: 'BAT', provinceName: 'Eastern Province' },
  { name: 'Ampara', code: 'AMP', provinceName: 'Eastern Province' },
  // North Western Province
  { name: 'Kurunegala', code: 'KUR', provinceName: 'North Western Province' },
  { name: 'Puttalam', code: 'PUT', provinceName: 'North Western Province' },
  // North Central Province
  { name: 'Anuradhapura', code: 'ANU', provinceName: 'North Central Province' },
  { name: 'Polonnaruwa', code: 'POL', provinceName: 'North Central Province' },
  // Uva Province
  { name: 'Badulla', code: 'BAD', provinceName: 'Uva Province' },
  { name: 'Monaragala', code: 'MON', provinceName: 'Uva Province' },
  // Sabaragamuwa Province
  { name: 'Ratnapura', code: 'RAT', provinceName: 'Sabaragamuwa Province' },
  { name: 'Kegalle', code: 'KEG', provinceName: 'Sabaragamuwa Province' }
];

const stationData = [
  { name: 'Colombo Fort Police Station', districtName: 'Colombo', address: 'Fort, Colombo 01', contact: '0112394222' },
  { name: 'Maradana Police Station', districtName: 'Colombo', address: 'Maradana, Colombo 10', contact: '0112693394' },
  { name: 'Wellampitiya Police Station', districtName: 'Colombo', address: 'Wellampitiya', contact: '0112522222' },
  { name: 'Negombo Police Station', districtName: 'Gampaha', address: 'Negombo', contact: '0312222222' },
  { name: 'Gampaha Police Station', districtName: 'Gampaha', address: 'Gampaha', contact: '0332222222' },
  { name: 'Kalutara Police Station', districtName: 'Kalutara', address: 'Kalutara', contact: '0342222222' },
  { name: 'Kandy Police Station', districtName: 'Kandy', address: 'Kandy', contact: '0812222222' },
  { name: 'Peradeniya Police Station', districtName: 'Kandy', address: 'Peradeniya', contact: '0812388888' },
  { name: 'Matale Police Station', districtName: 'Matale', address: 'Matale', contact: '0662222222' },
  { name: 'Nuwara Eliya Police Station', districtName: 'Nuwara Eliya', address: 'Nuwara Eliya', contact: '0522222222' },
  { name: 'Galle Police Station', districtName: 'Galle', address: 'Galle Fort', contact: '0912222222' },
  { name: 'Matara Police Station', districtName: 'Matara', address: 'Matara', contact: '0412222222' },
  { name: 'Hambantota Police Station', districtName: 'Hambantota', address: 'Hambantota', contact: '0472222222' },
  { name: 'Jaffna Police Station', districtName: 'Jaffna', address: 'Jaffna', contact: '0212222222' },
  { name: 'Trincomalee Police Station', districtName: 'Trincomalee', address: 'Trincomalee', contact: '0262222222' },
  { name: 'Batticaloa Police Station', districtName: 'Batticaloa', address: 'Batticaloa', contact: '0652222222' },
  { name: 'Kurunegala Police Station', districtName: 'Kurunegala', address: 'Kurunegala', contact: '0372222222' },
  { name: 'Puttalam Police Station', districtName: 'Puttalam', address: 'Puttalam', contact: '0322222222' },
  { name: 'Anuradhapura Police Station', districtName: 'Anuradhapura', address: 'Anuradhapura', contact: '0252222222' },
  { name: 'Polonnaruwa Police Station', districtName: 'Polonnaruwa', address: 'Polonnaruwa', contact: '0272222222' },
  { name: 'Badulla Police Station', districtName: 'Badulla', address: 'Badulla', contact: '0552222222' },
  { name: 'Ratnapura Police Station', districtName: 'Ratnapura', address: 'Ratnapura', contact: '0452222222' },
  { name: 'Kegalle Police Station', districtName: 'Kegalle', address: 'Kegalle', contact: '0352222222' },
  { name: 'Ampara Police Station', districtName: 'Ampara', address: 'Ampara', contact: '0632222222' },
  { name: 'Vavuniya Police Station', districtName: 'Vavuniya', address: 'Vavuniya', contact: '0242222222' }
];

// Sri Lanka approximate coordinates by district for realistic pings
const districtCoordinates = {
  'Colombo': { lat: 6.9271, lng: 79.8612, range: 0.15 },
  'Gampaha': { lat: 7.0917, lng: 79.9997, range: 0.2 },
  'Kalutara': { lat: 6.5854, lng: 79.9607, range: 0.2 },
  'Kandy': { lat: 7.2906, lng: 80.6337, range: 0.2 },
  'Matale': { lat: 7.4675, lng: 80.6234, range: 0.2 },
  'Nuwara Eliya': { lat: 6.9497, lng: 80.7891, range: 0.15 },
  'Galle': { lat: 6.0535, lng: 80.2210, range: 0.15 },
  'Matara': { lat: 5.9549, lng: 80.5550, range: 0.15 },
  'Hambantota': { lat: 6.1429, lng: 81.1212, range: 0.2 },
  'Jaffna': { lat: 9.6615, lng: 80.0255, range: 0.2 },
  'Trincomalee': { lat: 8.5874, lng: 81.2152, range: 0.2 },
  'Batticaloa': { lat: 7.7170, lng: 81.6924, range: 0.15 },
  'Kurunegala': { lat: 7.4675, lng: 80.3647, range: 0.25 },
  'Puttalam': { lat: 8.0362, lng: 79.8283, range: 0.2 },
  'Anuradhapura': { lat: 8.3114, lng: 80.4037, range: 0.25 },
  'Polonnaruwa': { lat: 7.9403, lng: 81.0188, range: 0.2 },
  'Badulla': { lat: 6.9934, lng: 81.0550, range: 0.2 },
  'Monaragala': { lat: 6.8728, lng: 81.3507, range: 0.2 },
  'Ratnapura': { lat: 6.6828, lng: 80.3992, range: 0.2 },
  'Kegalle': { lat: 7.2513, lng: 80.3464, range: 0.15 },
  'Kilinochchi': { lat: 9.3803, lng: 80.3770, range: 0.2 },
  'Mannar': { lat: 8.9810, lng: 79.9044, range: 0.2 },
  'Vavuniya': { lat: 8.7514, lng: 80.4971, range: 0.2 },
  'Mullaitivu': { lat: 9.2671, lng: 80.8142, range: 0.2 },
  'Ampara': { lat: 7.2990, lng: 81.6747, range: 0.2 }
};

const driverNames = [
  'Kamal Perera', 'Nimal Fernando', 'Suresh Silva', 'Arun Kumar', 'Bandula Dissanayake',
  'Chaminda Jayawardena', 'Dinesh Wickramasinghe', 'Eranga Rajapaksa', 'Fonseka Gamage',
  'Gayan Kumara', 'Harsha Rathnayake', 'Isuru Aluthgama', 'Janaka Hettiarachchi',
  'Kasun Mendis', 'Lahiru Pradeep', 'Mahesh Gunasekara', 'Nalaka Bandara', 'Oshan Pathirana',
  'Prasad Weerasinghe', 'Rukshan Amarasinghe', 'Saman Wijesinghe', 'Thilina Madusanka',
  'Udaya Kumara', 'Vimukthi Rajapakshe', 'Waruna Senanayake', 'Xavi Perera', 'Yasith Fernando',
  'Zaman Ali', 'Ajith Bandara', 'Buddika Jayasena', 'Chatura Gunawardena', 'Danushka Edirisinghe',
  'Eshan Madushanka', 'Farhan Hussain', 'Gihan Seneviratne', 'Hashan Peiris', 'Imesh Ranasinghe',
  'Jehan Rodrigo', 'Kavinda Amaratunga', 'Lasith Malinga', 'Manoj Paranagama', 'Nishan Cooray',
  'Oshada Fernando', 'Prabath Jayawickrama', 'Ravindu Rathnayaka', 'Shehan Jayasuriya',
  'Thusitha Perera', 'Uthpala Dias', 'Vishwa Kumara', 'Wimal Gunatillaka'
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateNIC(index) {
  const year = Math.floor(randomBetween(70, 99));
  const num = String(index * 13 + 100000).slice(-6);
  const suffix = Math.random() > 0.5 ? 'V' : 'X';
  return `${year}${num}${suffix}`;
}

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Promise.all([
      Province.deleteMany({}),
      District.deleteMany({}),
      PoliceStation.deleteMany({}),
      Vehicle.deleteMany({}),
      LocationPing.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Data cleared');

    // Create provinces
    console.log('Creating provinces...');
    const createdProvinces = await Province.insertMany(provinces);
    const provinceMap = {};
    createdProvinces.forEach(p => { provinceMap[p.name] = p; });
    console.log(`Created ${createdProvinces.length} provinces`);

    // Create districts
    console.log('Creating districts...');
    const districtsToInsert = districtData.map(d => ({
      name: d.name,
      code: d.code,
      province: provinceMap[d.provinceName]._id
    }));
    const createdDistricts = await District.insertMany(districtsToInsert);
    const districtMap = {};
    createdDistricts.forEach(d => { districtMap[d.name] = d; });
    console.log(`Created ${createdDistricts.length} districts`);

    // Create police stations
    console.log('Creating police stations...');
    const stationsToInsert = stationData.map(s => {
      const district = districtMap[s.districtName];
      const province = createdProvinces.find(p => p._id.equals(district.province));
      return {
        name: s.name,
        district: district._id,
        province: province._id,
        address: s.address,
        contactNumber: s.contact
      };
    });
    const createdStations = await PoliceStation.insertMany(stationsToInsert);
    const stationMap = {};
    createdStations.forEach(s => { stationMap[s.name] = s; });
    console.log(`Created ${createdStations.length} police stations`);

    // Create admin user
    console.log('Creating admin user...');
    await User.create({
      name: 'HQ Administrator',
      email: 'admin@police.lk',
      password: 'admin123456',
      role: 'HQ_ADMIN'
    });

    // Create provincial officers
    for (let i = 0; i < 3; i++) {
      await User.create({
        name: `Provincial Officer ${i + 1}`,
        email: `provincial${i + 1}@police.lk`,
        password: 'password123',
        role: 'PROVINCIAL',
        province: createdProvinces[i]._id
      });
    }

    // Create station officers
    for (let i = 0; i < 5; i++) {
      await User.create({
        name: `Station Officer ${i + 1}`,
        email: `station${i + 1}@police.lk`,
        password: 'password123',
        role: 'STATION',
        station: createdStations[i]._id
      });
    }
    console.log('Users created');

    // Create 200 vehicles
    console.log('Creating 200 vehicles...');
    const vehiclesToInsert = [];
    const districtArray = createdDistricts;
    const stationArray = createdStations;

    for (let i = 1; i <= 200; i++) {
      const district = districtArray[i % districtArray.length];
      const province = createdProvinces.find(p => p._id.equals(district.province));
      const station = stationArray[i % stationArray.length];
      const driverName = driverNames[i % driverNames.length] + ' ' + i;
      const provCode = province.code;
      
      // Create device user for this vehicle
      const deviceEmail = `device${String(i).padStart(3, '0')}@device.police.lk`;
      
      vehiclesToInsert.push({
        registrationNumber: `${provCode}-TK-${String(i).padStart(4, '0')}`,
        deviceId: `DEV-${String(i).padStart(4, '0')}`,
        driverName: driverName,
        driverNIC: generateNIC(i),
        driverPhone: `071${String(Math.floor(randomBetween(1000000, 9999999)))  }`,
        province: province._id,
        district: district._id,
        station: station._id,
        isActive: i <= 190 // 190 active, 10 inactive
      });
    }

    const createdVehicles = await Vehicle.insertMany(vehiclesToInsert);
    console.log(`Created ${createdVehicles.length} vehicles`);

    // Create DEVICE users for first 10 vehicles
    for (let i = 0; i < 10; i++) {
      await User.create({
        name: `Device ${i + 1}`,
        email: `device${String(i + 1).padStart(3, '0')}@device.police.lk`,
        password: 'device123',
        role: 'DEVICE'
      });
    }

    // Create location pings — 1 week history for each vehicle
    console.log('Creating 1 week of location history (this takes a moment)...');
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const PINGS_PER_VEHICLE = 168; // One ping per hour for 7 days
    const PING_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
    
    const allPings = [];
    
    for (const vehicle of createdVehicles) {
      if (!vehicle.isActive) continue; // Skip inactive vehicles
      
      const district = districtArray.find(d => d._id.equals(vehicle.district));
      const coords = districtCoordinates[district ? district.name : 'Colombo'];
      
      let currentLat = coords.lat + randomBetween(-coords.range, coords.range);
      let currentLng = coords.lng + randomBetween(-coords.range, coords.range);
      
      for (let h = 0; h < PINGS_PER_VEHICLE; h++) {
        const timestamp = new Date(oneWeekAgo.getTime() + h * PING_INTERVAL);
        
        // Simulate movement — small random movement each hour
        currentLat += randomBetween(-0.01, 0.01);
        currentLng += randomBetween(-0.01, 0.01);
        
        // Keep within Sri Lanka bounds
        currentLat = Math.max(5.92, Math.min(9.85, currentLat));
        currentLng = Math.max(79.72, Math.min(81.88, currentLng));
        
        // Speed: 0 at night (22:00-06:00), otherwise random
        const hour = timestamp.getHours();
        const isNight = hour >= 22 || hour < 6;
        const speed = isNight ? 0 : randomBetween(0, 60);
        const heading = randomBetween(0, 360);
        
        allPings.push({
          vehicle: vehicle._id,
          latitude: Math.round(currentLat * 10000) / 10000,
          longitude: Math.round(currentLng * 10000) / 10000,
          speed: Math.round(speed * 10) / 10,
          heading: Math.round(heading),
          timestamp
        });
      }
      
      // Insert in batches of 5000 to avoid memory issues
      if (allPings.length >= 5000) {
        await LocationPing.insertMany(allPings);
        console.log(`  Inserted ${allPings.length} pings...`);
        allPings.length = 0;
      }
    }
    
    // Insert remaining pings
    if (allPings.length > 0) {
      await LocationPing.insertMany(allPings);
    }

    const totalPings = await LocationPing.countDocuments();
    console.log(`\n============================`);
    console.log(`SEED COMPLETE!`);
    console.log(`============================`);
    console.log(`Provinces: ${await Province.countDocuments()}`);
    console.log(`Districts: ${await District.countDocuments()}`);
    console.log(`Stations: ${await PoliceStation.countDocuments()}`);
    console.log(`Vehicles: ${await Vehicle.countDocuments()}`);
    console.log(`Location Pings: ${totalPings}`);
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`\nDefault Login:`);
    console.log(`  Email: admin@police.lk`);
    console.log(`  Password: admin123456`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();