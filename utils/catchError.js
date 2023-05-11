export const globalCatch = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch((error) => next(error)); // error object
  };
};

// stack

// async function // promise

// return "Aya" // promise .. resolve
