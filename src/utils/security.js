const crypto = require('crypto');

let bcrypt = null;
try {
  bcrypt = require('bcryptjs');
} catch (e) {
  bcrypt = null;
}

/**
 * تشفير كلمة المرور بشكل آمن باستخدام bcryptjs أو بديل scrypt المدمج
 */
async function hashPassword(password) {
  if (bcrypt && typeof bcrypt.hash === 'function') {
    try {
      return await bcrypt.hash(password, 10);
    } catch (err) {
      // الاستمرار إلى البديل المدمج في حال حدوث أي استثناء
    }
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derivedKey}`;
}

/**
 * مطابقة والتحقق من صحة كلمة المرور المدخلة
 */
async function comparePassword(password, storedHash) {
  if (!password || !storedHash) return false;

  if (storedHash.startsWith('scrypt:')) {
    const parts = storedHash.split(':');
    const salt = parts[1];
    const originalHash = parts[2];
    const keyBuffer = Buffer.from(originalHash, 'hex');
    const matchBuffer = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, matchBuffer);
  }

  if (bcrypt && typeof bcrypt.compare === 'function') {
    try {
      return await bcrypt.compare(password, storedHash);
    } catch (err) {
      return false;
    }
  }

  return false;
}

module.exports = {
  hashPassword,
  comparePassword
};
