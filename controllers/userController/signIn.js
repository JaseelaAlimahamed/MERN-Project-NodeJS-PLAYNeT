
const users = require('../../models/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')


const USER_REGEX = /^[a-zA-z][a-zA-Z0-9-_ ]{3,23}$/;
const MOBILE_REGEX = /^[0-9]{10}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;

module.exports = {
    mobileExist: async (req, res) => {
        try {
            if (!req.body.mobile) {
                return res.status(400).json({ message: 'mobile - field required' });
            }
            if (!MOBILE_REGEX.test(req.body.mobile)) {
                return res.status(400).send({ message: 'Enter a valid number.' });
            }
            const response = await users.findOne({ mobile: req.body.mobile });
            if (response) {
                return res.status(409).json({ message: 'mobile number already exists' });
            } else {
                console.log('working');
                return res.status(200).json({ message: 'mobile number does not exist' });
            }
        } catch (err) {
            console.log(err.message);
            res.status(400).json({ message: 'error occurred', err: err.message });
        }
    },
    userSignup: (req, res) => {
        userSignup: async (req, res) => {
            try {
              if (!req.body.mobile || !req.body.password || !req.body.name) {
                return res.status(400).json({ message: 'name, mobile, password - fields required' });
              }         
              if (!USER_REGEX.test(req.body.name)) {
                return res.status(400).json({
                  message: 'name - "4 to 23 characters", "Must begin with a letter", "Letters, numbers, underscores, hyphens allowed."'
                });
              }
              if (!PWD_REGEX.test(req.body.password)) {
                return res.status(400).send({
                  message: 'password - "8 to 24 characters", "Must include uppercase and lowercase letters, a number and a special character", "Allowed special characters: ! @ # * $ %"'
                });
              }
              if (!MOBILE_REGEX.test(req.body.mobile)) {
                return res.status(400).send({ message: 'Enter a valid number.' });
              }
              const existingUser = await users.findOne({ mobile: req.body.mobile });
          
              if (existingUser) {
                return res.status(409).json({ message: 'mobile - already exists' });
              } else {
                req.body.password = await bcrypt.hash(req.body.password, 10);
                const newUser = await users.create(req.body);
                const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
                res.status(201).json(accessToken);
              }
            } catch (err) {
              console.log(err.message);
              res.status(400).json({ message: 'error occurred', err: err.message });
            }
          }
          
    },
    googleSignin: async (req, res) => {
       

        try {
            
          if (!req.body.email || !req.body.displayName) {
            return res.status(400).json({ message: 'email, fullName - fields required' });
          }
      
          const { email, displayName} = req.body;
    
          const existingUser = await users.findOne({ email });
     
          if (existingUser) {
            const accessToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.status(200).json({ accessToken, name: existingUser.name, email: existingUser.email });
          }
      
          const newUser = await users.create({ email, name: displayName });
          const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
          res.status(200).json({ accessToken, name: newUser.name, email: newUser.email });
        } catch (err) {
          console.log(err.message);

          res.status(400).json({ message: 'error occurred', err: err.message });
        }
      },      
      userSignin: async (req, res) => {
        try {
          const { mobile, password } = req.body;
      
          console.log(mobile);
      
          if (!mobile || !password) {
            return res.status(400).json({ message: 'mobile number and password required.' });
          } else {
            const foundUser = await users.findOne({ mobile });
      
            if (!foundUser) {
              return res.status(401).json({ message: 'incorrect mobile number or password' });
            } else {
              const passwordMatch = await bcrypt.compare(password, foundUser.password);
      
              if (passwordMatch) {
                if (foundUser.blockStatus) {
                  return res.status(403).json({ message: 'user blocked by admin' });
                } else {
                  const accessToken = jwt.sign({ id: foundUser._id },process.env.JWT_SECRET, { expiresIn: '7d' });
                  console.log(foundUser);
                  res.status(200).json({
                    accessToken,
                    name: foundUser.name,
                    mobile: foundUser.mobile,
                    wallet: foundUser.wallet
                  });
                }
              } else {
                res.status(401).json({ message: 'incorrect mobile number or password' });
              }
            }
          }
        } catch (err) {
          console.log(err.message);
          res.status(400).json({ message: 'error occurred', err: err.message });
        }
      },
      setName: async (req, res) => {
        const { name } = req.body
        if (!name) return res.status(400).json({ message: 'name - field is required' });
        try {
            let user = await users.findOneAndUpdate({ _id: req._id }, { $set: { name } }, { new: true })
            return res.status(200).json({ message: 'name changed succesfully', name: user.name });
        } catch (error) {
            console.log(error.message)
            res.status(400).json({ message: 'error occured', error: error.messaage })
        }
    }
}