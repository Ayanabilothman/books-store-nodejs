// validate data
export const isValid = (joiSchema) => {
  return (req, res, next) => {
    const copyReq = {
      ...req.body,
      ...req.query,
      ...req.params,
      //...(req.file && { [req.file.fieldname]: [{ ...req.file }] }), // copyRep = {....., thumbnail: [{fieldname: "thumbnail", size: 5281 .....so on}]}
      ...req.files,
    };

    const { error } = joiSchema.validate(copyReq, { abortEarly: false });

    if (error != null) {
      const messages = error.details.map((object) => object.message);
      return next(new Error(messages));
    }

    return next();
  };
};
