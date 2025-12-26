<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# TimeFlow Scheduler with Voice Commands

A modern scheduling application with AI-powered voice command capabilities.

## Features

- **Voice Command Scheduling**: Add tasks to your schedule using natural language voice commands
- **AI-Powered Task Extraction**: Uses DeepSeek-V3 model to intelligently parse your voice commands
- **Intuitive UI**: Modern interface with theme customization
- **Fallback Parsing**: Built-in heuristic parser as backup if AI parsing fails

## Voice Command Examples

- "Schedule a team meeting tomorrow at 2 PM"
- "Add doctor appointment on Friday at 10:30 AM"
- "Create a lunch with client at noon on Tuesday"

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `PORT`: Server port (default: 5000)
   - `DEEPSEEK_API_KEY`: Your DeepSeek API key for AI task extraction

3. Run the app:
   ```
   npm run dev
   ```

## Using Voice Commands

1. Open the Command Center by pressing `Ctrl+K` or clicking the floating AI button
2. Click the microphone icon (it will pulse red when active)
3. Speak your command clearly
4. The system will process your speech, extract task details, and add it to your schedule
5. You'll see confirmation feedback when the task is scheduled

## Browser Compatibility

Voice recognition works best in Chrome, Edge, and other Chromium-based browsers that support the Web Speech API.
