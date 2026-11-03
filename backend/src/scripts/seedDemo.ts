import 'dotenv/config';
import mongoose, { Types } from 'mongoose';
import { MONGODB_URI } from '../config';
import { OffenseModel } from '../models/offense.schema';

const parsedUri = new URL(MONGODB_URI);
const localHosts = new Set(['localhost', '127.0.0.1', '::1']);

if (!localHosts.has(parsedUri.hostname)) {
    throw new Error('Demo seeding is restricted to a local MongoDB server. Check MONGODB_URI.');
}

const demoUserId = new Types.ObjectId('66f000000000000000000001');
const sampleReports = [
    { id: '66f100000000000000000001', category: 'traffic', description: 'DEMO ONLY — sample traffic report near the city centre.', latitude: 48.7164, longitude: 21.2611, minutesAgo: 18 },
    { id: '66f100000000000000000002', category: 'parking', description: 'DEMO ONLY — sample parking report for preview purposes.', latitude: 48.7190, longitude: 21.2530, minutesAgo: 52 },
    { id: '66f100000000000000000003', category: 'noise', description: 'DEMO ONLY — synthetic noise report; not a real incident.', latitude: 48.7139, longitude: 21.2701, minutesAgo: 107 },
    { id: '66f100000000000000000004', category: 'vandalism', description: 'DEMO ONLY — sample report with fictional details.', latitude: 48.7222, longitude: 21.2639, minutesAgo: 196 },
];

async function seedDemoReports() {
    await mongoose.connect(MONGODB_URI);

    // Only rows explicitly marked by this script are replaced on repeat runs.
    await OffenseModel.collection.deleteMany({ demoSeed: true });

    const now = Date.now();
    await OffenseModel.collection.insertMany(
        sampleReports.map((report) => {
            const createdAt = new Date(now - report.minutesAgo * 60_000);
            return {
                _id: new Types.ObjectId(report.id),
                user: demoUserId,
                description: report.description,
                category: report.category,
                latitude: report.latitude,
                longitude: report.longitude,
                createdAt,
                updatedAt: createdAt,
                demoSeed: true,
            };
        })
    );

    console.log(`Inserted ${sampleReports.length} clearly labeled synthetic reports into local MongoDB.`);
}

seedDemoReports()
    .catch((error: unknown) => {
        console.error('Could not seed local demo reports.', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
