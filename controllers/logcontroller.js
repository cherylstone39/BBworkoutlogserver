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
router.get("/:owner_id", validateJWT, async (req, res) => {
    let {owner_id} = req.params;
    try{
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: owner_id
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
router.put("/update/:resultId", validateJWT, async (req, res) => {
    const {description, definition, result, owner_id} = req.body.log;
    const logId = req.params.resultId;
    const userId = req.user.id;

    const query = {
        where : {
            id: logId,
            owner: userId
        }
    };

    const updatedLog = {
        description: description,
        definition: definition,
        result: result
    }

    try {
        const update = await LogModel.update(updatedLog, query);
        res.status(200).json(update);
        }catch (err) {
            res.status(500).json ({ error: err});
        }
});

/********************
DELETE A LOG
********************/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner: ownerId
            }
        };

        await LogModel.destroy(query);
        res.status(200).json({message: "Log removed"});
    } catch (err) {
        res.status(500).json({ error: err});
    }
})

module.exports = router;