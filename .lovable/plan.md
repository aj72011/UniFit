
# ProjectGrade AI — MVP Plan

## Overview
A platform where students upload academic/personal projects and receive AI-powered grading aligned with the standards of their target universities. The platform also helps students discover research project ideas tailored to specific professors at those universities, helping them land internships or admissions.

## Pages & Features

### 1. Landing Page
- Clear value proposition: "Grade your projects against top university standards & find your ideal research mentor"
- Call-to-action to sign up or try a demo
- How it works section (3 steps: Upload → Grade → Discover Ideas)

### 2. Authentication (Sign Up / Log In)
- Email + password signup and login
- User profile with basic info: name, field of study, target universities

### 3. Dashboard
- Overview of submitted projects and their grades
- Quick access to upload a new project
- Recent professor/idea suggestions

### 4. Project Upload & Grading
- Upload project files (PDF, documents, or paste a description)
- Select target university or program
- AI analyzes the project against a structured rubric covering:
  - Technical depth & innovation
  - Relevance to the chosen university's standards
  - Presentation quality
  - Research methodology (if applicable)
- Results page showing:
  - Overall score with letter grade
  - Rubric breakdown with per-category scores
  - AI-generated feedback with improvement suggestions
  - Comparison note (e.g., "This project would be competitive for X program")

### 5. Professor & Idea Matching
- Browse a curated list of professors by university and research area
- Select a professor to get AI-generated project ideas based on their research focus
- Each suggestion includes: project title, brief description, why it aligns with the professor's work, and tips for reaching out

### 6. Profile & History
- View past project submissions and grades
- Track improvement over time
- Save favorite professors and ideas

## Backend Requirements
- **Database**: Store user profiles, projects, grades, professor data, and saved suggestions
- **AI Integration**: Lovable AI for project grading and idea generation
- **File Storage**: For uploaded project files
- **Authentication**: User accounts with Supabase Auth

## Design Style
- Clean, modern, and academic — think a polished EdTech platform
- Light color scheme with subtle blue/purple accents conveying trust and intelligence
- Card-based layouts for projects, grades, and professor profiles
