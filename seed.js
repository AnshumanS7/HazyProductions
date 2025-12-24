require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        tags: { type: [String], default: [] },
        images: { type: [String], default: [] },
        fileKey: { type: String, required: true },
        mediaType: {
            type: String,
            enum: ['ebook', 'sfx', 'template'],
            required: true
        },
        previewUrl: { type: String },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const MONGODB_URI = process.env.MONGODB_URI;

const dummyProducts = [
    // --- SFX ---
    {
        title: "Cinematic Boom SFX Pack",
        description: "A collection of 50 high-impact boom sound effects for trailers and action scenes. Deep sub bass and crisp impacts.",
        price: 29.99,
        category: "SFX",
        tags: ["sfx", "trailer", "boom", "cinematic", "audio"],
        images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"],
        fileKey: "demo/boom-pack.zip",
        mediaType: "sfx",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        isFeatured: true,
    },
    {
        title: "Cyberpunk Glitch SFX",
        description: "Futuristic interface sounds, glitches, and data noise for sci-fi projects.",
        price: 19.99,
        category: "SFX",
        tags: ["sfx", "glitch", "cyberpunk", "sci-fi"],
        images: ["https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=2071&auto=format&fit=crop"],
        fileKey: "demo/glitch-sfx.zip",
        mediaType: "sfx",
        isFeatured: true,
    },
    {
        title: "Atmospheric Drones Vol. 1",
        description: "Eerie and emotional drone textures for horror and drama. 20 original looping tracks.",
        price: 24.99,
        category: "SFX",
        tags: ["sfx", "ambient", "drone", "horror", "music"],
        images: ["https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop"],
        fileKey: "demo/drones-vol1.zip",
        mediaType: "sfx",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        isFeatured: true,
    },
    {
        title: "4K Film Grain Overlays",
        description: "Authentic 35mm and 16mm film grain scans to give your digital footage a vintage cinematic look.",
        price: 34.99,
        category: "SFX",
        tags: ["overlay", "grain", "film", "cinematic"],
        images: ["https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"],
        fileKey: "demo/film-grain.zip",
        mediaType: "sfx",
        isFeatured: true,
    },

    // --- EBOOKS ---
    {
        title: "The Creator's Guide to Filmmaking",
        description: "Comprehensive ebook covering lighting, composition, and color grading for indie filmmakers. 200+ pages.",
        price: 19.99,
        category: "Ebooks",
        tags: ["education", "filmmaking", "ebook", "guide"],
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop"],
        fileKey: "demo/filmmaking-guide.pdf",
        mediaType: "ebook",
        isFeatured: false,
    },
    {
        title: "Mastering Color Grading",
        description: "Deep dive into color theory and practical grading techniques for Davinci Resolve. Includes practice footage access.",
        price: 24.99,
        category: "Ebooks",
        tags: ["color correction", "grading", "ebook", "davinci"],
        images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"],
        fileKey: "demo/color-grading.pdf",
        mediaType: "ebook",
        isFeatured: true,
    },
    {
        title: "Script to Screen: A Field Guide",
        description: "From pre-production logistics to post-production workflows. The ultimate checklist book.",
        price: 14.99,
        category: "Ebooks",
        tags: ["production", "planning", "ebook"],
        images: ["https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop"],
        fileKey: "demo/script-to-screen.pdf",
        mediaType: "ebook",
        isFeatured: false,
    },

    // --- TEMPLATES ---
    {
        title: "Minimalist Notion Dashboard",
        description: "Organize your creative projects with this clean, aesthetic Notion template. Includes project tracker, script view, and shot list.",
        price: 9.99,
        category: "Templates",
        tags: ["notion", "productivity", "template", "minimalist"],
        images: ["https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop"],
        fileKey: "demo/notion-template.zip",
        mediaType: "template",
        isFeatured: false,
    },
    {
        title: "Modern Social Media Kit",
        description: "After Effects and Premiere Pro templates for Instagram Stories, TikToks, and YouTube Shorts. Dynamic text animations.",
        price: 39.99,
        category: "Templates",
        tags: ["social media", "instagram", "tiktok", "after effects", "premiere"],
        images: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop"],
        fileKey: "demo/social-kit.zip",
        mediaType: "template",
        isFeatured: true,
    },
    {
        title: "Budget Planner for Freelancers",
        description: "Excel and Google Sheets template designed for creative freelancers to track income, expenses, and taxes.",
        price: 12.99,
        category: "Templates",
        tags: ["finance", "excel", "template", "freelance"],
        images: ["https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2026&auto=format&fit=crop"],
        fileKey: "demo/budget-planner.zip",
        mediaType: "template",
        isFeatured: false,
    }
];

async function seed() {
    if (!MONGODB_URI) {
        console.error("MONGODB_URI missing from .env");
        process.exit(1);
    }

    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGODB_URI);

        // Safety: ensure index is gone
        if (await Product.collection.indexExists('slug_1')) {
            await Product.collection.dropIndex('slug_1');
        }

        console.log('Clearing existing products...');
        await Product.deleteMany({});

        console.log('Seeding products...');
        await Product.create(dummyProducts);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
