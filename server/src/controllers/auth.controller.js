const { loginUser, registerUser } = require("../services/auth.service");

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const result = await registerUser({ name, email, password, role });
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(201).json(result.data);
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const result = await loginUser({ email, password });
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }

    return res.status(200).json(result.data);
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.status(200).json({ user: req.user });
}

module.exports = {
  register,
  login,
  me
};
