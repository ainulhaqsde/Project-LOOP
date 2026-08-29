const adminMiddleware = (
  req,
  res,
  next
) => {
  // ===================================================
  // AUTHENTICATION CHECK
  // ===================================================

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });
  }

  // ===================================================
  // ADMIN ROLE CHECK
  // ===================================================

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Admin access required.",
    });
  }

  // ===================================================
  // AUTHORIZED
  // ===================================================

  next();
};

export default adminMiddleware;