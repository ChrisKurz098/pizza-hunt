const { Comment, Reply, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        Comment.create(body)
            .then(({ _id }) => {
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $push: { comments: _id } },
                    { new: true }
                )
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found at this ID' })
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    },
    //add reply
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate({ _id: params.commentId },
            { $push: { replies: body } },
            { new: true }
        )
            .then(dbCommentData => {
                if (!dbCommentData) {
                    res.status(404).json({ message: 'No comment found at ID' });
                    return;
                }
                res.json(dbCommentData);
            })
            .catch(err => res.json(err));
    },
    //remove reply
    removeReply({ params }) {
        Comment.findOneAndUpdate({ _id: params.commentId },
            { $pull: { replies: { replyId: params.replyId } } },
            { new: true }
        )
            .then(dbCommentData => {
                if (!dbCommentData) {
                    res.status(404).json({ message: 'No reply found' });
                    return;
                }
                res.json(dbCommentData);
            })
            .catch(err => res.json(err));
    },
    // remove comment
    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId }, res)
            .then(deletedComment => {
                if (!deletedComment) {
                    res.status(404).json({ message: 'No comment found at this ID' })
                    return;
                }
                return Pizza.findOneAndUpdate(
                    { _id: params.pizzaId },
                    { $pull: { comments: params.commentId } },
                    { new: true }
                );
            })
            .then(dbPizzaData => {
                if (!dbPizzaData) {
                    res.status(404).json({ message: 'No pizza found at this ID' })
                    return;
                }
                res.json(dbPizzaData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = commentController;