
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    adminLogin: async (req, res) => {
      console.log(req.body);
      try {
        const { name, password } = req.body;
    console.log(req.body);
        if (!name || !password) {
          return res.status(400).json({ message: 'Name and password are required fields.' });
        }
    
        if (name === 'jaseela' && password === '12345') {
          const payload = {
            email: name
          };
          const accessToken = jwt.sign(payload, 'jwt_9488', { expiresIn: '7d' });
          return res.status(200).json({ accessToken });
        } else {
          return res.status(401).json({ message: 'Invalid credentials.' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred.' });
      }
    },
    
}