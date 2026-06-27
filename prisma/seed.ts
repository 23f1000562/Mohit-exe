import { prisma } from "../src/lib/db";

async function main() {
  console.log("Seeding database with Mohit Kishore resume data...");

  // 1. Clean existing records
  await prisma.user.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.certification.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.socialLink.deleteMany({});
  await prisma.gameScore.deleteMany({});
  await prisma.contactMessage.deleteMany({});

  // 2. Create Admin User
  await prisma.user.create({
    data: {
      name: "Mohit Kishore",
      email: "mohitkishore145@gmail.com",
      password: "admin123hashed",
    },
  });

  // 3. Create Skills (from resume)
  const skillsData = [
    // Programming Languages
    { name: "Python", category: "Programming", level: 90, icon: "terminal", index: 1 },
    { name: "Java", category: "Programming", level: 85, icon: "code", index: 2 },
    { name: "JavaScript", category: "Programming", level: 80, icon: "code", index: 3 },
    { name: "TypeScript", category: "Programming", level: 75, icon: "code", index: 4 },
    // Frontend
    { name: "React", category: "Frontend", level: 80, icon: "layout", index: 5 },
    { name: "Vue.js", category: "Frontend", level: 85, icon: "layout", index: 6 },
    { name: "HTML5", category: "Frontend", level: 90, icon: "layout", index: 7 },
    { name: "CSS3", category: "Frontend", level: 85, icon: "layout", index: 8 },
    { name: "Bootstrap", category: "Frontend", level: 80, icon: "layout", index: 9 },
    // Backend
    { name: "Flask", category: "Backend", level: 90, icon: "server", index: 10 },
    { name: "FastAPI", category: "Backend", level: 75, icon: "server", index: 11 },
    { name: "Node.js", category: "Backend", level: 70, icon: "server", index: 12 },
    { name: "REST APIs", category: "Backend", level: 85, icon: "server", index: 13 },
    { name: "Jinja2", category: "Backend", level: 85, icon: "server", index: 14 },
    // AI/ML
    { name: "TensorFlow", category: "AI/ML", level: 85, icon: "cpu", index: 15 },
    { name: "PyTorch", category: "AI/ML", level: 80, icon: "cpu", index: 16 },
    { name: "Scikit-learn", category: "AI/ML", level: 88, icon: "cpu", index: 17 },
    { name: "Deep Learning", category: "AI/ML", level: 80, icon: "cpu", index: 18 },
    { name: "Computer Vision", category: "AI/ML", level: 82, icon: "cpu", index: 19 },
    { name: "NumPy", category: "AI/ML", level: 85, icon: "cpu", index: 20 },
    { name: "Pandas", category: "AI/ML", level: 85, icon: "cpu", index: 21 },
    { name: "Matplotlib", category: "AI/ML", level: 80, icon: "cpu", index: 22 },
    // Databases
    { name: "SQLite", category: "Database", level: 85, icon: "database", index: 23 },
    { name: "PostgreSQL", category: "Database", level: 80, icon: "database", index: 24 },
    { name: "Redis", category: "Database", level: 75, icon: "database", index: 25 },
    // Developer Tools
    { name: "Git & GitHub", category: "Developer Tools", level: 90, icon: "git", index: 26 },
    { name: "Docker", category: "Developer Tools", level: 70, icon: "container", index: 27 },
  ];

  for (const s of skillsData) {
    await prisma.skill.create({ data: s });
  }

  // 4. Create Experience (from resume)
  const experiences = [
    {
      company: "SlateMate",
      role: "Backend Developer",
      location: "Remote",
      startDate: "June 2025",
      endDate: "Aug 2025",
      description: "Developed backend systems and APIs for SlateMate platform.",
      technologies: "Python,Flask,FastAPI",
      index: 1,
    },
    {
      company: "Indian Institute of Technology Madras",
      role: "AI/ML Engineer Intern",
      location: "Chennai, TN",
      startDate: "Dec 2025",
      endDate: "Present",
      description: "Developing and deploying machine learning models in the Mechanical Design Section.\nFocus on data preprocessing, feature engineering, model training, evaluation, and performance tuning to build scalable AI solutions for predictive analytics and computer vision applications.",
      technologies: "Python,TensorFlow,PyTorch,Scikit-learn,NumPy,Pandas",
      index: 2,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  // 5. Create Projects (from resume with actual links)
  const projects = [
    {
      title: "Hospital Management System V1",
      slug: "hospital-management-v1",
      description: "A comprehensive hospital management platform supporting authentication, patient management, doctor management, appointment scheduling, and administrative dashboards.",
      problem: "Hospitals needed a centralized system to manage patients, doctors, appointments, and administrative workflows efficiently.",
      solution: "Built a full-stack Flask application with SQLAlchemy ORM, role-based authentication, and responsive admin dashboards.",
      architecture: "Flask backend with Jinja2 templates, SQLAlchemy ORM, SQLite database, HTML/CSS frontend.",
      techStack: "Flask,SQLAlchemy,SQLite,Jinja2,HTML,CSS",
      images: "",
      video: "",
      githubUrl: "https://github.com/23f1000562/mad-1-project-HMS-V1",
      liveUrl: "",
      status: "PUBLISHED",
      category: "Backend",
      difficulty: 4,
      features: "Role-based authentication\nPatient management\nDoctor management\nAppointment scheduling\nAdmin dashboards",
      lessons: "Designing database schemas for complex relationships requires careful normalization and validation.",
      future: "Add reporting features and improve UI/UX.",
    },
    {
      title: "Placement Portal V2",
      slug: "placement-portal-v2",
      description: "A scalable placement management platform with authentication, dashboards, caching, asynchronous background jobs, and recruitment workflow automation.",
      problem: "Campus placement processes were inefficient and lacked real-time tracking and automation.",
      solution: "Developed a distributed system with Vue.js frontend, Flask backend, Redis caching, and Celery for async jobs.",
      architecture: "Vue.js SPA frontend, Flask REST API backend, Redis cache layer, Celery task queue, SQLite database.",
      techStack: "Vue.js,Bootstrap,HTML5,CSS3,JavaScript,Flask,Celery,Redis,SQLite,REST APIs",
      images: "",
      video: "",
      githubUrl: "https://github.com/23f1000562/MAD-2-PPA",
      liveUrl: "",
      status: "PUBLISHED",
      category: "Full Stack",
      difficulty: 5,
      features: "Role-based access control\nStudent and company dashboards\nApplication tracking\nCaching optimization\nAsynchronous job processing",
      lessons: "Implementing effective caching and asynchronous task processing dramatically improves system performance.",
      future: "Add real-time notifications and advanced filtering.",
    },
    {
      title: "Gear Oil Viscosity Predictor",
      slug: "gear-oil-viscosity",
      description: "A machine learning application that predicts gear oil viscosity using engineering data with high accuracy for industrial applications.",
      problem: "Industrial engineers needed quick, accurate predictions of gear oil viscosity without expensive laboratory testing.",
      solution: "Built a Scikit-learn model with data preprocessing and deployed it as an interactive Flask web application on Hugging Face Spaces.",
      architecture: "Python ML backend, Flask frontend, Scikit-learn model, deployed on Hugging Face Spaces.",
      techStack: "Python,Flask,Scikit-learn,NumPy,Pandas,Matplotlib",
      images: "",
      video: "",
      githubUrl: "",
      liveUrl: "https://huggingface.co/spaces/Mohitkishorr/Viscosity-Model",
      status: "PUBLISHED",
      category: "AI/ML",
      difficulty: 3,
      features: "Viscosity prediction\nData visualization\nModel accuracy metrics\nEasy-to-use interface",
      lessons: "Effective data preprocessing and feature engineering are crucial for model accuracy.",
      future: "Expand to other industrial fluid predictions.",
    },
    {
      title: "CNN Model Volume Prediction",
      slug: "cnn-volume-prediction",
      description: "A deep learning model that predicts liquid volume inside a bucket using four images captured from different angles.",
      problem: "Accurate volume measurement from images is difficult without specialized equipment.",
      solution: "Trained a ResNet18-based deep learning regression model to learn relationships between visual patterns and volumes.",
      architecture: "PyTorch deep learning model, ResNet18 backbone, ONNX format for deployment, OpenCV for image processing.",
      techStack: "PyTorch,ResNet18,OpenCV,NumPy,ONNX,Computer Vision,Deep Learning",
      images: "",
      video: "",
      githubUrl: "https://github.com/23f1000562/CNN-Model-Volume-prediction",
      liveUrl: "",
      status: "PUBLISHED",
      category: "AI/ML",
      difficulty: 4,
      features: "Multi-angle volume prediction\nRegression-based estimation\nDeep learning model\nONNX deployment support",
      lessons: "Multi-angle input provides better model accuracy than single images.",
      future: "Add support for different container shapes.",
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  // 6. Create Achievements (no explicit achievements in resume, only arcade-based)
  const achievements = [
    {
      title: "Full Stack Master",
      description: "Complete all four engineering quests.",
      icon: "zap",
      points: 100,
      unlocked: false,
      category: "EXPLORATION",
      condition: "all_quests_complete",
    },
    {
      title: "ML Pioneer",
      description: "Explore all AI/ML projects.",
      icon: "cpu",
      points: 50,
      unlocked: false,
      category: "EXPLORATION",
      condition: "all_ml_projects",
    },
    {
      title: "Backend Architect",
      description: "Master the backend development quests.",
      icon: "server",
      points: 75,
      unlocked: false,
      category: "EXPLORATION",
      condition: "backend_complete",
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({ data: ach });
  }

  // 7. Create Education (from resume)
  await prisma.education.create({
    data: {
      institution: "MVIT",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Information Technology",
      startDate: "2021",
      endDate: "2025",
      grade: "",
    },
  });

  // 8. Create Social Links (from resume)
  await prisma.socialLink.create({
    data: { platform: "GitHub", url: "https://github.com/23f1000562", icon: "github" },
  });
  await prisma.socialLink.create({
    data: { platform: "LinkedIn", url: "https://www.linkedin.com/in/mohitkishorr/", icon: "linkedin" },
  });
  await prisma.socialLink.create({
    data: { platform: "Email", url: "mailto:mohitkishore145@gmail.com", icon: "mail" },
  });

  console.log("Database seeded successfully with Mohit Kishore resume data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
