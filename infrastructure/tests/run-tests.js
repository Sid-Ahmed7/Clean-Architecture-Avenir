const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const serverPath = path.resolve(__dirname, '..', 'server', 'src', 'index.ts');
const testScriptPath = path.resolve(__dirname, 'api-tests.js');
const serverPort = 3000;
const serverStartTimeout = 5000; // 5 seconds

console.log('Starting server and running API tests...');
console.log(`Server path: ${serverPath}`);
console.log(`Test script path: ${testScriptPath}`);

// Check if the server file exists
if (!fs.existsSync(serverPath)) {
  console.error(`Server file not found: ${serverPath}`);
  process.exit(1);
}

// Check if the test script exists
if (!fs.existsSync(testScriptPath)) {
  console.error(`Test script not found: ${testScriptPath}`);
  process.exit(1);
}

// Start the server using ts-node
console.log('Starting server...');
const server = spawn('npx', ['ts-node', serverPath], {
  stdio: 'pipe',
  shell: true
});

let serverOutput = '';

server.stdout.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.log(`[SERVER]: ${output.trim()}`);
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  serverOutput += output;
  console.error(`[SERVER ERROR]: ${output.trim()}`);
});

server.on('error', (error) => {
  console.error(`Failed to start server: ${error.message}`);
  process.exit(1);
});

// Wait for the server to start before running tests
console.log(`Waiting ${serverStartTimeout/1000} seconds for server to start...`);
setTimeout(() => {
  // Check if server is running by looking for the expected output
  if (!serverOutput.includes(`Server running on port ${serverPort}`)) {
    console.error('Server did not start properly. Server output:');
    console.error(serverOutput);
    server.kill();
    process.exit(1);
  }

  console.log('Server started successfully. Running tests...');
  
  // Run the test script
  const tests = spawn('node', [testScriptPath], {
    stdio: 'inherit',
    shell: true
  });

  tests.on('error', (error) => {
    console.error(`Failed to run tests: ${error.message}`);
    server.kill();
    process.exit(1);
  });

  tests.on('close', (code) => {
    console.log(`Tests completed with exit code: ${code}`);
    
    // Terminate the server
    console.log('Shutting down server...');
    server.kill();
    
    // Exit with the same code as the tests
    process.exit(code);
  });
}, serverStartTimeout);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Process interrupted. Shutting down...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Process terminated. Shutting down...');
  server.kill();
  process.exit(0);
});