try {
  console.log('Testing accounts routes import...');
  await import('./start/routes/accounts.js');
  console.log('✓ Accounts routes loaded successfully');
} catch (e) {
  console.error('✗ Error loading accounts routes:');
  console.error('Message:', e.message);
  console.error('Stack:', e.stack);
  process.exit(1);
}
