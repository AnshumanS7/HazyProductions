import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from './models/Product'; // Adjust path if needed
import dbConnect from './lib/mongodb';

dotenv.config();

const dummyProducts = [
    {
        title: "Cinematic Boom SFX Pack",
        description: "A collection of 50 high-impact boom sound effects for trailers and action scenes. Deep sub bass and crisp impacts.",
        price: 29.99,
        category: "Audio",
        tags: ["sfx", "trailer", "boom", "cinematic", "audio"],
        images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop"],
        fileKey: "demo/boom-pack.zip",
        mediaType: "audio",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Public demo
        isFeatured: true,
    },
    {
        title: "Neon Cyberpunk Overlay Pack",
        description: "4K Video overlays featuring neon glitches, holographic interfaces, and cyberpunk framing. Alpha channel included.",
        price: 49.99,
        category: "Video",
        tags: ["video", "overlay", "cyberpunk", "neon", "vfx"],
        images: ["https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=2071&auto=format&fit=crop"],
        fileKey: "demo/cyberpunk-overlays.zip",
        mediaType: "video",
        isFeatured: true,
    },
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
        title: "Atmospheric Drones Vol. 1",
        description: "Eerie and emotional drone textures for horror and drama. 20 original looping tracks.",
        price: 24.99,
        category: "Audio",
        tags: ["audio", "ambient", "drone", "horror", "music"],
        images: ["https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop"],
        fileKey: "demo/drones-vol1.zip",
        mediaType: "audio",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        isFeatured: true,
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
        isFeatured: false,
    }
];

async function seed() {
    try {
        console.log('Connecting to DB...');
        await dbConnect();

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
