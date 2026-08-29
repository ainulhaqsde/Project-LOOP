import jwt from "jsonwebtoken";

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authMiddleware = (req, res, next) => {
  try {
    // =================================================
    // GET AUTHORIZATION HEADER
    // =================================================

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // =================================================
    // CHECK BEARER FORMAT
    // =================================================

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication format.",
      });
    }

    // =================================================
    // EXTRACT TOKEN
    // =================================================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing.",
      });
    }

    // =================================================
    // CHECK JWT SECRET
    // =================================================

    if (!process.env.JWT_SECRET) {
      console.error(
        "JWT_SECRET is missing from environment variables."
      );

      return res.status(500).json({
        success: false,
        message: "Authentication configuration error.",
      });
    }

    // =================================================
    // VERIFY TOKEN
    // =================================================

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =================================================
    // ATTACH USER TO REQUEST
    // =================================================

    req.user = decoded;

    // =================================================
    // CONTINUE
    // =================================================

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

export {
  authMiddleware,
};