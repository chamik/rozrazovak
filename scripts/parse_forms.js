// This is a Google Apps Script that reads data from Forms.
// it cleans up texts to use the proper apostrophe 
// and replaces ..... and ____ with a single _.
//
// It writes json output to a random google doc because for some god
// forsaken reason it truncates text when logging to console.
//
// Edit the first two variables in allForms()

function parseForm(formId) {
  var form = FormApp.openById(formId);

  var items = form.getItems(FormApp.ItemType.MULTIPLE_CHOICE);

  let questions = [];

  
  for (const item of items) {
    let title = item.asMultipleChoiceItem().getTitle();
    title = title.replace(/[_\.]{2,}/g, "_");
    title = title.replace(/[’´`]/g, "'");

    var right_answer = item.asMultipleChoiceItem().getChoices().find(x => x.isCorrectAnswer());
    if (!right_answer)
      continue;

    right_answer = right_answer.getValue().replace(/[’´`]/g, "'");

    var wrong_answers = item.asMultipleChoiceItem().getChoices().filter(x => !x.isCorrectAnswer()).map(x => x.getValue().replace(/[’´`]/g, "'"));
    if (wrong_answers.length != 3)
      continue;

    const question = {
      questionText: title,
      rightAnswer: right_answer,
      wrongAnswers: wrong_answers,
    }

    questions.push(question);
  }

  return questions
}

function allForms() {
  // array of Form ID strings 
  const formIds = [];

  // google doc ID
  const docsId = "1W-tiH5HSBLfA3W9KXNpLpMMAqPRqOFYHeBtYI6zQqiM"

  let obj = {
    questions: []
  };

  for (const id of formIds) {
    Logger.log(`Parsing form ${id}`);
    obj.questions.push(...parseForm(id))
  }

  const js = JSON.stringify(obj);

  var doc = DocumentApp.openById(docsId);
  doc.getBody().setText(js);
}
