const { Pizza } = require('../models');

const pizzaController = {
    //get all Pizzas
    getAllPizzas(req, res) {
        Pizza.find({})
            .then(dbPizzaData => res.json(dbPizzaDatta))
            .catch(err => {
                console.error(err);
                res.status(400).json(err);
            })
    },

    //get pizza by _id
    getPizzaById({ params }, res) {
        Pizza.findOne({ _id: params.id })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: "There is no pizza at that ID!" });
                    return;
                }
                res.json(dbPizzaDatta);
            })
            .catch(err => {
                console.error(err);
                res.status(404).json(err)
            })
    },

    // createPizza
    createPizza({ body }, res) {
        Pizza.create(body)
            .then(dbPizzaData => res.json(dbPizzaData))
            .catch(err => res.status(400).json(err));
    },

    //Update pizza
    updatePizza({ params, body }, res) {
        //{new: true} makes mongoose return the updated data. ste to false to return original
        Pizza.findOneAndUpdate({_id: params.id}, body, {new: true})
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: "No pizza found at that ID"});
                return;
            }
            res.json(dbPizzaDatta);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete pizza
    deletePizza({params},res) {
        Pizza.findOneAndDelete({ _id: params.id})
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({message: 'No pizza found at that ID'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.status(400).json(err))
    }

}

module.exports = pizzaController;