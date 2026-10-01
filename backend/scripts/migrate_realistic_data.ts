import {
  PrismaClient,
  Role,
  VerificationStatus,
  BookingStatus,
  TuitionType,
  TuitionPostStatus,
  ApplicationStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const dbUrl =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_N2LJW4gZdpXq@ep-broad-forest-aq13la6y-pooler.c-8.us-east-1.aws.neon.tech/tutor-lagbe?sslmode=require&channel_binding=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

async function main() {
  console.log("Connecting to database at:", dbUrl.split("@")[1]);
  console.log("Hashing default password '123456'...");
  const passwordHash = await bcrypt.hash("123456", 10);

  // 1. Clean existing records in proper dependency order
  console.log("Cleaning up existing data in target database...");
  await prisma.tuitionApplication.deleteMany({});
  await prisma.tuitionPost.deleteMany({});
  await prisma.withdrawalRequest.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.tutorProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleared old data. Now inserting realistic Bangladeshi data...");

  // 2. Core Mandatory Test Accounts
  console.log("Creating Super Admin, Student, and Tutor test accounts...");
  const adminUser = await prisma.user.create({
    data: {
      name: "System Administrator",
      email: "admin@gmail.com",
      phone: "01711000000",
      password: passwordHash,
      role: Role.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
  });

  const demoStudent = await prisma.user.create({
    data: {
      name: "Tanvir Rahman",
      email: "student@gmail.com",
      phone: "01722334455",
      password: passwordHash,
      role: Role.STUDENT,
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    },
  });

  const demoTutorUser = await prisma.user.create({
    data: {
      name: "Nafis Fuad",
      email: "tutor@gmail.com",
      phone: "01819283746",
      password: passwordHash,
      role: Role.TUTOR,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
  });

  const demoTutorProfile = await prisma.tutorProfile.create({
    data: {
      userId: demoTutorUser.id,
      bio: "Assalamu Alaikum. I am an experienced tutor from BUET. Over 4+ years I have mentored 50+ students in HSC Physics and Higher Mathematics with 90%+ achieving GPA 5.0.",
      subjects: ["Physics", "Higher Mathematics", "ICT", "Chemistry"],
      classes: ["Class 9", "Class 10", "HSC", "Admission"],
      mediums: ["Bangla Medium", "English Version"],
      gender: "MALE",
      locationDistrict: "Dhaka",
      locationArea: "Dhanmondi",
      expectedSalary: 8000,
      hourlyRate: 450,
      experienceYears: 4,
      qualification: "B.Sc in Computer Science & Engineering",
      institution: "Bangladesh University of Engineering and Technology (BUET)",
      verificationStatus: VerificationStatus.APPROVED,
      nidNumber: "19982691234567890",
      availableSlots: ["Sat-16:00", "Mon-16:00", "Wed-16:00", "Fri-10:00"],
      averageRating: 4.95,
      totalReviews: 8,
    },
  });

  // 3. Realistic Bangladeshi Tutors
  console.log("Creating realistic tutors from top universities...");
  const tutorsData = [
    {
      name: "Dr. Ayesha Siddiqa",
      email: "ayesha.siddiqa@gmail.com",
      phone: "01733445566",
      gender: "FEMALE",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      institution: "Dhaka Medical College (DMC)",
      qualification: "MBBS (Intern Doctor)",
      bio: "Specialist tutor for Biology, Medical Admission Coaching & Chemistry. Explaining cellular mechanisms and biochemistry with practical real-life medical insights.",
      subjects: ["Biology", "Chemistry", "Science"],
      classes: ["Class 9", "Class 10", "HSC", "Medical Admission"],
      mediums: ["Bangla Medium", "English Version"],
      locationDistrict: "Dhaka",
      locationArea: "Dhanmondi",
      expectedSalary: 9000,
      hourlyRate: 500,
      experienceYears: 5,
      rating: 5.0,
      reviews: 14,
    },
    {
      name: "Tanvir Hasan Rifat",
      email: "tanvir.rifat@gmail.com",
      phone: "01744556677",
      gender: "MALE",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      institution: "BUET (EEE)",
      qualification: "B.Sc in Electrical & Electronic Engineering",
      bio: "Engineering student with top rank in BUET admission test. Teaching physics mechanics and calculus with clear graphical representations and formula derivations.",
      subjects: ["Physics", "Higher Mathematics", "General Math"],
      classes: ["Class 9", "Class 10", "HSC", "Engineering Admission"],
      mediums: ["Bangla Medium", "English Version"],
      locationDistrict: "Dhaka",
      locationArea: "Mirpur DOHS",
      expectedSalary: 8500,
      hourlyRate: 450,
      experienceYears: 3,
      rating: 4.9,
      reviews: 11,
    },
    {
      name: "Fahim Muntasir",
      email: "fahim.muntasir@gmail.com",
      phone: "01755667788",
      gender: "MALE",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      institution: "Institute of Business Administration (IBA), DU",
      qualification: "BBA (3rd Year)",
      bio: "Experienced in English language coaching, IBA admission, SAT English & Mathematics. Helping students develop analytical grammar and critical reading.",
      subjects: ["English", "General Math", "Accounting", "Economics"],
      classes: ["Class 8", "Class 9", "Class 10", "HSC", "IBA Admission"],
      mediums: ["English Medium", "English Version", "Bangla Medium"],
      locationDistrict: "Dhaka",
      locationArea: "Gulshan",
      expectedSalary: 10000,
      hourlyRate: 600,
      experienceYears: 4,
      rating: 4.88,
      reviews: 9,
    },
    {
      name: "Nusrat Jahan Bristy",
      email: "nusrat.bristy@gmail.com",
      phone: "01766778899",
      gender: "FEMALE",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      institution: "BRAC University",
      qualification: "B.Sc in Computer Science & Engineering",
      bio: "Passionate educator for English Medium & English Version students. Proven success in Edexcel & Cambridge O-Level Mathematics and ICT syllabus.",
      subjects: ["ICT", "Mathematics", "Science", "Computer Programming"],
      classes: ["Class 6", "Class 7", "Class 8", "O-Level"],
      mediums: ["English Medium", "English Version"],
      locationDistrict: "Dhaka",
      locationArea: "Uttara",
      expectedSalary: 7500,
      hourlyRate: 400,
      experienceYears: 3,
      rating: 4.92,
      reviews: 12,
    },
    {
      name: "Mahir Faisal",
      email: "mahir.faisal@gmail.com",
      phone: "01777889900",
      gender: "MALE",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
      institution: "North South University (NSU)",
      qualification: "BBA in Finance & Accounting",
      bio: "Commerce and Business Studies specialist. Teaching Business Studies, Finance & Banking, and Accounting with real-world case examples.",
      subjects: ["Accounting", "Finance", "Business Studies", "General Math"],
      classes: ["Class 9", "Class 10", "HSC"],
      mediums: ["Bangla Medium", "English Version"],
      locationDistrict: "Dhaka",
      locationArea: "Bashundhara R/A",
      expectedSalary: 7000,
      hourlyRate: 350,
      experienceYears: 3,
      rating: 4.75,
      reviews: 7,
    },
    {
      name: "Tasnim Zannat",
      email: "tasnim.zannat@gmail.com",
      phone: "01788990011",
      gender: "FEMALE",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      institution: "University of Dhaka (DU)",
      qualification: "M.A. in English Literature",
      bio: "Senior English instructor with 6+ years experience. Specializing in HSC English 1st & 2nd paper, grammar foundation, IELTS and creative writing.",
      subjects: ["English", "Bangla", "Social Science"],
      classes: ["Class 8", "Class 9", "Class 10", "HSC"],
      mediums: ["Bangla Medium", "English Version"],
      locationDistrict: "Dhaka",
      locationArea: "Mohammadpur",
      expectedSalary: 6500,
      hourlyRate: 350,
      experienceYears: 6,
      rating: 4.96,
      reviews: 16,
    },
    {
      name: "Shifat Al Din",
      email: "shifat.din@gmail.com",
      phone: "01799001122",
      gender: "MALE",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
      institution: "Chittagong University of Eng. & Tech (CUET)",
      qualification: "B.Sc in Civil Engineering",
      bio: "Dedicated Science & Math mentor in Chittagong. Focuses on developing intuitive problem-solving skills for SSC & HSC Science students.",
      subjects: ["Higher Mathematics", "Physics", "Chemistry"],
      classes: ["Class 9", "Class 10", "HSC"],
      mediums: ["Bangla Medium"],
      locationDistrict: "Chittagong",
      locationArea: "Panchlaish",
      expectedSalary: 6000,
      hourlyRate: 300,
      experienceYears: 3,
      rating: 4.82,
      reviews: 6,
    },
    {
      name: "Sadia Afrin",
      email: "sadia.afrin@gmail.com",
      phone: "01811223344",
      gender: "FEMALE",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      institution: "Sir Salimullah Medical College (SSMC)",
      qualification: "MBBS (4th Year)",
      bio: "Empathetic and structured teaching methodology for young students. Preparing students for Board Exams and Science Olympiads with dedicated notes.",
      subjects: ["Biology", "Chemistry", "General Science"],
      classes: ["Class 8", "Class 9", "Class 10", "HSC"],
      mediums: ["Bangla Medium", "English Version"],
      locationDistrict: "Dhaka",
      locationArea: "Lalmatia",
      expectedSalary: 7500,
      hourlyRate: 400,
      experienceYears: 4,
      rating: 4.91,
      reviews: 10,
    },
  ];

  const createdTutorProfiles: any[] = [demoTutorProfile];

  for (const t of tutorsData) {
    const user = await prisma.user.create({
      data: {
        name: t.name,
        email: t.email,
        phone: t.phone,
        password: passwordHash,
        role: Role.TUTOR,
        avatarUrl: t.avatar,
      },
    });

    const profile = await prisma.tutorProfile.create({
      data: {
        userId: user.id,
        bio: t.bio,
        subjects: t.subjects,
        classes: t.classes,
        mediums: t.mediums,
        gender: t.gender,
        locationDistrict: t.locationDistrict,
        locationArea: t.locationArea,
        expectedSalary: t.expectedSalary,
        hourlyRate: t.hourlyRate,
        experienceYears: t.experienceYears,
        qualification: t.qualification,
        institution: t.institution,
        verificationStatus: VerificationStatus.APPROVED,
        nidNumber: `1997${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        availableSlots: ["Sat-16:00", "Mon-16:00", "Wed-16:00", "Thu-17:00"],
        averageRating: t.rating,
        totalReviews: t.reviews,
      },
    });

    createdTutorProfiles.push(profile);
  }

  // 4. Realistic Bangladeshi Students / Parents
  console.log("Creating realistic students and parents...");
  const studentsData = [
    {
      name: "Farhana Chowdhury",
      email: "farhana.chowdhury@gmail.com",
      phone: "01822334455",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    },
    {
      name: "Rezaul Karim",
      email: "rezaul.karim@gmail.com",
      phone: "01833445566",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    {
      name: "Sabrina Mustari",
      email: "sabrina.mustari@gmail.com",
      phone: "01844556677",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    },
    {
      name: "Imran Nazir",
      email: "imran.nazir@gmail.com",
      phone: "01855667788",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    },
    {
      name: "Shamima Nasrin",
      email: "shamima.nasrin@gmail.com",
      phone: "01866778899",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
  ];

  const createdStudents: any[] = [demoStudent];

  for (const s of studentsData) {
    const student = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        phone: s.phone,
        password: passwordHash,
        role: Role.STUDENT,
        avatarUrl: s.avatar,
      },
    });
    createdStudents.push(student);
  }

  // 5. Realistic Tuition Job Posts
  console.log("Creating realistic tuition job posts...");
  const tuitionPostsData = [
    {
      studentIndex: 0,
      title: "Need Expert BUET Tutor for HSC 2026 Physics & Higher Mathematics",
      description: "My son is preparing for HSC 2026 science from Notre Dame College. We need a punctual tutor from BUET/DU who can take 3 days a week, 1.5 hours per session. Special emphasis required on Vector, Electricity, and Integral Calculus.",
      subject: "Physics & Higher Mathematics",
      class: "HSC 2nd Year",
      medium: "Bangla Medium",
      locationDistrict: "Dhaka",
      locationArea: "Dhanmondi (Near Road 27)",
      salary: 8500,
      daysPerWeek: 3,
      genderPreference: "MALE",
      tuitionType: TuitionType.OFFLINE,
    },
    {
      studentIndex: 1,
      title: "Urgent: Female Tutor for Class 8 English Version (All Subjects)",
      description: "Looking for an affectionate, university-going female tutor for my daughter studying in Class 8 at Scholastica. Must guide her daily homework and prepare for school term exams.",
      subject: "All Subjects (Math, Science, English)",
      class: "Class 8",
      medium: "English Version",
      locationDistrict: "Dhaka",
      locationArea: "Uttara (Sector 11)",
      salary: 7500,
      daysPerWeek: 4,
      genderPreference: "FEMALE",
      tuitionType: TuitionType.OFFLINE,
    },
    {
      studentIndex: 2,
      title: "Seeking Medical Student for Biology & Chemistry Preparation",
      description: "HSC 2025 candidate needing intensive revision on Botany, Zoology and Organic Chemistry mechanisms. Prefer a mentor studying in DMC or SSMC.",
      subject: "Biology & Chemistry",
      class: "HSC 1st Year",
      medium: "Bangla Medium",
      locationDistrict: "Dhaka",
      locationArea: "Lalmatia",
      salary: 8000,
      daysPerWeek: 3,
      genderPreference: "ANY",
      tuitionType: TuitionType.OFFLINE,
    },
    {
      studentIndex: 3,
      title: "O-Level Edexcel Mathematics B and Physics Specialist",
      description: "Urgent tuition for an O-Level candidate sitting in Jan 2027 exams. Experience with past papers and syllabus breakdown is mandatory.",
      subject: "Mathematics B & Physics",
      class: "O-Level",
      medium: "English Medium",
      locationDistrict: "Dhaka",
      locationArea: "Gulshan-2",
      salary: 11000,
      daysPerWeek: 3,
      genderPreference: "ANY",
      tuitionType: TuitionType.OFFLINE,
    },
    {
      studentIndex: 4,
      title: "Class 10 SSC Candidate - Mathematics & ICT Foundation",
      description: "Seeking a dedicated mentor to clear trigonometric formulas, general mathematics and ICT chapter 3 & 4. Monthly exam test papers must be taken.",
      subject: "General Math & ICT",
      class: "Class 10",
      medium: "Bangla Medium",
      locationDistrict: "Dhaka",
      locationArea: "Mirpur DOHS",
      salary: 7000,
      daysPerWeek: 3,
      genderPreference: "ANY",
      tuitionType: TuitionType.OFFLINE,
    },
    {
      studentIndex: 5,
      title: "Online Coding & Mathematics Tutor for Class 9 Student",
      description: "Looking for an energetic CS student who can teach Mathematics and introduce Python programming fundamentals via Google Meet / Zoom.",
      subject: "Mathematics & Python Programming",
      class: "Class 9",
      medium: "English Medium",
      locationDistrict: "Dhaka",
      locationArea: "Bashundhara R/A",
      salary: 6000,
      daysPerWeek: 2,
      genderPreference: "ANY",
      tuitionType: TuitionType.ONLINE,
    },
  ];

  const createdTuitionPosts: any[] = [];
  for (const post of tuitionPostsData) {
    const studentUser = createdStudents[post.studentIndex % createdStudents.length];
    const createdPost = await prisma.tuitionPost.create({
      data: {
        studentId: studentUser.id,
        title: post.title,
        description: post.description,
        subject: post.subject,
        class: post.class,
        medium: post.medium,
        locationDistrict: post.locationDistrict,
        locationArea: post.locationArea,
        salary: post.salary,
        daysPerWeek: post.daysPerWeek,
        genderPreference: post.genderPreference,
        tuitionType: post.tuitionType,
        status: TuitionPostStatus.OPEN,
      },
    });
    createdTuitionPosts.push(createdPost);
  }

  // 6. Realistic Applications from Tutors
  console.log("Creating applications for tuition job posts...");
  if (createdTuitionPosts.length > 0 && createdTutorProfiles.length > 1) {
    // Tutor 0 applies to Post 0
    await prisma.tuitionApplication.create({
      data: {
        tuitionPostId: createdTuitionPosts[0].id,
        tutorProfileId: createdTutorProfiles[0].id,
        coverLetter: "Assalamu Alaikum. I am studying in CSE at BUET and living in Dhanmondi. I have been mentoring HSC science students for 4+ years. I can assure structured weekly tests and comprehensive chapter revisions.",
        expectedSalary: 8500,
        status: ApplicationStatus.PENDING,
      },
    });

    // Tutor 1 applies to Post 0 as well (competitive applications)
    await prisma.tuitionApplication.create({
      data: {
        tuitionPostId: createdTuitionPosts[0].id,
        tutorProfileId: createdTutorProfiles[2].id, // Tanvir Hasan Rifat
        coverLetter: "Hello, I am Tanvir from BUET EEE. I have extensive experience in College-level Physics and Math with past student references available upon request.",
        expectedSalary: 8500,
        status: ApplicationStatus.PENDING,
      },
    });

    // Female tutor applies to Post 1
    await prisma.tuitionApplication.create({
      data: {
        tuitionPostId: createdTuitionPosts[1].id,
        tutorProfileId: createdTutorProfiles[4].id, // Nusrat Jahan Bristy
        coverLetter: "Assalamu Alaikum. I reside in Uttara Sector 9, very close to your location. I am currently pursuing CSE at BRAC University and have taught Class 8 English Version students for over 2 years.",
        expectedSalary: 7500,
        status: ApplicationStatus.ACCEPTED,
      },
    });
  }

  // 7. Realistic Bookings
  console.log("Creating realistic bookings...");
  const sampleBooking1 = await prisma.booking.create({
    data: {
      studentId: createdStudents[0].id,
      tutorProfileId: createdTutorProfiles[0].id,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      timeSlot: "Sat-16:00",
      tuitionType: TuitionType.OFFLINE,
      address: "House 42, Road 27, Dhanmondi, Dhaka",
      status: BookingStatus.ACCEPTED,
      notes: "Please bring class 10 physics board question sheets for trial analysis.",
      amount: 8000,
    },
  });

  const sampleBooking2 = await prisma.booking.create({
    data: {
      studentId: createdStudents[1].id,
      tutorProfileId: createdTutorProfiles[1].id, // Dr. Ayesha Siddiqa
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      timeSlot: "Sun-17:00",
      tuitionType: TuitionType.OFFLINE,
      address: "Road 4, Dhanmondi, Dhaka",
      status: BookingStatus.COMPLETED,
      notes: "First month medical biology module completed successfully.",
      amount: 9000,
    },
  });

  // 8. Realistic Reviews
  console.log("Creating realistic reviews...");
  await prisma.review.create({
    data: {
      studentId: createdStudents[1].id,
      tutorProfileId: createdTutorProfiles[1].id,
      rating: 5,
      comment: "Ayesha apu is genuinely one of the best biology mentors! She explains cell physiology using drawings and real medical insights. Highly recommended.",
    },
  });

  await prisma.review.create({
    data: {
      studentId: createdStudents[0].id,
      tutorProfileId: createdTutorProfiles[0].id,
      rating: 5,
      comment: "Nafis sir has a deep grasp on calculus and physics vectors. My son's confidence in Math has significantly improved within just 3 weeks.",
    },
  });

  // 9. Realistic System & Transaction Notifications
  console.log("Creating notifications...");
  await prisma.notification.createMany({
    data: [
      {
        userId: demoTutorUser.id,
        title: "New Tuition Match in Dhanmondi",
        message: "A new tuition post matching your subjects (Physics & Higher Math) was posted in Dhanmondi.",
        type: "NEW_TUITION_POST",
        isRead: false,
      },
      {
        userId: demoStudent.id,
        title: "Booking Accepted",
        message: "Tutor Nafis Fuad has accepted your booking request for Sat-16:00.",
        type: "BOOKING_ACCEPTED",
        isRead: false,
      },
      {
        userId: adminUser.id,
        title: "New Tutor Verification Submitted",
        message: "Tutor Dr. Ayesha Siddiqa submitted documents for blue badge verification.",
        type: "TUTOR_VERIFICATION",
        isRead: false,
      },
    ],
  });

  // 10. Wishlist Items
  console.log("Creating wishlist items...");
  await prisma.wishlistItem.create({
    data: {
      studentId: demoStudent.id,
      tutorProfileId: createdTutorProfiles[1].id,
    },
  });

  console.log("\n=======================================================");
  console.log("🎉 ALL REALISTIC BANGLADESHI DATA MIGRATED SUCCESSFULLY!");
  console.log("=======================================================");
  console.log("Total Users Created:", 1 + createdTutorProfiles.length + createdStudents.length);
  console.log("Total Tutors Created:", createdTutorProfiles.length);
  console.log("Total Students Created:", createdStudents.length);
  console.log("Total Tuition Posts Created:", createdTuitionPosts.length);
  console.log("\nReady test credentials (Password: 123456):");
  console.log("- Super Admin: admin@gmail.com");
  console.log("- Student:     student@gmail.com");
  console.log("- Tutor:       tutor@gmail.com");
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
