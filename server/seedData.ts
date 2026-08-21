import { IUser, IProperty, IAgent, IBlogPost, ITestimonial } from './types';
import bcrypt from 'bcryptjs';

// Pre-hashed passwords for seed users ('admin123456' and 'user123456')
// We will generate hashes dynamically during seed initialization or use standard bcrypt
export function generateSeedData(): {
  users: IUser[];
  properties: IProperty[];
  agents: IAgent[];
  blogPosts: IBlogPost[];
  testimonials: ITestimonial[];
} {
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('admin123456', salt);
  const userHash = bcrypt.hashSync('user123456', salt);

  const users: IUser[] = [
    {
      id: 'usr-admin-1',
      name: 'Executive Admin',
      email: 'admin@growthrealtors.com',
      passwordHash: adminHash,
      phone: '+92 51 8899770',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      favorites: ['prop-1', 'prop-3'],
      createdAt: '2025-01-10T10:00:00.000Z',
    },
    {
      id: 'usr-demo-1',
      name: 'Hamza Khan',
      email: 'user@growthrealtors.com',
      passwordHash: userHash,
      phone: '+92 300 1234567',
      role: 'user',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      favorites: ['prop-1', 'prop-2', 'prop-5'],
      createdAt: '2025-02-01T12:30:00.000Z',
    }
  ];

  const agents: IAgent[] = [
    {
      id: 'agent-1',
      name: 'Tariq Malik',
      email: 'tariq.malik@growthrealtors.com',
      phone: '+92 321 5550192',
      whatsapp: '+923215550192',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      position: 'Senior Managing Director - Islamabad & Rawalpindi',
      bio: 'Over 16 years of premier real estate advisory experience across Islamabad diplomatic enclave, Sector F-6, F-7, and Bahria Golf City. Recognized as a trusted advisor to high-net-worth individuals and corporate developers.',
      experienceYears: 16,
      specialization: 'Luxury Mansions & Diplomatic Residences',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        facebook: 'https://facebook.com'
      },
      propertiesCount: 18,
      rating: 4.9,
      reviewsCount: 42,
      createdAt: '2024-01-15T00:00:00.000Z'
    },
    {
      id: 'agent-2',
      name: 'Ayesha Rahman',
      email: 'ayesha.rahman@growthrealtors.com',
      phone: '+92 333 4440188',
      whatsapp: '+923334440188',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      position: 'Principal Luxury Consultant - Lahore & DHA',
      bio: 'Specializing in prime DHA Lahore, Gulberg high-rises, and Lake City luxury estates. Known for precision market valuations and discreet transaction closures.',
      experienceYears: 12,
      specialization: 'DHA Luxury Estates & Penthouse Portfolios',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com'
      },
      propertiesCount: 24,
      rating: 5.0,
      reviewsCount: 56,
      createdAt: '2024-02-10T00:00:00.000Z'
    },
    {
      id: 'agent-3',
      name: 'Zaryab Farooq',
      email: 'zaryab.farooq@growthrealtors.com',
      phone: '+92 300 8887711',
      whatsapp: '+923008887711',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      position: 'Commercial & Coastal Real Estate Lead - Karachi',
      bio: 'Leading high-value residential & commercial acquisitions in Clifton, Emaar Oceanfront Karachi, and DHA Phase 8. Expert in yield optimization and overseas investor portfolios.',
      experienceYears: 14,
      specialization: 'Waterfront Living & Commercial Towers',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      },
      propertiesCount: 15,
      rating: 4.8,
      reviewsCount: 38,
      createdAt: '2024-03-01T00:00:00.000Z'
    },
    {
      id: 'agent-4',
      name: 'Fatima Al-Hassan',
      email: 'fatima.hassan@growthrealtors.com',
      phone: '+92 345 7772233',
      whatsapp: '+923457772233',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      position: 'Senior Architectural Advisor & Rental Specialist',
      bio: 'Focuses on luxury designer rentals, embassies, multinational corporate leases, and turnkey furnished architectural residences across Islamabad E-7 and F-8.',
      experienceYears: 9,
      specialization: 'Corporate Relocations & Furnished Villas',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com'
      },
      propertiesCount: 19,
      rating: 4.9,
      reviewsCount: 29,
      createdAt: '2024-04-12T00:00:00.000Z'
    },
    {
      id: 'agent-5',
      name: 'Bilal Qureshi',
      email: 'bilal.qureshi@growthrealtors.com',
      phone: '+92 312 9991100',
      whatsapp: '+923129991100',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      position: 'Development & Master-Planned Communities Specialist',
      bio: 'Expertise in Bahria Town, Eighteen Islamabad, and Park View City developments. Guiding investors through pre-launch phases, plots, and constructed villas.',
      experienceYears: 10,
      specialization: 'Master-Planned Communities & Land Investments',
      socialLinks: {
        linkedin: 'https://linkedin.com',
        facebook: 'https://facebook.com'
      },
      propertiesCount: 22,
      rating: 4.9,
      reviewsCount: 34,
      createdAt: '2024-05-20T00:00:00.000Z'
    }
  ];

  const properties: IProperty[] = [
    {
      id: 'prop-1',
      title: 'The Margalla Horizon Estate - 2 Kanal Architectural Mansion',
      slug: 'the-margalla-horizon-estate-f6-islamabad',
      description: 'An exceptional custom-built modern architectural masterwork nestled on the premier hills of Sector F-6/3, Islamabad. Featuring panoramic Margalla Hills vistas, double-height Italian marble grand foyer, imported German Poggenpohl kitchen, indoor climate-controlled infinity pool, rooftop entertainment deck, and full automated smart-home infrastructure.',
      price: 340000000, // PKR 34 Crore
      priceUsd: 1220000,
      currency: 'PKR',
      location: 'Sector F-6/3, Islamabad',
      address: 'Street 18, Sector F-6/3',
      city: 'Islamabad',
      propertyType: 'Mansion',
      listingType: 'Buy',
      bedrooms: 6,
      bathrooms: 8,
      area: 9000,
      areaUnit: 'sq ft',
      yearBuilt: 2024,
      featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Private Swimming Pool',
        'Smart Home Automation',
        'Generator Backup 50kVA',
        'Basement Cinema / Theater',
        'Gymnasium & Sauna',
        'Servant Quarters (2)',
        'Guard Room & CCTV 360',
        'Landscaped Garden with Pergola'
      ],
      features: [
        'Solid Burma Teak Woodwork',
        'Double Glazed Thermal Windows',
        'Underfloor Heating in Master Suites',
        'Central VRF Climate Control',
        'Solar Power System 30kW',
        'Covered Garage for 4 Cars'
      ],
      status: 'Available',
      isFeatured: true,
      agentId: 'agent-1',
      agentName: 'Tariq Malik',
      agentPhone: '+92 321 5550192',
      agentEmail: 'tariq.malik@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 33.7294, lng: 73.0768 },
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-02-10T00:00:00.000Z'
    },
    {
      id: 'prop-2',
      title: 'Royal Palms Grand Villa - 1 Kanal Designer Residence',
      slug: 'royal-palms-grand-villa-dha-phase-5-lahore',
      description: 'Sophisticated contemporary 1 Kanal residence located in the heart of DHA Phase 5, Lahore. Highlights include open-concept living salons, Spanish porcelain flooring, high-end chef kitchen, terrace lounge with outdoor fireplace, and private elevator servicing all levels.',
      price: 135000000, // PKR 13.5 Crore
      priceUsd: 485000,
      currency: 'PKR',
      location: 'DHA Phase 5, Lahore',
      address: 'Sector C, DHA Phase 5',
      city: 'Lahore',
      propertyType: 'Villa',
      listingType: 'Buy',
      bedrooms: 5,
      bathrooms: 6,
      area: 4500,
      areaUnit: 'sq ft',
      yearBuilt: 2023,
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Private Elevator',
        'Lush Courtyard Garden',
        'Inverter Air Conditioners Throughout',
        'Standby Solar System 20kW',
        'Modern Dirty & Main Kitchens',
        'High-Speed Fiber Ready'
      ],
      features: [
        'Imported Grohe & Kohler Sanitary',
        'Ash Wood Paneling',
        'Thermal Insulation',
        '3-Car Secured Porch'
      ],
      status: 'Available',
      isFeatured: true,
      agentId: 'agent-2',
      agentName: 'Ayesha Rahman',
      agentPhone: '+92 333 4440188',
      agentEmail: 'ayesha.rahman@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 31.4697, lng: 74.3986 },
      createdAt: '2025-01-20T00:00:00.000Z',
      updatedAt: '2025-02-14T00:00:00.000Z'
    },
    {
      id: 'prop-3',
      title: 'Oceanfront Sky Penthouse - Coral Towers Clifton',
      slug: 'oceanfront-sky-penthouse-clifton-karachi',
      description: 'An elite 4-Bedroom duplex sky penthouse perched on the 28th & 29th floors of Coral Towers in Clifton, Karachi. Offering 360-degree Arabian Sea and city skyline vistas, floor-to-ceiling glass walls, expansive private sea-facing terrace with plunge jacuzzi, and concierge reception.',
      price: 210000000, // PKR 21 Crore
      priceUsd: 755000,
      currency: 'PKR',
      location: 'Block 2, Clifton, Karachi',
      address: 'Marine Drive, Block 2 Clifton',
      city: 'Karachi',
      propertyType: 'Penthouse',
      listingType: 'Buy',
      bedrooms: 4,
      bathrooms: 5,
      area: 6200,
      areaUnit: 'sq ft',
      yearBuilt: 2024,
      featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Unobstructed Sea View',
        'Terrace Plunge Jacuzzi',
        '24/7 Concierge & Valet',
        'Designated 3 Basement Parkings',
        'Infinity Sky Pool & Fitness Center',
        'Full 100% Redundant Power'
      ],
      features: [
        'Private Keycard Elevator Access',
        'Italian Poliform Wardrobes',
        'Soundproof Acoustic Glass',
        'Dedicated Butler Quarters'
      ],
      status: 'Available',
      isFeatured: true,
      agentId: 'agent-3',
      agentName: 'Zaryab Farooq',
      agentPhone: '+92 300 8887711',
      agentEmail: 'zaryab.farooq@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 24.8138, lng: 67.0309 },
      createdAt: '2025-01-22T00:00:00.000Z',
      updatedAt: '2025-02-18T00:00:00.000Z'
    },
    {
      id: 'prop-4',
      title: 'Diplomatic Enclave Residence - Fully Furnished Luxury Villa',
      slug: 'diplomatic-enclave-furnished-villa-f7-islamabad',
      description: 'Exclusively available for diplomatic and high-profile corporate lease. This luxury 1.5 Kanal furnished villa in Sector F-7/2 features bullet-resistant secure perimeter, bespoke imported Italian furnishings, central HVAC, sprawling lawn, and diplomatic grade security setup.',
      price: 1800000, // PKR 18 Lakh / Month
      priceUsd: 6500,
      currency: 'PKR',
      location: 'Sector F-7/2, Islamabad',
      address: 'Main Parbat Road, F-7/2',
      city: 'Islamabad',
      propertyType: 'Villa',
      listingType: 'Rent',
      bedrooms: 5,
      bathrooms: 6,
      area: 6800,
      areaUnit: 'sq ft',
      yearBuilt: 2022,
      featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Fully Furnished Luxury Decor',
        '24/7 Security Guard Cabin',
        '30kVA Silent Diesel Generator',
        'Large Landscaped Garden',
        'Barbeque Gazebo',
        'Water Filtration Plant'
      ],
      features: [
        'Diplomatic Security Clearances',
        'Central Heating & AC',
        '2 Servant Rooms with Bath',
        'Covered Parking for 4 SUVs'
      ],
      status: 'Available',
      isFeatured: true,
      agentId: 'agent-4',
      agentName: 'Fatima Al-Hassan',
      agentPhone: '+92 345 7772233',
      agentEmail: 'fatima.hassan@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 33.7215, lng: 73.0566 },
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-15T00:00:00.000Z'
    },
    {
      id: 'prop-5',
      title: 'Gulberg Greens Modernist Farmhouse Estate - 4 Kanal',
      slug: 'gulberg-greens-modernist-farmhouse-islamabad',
      description: 'A breathtaking 4-Kanal country farmhouse in Executive Block, Gulberg Greens Islamabad. Blending clean Scandinavian minimalism with expansive manicured orchards, heated outdoor pool, glass-walled barbecue pavilion, and equestrian paddocks nearby.',
      price: 280000000, // PKR 28 Crore
      priceUsd: 1005000,
      currency: 'PKR',
      location: 'Executive Block, Gulberg Greens, Islamabad',
      address: 'Farmhouse Avenue 4, Gulberg Greens',
      city: 'Islamabad',
      propertyType: 'Mansion',
      listingType: 'Buy',
      bedrooms: 6,
      bathrooms: 7,
      area: 18000,
      areaUnit: 'sq ft',
      yearBuilt: 2024,
      featuredImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600573472591-ee6c563aaec9?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        '4 Kanal Gated Private Grounds',
        'Heated Swimming Pool & Deck',
        'Organic Fruit Orchard',
        'Staff Residence Annexe',
        'Full Solar Microgrid (40kW)',
        'Gourmet Outdoor Kitchen'
      ],
      features: [
        'Architectural Cantilever Roofs',
        'Imported Marble & Hardwood',
        'Smart Irrigation System',
        'High Perimeter Security'
      ],
      status: 'Available',
      isFeatured: true,
      agentId: 'agent-1',
      agentName: 'Tariq Malik',
      agentPhone: '+92 321 5550192',
      agentEmail: 'tariq.malik@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 33.5989, lng: 73.1558 },
      createdAt: '2025-02-05T00:00:00.000Z',
      updatedAt: '2025-02-19T00:00:00.000Z'
    },
    {
      id: 'prop-6',
      title: 'Eighteen Heights Luxury Executive Apartment',
      slug: 'eighteen-heights-luxury-apartment-islamabad',
      description: 'Exclusive 3-Bedroom residence within the Eighteen master community. Overlooking the championship 18-hole golf course, offering resort-level club amenities, 24-hour concierge, private balcony, and European fixtures.',
      price: 68000000, // PKR 6.8 Crore
      priceUsd: 245000,
      currency: 'PKR',
      location: 'Eighteen, Kashmir Highway, Islamabad',
      address: 'Heights Tower B, Eighteen Islamabad',
      city: 'Islamabad',
      propertyType: 'Apartment',
      listingType: 'Buy',
      bedrooms: 3,
      bathrooms: 4,
      area: 2850,
      areaUnit: 'sq ft',
      yearBuilt: 2023,
      featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Golf Course Frontage',
        'Clubhouse Access',
        'Championship Tennis Courts',
        'Kids Play Zone',
        'Underground Assigned Parking',
        'High-Speed Elevators'
      ],
      features: [
        'Miele Kitchen Appliances',
        'Marble Finishes',
        'Central Chilled Water System',
        'Round-the-Clock Gated Security'
      ],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-5',
      agentName: 'Bilal Qureshi',
      agentPhone: '+92 312 9991100',
      agentEmail: 'bilal.qureshi@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 33.6111, lng: 72.8944 },
      createdAt: '2025-02-08T00:00:00.000Z',
      updatedAt: '2025-02-18T00:00:00.000Z'
    },
    {
      id: 'prop-7',
      title: 'Gulberg Corporate Tower - Grade-A Commercial Floor',
      slug: 'gulberg-corporate-tower-grade-a-office-lahore',
      description: 'Full-floor prime commercial corporate headquarters in Main Boulevard Gulberg, Lahore. Designed for multinational enterprises, IT hubs, and financial institutions with LEED certified specifications, raised flooring, and panoramic urban views.',
      price: 195000000, // PKR 19.5 Crore
      priceUsd: 700000,
      currency: 'PKR',
      location: 'Main Boulevard, Gulberg III, Lahore',
      address: 'Tower 9, Main Boulevard Gulberg',
      city: 'Lahore',
      propertyType: 'Commercial',
      listingType: 'Buy',
      bedrooms: 0,
      bathrooms: 4,
      area: 7500,
      areaUnit: 'sq ft',
      yearBuilt: 2024,
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Grade-A Commercial Certification',
        'High-Speed OTIS Elevators (6)',
        '30 Dedicated Parking Bays',
        'Fiber-Optic Dual Ring',
        'Building Management System',
        'Fire Sprinkler & Smoke Detection'
      ],
      features: [
        'Column-Free Flexible Floorplate',
        'Double Glazed Low-E Glass',
        '100% Generator Backup Dual Genset',
        'Cafeteria & Conference Suites'
      ],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-2',
      agentName: 'Ayesha Rahman',
      agentPhone: '+92 333 4440188',
      agentEmail: 'ayesha.rahman@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 31.5152, lng: 74.3468 },
      createdAt: '2025-02-10T00:00:00.000Z',
      updatedAt: '2025-02-19T00:00:00.000Z'
    },
    {
      id: 'prop-8',
      title: 'Bahria Town Safari Valley Luxury Designer Villa',
      slug: 'bahria-town-safari-villa-rawalpindi',
      description: 'Elegant 10 Marla designer residence in Safari Valley, Bahria Town Rawalpindi. Move-in ready with modern wooden kitchen, private media room, rooftop terrace with scenic green views, and 24/7 Bahria security.',
      price: 650000, // PKR 6.5 Lakh / Month rent
      priceUsd: 2350,
      currency: 'PKR',
      location: 'Safari Valley, Phase 8, Bahria Town, Rawalpindi',
      address: 'Safari 3, Sector D, Bahria Town',
      city: 'Rawalpindi',
      propertyType: 'Villa',
      listingType: 'Rent',
      bedrooms: 4,
      bathrooms: 5,
      area: 3200,
      areaUnit: 'sq ft',
      yearBuilt: 2023,
      featuredImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Bahria Gated Security',
        'Underground Electricity',
        'Community Park Facing',
        'Servant Room with Washroom',
        'Water Tank & Booster Pump'
      ],
      features: [
        'Contemporary False Ceilings',
        'Tempered Glass Shower Cubicles',
        'Solar Water Heater Installed',
        'Covered Car Garage'
      ],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-5',
      agentName: 'Bilal Qureshi',
      agentPhone: '+92 312 9991100',
      agentEmail: 'bilal.qureshi@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 33.5135, lng: 73.1098 },
      createdAt: '2025-02-11T00:00:00.000Z',
      updatedAt: '2025-02-17T00:00:00.000Z'
    },
    {
      id: 'prop-9',
      title: 'Emaar Oceanfront Coral Beachfront Residence',
      slug: 'emaar-oceanfront-coral-residence-karachi',
      description: 'Luxury 3-Bedroom ocean-facing apartment in Emaar Oceanfront Karachi. Direct beach access, infinity pool, fitness center, signature concierge, and world-class retail promenade.',
      price: 850000, // PKR 8.5 Lakh / Month
      priceUsd: 3050,
      currency: 'PKR',
      location: 'Emaar Oceanfront, Phase 8 DHA, Karachi',
      address: 'Coral Tower 2, Emaar Crescent Bay',
      city: 'Karachi',
      propertyType: 'Apartment',
      listingType: 'Rent',
      bedrooms: 3,
      bathrooms: 4,
      area: 2600,
      areaUnit: 'sq ft',
      yearBuilt: 2024,
      featuredImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Direct Private Beachfront',
        'Resort Infinity Pool',
        'Health Club & Spa',
        'Kids Splash Park',
        '24/7 Security & CCTV',
        'Dedicated Car Parking'
      ],
      features: [
        'Floor-to-Ceiling Sea Glass',
        'German Hansgrohe Fittings',
        'Built-in Wardrobes',
        'Maid’s Room with Attached Bath'
      ],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-3',
      agentName: 'Zaryab Farooq',
      agentPhone: '+92 300 8887711',
      agentEmail: 'zaryab.farooq@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 24.7869, lng: 67.0655 },
      createdAt: '2025-02-12T00:00:00.000Z',
      updatedAt: '2025-02-20T00:00:00.000Z'
    },
    {
      id: 'prop-10',
      title: 'Lake City Golf Estate - 1 Kanal Spanish Luxury Villa',
      slug: 'lake-city-golf-estate-spanish-villa-lahore',
      description: 'Charming 1 Kanal Spanish-inspired masterpiece in Sector M-7 Lake City Lahore. Overlooking lush fairways with terra cotta tiled accents, courtyard fountain, private basement lounge, and bespoke carpentry.',
      price: 118000000, // PKR 11.8 Crore
      priceUsd: 425000,
      currency: 'PKR',
      location: 'Sector M-7, Lake City, Raiwind Road, Lahore',
      address: 'Fairway Boulevard, Lake City',
      city: 'Lahore',
      propertyType: 'Villa',
      listingType: 'Buy',
      bedrooms: 5,
      bathrooms: 6,
      area: 4500,
      areaUnit: 'sq ft',
      yearBuilt: 2023,
      featuredImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Golf Course Views',
        'Community Country Club',
        'Underground Cabling',
        'Solar Inverter 15kW',
        'Gated Community 24/7 Patrol'
      ],
      features: [
        'Spanish Clay Roof Tiles',
        'Antique Brass Hardware',
        'Custom Oak Wine/Juice Cellar',
        'Covered 2-Car Porch'
      ],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-2',
      agentName: 'Ayesha Rahman',
      agentPhone: '+92 333 4440188',
      agentEmail: 'ayesha.rahman@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 31.3654, lng: 74.2482 },
      createdAt: '2025-02-14T00:00:00.000Z',
      updatedAt: '2025-02-20T00:00:00.000Z'
    },
    {
      id: 'prop-11',
      title: 'Sector E-11 Modern Townhouse Residence',
      slug: 'sector-e11-modern-townhouse-islamabad',
      description: 'Contemporary triplex 3-bedroom luxury townhouse located in Sector E-11/2 Islamabad with stunning views of the Margalla hills, private rooftop terrace garden, and smart security.',
      price: 52000000, // PKR 5.2 Crore
      priceUsd: 187000,
      currency: 'PKR',
      location: 'Sector E-11/2, Islamabad',
      address: 'Street 45, Sector E-11/2',
      city: 'Islamabad',
      propertyType: 'Townhouse',
      listingType: 'Buy',
      bedrooms: 3,
      bathrooms: 4,
      area: 2400,
      areaUnit: 'sq ft',
      yearBuilt: 2024,
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Rooftop BBQ Deck',
        'Solar Net Metering Ready',
        'Water Boring & CDA Supply',
        'Automated Gate'
      ],
      features: [
        'Italian Kitchen Fittings',
        'Tempered Glass Staircase',
        'LED Ambient Lighting'
      ],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-4',
      agentName: 'Fatima Al-Hassan',
      agentPhone: '+92 345 7772233',
      agentEmail: 'fatima.hassan@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 33.6991, lng: 72.9798 },
      createdAt: '2025-02-15T00:00:00.000Z',
      updatedAt: '2025-02-21T00:00:00.000Z'
    },
    {
      id: 'prop-12',
      title: 'Prime 1 Kanal Residential Plot - DHA Phase 2 Islamabad',
      slug: 'prime-1-kanal-plot-dha-phase-2-islamabad',
      description: 'Exceptional level 1 Kanal residential corner plot in Sector B, DHA Phase 2 Islamabad. Boulevard facing, close to central commercial hub, parks, and world-class educational institutions. Fully cleared title with possession available.',
      price: 58000000, // PKR 5.8 Crore
      priceUsd: 208000,
      currency: 'PKR',
      location: 'Sector B, DHA Phase 2, Islamabad',
      address: 'Main Boulevard, Sector B DHA Phase 2',
      city: 'Islamabad',
      propertyType: 'Plot',
      listingType: 'Buy',
      bedrooms: 0,
      bathrooms: 0,
      area: 4500,
      areaUnit: 'sq ft',
      yearBuilt: 2025,
      featuredImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80'
      ],
      amenities: [
        'Corner Plot with Wide Road Access',
        'Underground Utilities (Gas, Water, Power)',
        'Immediate Construction Possession',
        'DHA Security & Transfer Guarantee'
      ],
      features: [
        'Direct Access from GT Road & Expressway',
        'Scenic Mountain Views',
        'Ready for Immediate Transfer'
      ],
      status: 'Available',
      isFeatured: false,
      agentId: 'agent-1',
      agentName: 'Tariq Malik',
      agentPhone: '+92 321 5550192',
      agentEmail: 'tariq.malik@growthrealtors.com',
      agentImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      coordinates: { lat: 33.5284, lng: 73.1611 },
      createdAt: '2025-02-16T00:00:00.000Z',
      updatedAt: '2025-02-21T00:00:00.000Z'
    }
  ];

  const blogPosts: IBlogPost[] = [
    {
      id: 'blog-1',
      title: 'Top High-Yield Real Estate Investment Locations in Pakistan for 2025 & 2026',
      slug: 'top-real-estate-investment-locations-pakistan-2025-2026',
      excerpt: 'An in-depth market analysis on capital appreciation hotspots, rental yields across Islamabad sectors, DHA developments, and high-rise commercial corridors.',
      content: `## Capitalizing on Pakistan's Prime Real Estate Corridor

Pakistan’s luxury and prime residential real estate sector continues to demonstrate resilient performance as both local investors and overseas Pakistanis seek tangible, inflation-hedged wealth preservation.

### 1. Islamabad: Sectors F-6, F-7, and Eighteen
Islamabad remains the prime destination for high-end luxury estates and diplomatic grade rentals. With finite land inventory in the Margalla-facing sectors (F-6, F-7, E-7), capital appreciation has consistently outpaced general indices. Concurrently, master-planned developments like Eighteen offer international standard living with golf-course views and integrated utilities.

### 2. Lahore: DHA Phases 5, 6, 8 & Commercial Hubs
Lahore's DHA expansion corridors have proven to be the bedrock of reliable rental yields. Commercial avenues in Gulberg and Phase 6 Main Boulevards are generating 7% to 9% annual yields from corporate tenants.

### 3. Coastal Luxury: Karachi Emaar Oceanfront & Clifton
For waterfront living, Emaar Oceanfront in DHA Phase 8 Karachi is setting benchmarks with seamless security, beach access, and international facilities.

### Key Advisory Tips:
- Verify CDA/RDA/LDA approval and clear title deeds prior to token transfer.
- Look for solar microgrid and dedicated backup power infrastructure.
- Partner with certified Growth Realtors advisors for discreet transaction management.`,
      featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Tariq Malik',
        role: 'Senior Managing Director',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      },
      category: 'Investment',
      tags: ['Investment', 'Islamabad', 'Lahore', 'Market Trends'],
      readTime: '6 min read',
      published: true,
      createdAt: '2025-01-18T10:00:00.000Z',
      updatedAt: '2025-02-10T10:00:00.000Z'
    },
    {
      id: 'blog-2',
      title: 'The Ultimate Guide to Buying Luxury Property in Islamabad as an Overseas Pakistani',
      slug: 'guide-buying-luxury-property-islamabad-overseas-pakistanis',
      excerpt: 'Everything you need to know about Roshan Digital Account transfers, power of attorney procedures, verified title checks, and tax guidelines.',
      content: `## A Seamless Guide for Overseas Investors

Investing in Pakistani real estate from abroad has never been more streamlined, thanks to digital banking innovations and regulated advisory firms.

### Roshan Digital Account (RDA) Benefits
Through RDA, overseas Pakistanis can execute repatriable real estate investments directly from abroad. This gives investors full peace of mind regarding currency conversion, legal compliance, and tax withholding documentation.

### The Due Diligence Checklist
1. **Title Verification**: Ensuring the property is free of encumbrance, mortgage liens, or litigation.
2. **Authority NOC**: Verifying No Objection Certificates from CDA (Capital Development Authority), DHA, or Bahria Town authorities.
3. **Special Power of Attorney (SPA)**: If you cannot physically attend registry transfer, executing an attested SPA through the Pakistani Embassy or Consulate.

Growth Realtors provides end-to-end concierge representation, including live video walkthroughs, structural surveys, and notary escrow coordination.`,
      featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Ayesha Rahman',
        role: 'Principal Luxury Consultant',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      },
      category: 'Buying Guide',
      tags: ['Overseas Pakistanis', 'Buying Guide', 'Legal', 'RDA'],
      readTime: '7 min read',
      published: true,
      createdAt: '2025-01-25T14:00:00.000Z',
      updatedAt: '2025-02-12T14:00:00.000Z'
    },
    {
      id: 'blog-3',
      title: 'Architectural Trends: Modernist Farmhouses vs. Contemporary High-Rise Living',
      slug: 'architectural-trends-modernist-farmhouses-vs-high-rise-living',
      excerpt: 'Exploring the growing demand for sprawling farm estates in Gulberg Greens and Chak Shahzad versus low-maintenance luxury penthouses in urban centers.',
      content: `## The Modernist Architectural Renaissance

Homebuyers are increasingly prioritizing wellness, biophilic design, and private green sanctuary spaces.

### The Farmhouse Resurgence
Areas like Gulberg Greens, Chak Shahzad, and Bedian Road Lahore have transformed from weekend getaways into primary family residences. Features such as floor-to-ceiling glass pavilions, private solar microgrids, organic orchards, and indoor heated lap pools provide an escape from urban congestion without sacrificing connectivity.

### The Allure of Sky Penthouses
Meanwhile, busy executives and expatriates favor high-rise penthouses in Clifton Karachi and Gulberg Lahore. Unmatched security, concierge services, breathtaking skyline vistas, and lock-and-leave convenience make vertical luxury living a prime choice.

Both lifestyle archetypes represent the pinnacle of bespoke living in modern Pakistan.`,
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Fatima Al-Hassan',
        role: 'Architectural Advisor',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
      },
      category: 'Luxury Living',
      tags: ['Architecture', 'Luxury Living', 'Farmhouses', 'Penthouses'],
      readTime: '5 min read',
      published: true,
      createdAt: '2025-02-02T11:00:00.000Z',
      updatedAt: '2025-02-15T11:00:00.000Z'
    },
    {
      id: 'blog-4',
      title: 'How to Price and Stage Your Property for a Record-Setting Sale',
      slug: 'how-to-price-and-stage-property-for-record-sale',
      excerpt: 'Expert staging methodologies, professional photography insights, and strategic pricing models to attract serious high-value buyers.',
      content: `## Maximizing Your Property Value in the Luxury Market

Selling a multi-crore property requires an artful combination of psychological presentation and analytical market positioning.

### 1. Professional Architectural Photography & 3D Tours
First impressions occur online. Over 90% of prime property buyers explore high-resolution photo galleries and video walkthroughs before requesting an in-person viewing. Highlighting evening lighting, landscaping, and premium marble finishes commands immediate authority.

### 2. Neutralizing and Decluttering
High-net-worth buyers want to envision their own lifestyle in the space. Neutral palette styling, removal of personal clutter, and accentuating natural daylight instantly increases perceived square footage.

### 3. Precision Pricing Strategy
Overpricing causes listings to grow stale, while underpricing leaves significant equity on the table. Our Growth Realtors comparative market analysis (CMA) models active comp listings and verified historical registry transfers to price your asset for maximum velocity and return.`,
      featuredImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Zaryab Farooq',
        role: 'Commercial Lead',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'
      },
      category: 'Home Architecture',
      tags: ['Selling', 'Staging', 'Valuation', 'Tips'],
      readTime: '5 min read',
      published: true,
      createdAt: '2025-02-06T09:00:00.000Z',
      updatedAt: '2025-02-16T09:00:00.000Z'
    },
    {
      id: 'blog-5',
      title: 'Commercial Real Estate Trends: High-Yield IT Parks & Grade-A Offices',
      slug: 'commercial-real-estate-trends-it-parks-grade-a-offices',
      excerpt: 'Why institutional investors and corporate funds are acquiring Grade-A office floors and commercial retail spaces in Lahore and Islamabad.',
      content: `## The Boom in Corporate Commercial Assets

With the rapid expansion of technology conglomerates, multinational consultancies, and flexible co-working spaces, the demand for Grade-A commercial real estate is outstripping existing supply in metropolitan centers.

### What Defines Grade-A Commercial Real Estate?
- Centralized Building Management Systems (BMS)
- Redundant dual power grids (100% backup generators)
- Multi-tier vehicle parking facilities with EV charging stations
- High-efficiency HVAC chillers and LEED green building standards

Investors enjoying long-term 5 to 10 year lease contracts with corporate tenants secure consistent indexed rental increases and hedge against macroeconomic volatility.`,
      featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Bilal Qureshi',
        role: 'Development Specialist',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      category: 'Market Trends',
      tags: ['Commercial', 'Office', 'Investment', 'Yield'],
      readTime: '6 min read',
      published: true,
      createdAt: '2025-02-10T12:00:00.000Z',
      updatedAt: '2025-02-18T12:00:00.000Z'
    },
    {
      id: 'blog-6',
      title: 'Rental Mastery: How Landlords Can Attain 100% Occupancy with Diplomatic Tenants',
      slug: 'rental-mastery-diplomatic-tenants-islamabad-lahore',
      excerpt: 'Key amenities, security standards, and lease documentation required to attract embassies, international NGOs, and senior corporate executives.',
      content: `## Attracting High-Tier Diplomatic and Corporate Tenants

Diplomatic and multinational leases in Islamabad Sectors F-6, F-7, E-7 and Lahore DHA represent the gold standard of residential tenancy: guaranteed prompt rental disbursements, meticulous property care, and long-term lease commitments.

### Essential Tenant Requirements:
1. **Security & Perimeter**: Raised boundary walls, CCTV coverage, security guard quarters, and shatterproof window treatments.
2. **Turnkey Luxury Furnishings**: Modern minimalist Italian furnishings, branded appliances (refrigerator, dishwasher, washer/dryer, oven), and high-speed Wi-Fi readiness.
3. **Uninterrupted Power**: 20kVA to 40kVA soundproof generator and solar inverter system with automated changeover switches.
4. **Maintenance SLA**: Responsive 24-hour maintenance team for plumbing, electrical, and HVAC servicing.

Growth Realtors manages the entire lease lifecycle, from tenant vetting and diplomatic clause drafting to ongoing property management.`,
      featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Fatima Al-Hassan',
        role: 'Rental Specialist',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
      },
      category: 'Rental Advice',
      tags: ['Rentals', 'Diplomatic Leases', 'Property Management', 'Islamabad'],
      readTime: '4 min read',
      published: true,
      createdAt: '2025-02-12T15:00:00.000Z',
      updatedAt: '2025-02-19T15:00:00.000Z'
    }
  ];

  const testimonials: ITestimonial[] = [
    {
      id: 'test-1',
      clientName: 'Senator (Retd.) Tariq Aziz',
      clientTitle: 'Former Ambassador & Diplomat',
      clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review: 'Growth Realtors handled the acquisition of our 2 Kanal estate in Sector F-6 with unmatched discretion and professionalism. Tariq Malik and his team ensured complete legal transparency and arranged swift CDA transfer within days. They are true masters of luxury real estate.',
      propertyType: 'Mansion in Sector F-6, Islamabad',
      location: 'Islamabad',
      transactionType: 'Bought',
      createdAt: '2025-01-20T00:00:00.000Z'
    },
    {
      id: 'test-2',
      clientName: 'Dr. Sarah Farhan & Farhan Siddiqui',
      clientTitle: 'Overseas Healthcare Executives (London, UK)',
      clientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review: 'Living in London, investing in DHA Lahore felt daunting until we partnered with Ayesha Rahman. From virtual 4K video inspections to power of attorney processing and tenant placement, Growth Realtors delivered a flawless experience. Our rental yield is exceptional!',
      propertyType: '1 Kanal Luxury Villa in DHA Phase 5, Lahore',
      location: 'Lahore',
      transactionType: 'Investment',
      createdAt: '2025-01-28T00:00:00.000Z'
    },
    {
      id: 'test-3',
      clientName: 'Kamran Jaffery',
      clientTitle: 'CEO, Nexus Global Technologies',
      clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review: 'We required a full floor Grade-A corporate office in Gulberg Lahore with specific redundant power requirements. Growth Realtors negotiated prime terms and closed the deal in record time. Highly recommended for commercial portfolios.',
      propertyType: 'Grade-A Commercial Headquarters, Gulberg III',
      location: 'Lahore',
      transactionType: 'Bought',
      createdAt: '2025-02-04T00:00:00.000Z'
    },
    {
      id: 'test-4',
      clientName: 'Mariam & Daniyal Hashmi',
      clientTitle: 'Architectural Designers & Private Investors',
      clientImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review: 'When selling our customized farmhouse in Gulberg Greens, we needed a firm that understood high-end architecture and could reach pre-qualified buyers. Growth Realtors staged the property brilliantly and achieved 98% of our asking price.',
      propertyType: '4 Kanal Farmhouse in Gulberg Greens, Islamabad',
      location: 'Islamabad',
      transactionType: 'Sold',
      createdAt: '2025-02-10T00:00:00.000Z'
    },
    {
      id: 'test-5',
      clientName: 'Rehan Merchant',
      clientTitle: 'Managing Partner, Merchant & Sons Capital',
      clientImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      review: 'Zaryab Farooq guided us through the acquisition of a duplex penthouse in Coral Towers Clifton. The sea views are magnificent and the closing was handled with absolute confidentiality and precision.',
      propertyType: 'Oceanfront Sky Penthouse, Clifton Karachi',
      location: 'Karachi',
      transactionType: 'Bought',
      createdAt: '2025-02-14T00:00:00.000Z'
    }
  ];

  return {
    users,
    properties,
    agents,
    blogPosts,
    testimonials
  };
}
