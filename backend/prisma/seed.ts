import { PrismaClient, Role, TuitionType, BookingStatus, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Hashing passwords...');
  const passwordHash = await bcrypt.hash('password123', 10);

  // Clear existing data
  console.log('Cleaning up existing data...');
  await prisma.payment.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.tutorProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Creating admin user...');
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@tutorlagbe.com',
      password: passwordHash,
      role: Role.ADMIN,
      phone: '01711111111',
    },
  });

  // Base Students
  console.log('Creating base student users...');
  const students = [
    await prisma.user.create({
      data: {
        name: 'Rahat Rahman',
        email: 'rahat@gmail.com',
        password: passwordHash,
        role: Role.STUDENT,
        phone: '01811111111',
      },
    }),
    await prisma.user.create({
      data: {
        name: 'Sadia Islam',
        email: 'sadia@gmail.com',
        password: passwordHash,
        role: Role.STUDENT,
        phone: '01911111111',
      },
    }),
  ];

  // Generate 150 more students
  console.log('Generating 150 random students...');
  const firstNames = ['Abir', 'Tahsin', 'Muntasir', 'Faisal', 'Zarin', 'Samira', 'Amina', 'Nabila', 'Ismail', 'Zahid', 'Farhan', 'Karim', 'Sajid', 'Liza', 'Taskin'];
  const lastNames = ['Hasan', 'Ahmed', 'Rahman', 'Islam', 'Jahan', 'Chowdhury', 'Khan', 'Siddique', 'Hossain', 'Akter', 'Uddin'];

  for (let i = 1; i <= 150; i++) {
    const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]} (${i})`;
    const student = await prisma.user.create({
      data: {
        name,
        email: `student${i}@tutorlagbe.com`,
        password: passwordHash,
        role: Role.STUDENT,
        phone: `01500000${String(i).padStart(3, '0')}`,
      },
    });
    students.push(student);
  }

  // Base Tutors
  console.log('Creating base tutor users...');
  const tutors = [];
  const baseTutorsData = [
    {
      name: 'Tamim Iqbal',
      email: 'tamim@gmail.com',
      phone: '01722222222',
      profile: {
        bio: 'B.Sc. in CSE from BUET. 4 years of experience teaching Math, Physics, and ICT.',
        subjects: ['Mathematics', 'Physics', 'ICT'],
        classes: ['Class 9', 'Class 10', 'HSC'],
        mediums: ['Bangla Medium', 'English Version'],
        gender: 'Male',
        locationDistrict: 'Dhaka',
        locationArea: 'Dhanmondi',
        expectedSalary: 8000,
        hourlyRate: 500,
        experienceYears: 4,
        qualification: 'B.Sc. in CSE',
        institution: 'BUET',
        verificationStatus: VerificationStatus.APPROVED,
        nidNumber: '1998263748293',
        availableSlots: ['Sat-17:00', 'Mon-17:00', 'Wed-17:00'],
        averageRating: 4.8,
        totalReviews: 2,
      },
    },
    {
      name: 'Fariha Anjum',
      email: 'fariha@gmail.com',
      phone: '01822222222',
      profile: {
        bio: 'Medical student at Dhaka Medical College (DMC). Passionate about Biology and Chemistry.',
        subjects: ['Biology', 'Chemistry'],
        classes: ['Class 9', 'Class 10', 'HSC'],
        mediums: ['Bangla Medium'],
        gender: 'Female',
        locationDistrict: 'Dhaka',
        locationArea: 'Mirpur',
        expectedSalary: 6000,
        hourlyRate: 400,
        experienceYears: 2,
        qualification: 'MBBS (Ongoing)',
        institution: 'Dhaka Medical College',
        verificationStatus: VerificationStatus.APPROVED,
        nidNumber: '2001263748255',
        availableSlots: ['Sun-15:00', 'Tue-15:00', 'Thu-15:00'],
        averageRating: 4.5,
        totalReviews: 1,
      },
    },
  ];

  for (const t of baseTutorsData) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        password: passwordHash,
        role: Role.TUTOR,
        phone: t.phone,
        tutorProfile: {
          create: t.profile,
        },
      },
      include: {
        tutorProfile: true,
      },
    });
    tutors.push(user);
  }

  // Generate 150 more tutors
  console.log('Generating 150 random tutors...');
  const universities = ['BUET', 'Dhaka University', 'NSU', 'BRAC University', 'DMC', 'RUET', 'CUET', 'MIST'];
  const subjectsPool = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'Accounting'];
  const areas = ['Dhanmondi', 'Mirpur', 'Uttara', 'Gulshan', 'Banani', 'Badda', 'Mohammadpur', 'Khilgaon'];

  for (let i = 1; i <= 150; i++) {
    const name = `Tutor ${firstNames[i % firstNames.length]} (${i})`;
    const sub = [subjectsPool[i % subjectsPool.length], subjectsPool[(i + 1) % subjectsPool.length]];
    const tutor = await prisma.user.create({
      data: {
        name,
        email: `tutor${i}@tutorlagbe.com`,
        password: passwordHash,
        role: Role.TUTOR,
        phone: `01600000${String(i).padStart(3, '0')}`,
        tutorProfile: {
          create: {
            bio: `Experienced tutor from ${universities[i % universities.length]} offering classes in ${sub.join(', ')}.`,
            subjects: sub,
            classes: ['Class 8', 'Class 9', 'Class 10'],
            mediums: ['Bangla Medium', 'English Version'],
            gender: i % 2 === 0 ? 'Male' : 'Female',
            locationDistrict: 'Dhaka',
            locationArea: areas[i % areas.length],
            expectedSalary: 5000 + (i % 5) * 1000,
            hourlyRate: 300 + (i % 5) * 50,
            experienceYears: 1 + (i % 6),
            qualification: 'B.Sc. / B.A. (Hons)',
            institution: universities[i % universities.length],
            verificationStatus: i % 3 === 0 ? VerificationStatus.PENDING : VerificationStatus.APPROVED,
            nidNumber: `19970000000${String(i).padStart(3, '0')}`,
            availableSlots: ['Sat-18:00', 'Mon-18:00', 'Wed-18:00'],
            averageRating: 4.0 + (i % 10) * 0.1,
            totalReviews: 1,
          },
        },
      },
      include: {
        tutorProfile: true,
      },
    });
    tutors.push(tutor);
  }

  // Generate 750 bookings
  console.log('Generating 750 bookings...');
  const statuses = [BookingStatus.PENDING, BookingStatus.ACCEPTED, BookingStatus.COMPLETED, BookingStatus.REJECTED];
  const slots = ['Sat-17:00', 'Sun-15:00', 'Mon-17:00', 'Tue-15:00', 'Wed-17:00', 'Thu-15:00'];

  for (let i = 1; i <= 750; i++) {
    const student = students[i % students.length];
    const tutor = tutors[i % tutors.length];
    const tutorProfileId = tutor.tutorProfile?.id;

    if (!tutorProfileId) continue;

    await prisma.booking.create({
      data: {
        studentId: student.id,
        tutorProfileId,
        date: new Date(Date.now() + (i % 10 - 5) * 24 * 60 * 60 * 1000), // Range between -5 to +4 days
        timeSlot: slots[i % slots.length],
        tuitionType: i % 2 === 0 ? TuitionType.ONLINE : TuitionType.OFFLINE,
        address: i % 2 === 0 ? undefined : `${areas[i % areas.length]}, Dhaka`,
        status: statuses[i % statuses.length],
        notes: `Need tutoring support for ${tutor.tutorProfile?.subjects[0]}.`,
        amount: tutor.tutorProfile?.expectedSalary || 6000,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
