const { sequelize, User, Program, Club } = require('./src/models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // 1. Create Users for all Roles
        const users = [
            { name: 'Super Admin', email: 'admin@kst.rw', role: 'Super Admin', image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/smiling-man.jpg' },
            { name: 'Content Manager', email: 'manager@kst.rw', role: 'Content Manager', image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/business-woman.jpg' },
            { name: 'Blogger', email: 'blogger@kst.rw', role: 'Blogger', image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie.jpg' },
            { name: 'Editor User', email: 'user@kst.rw', role: 'Editor', image: 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/kitchen-bar.jpg' }, // Default role is Editor
        ];

        for (const user of users) {
            const existingUser = await User.findOne({ where: { email: user.email } });
            if (!existingUser) {
                const hashedPassword = await bcrypt.hash('123', 10);
                await User.create({
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role,
                    image: user.image,
                });
                console.log(`Created ${user.role}: ${user.email} / 123`);
            } else {
                console.log(`${user.role} already exists.`);
            }
        }

        // 2. Create Sample Program
        const programName = 'Shaolin Kung Fu';
        const programExists = await Program.findOne({ where: { name: programName } });

        if (!programExists) {
            await Program.create({
                name: programName,
                description: 'Traditional Shaolin Kung Fu training for discipline and strength.',
                image: 'https://placehold.co/600x400/png',
                status: 'active',
            });
            console.log('Sample Program created.');
        } else if (programExists.image === 'https://via.placeholder.com/600x400') {
            await programExists.update({ image: 'https://placehold.co/600x400/png' });
            console.log('Sample Program placeholder updated.');
        }

        // 3. Create Sample Club
        const clubName = 'Kigali HQ';
        const clubExists = await Club.findOne({ where: { name: clubName } });

        if (!clubExists) {
            await Club.create({
                name: clubName,
                description: 'Main headquarters of the Kigali Shaolin Temple.',
                location: 'Kigali, Rwanda',
                image: 'https://placehold.co/600x400/png',
            });
            console.log('Sample Club created.');
        } else if (clubExists.image === 'https://via.placeholder.com/600x400') {
            await clubExists.update({ image: 'https://placehold.co/600x400/png' });
            console.log('Sample Club placeholder updated.');
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
