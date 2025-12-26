// Server starter script with error handling
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
const logFile = fs.createWriteStream(path.join(logsDir, `server-${date}.log`));
const errorLogFile = fs.createWriteStream(path.join(logsDir, `server-error-${date}.log`));

console.log('🚀 Starting TimeFlow Server...');
console.log(`📝 Logs will be saved to: ${path.join(logsDir, `server-${date}.log`)}`);

// Check if MongoDB URI is set
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not set in .env file');
  console.error('Please make sure your .env file contains a valid MONGODB_URI');
  process.exit(1);
}

// Check if PORT is set
const PORT = process.env.PORT || 5000;
console.log(`🔌 Server will run on port: ${PORT}`);

// Start the server
const server = spawn('node', ['server/index.js'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: process.env
});

// Handle server output
server.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(output);
  logFile.write(`${new Date().toISOString()} - ${output}\n`);
});

server.stderr.on('data', (data) => {
  const error = data.toString().trim();
  console.error(`❌ ERROR: ${error}`);
  errorLogFile.write(`${new Date().toISOString()} - ${error}\n`);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Server process exited with code ${code}`);
    errorLogFile.write(`${new Date().toISOString()} - Server process exited with code ${code}\n`);
  }
  
  logFile.end();
  errorLogFile.end();
});

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  server.kill('SIGINT');
  process.exit(0);
});

console.log('\n✅ Server started successfully!');
console.log('Press Ctrl+C to stop the server');
console.log('\n📡 Server logs:');
console.log('-'.repeat(50));
