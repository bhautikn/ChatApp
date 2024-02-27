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

module.exports = router;