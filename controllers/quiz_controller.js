var models =require('../models/models.js');

// Autoload - factoría el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({
            where: {
                id: Number(quizId)
            },
            include: [{
                model: models.Comment
            }]
        }).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId))}
    }
  ).catch(function(error) {next(error)});

};

// GET /quizes
// GET /quizez?buscar=texto_a_buscar
exports.index = function(req,res) {
   
   if (req.query.buscar == undefined) {
  models.Quiz.findAll().then(
    function(quizes) {
    res.render('quizes/index',{quizes: quizes, errors: []})
  }
  ).catch(function(error) {next(error);})
 } else {
    var buscar = '%' + req.query.buscar.replace(/\s/g,"%") + '%';
    console.log(" Buscar = " + buscar);
   models.Quiz.findAll(
        {where: ["pregunta like ?",buscar],
         order: [['pregunta','ASC']]}
        ).then(function(quizes) {
    res.render('quizes/index',{quizes: quizes, errors: []})
  }
  ).catch(function(error) {next(error);});
 }

};

// GET /quizes/:id
exports.show = function(req,res) {
  var quiz = req.quiz; // autoload de instancia quiz
  res.render('quizes/show',{quiz: quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer',  { quiz: req.quiz,  respuesta: resultado , errors: []});
};

// GET /quizes/new
exports.new = function(req,res) {
  var quiz = models.Quiz.build( // Crea objeto quiz
    { pregunta:"Pregunta", resuesta:"Respueta"}
  );
     res.render('quizes/new',{quiz: quiz, errors: []})
};

// POST /quizes/new
exports.create = function(req,res) {
  var quiz = models.Quiz.build( req.body.quiz);
  
  quiz
 .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
          //guarda en DB los campos pregunta y respuesta de quiz
          quiz.save({fields: ["pregunta","respuesta","tema"]}).
          then(function(){res.redirect('/quizes')})  
              // Redirección HTTP (URL relativo) lista de preguntas
            }
      }
    );
 };

 // GET /quizes/:id/edit
exports.edit= function(req,res) {
  var quiz = req.quiz; // autoload de instancia quiz
  res.render('quizes/edit',{quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req,res) {
  
  req.quiz.pregunta =  req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
 .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
          //guarda en DB los campos pregunta y respuesta de quiz
          req.quiz.save({fields: ["pregunta","respuesta","tema"]}).
          then(function(){res.redirect('/quizes')})  
              // Redirección HTTP (URL relativo) lista de preguntas
            }
      }
    );
 };

 // DELETE /quizes/:id
exports.destroy = function(req,res) {
   req.quiz.destroy().then(
    function() {
      res.redirect('/quizes');
  }).catch(function(error) {next(error);});
};