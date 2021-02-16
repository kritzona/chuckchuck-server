export const generateSuccessStatus = (data = {}) => {
  return {
    status: 'success',
    data,
  }
}
export const generateErrorStatus = (message = '') => {
  return {
    status: 'error',
    message,
  }
}
/* export const generateFailStatus = (data = {}) => {
  return {
    status: 'fail',
    data,
  }
} */
