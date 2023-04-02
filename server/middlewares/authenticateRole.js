export const authenticateRole = (roleArray) => async (req, res, next) => {
  let allow = false;
  const designation = req.user?.designation;

  if (roleArray.includes(designation)) {
    allow = true;
  }
  //   for (let roleName in userRoles) {
  //     if (roleArray.includes(roleName)) {
  //       allow = true;
  //     }
  //   }
  if (allow) {
    next();
  } else {
    res.status(401).send({ success: false, message: "Unauthorized" });
  }
};
