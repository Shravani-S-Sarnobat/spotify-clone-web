// ============================================
// State Management
// ============================================
let isLogin = true;
let showPassword = false;

// ============================================
// DOM Elements
// ============================================
const elements = {
  // Text elements
  title: document.getElementById('title'),
  subtitle: document.getElementById('subtitle'),
  
  // Groups/Containers
  nameGroup: document.getElementById('nameGroup'),
  confirmGroup: document.getElementById('confirmGroup'),
  formOptions: document.getElementById('formOptions'),
  termsGroup: document.getElementById('termsGroup'),
  successMessage: document.getElementById('successMessage'),
  successText: document.getElementById('successText'),
  
  // Buttons
  submitBtn: document.getElementById('submitBtn'),
  toggleBtn: document.getElementById('toggleBtn'),
  toggleText: document.getElementById('toggleText'),
  togglePassword: document.getElementById('togglePassword'),
  eyeIcon: document.getElementById('eyeIcon'),
  
  // Input fields
  nameInput: document.getElementById('nameInput'),
  emailInput: document.getElementById('emailInput'),
  passwordInput: document.getElementById('passwordInput'),
  confirmInput: document.getElementById('confirmInput'),
  termsCheckbox: document.getElementById('termsCheckbox'),
  
  // Input wrappers (for styling)
  nameWrapper: document.getElementById('nameWrapper'),
  emailWrapper: document.getElementById('emailWrapper'),
  passwordWrapper: document.getElementById('passwordWrapper'),
  confirmWrapper: document.getElementById('confirmWrapper'),
  
  // Error messages
  nameError: document.getElementById('nameError'),
  emailError: document.getElementById('emailError'),
  passwordError: document.getElementById('passwordError'),
  confirmError: document.getElementById('confirmError'),
  termsError: document.getElementById('termsError')
};

// ============================================
// User Database Functions (localStorage)
// ============================================
function getAllUsers() {
  try {
    const users = localStorage.getItem('spotifyUsers');
    return users ? JSON.parse(users) : [];
  } catch (e) {
    console.error('Error reading users:', e);
    return [];
  }
}

function saveUser(userData) {
  try {
    const users = getAllUsers();
    users.push(userData);
    localStorage.setItem('spotifyUsers', JSON.stringify(users));
    return true;
  } catch (e) {
    console.error('Error saving user:', e);
    return false;
  }
}

function findUserByEmail(email) {
  const users = getAllUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

function validateCredentials(email, password) {
  const user = findUserByEmail(email);
  if (!user) {
    return { success: false, message: 'User not found. Please sign up first.' };
  }
  if (user.password !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }
  return { success: true, user: user };
}

// ============================================
// Validation Rules
// ============================================
const validators = {
  name: (value) => {
    if (!value.trim()) return 'Enter a name for your profile.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  
  email: (value, isSignup = false) => {
    if (!value.trim()) return 'Please enter your Spotify username or email address.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    if (!emailRegex.test(value) && !usernameRegex.test(value)) {
      return 'Please enter a valid email or username.';
    }
    
    // Check if email already exists during signup
    if (isSignup && findUserByEmail(value)) {
      return 'This email is already registered. Please login instead.';
    }
    
    return '';
  },
  
  password: (value) => {
    if (!value) return 'Please enter your password.';
    if (value.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-z]/.test(value)) return 'Password needs a lowercase letter.';
    if (!/[A-Z]/.test(value)) return 'Password needs an uppercase letter.';
    if (!/\d/.test(value)) return 'Password needs a number.';
    return '';
  },
  
  confirm: (value, password) => {
    if (!value) return 'Please confirm your password.';
    if (value !== password) return 'Passwords don\'t match.';
    return '';
  },
  
  terms: (checked) => {
    if (!checked) return 'Please accept the terms to continue.';
    return '';
  }
};

