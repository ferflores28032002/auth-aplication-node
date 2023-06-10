export const checkRoleAndPermission = (requiredRoles, requiredPermissions) => {
  return (req, res, next) => {
    // Verifica si el usuario tiene al menos uno de los roles requeridos
    const hasRequiredRole = requiredRoles.some((requiredRole) =>
      req.user.Roles.some((role) => role.name === requiredRole)
    );
    if (!hasRequiredRole) {
      return res.status(403).json({
        error: `Acceso denegado.`,
        requiredRoles: requiredRoles,
      });
    }

    // Verifica si el usuario tiene al menos uno de los permisos requeridos
    const hasRequiredPermission = requiredPermissions.some(
      (requiredPermission) =>
        req.user.Roles.some((role) =>
          role.Permissions.some(
            (permission) => permission.name === requiredPermission
          )
        )
    );
    if (!hasRequiredPermission) {
      return res.status(403).json({
        error: `Acceso denegado`,
        requiredPermissions: requiredPermissions,
      });
    }

    // Si el usuario tiene los roles y permisos requeridos, continúa con la siguiente función de middleware
    next();
  };
};
