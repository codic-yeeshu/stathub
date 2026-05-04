// Test-only env. Loaded before any module imports so modules that read
// from process.env at import-time (jwt.js, db.js) don't crash.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-do-not-use-in-prod";
process.env.DATABASE_URL = "postgres://test:test@localhost:5432/test";
process.env.ARCJET_KEY = "";
process.env.ARCJET_MODE = "DRY_RUN";
process.env.RESEND_API_KEY = "test-resend";
process.env.GOOGLE_CLIENT_ID = "test-google-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-secret";
process.env.CLIENT_URL = "http://localhost:5173";
process.env.CLIENT_PASSWORD_RESET_URL = "http://localhost:5173/reset-password";
process.env.PORT = "0";