// ============================================
// Error Handling Functions
// ============================================
function setError(field, message) {
  const wrapper = elements[`${field}Wrapper`];
  const errorEl = elements[`${field}Error`];
  
  if (message) {
    if (wrapper) wrapper.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('show');
    }
  } else {
    if (wrapper) wrapper.classList.remove('error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('show');
    }
  }
}

function clearAllErrors() {
  ['name', 'email', 'password', 'confirm', 'terms'].forEach(field => {
    setError(field, '');
  });
}

// ============================================
// Success Message
// ============================================
function showSuccess(message) {
  elements.successText.textContent = message;
  elements.successMessage.classList.add('show');
  
  setTimeout(() => {
    elements.successMessage.classList.remove('show');
  }, 4000);
}

// ============================================
// Form Validation
// ============================================
function validateForm() {
  let isValid = true;
  clearAllErrors();
  
  // Validate name (signup only)
  if (!isLogin) {
    const nameError = validators.name(elements.nameInput.value);
    if (nameError) {
      setError('name', nameError);
      isValid = false;
    }
  }
  
  // Validate email/username (pass isSignup flag)
  const emailError = validators.email(elements.emailInput.value, !isLogin);
  if (emailError) {
    setError('email', emailError);
    isValid = false;
  }
  
  // Validate password
  const passwordError = validators.password(elements.passwordInput.value);
  if (passwordError) {
    setError('password', passwordError);
    isValid = false;
  }
  
  // Validate confirm password (signup only)
  if (!isLogin) {
    const confirmError = validators.confirm(
      elements.confirmInput.value,
      elements.passwordInput.value
    );
    if (confirmError) {
      setError('confirm', confirmError);
      isValid = false;
    }
    
    // Validate terms checkbox
    const termsError = validators.terms(elements.termsCheckbox.checked);
    if (termsError) {
      setError('terms', termsError);
      isValid = false;
    }
  }
  
  return isValid;
}

