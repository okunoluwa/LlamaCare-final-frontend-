<!-- userDatabase.js - Save this as a separate file and include in all pages -->
<script>
// User Database Management System for LlamaCare
class UserDatabase {
    constructor() {
        this.currentUserKey = 'llamacare_current_user';
        this.usersKey = 'llamacare_registered_users';
        this.sessionKey = 'llamacare_session';
        this.initDatabase();
    }
    
    // Initialize database if it doesn't exist
    initDatabase() {
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.sessionKey)) {
            localStorage.setItem(this.sessionKey, JSON.stringify({
                isActive: false,
                startTime: null,
                lastActivity: null,
                pagesVisited: []
            }));
        }
    }
    
    // Register a new user
    registerUser(userData) {
        const users = this.getAllUsers();
        
        // Check if user already exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            return { success: false, message: 'User with this email already exists' };
        }
        
        // Generate unique patient ID
        const patientId = 'LLC-' + Date.now().toString().slice(-6);
        
        // Create user object
        const newUser = {
            id: patientId,
            name: userData.name,
            email: userData.email,
            password: userData.password, // In production, this should be hashed
            location: userData.location,
            gender: userData.gender,
            phone: userData.phone || '',
            language: 'English',
            darkMode: false,
            registrationDate: new Date().toISOString(),
            lastLogin: null,
            profilePicture: null,
            procedures: [],
            summaries: [],
            appointments: []
        };
        
        // Add to database
        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        
        // Auto login after registration
        this.setCurrentUser(newUser);
        
        return { success: true, user: newUser };
    }
    
    // Login user
    loginUser(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // Set as current user
            this.setCurrentUser(user);
            
            return { success: true, user };
        }
        
        return { success: false, message: 'Invalid email or password' };
    }
    
    // Set current user in session
    setCurrentUser(user) {
        // Store current user
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        
        // Update session
        const session = JSON.parse(localStorage.getItem(this.sessionKey));
        session.isActive = true;
        session.startTime = new Date().toISOString();
        session.lastActivity = new Date().toISOString();
        session.userId = user.id;
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        
        // Track page visit
        this.trackPageVisit(window.location.pathname);
    }
    
    // Get current user
    getCurrentUser() {
        const userJson = localStorage.getItem(this.currentUserKey);
        return userJson ? JSON.parse(userJson) : null;
    }
    
    // Get all registered users
    getAllUsers() {
        const usersJson = localStorage.getItem(this.usersKey);
        return usersJson ? JSON.parse(usersJson) : [];
    }
    
    // Update user information
    updateUser(updatedData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'No user logged in' };
        
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            // Update user data
            users[userIndex] = { ...users[userIndex], ...updatedData };
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // Update current user in session
            localStorage.setItem(this.currentUserKey, JSON.stringify(users[userIndex]));
            
            return { success: true, user: users[userIndex] };
        }
        
        return { success: false, message: 'User not found' };
    }
    
    // Logout user
    logoutUser() {
        // Update session
        const session = JSON.parse(localStorage.getItem(this.sessionKey));
        session.isActive = false;
        session.endTime = new Date().toISOString();
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
        
        // Clear current user
        localStorage.removeItem(this.currentUserKey);
        
        return { success: true };
    }
    
    // Track page visits
    trackPageVisit(page) {
        const session = JSON.parse(localStorage.getItem(this.sessionKey));
        if (!session.pagesVisited.includes(page)) {
            session.pagesVisited.push(page);
        }
        session.lastActivity = new Date().toISOString();
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
    }
    
    // Add medical procedure to user
    addProcedure(procedureData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'No user logged in' };
        
        const procedure = {
            id: 'PROC-' + Date.now().toString().slice(-6),
            ...procedureData,
            date: new Date().toISOString(),
            status: 'scheduled'
        };
        
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].procedures) users[userIndex].procedures = [];
            users[userIndex].procedures.push(procedure);
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // Update current user
            localStorage.setItem(this.currentUserKey, JSON.stringify(users[userIndex]));
            
            return { success: true, procedure };
        }
        
        return { success: false, message: 'User not found' };
    }
    
    // Add summary to user
    addSummary(summaryData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'No user logged in' };
        
        const summary = {
            id: 'SUM-' + Date.now().toString().slice(-6),
            ...summaryData,
            date: new Date().toISOString(),
            reviewed: false
        };
        
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].summaries) users[userIndex].summaries = [];
            users[userIndex].summaries.push(summary);
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // Update current user
            localStorage.setItem(this.currentUserKey, JSON.stringify(users[userIndex]));
            
            return { success: true, summary };
        }
        
        return { success: false, message: 'User not found' };
    }
    
    // Add appointment to user
    addAppointment(appointmentData) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return { success: false, message: 'No user logged in' };
        
        const appointment = {
            id: 'APT-' + Date.now().toString().slice(-6),
            ...appointmentData,
            createdDate: new Date().toISOString(),
            status: 'scheduled'
        };
        
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            if (!users[userIndex].appointments) users[userIndex].appointments = [];
            users[userIndex].appointments.push(appointment);
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            // Update current user
            localStorage.setItem(this.currentUserKey, JSON.stringify(users[userIndex]));
            
            return { success: true, appointment };
        }
        
        return { success: false, message: 'User not found' };
    }
    
    // Get user initials for avatar
    getUserInitials(name) {
        if (!name) return '??';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
    
    // Check if user is logged in
    isLoggedIn() {
        const session = JSON.parse(localStorage.getItem(this.sessionKey));
        return session && session.isActive === true;
    }
    
    // Get session data
    getSession() {
        return JSON.parse(localStorage.getItem(this.sessionKey));
    }
    
    // Clear entire database (for testing/reset)
    clearDatabase() {
        localStorage.removeItem(this.currentUserKey);
        localStorage.removeItem(this.usersKey);
        localStorage.removeItem(this.sessionKey);
        this.initDatabase();
        return { success: true, message: 'Database cleared' };
    }
}

// Create global instance
const userDB = new UserDatabase();
</script>