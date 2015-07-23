var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz p2p mlazaro' });
});

/* GET home page. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Quiz p2p mlazaro' });
});
router.get('/quizes/answer', quizController.answer);
router.get('/quizes/question', quizController.question);

module.exports = router;
