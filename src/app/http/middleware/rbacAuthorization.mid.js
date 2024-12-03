
const roles = global.$_constant.business.roles

module.exports = ({ includeRoles = [], excludeRoles = [] }) => (req, res, next) => {
	try {
		const userRole = roles[req.session.currentUser.role];

		let hasIncludeAccess = true;
		let hasExcludeAccess = false;
		if (includeRoles.length) {
			hasIncludeAccess = includeRoles.some(
				(role) => {
					return (userRole & role) === role
				}
			);
		}

		if (excludeRoles.length) {
			hasExcludeAccess = excludeRoles.some(
				(role) => (userRole & role) === role
			);
		}

		if (!hasIncludeAccess || hasExcludeAccess) {
			return res.status(403).sendMessage([
				{
					"msg": global.$_errorCodeResponse.auth.roleInvalid,
					"key": "roleInvalid"
				}
			]);
		}

		next(); 
	} catch (error) {
		console.error(error)
		throw new Error("Internal server error.")
	}
};
