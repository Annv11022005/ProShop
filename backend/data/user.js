import bcrypt from 'bcrypt';

const users = [
  {
    name: 'admin user',
    email: 'admin@sample.com',
    password: bcrypt.hashSync('admin', 10),
    isAdmin: true,
  },
  {
    name: 'Kim Joohoon',
    email: 'joohoon@email.com',
    password: bcrypt.hashSync('joohoon', 10),
    isAdmin: false,
  },
  {
    name: 'James',
    email: 'james@email.com',
    password: bcrypt.hashSync('james', 10),
    isAdmin: false,
  },
];

export default users;
