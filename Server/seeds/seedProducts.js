require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const productSeedData = [
  {
    title: "Noir Meridian Tailored Blazer",
    brand: "Avi Atelier",
    description:
      "Structured wool-blend blazer with soft satin lining, crafted for formal evenings and premium office styling.",
    mainImg:
      "https://images.unsplash.com/photo-1594938328870-9623159c8c99?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Outerwear",
    gender: "men",
    sizes: ["S", "M", "L", "XL"],
    price: 8999,
    discount: 12,
    rating: 4.8,
    ratingsCount: 214,
    stock: 42,
    isActive: true,
  },
  {
    title: "Aether Knit Polo",
    brand: "Avi Core",
    description:
      "Premium breathable knit polo with textured finish and stretch comfort for smart-casual luxury.",
    mainImg:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Tops",
    gender: "men",
    sizes: ["S", "M", "L", "XL"],
    price: 3299,
    discount: 8,
    rating: 4.6,
    ratingsCount: 188,
    stock: 84,
    isActive: true,
  },
  {
    title: "Velour Signature Dress",
    brand: "Avi Femme",
    description:
      "Elegant mid-length premium dress with flowing drape and refined silhouette designed for statement occasions.",
    mainImg:
      "https://images.unsplash.com/photo-1566479179817-c0b5b4b4b06d?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Dresses",
    gender: "women",
    sizes: ["XS", "S", "M", "L"],
    price: 6499,
    discount: 15,
    rating: 4.9,
    ratingsCount: 301,
    stock: 33,
    isActive: true,
  },
  {
    title: "Sable Court Sneakers",
    brand: "Avi Motion",
    description:
      "Luxury leather sneakers with cushioned sole, minimal profile, and all-day support for premium streetwear.",
    mainImg:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Footwear",
    gender: "unisex",
    sizes: ["6", "7", "8", "9", "10", "11"],
    price: 5899,
    discount: 10,
    rating: 4.7,
    ratingsCount: 412,
    stock: 120,
    isActive: true,
  },
  {
    title: "Canyon Leather Weekender",
    brand: "Avi Heritage",
    description:
      "Hand-finished weekender duffle bag with premium leather body, brass hardware, and dedicated laptop sleeve.",
    mainImg:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Bags",
    gender: "unisex",
    sizes: ["Standard"],
    price: 11999,
    discount: 18,
    rating: 4.9,
    ratingsCount: 156,
    stock: 24,
    isActive: true,
  },
  {
    title: "Aurora Silk Scarf",
    brand: "Avi Femme",
    description:
      "Pure silk scarf with artistic gradient print and soft hand-feel crafted for versatile premium styling.",
    mainImg:
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Accessories",
    gender: "women",
    sizes: ["Standard"],
    price: 2499,
    discount: 5,
    rating: 4.5,
    ratingsCount: 98,
    stock: 70,
    isActive: true,
  },
  {
    title: "Vertex Chrono Watch",
    brand: "Avi Time",
    description:
      "Stainless steel chronograph watch with sapphire glass and premium matte strap for formal and casual wear.",
    mainImg:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Accessories",
    gender: "men",
    sizes: ["Standard"],
    price: 15499,
    discount: 14,
    rating: 4.8,
    ratingsCount: 239,
    stock: 29,
    isActive: true,
  },
  {
    title: "Summit Trail Jacket",
    brand: "Avi Expedition",
    description:
      "Performance outer jacket with weather-resistant shell, thermal comfort, and sleek premium fit.",
    mainImg:
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Outerwear",
    gender: "unisex",
    sizes: ["S", "M", "L", "XL"],
    price: 7299,
    discount: 11,
    rating: 4.7,
    ratingsCount: 267,
    stock: 55,
    isActive: true,
  },
  {
    title: "Luna Active Set",
    brand: "Avi Motion",
    description:
      "Two-piece activewear set with sculpted fit, moisture-wicking fabric, and premium movement comfort.",
    mainImg:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Activewear",
    gender: "women",
    sizes: ["XS", "S", "M", "L"],
    price: 4599,
    discount: 9,
    rating: 4.6,
    ratingsCount: 174,
    stock: 66,
    isActive: true,
  },
  {
    title: "Mini Orbit Hoodie",
    brand: "Avi Kids",
    description:
      "Soft premium cotton hoodie for kids with durable stitching and playful minimal aesthetic.",
    mainImg:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Tops",
    gender: "kids",
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    price: 2799,
    discount: 7,
    rating: 4.5,
    ratingsCount: 83,
    stock: 96,
    isActive: true,
  },
  {
    title: "Harbor Linen Shirt",
    brand: "Avi Core",
    description:
      "Premium linen shirt with lightweight weave and relaxed tailoring for refined summer layering.",
    mainImg:
      "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Tops",
    gender: "men",
    sizes: ["S", "M", "L", "XL"],
    price: 3599,
    discount: 6,
    rating: 4.4,
    ratingsCount: 141,
    stock: 74,
    isActive: true,
  },
  {
    title: "Ivory Pearl Handbag",
    brand: "Avi Femme",
    description:
      "Structured premium handbag with pearl hardware detailing and refined compartments for daily luxury.",
    mainImg:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Bags",
    gender: "women",
    sizes: ["Standard"],
    price: 9499,
    discount: 13,
    rating: 4.8,
    ratingsCount: 209,
    stock: 31,
    isActive: true,
  },
  {
    title: "Raven Selvedge Denim",
    brand: "Avi Core",
    description:
      "Premium selvedge denim with tapered silhouette, clean finishing, and comfort stretch for everyday luxury.",
    mainImg:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Bottoms",
    gender: "men",
    sizes: ["30", "32", "34", "36", "38"],
    price: 4299,
    discount: 9,
    rating: 4.6,
    ratingsCount: 167,
    stock: 78,
    isActive: true,
  },
  {
    title: "Seraphine Pleated Skirt",
    brand: "Avi Femme",
    description:
      "Elegant pleated midi skirt with fluid drape and premium fabric blend designed for polished movement.",
    mainImg:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Bottoms",
    gender: "women",
    sizes: ["XS", "S", "M", "L"],
    price: 4999,
    discount: 12,
    rating: 4.7,
    ratingsCount: 193,
    stock: 52,
    isActive: true,
  },
  {
    title: "Onyx Leather Loafers",
    brand: "Avi Heritage",
    description:
      "Handcrafted leather loafers with cushioned insole and minimalist profile for formal and smart-casual styling.",
    mainImg:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Footwear",
    gender: "men",
    sizes: ["7", "8", "9", "10", "11"],
    price: 7699,
    discount: 10,
    rating: 4.8,
    ratingsCount: 245,
    stock: 37,
    isActive: true,
  },
  {
    title: "Nimbus Performance Cap",
    brand: "Avi Motion",
    description:
      "Lightweight performance cap with breathable lining and moisture-wicking comfort for travel and workouts.",
    mainImg:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Accessories",
    gender: "unisex",
    sizes: ["Standard"],
    price: 1899,
    discount: 4,
    rating: 4.4,
    ratingsCount: 122,
    stock: 140,
    isActive: true,
  },
  {
    title: "Celeste Gold Hoop Set",
    brand: "Avi Femme",
    description:
      "Premium plated hoop earring set with lightweight finish and elegant shine for day-to-night outfits.",
    mainImg:
      "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Jewelry",
    gender: "women",
    sizes: ["Standard"],
    price: 3199,
    discount: 7,
    rating: 4.6,
    ratingsCount: 146,
    stock: 88,
    isActive: true,
  },
  {
    title: "Atlas Polarized Aviators",
    brand: "Avi Luxe",
    description:
      "Metal-frame polarized aviators with UV protection and premium lens clarity for city and coastal travel.",
    mainImg:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Accessories",
    gender: "unisex",
    sizes: ["Standard"],
    price: 5599,
    discount: 11,
    rating: 4.7,
    ratingsCount: 202,
    stock: 63,
    isActive: true,
  },
  {
    title: "Velvet Ember Eau De Parfum",
    brand: "Avi Essence",
    description:
      "Long-lasting premium fragrance with warm amber, cedarwood, and floral top notes in a signature bottle.",
    mainImg:
      "https://images.unsplash.com/photo-1595425964071-4b1524f4f70f?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Fragrance",
    gender: "unisex",
    sizes: ["50ml", "100ml"],
    price: 6899,
    discount: 13,
    rating: 4.8,
    ratingsCount: 218,
    stock: 41,
    isActive: true,
  },
  {
    title: "Kinetic Junior Runner",
    brand: "Avi Kids",
    description:
      "Premium lightweight kids running shoes with secure fit, soft cushioning, and durable non-slip outsole.",
    mainImg:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Footwear",
    gender: "kids",
    sizes: ["1", "2", "3", "4", "5"],
    price: 3399,
    discount: 6,
    rating: 4.5,
    ratingsCount: 97,
    stock: 108,
    isActive: true,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    const operations = productSeedData.map((product) => ({
      updateOne: {
        filter: { title: product.title },
        update: { $set: product },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(operations);
    console.log(
      `Products seeded successfully. Upserts: ${result.upsertedCount}, Modified: ${result.modifiedCount}`
    );
  } catch (error) {
    console.error(`Product seeding failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedProducts();
