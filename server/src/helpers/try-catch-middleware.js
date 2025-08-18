const TryCatchBlock = (fun) => {
  return async (req, res, next) => {
    try {
      await fun(req, res, next);
    } catch (error) {
      console.error("Error in trycatch block: ", error.message);
      res.status(error.cause || 500).json({
        success: false,
        message: `Internal Server Error!! Error : ${error.message}`,
      });
    }
  };
};

export default TryCatchBlock;
