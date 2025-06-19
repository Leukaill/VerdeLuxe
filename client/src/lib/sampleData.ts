// Sample plant data for demonstration
export const samplePlants = [
  {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    slug: "monstera-deliciosa",
    description: "The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a stunning tropical houseplant known for its large, glossy leaves with natural splits and holes.",
    price: 89.99,
    categoryId: "tropical",
    imageUrls: [
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800",
      "https://images.unsplash.com/photo-1509937528-f993b3dafb37?w=800"
    ],
    stock: 25,
    featured: true,
    tags: ["tropical", "low-light", "air-purifying"],
    careInstructions: "Water when top inch of soil is dry. Bright, indirect light.",
    lightRequirement: "Bright, indirect light",
    wateringFrequency: "Weekly",
    difficultyLevel: "Easy",
    rating: 4.8,
    reviewCount: 124,
    threeDModelUrl: "/models/monstera.glb",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    slug: "fiddle-leaf-fig",
    description: "The Fiddle Leaf Fig is a popular houseplant with large, violin-shaped leaves that make a bold statement in any room.",
    price: 129.99,
    categoryId: "tropical",
    imageUrls: [
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800"
    ],
    stock: 15,
    featured: true,
    tags: ["tropical", "statement", "large"],
    careInstructions: "Water when top 2 inches of soil are dry. Bright, indirect light.",
    lightRequirement: "Bright, indirect light",
    wateringFrequency: "Bi-weekly",
    difficultyLevel: "Intermediate",
    rating: 4.6,
    reviewCount: 89,
    threeDModelUrl: "/models/fiddle-leaf.glb",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    slug: "snake-plant",
    description: "Also known as Sansevieria, this hardy plant is perfect for beginners with its striking upright leaves and incredible resilience.",
    price: 45.99,
    categoryId: "succulent",
    imageUrls: [
      "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800",
      "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800"
    ],
    stock: 40,
    featured: true,
    tags: ["succulent", "low-light", "beginner-friendly", "air-purifying"],
    careInstructions: "Water sparingly, once every 2-3 weeks. Tolerates low light.",
    lightRequirement: "Low to bright light",
    wateringFrequency: "Bi-weekly to monthly",
    difficultyLevel: "Very Easy",
    rating: 4.9,
    reviewCount: 156,
    threeDModelUrl: "/models/snake-plant.glb",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    slug: "peace-lily",
    description: "Elegant white flowers and glossy green leaves make the Peace Lily a beautiful addition to any home or office space.",
    price: 65.99,
    categoryId: "flowering",
    imageUrls: [
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
      "https://images.unsplash.com/photo-1469796466635-455ede028aca?w=800"
    ],
    stock: 30,
    featured: false,
    tags: ["flowering", "air-purifying", "low-light"],
    careInstructions: "Keep soil consistently moist. Bright, indirect light preferred.",
    lightRequirement: "Low to medium light",
    wateringFrequency: "2-3 times per week",
    difficultyLevel: "Easy",
    rating: 4.7,
    reviewCount: 78,
    threeDModelUrl: "/models/peace-lily.glb",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "rubber-plant",
    name: "Rubber Plant",
    slug: "rubber-plant",
    description: "The Rubber Plant features thick, glossy leaves and can grow into an impressive indoor tree with proper care.",
    price: 79.99,
    categoryId: "tropical",
    imageUrls: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800"
    ],
    stock: 20,
    featured: false,
    tags: ["tropical", "large", "statement"],
    careInstructions: "Water when top inch of soil is dry. Bright, indirect light.",
    lightRequirement: "Bright, indirect light",
    wateringFrequency: "Weekly",
    difficultyLevel: "Easy",
    rating: 4.5,
    reviewCount: 92,
    threeDModelUrl: "/models/rubber-plant.glb",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "pothos",
    name: "Golden Pothos",
    slug: "pothos",
    description: "This trailing vine with heart-shaped leaves is perfect for hanging baskets or climbing up moss poles.",
    price: 29.99,
    categoryId: "tropical",
    imageUrls: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
      "https://images.unsplash.com/photo-1664302926355-2bb74e4d9b1d?w=800"
    ],
    stock: 50,
    featured: true,
    tags: ["tropical", "trailing", "air-purifying", "beginner-friendly"],
    careInstructions: "Very forgiving. Water when soil feels dry. Low to bright light.",
    lightRequirement: "Low to bright light",
    wateringFrequency: "Weekly",
    difficultyLevel: "Very Easy",
    rating: 4.8,
    reviewCount: 203,
    threeDModelUrl: "/models/pothos.glb",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const sampleCategories = [
  {
    id: "tropical",
    name: "Tropical Plants",
    slug: "tropical",
    description: "Lush tropical plants that bring paradise indoors",
    imageUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=800",
    createdAt: new Date().toISOString()
  },
  {
    id: "succulent",
    name: "Succulents",
    slug: "succulent",
    description: "Low-maintenance plants perfect for busy lifestyles",
    imageUrl: "https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=800",
    createdAt: new Date().toISOString()
  },
  {
    id: "flowering",
    name: "Flowering Plants",
    slug: "flowering",
    description: "Beautiful blooms that add color to your space",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    createdAt: new Date().toISOString()
  }
];