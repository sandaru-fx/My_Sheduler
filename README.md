<div align="center">
<img width="1200" height="475" alt="TimeFlow Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# TimeFlow Scheduler

**Modern Task Management with AI Voice Commands**

</div>

## Overview

TimeFlow Scheduler is a professional-grade task management application with a modern UI and AI-powered features. The application combines beautiful 3D backgrounds with practical scheduling tools and innovative voice command capabilities.

## Key Features

- **AI Voice Command Integration**: Schedule tasks using natural language voice commands
- **Interactive 3D Backgrounds**: Multiple theme options with dynamic animations
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Offline Capability**: Local storage fallback ensures your tasks are saved even without internet
- **Theme Customization**: Choose from multiple visual themes to personalize your experience
- **User Profiles**: Customizable user information and preferences

## Example Use Cases

### Daily Planning
1. Open TimeFlow Scheduler in the morning
2. View your daily timeline at a glance
3. Press Ctrl+K to open the AI Command Center
4. Say "Schedule team standup at 9:30 AM"
5. Add more tasks using voice or manual entry

### Meeting Management
1. When a colleague requests a meeting, open TimeFlow
2. Click the microphone button and say "Meeting with marketing team tomorrow at 2 PM"
3. The AI automatically adds it to your schedule
4. View your complete timeline to check for conflicts

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database (local or Atlas)
- Modern web browser (Chrome/Edge recommended for voice features)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/timeflow-scheduler.git
   cd timeflow-scheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   DEEPSEEK_API_KEY=your_deepseek_api_key  # Optional for advanced AI features
   ```

4. Start development server:
   ```bash
   npm run dev:full
   ```

5. For production build:
   ```bash
   npm run build
   ```

## Deployment Guide

### Netlify Deployment

1. Create a new site on Netlify
2. Connect to your GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set up environment variables in Netlify dashboard
5. Deploy!

### Server Deployment (MongoDB + Express)

1. Set up MongoDB Atlas cluster
2. Deploy Express backend to a service like Heroku or Render
3. Update frontend API endpoints to point to your deployed backend

## Voice Command Usage

1. Open the Command Center by pressing `Ctrl+K` or clicking the floating AI button
2. Click the microphone icon (turns red when active)
3. Speak commands like:
   - "Schedule meeting with client tomorrow at 3 PM"
   - "Add doctor appointment on Friday at 10:30 AM"
   - "Create lunch with team on Wednesday at noon"
4. The system processes your speech and adds the task to your schedule

## Browser Compatibility

- **Full Support**: Chrome, Edge, Opera (all voice features)
- **Partial Support**: Firefox, Safari (voice features may be limited)
- **Mobile**: Works on modern mobile browsers with responsive design

## Technologies Used

- **Frontend**: React, TypeScript, Three.js, Web Speech API
- **Backend**: Express, MongoDB, Mongoose
- **Styling**: Tailwind CSS
- **Build Tools**: Vite, ESLint, Prettier
