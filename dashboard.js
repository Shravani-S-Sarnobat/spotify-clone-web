// ============================================
// Check Authentication
// ============================================
function checkAuth() {
  const userData = localStorage.getItem('spotifyUser');
  if (!userData) {
    // Redirect to login if not authenticated
    window.location.href = 'index.html';
    return null;
  }
  return JSON.parse(userData);
}

// ============================================
// Initialize User Info
// ============================================
function initializeUser() {
  const user = checkAuth();
  if (!user) return;

  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  
  if (userName && user.name) {
    userName.textContent = user.name;
  }
  
  if (userAvatar && user.name) {
    const initials = user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    userAvatar.textContent = initials;
  }
}

// ============================================
// Set Greeting Based on Time
// ============================================
function setGreeting() {
  const hour = new Date().getHours();
  const greeting = document.getElementById('greeting');
  
  if (!greeting) return;
  
  if (hour < 12) {
    greeting.textContent = 'Good morning';
  } else if (hour < 18) {
    greeting.textContent = 'Good afternoon';
  } else {
    greeting.textContent = 'Good evening';
  }
}

// ============================================
// Theme Toggle Functionality
// ============================================
function initializeTheme() {
  // Check for saved theme preference or default to dark mode
  const savedTheme = localStorage.getItem('spotifyTheme') || 'dark';
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
  
  updateThemeIcon();
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle('light-mode');
  
  // Save preference
  const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('spotifyTheme', currentTheme);
  
  updateThemeIcon();
  
  // Add a subtle notification
  console.log(`Theme switched to ${currentTheme} mode`);
}

function updateThemeIcon() {
  const themeIcon = document.getElementById('themeIcon');
  const isLightMode = document.body.classList.contains('light-mode');
  
  if (!themeIcon) return;
  
  if (isLightMode) {
    // Moon icon for dark mode option
    themeIcon.innerHTML = `
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
    `;
  } else {
    // Sun icon for light mode option
    themeIcon.innerHTML = `
      <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
      <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="2"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="2"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="2"/>
      <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2"/>
      <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="2"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" stroke-width="2"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" stroke-width="2"/>
    `;
  }
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  if (!themeToggle) return;
  
  themeToggle.addEventListener('click', toggleTheme);
}

// ============================================
// User Menu Dropdown
// ============================================
function setupUserMenu() {
  const userMenu = document.getElementById('userMenu');
  const dropdownMenu = document.getElementById('dropdownMenu');
  
  if (!userMenu || !dropdownMenu) return;
  
  userMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
  });
  
  dropdownMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// ============================================
// Logout Functionality
// ============================================
function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (!logoutBtn) return;
  
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear user data (but keep theme preference)
    localStorage.removeItem('spotifyUser');
    
    // Redirect to login
    window.location.href = 'index.html';
  });
}

// ============================================
// Navigation Buttons
// ============================================
function setupNavigation() {
  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }
  
  if (forwardBtn) {
    forwardBtn.addEventListener('click', () => {
      window.history.forward();
    });
  }
}

// ============================================
// Mobile Menu Toggle
// ============================================
function setupMobileMenu() {
  const sideMenu = document.getElementById('sideMenu');
  
  // Create hamburger button for mobile
  const navLeft = document.querySelector('.nav-left');
  if (!navLeft) return;
  
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-btn hamburger';
  hamburger.id = 'hamburger';
  hamburger.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
  `;
  
  // Insert at beginning of nav-left
  navLeft.insertBefore(hamburger, navLeft.firstChild);
  
  hamburger.addEventListener('click', () => {
    sideMenu.classList.toggle('open');
  });
  
  // Close menu when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sideMenu.contains(e.target) && !hamburger.contains(e.target)) {
        sideMenu.classList.remove('open');
      }
    }
  });
}

// ============================================
// Play Button Interactions
// ============================================
function setupPlayButtons() {
  const playButtons = document.querySelectorAll('.play-btn');
  
  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Visual feedback
      btn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btn.style.transform = '';
      }, 100);
      
      console.log('Playing music...');
      // Add play functionality here
    });
  });
}

// ============================================
// Card Click Handlers
// ============================================
function setupCardClicks() {
  const cards = document.querySelectorAll('.card, .recent-item');
  
  cards.forEach(card => {
    card.addEventListener('click', () => {
      console.log('Opening track/playlist...');
      // Add navigation to track/playlist page
    });
  });
}

// ============================================
// Menu Item Click Handlers
// ============================================
function setupMenuItems() {
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all items
      menuItems.forEach(i => i.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');
      
      console.log('Navigating to:', item.textContent.trim());
      // Add navigation logic here
    });
  });
}

// ============================================
// Create Playlist Button
// ============================================
function setupCreatePlaylist() {
  const createBtn = document.querySelector('.create-playlist-btn');
  
  if (!createBtn) return;
  
  createBtn.addEventListener('click', () => {
    // Simple prompt for demo
    const playlistName = prompt('Enter playlist name:');
    
    if (playlistName && playlistName.trim()) {
      console.log('Creating new playlist:', playlistName);
      alert(`Playlist "${playlistName}" created successfully!`);
      // Add create playlist functionality here
    }
  });
}

// ============================================
// Keyboard Shortcuts
// ============================================
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-bar input');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // Ctrl/Cmd + Shift + L for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// ============================================
// Initialize Application
// ============================================
function init() {
  // Check authentication first
  checkAuth();
  
  // Initialize theme before anything else
  initializeTheme();
  
  // Initialize user info
  initializeUser();
  
  // Set time-based greeting
  setGreeting();
  
  // Setup all event listeners
  setupThemeToggle();
  setupUserMenu();
  setupLogout();
  setupNavigation();
  setupMobileMenu();
  setupPlayButtons();
  setupCardClicks();
  setupMenuItems();
  setupCreatePlaylist();
  setupKeyboardShortcuts();
  
  console.log('🎵 Dashboard initialized successfully!');
  console.log('💡 Keyboard shortcuts:');
  console.log('   Ctrl/Cmd + K: Focus search');
  console.log('   Ctrl/Cmd + Shift + L: Toggle theme');
}

// Run initialization when DOM is ready
document.addEventListener('DOMContentLoaded', init);