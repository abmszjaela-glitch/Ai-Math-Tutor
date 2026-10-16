const cookieOptions = require("../config/cookies");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const prisma = require("../config/prisma");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().max(254).email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").refine((value) => Buffer.byteLength(value, "utf8") <= 72, "Password must be at most 72 bytes"),
  grade: z.number().int().min(1).max(6),
});

const register = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { name, email, password, grade } = validation.data;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const gradeRecord = await prisma.grade.findUnique({
      where: {
        number: grade,
      },
    });

    if (!gradeRecord) {
      return res.status(400).json({
        success: false,
        message: "Selected grade does not exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,

        student: {
          create: {
            name,
            gradeId: gradeRecord.id,
          },
        },
      },

      include: {
        student: {
          include: {
            grade: true,
          },
        },
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        student: {
          id: user.student.id,
          name: user.student.name,
          grade: user.student.grade.number,
        },
      },
    });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ success: false, message: "An account with this email already exists" });
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const login = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid login data",
        errors: validation.error.flatten().fieldErrors,
      });
    }

    const { email, password } = validation.data;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
      include: {
        student: {
          include: {
            grade: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      ...cookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        student: user.student
          ? {
              id: user.student.id,
              name: user.student.name,
              grade: user.student.grade.number,
              avatar: user.student.avatar
                ? {
                    id: user.student.avatar.id,
                    name: user.student.avatar.name,
                  }
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        student: {
          include: {
            grade: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        student: user.student
          ? {
              id: user.student.id,
              name: user.student.name,
              grade: user.student.grade.number,
              avatar: user.student.avatar
                ? {
                    id: user.student.avatar.id,
                    name: user.student.avatar.name,
                  }
                : null,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get current user",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      ...cookieOptions(),
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during logout",
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};