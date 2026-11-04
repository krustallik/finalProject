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
    { id: '66f100000000000000000001', category: 'traffic', description: 'DEMO ONLY — synthetic traffic report near the city centre.', latitude: 48.7164, longitude: 21.2611, minutesAgo: 18 },
    { id: '66f100000000000000000002', category: 'parking', description: 'DEMO ONLY — synthetic parking report in the central district.', latitude: 48.7190, longitude: 21.2530, minutesAgo: 52 },
    { id: '66f100000000000000000003', category: 'noise', description: 'DEMO ONLY — fictional noise report; not a real incident.', latitude: 48.7139, longitude: 21.2701, minutesAgo: 107 },
    { id: '66f100000000000000000004', category: 'vandalism', description: 'DEMO ONLY — sample report with fictional details.', latitude: 48.7222, longitude: 21.2639, minutesAgo: 196 },
    { id: '66f100000000000000000005', category: 'traffic', description: 'DEMO ONLY — synthetic road report on the western side of the map.', latitude: 48.7264, longitude: 21.2435, minutesAgo: 1_520 },
    { id: '66f100000000000000000006', category: 'parking', description: 'DEMO ONLY — fictional parking report in a northern area.', latitude: 48.7330, longitude: 21.2580, minutesAgo: 2_140 },
    { id: '66f100000000000000000007', category: 'noise', description: 'DEMO ONLY — synthetic noise report in an eastern area.', latitude: 48.7215, longitude: 21.2830, minutesAgo: 2_880 },
    { id: '66f100000000000000000008', category: 'theft', description: 'DEMO ONLY — fictional theft report in a southern area.', latitude: 48.7048, longitude: 21.2770, minutesAgo: 3_620 },
    { id: '66f100000000000000000009', category: 'vandalism', description: 'DEMO ONLY — synthetic vandalism report in a western area.', latitude: 48.7005, longitude: 21.2515, minutesAgo: 4_360 },
    { id: '66f100000000000000000010', category: 'traffic', description: 'DEMO ONLY — fictional traffic report in a south-western area.', latitude: 48.7121, longitude: 21.2305, minutesAgo: 5_100 },
    { id: '66f100000000000000000011', category: 'parking', description: 'DEMO ONLY — synthetic parking report in a north-western area.', latitude: 48.7350, longitude: 21.2310, minutesAgo: 5_840 },
    { id: '66f100000000000000000012', category: 'other', description: 'DEMO ONLY — fictional community report in an eastern area.', latitude: 48.7062, longitude: 21.2935, minutesAgo: 6_580 },
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
