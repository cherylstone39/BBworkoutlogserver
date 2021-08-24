const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require('../models');

router.get("/practice", validateJWT, (req, res) => {
    res.send("Hey, this is a practice route!")
});
/******************
 * Log Create
 * ***************/
router.post("/create", validateJWT, async (req, res) => {
    const {description, definition, result, owner_id} = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition,
        result,
        owner_id
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json({newLog});
    } catch (err) {
        res.status(500).json({ error: err});
    }
    LogModel.create(logEntry)
    
});

router.get('/about', (req, res) => {
    res.send('Hey, this is a about route!');
});
/**********************
 * **  GET ALL JOURNALS
 * *******************/

router.get("/", async (req, res) => {
    
    try {
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/********************
 * ** LOGS BY USER
 * ****************/
router.get("/:id", validateJWT, async (req, res) => {
    try{
        const userLogs = await LogModel.findOne({
            where: {
                owner_id: req.params.id
            }
        });
        res.status(200).json(userLogs);
    }catch (err) {
        res.status(500).json({ error: err });
    }
});
/********************
 * ** LOGS BY UPDATED BY USER
 * **********************/
router.put("/:id", validateJWT, async (req, res) => {
    const {description, definition, result, owner_id} = req.body;

    try {
        await LogModel.update(
          { description, definition, result, owner_id },
          { where: { id: req.params.id }, returning: true }
        ).then((result) => {
          res.status(201).json({
            message: "Log successfully updated",
            updatedLog: resultId,
          });
        });
      } catch (err) {
        res.status(500).json({
          message: `Failed to update log: ${err}`,
        });
      }
    });
   

/********************
DELETE A LOG
********************/
router.delete("/:id", validateJWT, async (req, res) => {
    try {
        const deletedLog = await LogModel.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
        message: "Successfully Deleted",
        deletedLog
        });
    } catch(e) {
        res.status(500).json({
            message:"Failed to delete message",
            error: e
        })
    }
})

module.exports = router;