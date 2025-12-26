// Application startup script
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create log file streams
const date = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const logFile = fs.createWriteStream(path.join(logsDir, `app-${date}.log`));

console.log('🚀 Starting TimeFlow Application...');
console.log(`📝 Logs will be saved to: ${path.join(logsDir, `app-${date}.log`)}`);

// Check if PORT is set
const PORT = process.env.PORT || 5000;
const VITE_PORT = 3000;

console.log(`🔌 Backend server will run on port: ${PORT}`);
console.log(`🔌 Frontend server will run on port: ${VITE_PORT}`);

// Start the server
console.log('\n📡 Starting backend server...');
const server = spawn('node', ['server/index.js'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env
});

// Start the frontend
console.log('🌐 Starting frontend server...');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const frontend = spawn(npm, ['run', 'dev'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env,
  shell: true
});

// Handle server output
server.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[SERVER] ${output}`);
  logFile.write(`${new Date().toISOString()} [SERVER] ${output}\n`);
});

server.stderr.on('data', (data) => {
  const error = data.toString().trim();
  console.error(`❌ [SERVER ERROR] ${error}`);
  logFile.write(`${new Date().toISOString()} [SERVER ERROR] ${error}\n`);
});

// Handle frontend output
frontend.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[FRONTEND] ${output}`);
  logFile.write(`${new Date().toISOString()} [FRONTEND] ${output}\n`);
});

frontend.stderr.on('data', (data) => {
  const error = data.toString().trim();
  console.error(`❌ [FRONTEND ERROR] ${error}`);
  logFile.write(`${new Date().toISOString()} [FRONTEND ERROR] ${error}\n`);
});

// Handle process termination
const cleanup = () => {
  console.log('\n🛑 Stopping application...');
  server.kill('SIGINT');
  frontend.kill('SIGINT');
  logFile.end();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

console.log('\n✅ Application started successfully!');
console.log(`🌐 Open your browser at: http://localhost:${VITE_PORT}`);
console.log('Press Ctrl+C to stop the application');
