const express = require('express');

const { 
    createChat, 
    deleteChat, 
    authanticate, 
    sendEmail

} = require('../controller/chat');
const router = express.Router();

router.post('/', createChat)

router.delete('/:id', deleteChat)

router.post('/authanticate', authanticate)

router.post('/email', sendEmail)

// dummy req to start server
router.get('/', (req, res) =>{
    res.json({status: 200});
})

module.exports = router;