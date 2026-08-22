import assert from 'assert'
import bcrypt from 'bcryptjs'
import { generateToken, generateRefreshToken, verifyToken, verifyRefreshToken } from './src/utils/jwt.js'
import { toSafeUser } from './src/controllers/authController.js'

console.log('🧪 Running Backend Security & Architecture Unit Tests...\n')

// 1. Test JWT Access Token & Type Enforcement
try {
  const token = generateToken('user123', 'admin')
  const decoded = verifyToken(token)
  assert.strictEqual(decoded.id, 'user123')
  assert.strictEqual(decoded.role, 'admin')
  assert.strictEqual(decoded.type, 'access')
  console.log('✅ TEST 1: JWT Access Token generated and verified successfully.')
} catch (e) {
  console.error('❌ TEST 1 FAILED:', e.message)
  process.exit(1)
}

// 2. Test Refresh Token Type Separation (access token cannot be verified as refresh token)
try {
  const accessToken = generateToken('user123', 'admin')
  let caught = false
  try {
    verifyRefreshToken(accessToken)
  } catch (err) {
    caught = true
  }
  assert.strictEqual(caught, true, 'Access token must be rejected by verifyRefreshToken')
  console.log('✅ TEST 2: Type separation verified (Access token rejected as Refresh token).')
} catch (e) {
  console.error('❌ TEST 2 FAILED:', e.message)
  process.exit(1)
}

// 3. Test Refresh Token Verification
try {
  const refreshToken = generateRefreshToken('user123', 'student')
  const decoded = verifyRefreshToken(refreshToken)
  assert.strictEqual(decoded.id, 'user123')
  assert.strictEqual(decoded.role, 'student')
  assert.strictEqual(decoded.type, 'refresh')
  console.log('✅ TEST 3: Refresh token generated and verified with correct type claim.')
} catch (e) {
  console.error('❌ TEST 3 FAILED:', e.message)
  process.exit(1)
}

// 4. Test Password Hashing with Bcrypt
try {
  const password = 'StrongPassword2026!'
  const hash = await bcrypt.hash(password, 12)
  const isMatch = await bcrypt.compare(password, hash)
  const isWrongMatch = await bcrypt.compare('WrongPassword', hash)
  assert.strictEqual(isMatch, true)
  assert.strictEqual(isWrongMatch, false)
  console.log('✅ TEST 4: Bcrypt password hashing (12 rounds) verified.')
} catch (e) {
  console.error('❌ TEST 4 FAILED:', e.message)
  process.exit(1)
}

// 5. Test toSafeUser Serialization (strips password, tokens, internal keys)
try {
  const unsafeUser = {
    _id: '65f123456789abcdef012345',
    name: { en: 'John Doe', bn: 'জন ডো' },
    email: 'john@example.com',
    password: '$2a$12$hashedPasswordHere',
    resetPasswordToken: 'secretToken',
    __v: 0,
    role: 'teacher'
  }

  const safe = toSafeUser(unsafeUser, 'teacher')
  assert.strictEqual(safe.password, undefined, 'Password must be omitted')
  assert.strictEqual(safe.resetPasswordToken, undefined, 'Reset token must be omitted')
  assert.strictEqual(safe.__v, undefined, '__v must be omitted')
  assert.strictEqual(safe.email, 'john@example.com')
  assert.strictEqual(safe.role, 'teacher')
  console.log('✅ TEST 5: User serialization safely strips password and internal tokens.')
} catch (e) {
  console.error('❌ TEST 5 FAILED:', e.message)
  process.exit(1)
}

console.log('\n🎉 ALL 5 SECURITY UNIT TESTS PASSED!')
