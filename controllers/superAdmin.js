exports.getClients = async (req, res, next) => {
    try {
      const {id} = req.params
      const user= await prisma.user.delete({
        where: { id: Number(id) },
      })
      res.json(user)
    } catch (error) {
      next(error)
    }
  }