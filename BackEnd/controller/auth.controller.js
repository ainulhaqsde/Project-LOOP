import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../model/user.js";
import { z } from "zod";


// =====================================================
// REGISTER CONTROLLER
// =====================================================

const register_controller = async (req, res) => {

  const user_schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
  });


  try {

    // =================================================
    // VALIDATE REQUEST BODY
    // =================================================

    const isValid = user_schema.safeParse(req.body);


    if (!isValid.success) {

      return res.status(400).json({
        success: false,
        message: isValid.error.issues[0]?.message || "Invalid input"
      });

    }


    const {
      name,
      email,
      password,
      confirmPassword
    } = isValid.data;


    // =================================================
    // CHECK PASSWORDS
    // =================================================

    if (password !== confirmPassword) {

      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });

    }


    // =================================================
    // CHECK EXISTING USER
    // =================================================

    const existingUser = await User.findOne({
      email
    });


    if (existingUser) {

      return res.status(400).json({
        success: false,
        message: "User already exists"
      });

    }


    // =================================================
    // HASH PASSWORD
    // =================================================

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // =================================================
    // CREATE USER
    // =================================================

    const user = await User.create({

      name,

      email,

      password: hashedPassword

    });


    // =================================================
    // SUCCESS RESPONSE
    // =================================================

    return res.status(201).json({

      success: true,

      message: "User registered successfully",

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role

      }

    });


  } catch (error) {

    console.error(
      "Registration error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message

    });

  }

};


// =====================================================
// LOGIN CONTROLLER
// =====================================================

const login_controller = async (req, res) => {

  const login_schema = z.object({

    email: z.email("Invalid email address"),

    password: z.string().min(
      1,
      "Password is required"
    )

  });


  try {

    // =================================================
    // VALIDATE REQUEST BODY
    // =================================================

    const isValid = login_schema.safeParse(
      req.body
    );


    if (!isValid.success) {

      return res.status(400).json({

        success: false,

        message:
          isValid.error.issues[0]?.message ||
          "Invalid input"

      });

    }


    const {
      email,
      password
    } = isValid.data;


    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findOne({
      email
    });


    if (!user) {

      return res.status(401).json({

        success: false,

        message: "Invalid email or password"

      });

    }


    // =================================================
    // CHECK PASSWORD
    // =================================================

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!isPasswordCorrect) {

      return res.status(401).json({

        success: false,

        message: "Invalid email or password"

      });

    }


    // =================================================
    // CHECK JWT SECRET
    // =================================================

    if (!process.env.JWT_SECRET) {

      console.error(
        "JWT_SECRET is missing from .env"
      );

      return res.status(500).json({

        success: false,

        message:
          "Server authentication configuration error"

      });

    }


    // =================================================
    // CREATE JWT
    // =================================================

    const token = jwt.sign(

      {

        userId: user._id.toString(),

        role: user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d"

      }

    );


    // =================================================
    // SEND RESPONSE
    // =================================================

    return res.status(200).json({

      success: true,

      message: "Login successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role

      }

    });


  } catch (error) {

    console.error(
      "Login error:",
      error
    );


    return res.status(500).json({

      success: false,

      message: "Server error",

      error: error.message

    });

  }

};


// =====================================================
// EXPORT
// =====================================================

export {
  register_controller,
  login_controller
};

