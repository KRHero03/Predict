const users = require("../../models/user");


module.exports = app => {
    app.post('/api/search', async (req, res) => {
        const currentUser = req.user
        const query = req.body.query
        let response = { success: 0 }
        try {
            if (!query) {
                res.send(response)
                return
            }
            if (currentUser) {
                const userResponse = await users.find({ 'name': { '$regex': query, '$options': 'i' } })
                let id = []
                userResponse.forEach((user) => id.push(user._id))
                response.success = 1
                response.result = id
                res.send(response)
                return
            }
            res.send(response)
            return
        }catch(e){
            console.log(e)
            res.send(response)
        }
        

    })
}