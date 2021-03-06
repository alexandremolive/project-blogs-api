const userModels = require('../Models/userModels');
const { generateToken } = require('../auth/generateToken');
const { status } = require('../utils');

const {
  displayNameValidations,
  emailValidations,
  passwordValidations,
} = require('../Schema/userValidation');

const addUsers = async (displayName, email, password, image) => {
  const validateDisplayName = displayNameValidations(displayName);
  const validateEmail = emailValidations(email);
  const validatePassword = passwordValidations(password);

  if (validateDisplayName) return validateDisplayName;
  if (validateEmail) return validateEmail;
  if (validatePassword) return validatePassword;

  const userExists = await userModels.checkEmailExists(email);
  if (userExists) return { code: status.HTTP_STATUS_CONFLICT, message: status.ERROR_MESSAGE };

  const { token } = generateToken({ displayName, email });
  await userModels.addUsers(displayName, email, password, image);

  return {
    code: status.HTTP_STATUS_CREATED,
    token,
  };
};

module.exports = {
  addUsers,
};