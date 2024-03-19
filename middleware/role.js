function checkUserRole(role) {
  return (req, res, next) => {
    const user = req.user;
    if (user && user.roleId === role) {
      next(); // User has the required role, allow access
    } else {
      res.status(403).json({ message: "Access denied" }); // User doesn't have the required role
    }
  };
}

module.exports = checkUserRole;
