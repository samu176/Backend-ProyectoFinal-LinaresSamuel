const config = require('./config');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const bcrypt = require('bcrypt');
const AuthService = require('../services/authService');

// Instancia de AuthService
const authService = new AuthService();

// Estrategia local de Passport.js
passport.use(new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password' 
}, async (email, password, done) => {


  // Verificar si las credenciales son del admin
  if (email === config.adminEmail && password === config.adminPassword) {
    return done(null, { 
      id: 'admin', 
      role: 'admin',
      first_name: 'Administrador',
      last_name: '',
      email: config.adminEmail
    });
  }
  
  try {
    // Verificar las credenciales del usuario
    const user = await authService.verifyCredentials(email, password); 
    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }
  
    return done(null, user);
  } catch (error) {
    return done(error);
  }
  }));
  
  // Estrategia de GitHub de Passport.js
passport.use(new GitHubStrategy({
  clientID: config.githubClientId,
  clientSecret: config.githubClientSecret,
  callbackURL: config.githubCallbackUrl,
  passReqToCallback: true 
},
async function(req, accessToken, refreshToken, profile, cb) { 
  try {

    // Buscar el usuario por su ID de GitHub
    let user = await authService.findUserByGithubId(profile.id); 
    if (user) {

      return cb(null, user);
    } else {
      // Inventar un email si no está visible en el perfil de GitHub
      // Crear usuario y asociar el ID del carrito creado
      user = await authService.register(req, profile.username, '.', `${profile.username}@github.com`, 0, '1234', profile.id);


      return cb(null, user);
    }
  } catch (err) {
    return cb(err, null);
  }
}
));

// Configuramos cómo Passport.js serializa al usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Configuramos cómo Passport.js deserializa al usuario
passport.deserializeUser(async (id, done) => {

  if (id === 'admin') {
    done(null, { 
      id: 'admin', 
      role: 'admin',
      first_name: 'Administrador',
      last_name: '',
      email: config.adminEmail,
      age: 30
    });
  } else {
    const user = await authService.getUserById(id); // Usamos authService.getUserById en lugar de authService.login
    if (user) {
      // Crear un objeto de usuario con todos los campos que se necesitan
      const userDto = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart 
      };

      done(null, userDto);
    } else {
      done(new Error('User not found'), null);
    }
  }
});

// Exportamos la configuración de Passport.js
module.exports = passport;