// ============================================
// Form Submission
// ============================================
function handleSubmit() {
  if (!validateForm()) {
    return;
  }
  
  const email = elements.emailInput.value;
  const password = elements.passwordInput.value;
  
  if (isLogin) {
    // LOGIN LOGIC
    console.log('Attempting login for:', email);
    const result = validateCredentials(email, password);
    
    if (!result.success) {
      console.log('Login failed:', result.message);
      setError('email', result.message);
      return;
    }
    
    console.log('Login successful for user:', result.user.name);
    
    // Save current session FIRST
    try {
      const sessionData = {
        name: result.user.name,
        email: result.user.email,
        loggedIn: true,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('spotifyUser', JSON.stringify(sessionData));
      console.log('✓ Session saved successfully:', sessionData);
    } catch (e) {
      console.error('✗ Error saving session:', e);
      setError('email', 'Failed to save session. Please try again.');
      return;
    }
    
    showSuccess('🎵 Welcome back! Redirecting to your music...');
    
    // Redirect to dashboard
    setTimeout(() => {
      console.log('Redirecting to dashboard.html...');
      window.location.href = 'dashboard.html';
    }, 1500);
    
  } else {
    // SIGNUP LOGIC
    const name = elements.nameInput.value;
    
    const newUser = {
      name: name,
      email: email,
      password: password, // In production, this should be hashed!
      createdAt: new Date().toISOString()
    };
    
    const saved = saveUser(newUser);
    
    if (!saved) {
      setError('email', 'Failed to create account. Please try again.');
      return;
    }
    
    console.log('✓ User registered successfully:', email);
    showSuccess('🎉 Account created successfully! You can now log in.');
    
    // Switch to login mode after successful signup
    setTimeout(() => {
      toggleMode();
      elements.emailInput.value = email; // Pre-fill email
    }, 2000);
  }
  
  clearForm();
}

function clearForm() {
  if (elements.nameInput) elements.nameInput.value = '';
  if (elements.passwordInput) elements.passwordInput.value = '';
  if (elements.confirmInput) elements.confirmInput.value = '';
  if (elements.termsCheckbox) elements.termsCheckbox.checked = false;
  
  // Don't clear email on login mode (useful for pre-fill after signup)
  if (!isLogin) {
    elements.emailInput.value = '';
  }
}

// ============================================
// Toggle Login/Signup Mode
// ============================================
function toggleMode() {
  isLogin = !isLogin;
  clearAllErrors();
  clearForm();
  elements.successMessage.classList.remove('show');
  
  // Update header text
  elements.title.textContent = isLogin 
    ? 'Log in to Spotify' 
    : 'Sign up for free to start listening';
  elements.subtitle.textContent = isLogin 
    ? 'Welcome back! Ready to discover new music?' 
    : 'Join millions of listeners worldwide';
  
  // Update button text
  elements.submitBtn.textContent = isLogin ? 'Log In' : 'Sign Up';
  
  // Update toggle section
  elements.toggleText.textContent = isLogin 
    ? "Don't have an account? " 
    : 'Already have an account? ';
  elements.toggleBtn.textContent = isLogin 
    ? 'Sign up for Spotify' 
    : 'Log in to Spotify';
  
  // Show/hide relevant fields
  elements.nameGroup.classList.toggle('hidden', isLogin);
  elements.confirmGroup.classList.toggle('hidden', isLogin);
  elements.formOptions.classList.toggle('hidden', !isLogin);
  elements.termsGroup.classList.toggle('hidden', isLogin);
}

// ============================================
// Password Visibility Toggle
// ============================================
function togglePasswordVisibility() {
  showPassword = !showPassword;
  
  const type = showPassword ? 'text' : 'password';
  elements.passwordInput.type = type;
  if (elements.confirmInput) {
    elements.confirmInput.type = type;
  }
  
  // Update eye icon SVG path
  const eyePath = showPassword 
    ? 'M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z'
    : 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z';
  
  elements.eyeIcon.innerHTML = `<path d="${eyePath}"/>`;
}

// ============================================
// Social Login Handlers
// ============================================
function handleSocialLogin(provider) {
  console.log(`Initiating ${provider} login...`);
  showSuccess(`Connecting to ${provider}...`);
  
  // Here you would redirect to OAuth provider
  // window.location.href = `/auth/${provider}`;
}

// ============================================
// Input Event Listeners
// ============================================
function setupInputListeners() {
  const inputConfigs = [
    { input: elements.nameInput, field: 'name' },
    { input: elements.emailInput, field: 'email' },
    { input: elements.passwordInput, field: 'password' },
    { input: elements.confirmInput, field: 'confirm' }
  ];
  
  inputConfigs.forEach(({ input, field }) => {
    if (!input) return;
    
    // Clear error on input
    input.addEventListener('input', () => {
      setError(field, '');
    });
    
    // Submit on Enter key
    input.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    });
  });
  
  // Terms checkbox listener
  if (elements.termsCheckbox) {
    elements.termsCheckbox.addEventListener('change', () => {
      setError('terms', '');
    });
  }
}

// ============================================
// Setup Social Buttons
// ============================================
function setupSocialButtons() {
  const socialBtns = document.querySelectorAll('.social-btn');
  
  socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.classList.contains('google') ? 'Google'
        : btn.classList.contains('facebook') ? 'Facebook'
        : 'Apple';
      handleSocialLogin(provider);
    });
  });
}

// ============================================
// Initialize Application
// ============================================
function init() {
  // Set up event listeners
  elements.submitBtn.addEventListener('click', handleSubmit);
  elements.toggleBtn.addEventListener('click', toggleMode);
  elements.togglePassword.addEventListener('click', togglePasswordVisibility);
  
  // Set up input listeners
  setupInputListeners();
  
  // Set up social buttons
  setupSocialButtons();
  
  // Start in login mode
  isLogin = true;
  
  // Initialize UI state
  elements.nameGroup.classList.add('hidden');
  elements.confirmGroup.classList.add('hidden');
  elements.termsGroup.classList.add('hidden');
  
  console.log('🎵 Spotify Auth System Ready!');
  console.log('📊 Total registered users:', getAllUsers().length);
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);