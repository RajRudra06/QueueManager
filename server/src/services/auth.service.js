const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

const env = require("../config/env");
const User = require("../models/user.model");
const store = require("../data/store");
const { signToken } = require("../utils/token");

async function registerUser({ name, email, password, role }) {
  const normalizedEmail = email.toLowerCase();
  const existing = env.demoMode
    ? store.users.find((u) => u.email === normalizedEmail)
    : await User.findOne({ email: normalizedEmail });

  if (existing) {
    return { error: "Email already registered", status: 409 };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  let user;
  if (env.demoMode) {
    user = {
      id: randomUUID(),
      name,
      email: normalizedEmail,
      passwordHash,
      role: role || "STUDENT",
      createdAt: new Date().toISOString()
    };
    store.users.push(user);
  } else {
    const created = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: role || "STUDENT"
    });

    user = {
      id: created._id.toString(),
      name: created.name,
      email: created.email,
      role: created.role
    };
  }

  return issueAuthResponse(user);
}

async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase();
  let user;
  if (env.demoMode) {
    user = store.users.find((u) => u.email === normalizedEmail);
  } else {
    const doc = await User.findOne({ email: normalizedEmail });
    user = doc
      ? {
          id: doc._id.toString(),
          name: doc.name,
          email: doc.email,
          role: doc.role,
          passwordHash: doc.passwordHash
        }
      : null;
  }

  if (!user || !user.passwordHash) {
    return { error: "Invalid credentials", status: 401 };
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    return { error: "Invalid credentials", status: 401 };
  }

  return issueAuthResponse(user);
}

function issueAuthResponse(user) {
  const token = signToken(user);

  return {
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  };
}

module.exports = {
  registerUser,
  loginUser,
  issueAuthResponse
};
