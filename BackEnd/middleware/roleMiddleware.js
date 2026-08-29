// =====================================================
// ROLE AUTHORIZATION MIDDLEWARE
// =====================================================

const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // =================================================
      // CHECK AUTHENTICATED USER
      // =================================================

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // =================================================
      // CHECK USER ROLE
      // =================================================

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to perform this action.",
        });
      }

      // =================================================
      // USER HAS REQUIRED ROLE
      // =================================================

      next();
    } catch (error) {
      console.error(
        "Role authorization error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Authorization error.",
      });
    }
  };
};

export {
  allowRoles,
};