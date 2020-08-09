

const controller = {
    
    // createUser: (req, res) => {
    //     const pw = req.body.password;
    //     const encryptedPW;


    // },

    getUser: (req, res) => {
        res.send("getUser route suceeded!");
    },

    postUser: (req, res) => {
        res.send("postUser route succeeded!");
    }
}

module.exports = controller;