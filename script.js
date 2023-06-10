fetch('https://raw.githubusercontent.com/DocPatthar/The-mcq/main/Questions.txt')
  .then(response => response.text())
  .then(inputText => generateMCQ(inputText))
  .catch(error => console.error(error));

function generateMCQ(inputText) {
  var lines = inputText.trim().split('\n');
  var container = document.getElementById('mcq-container');
  container.innerHTML = '';

  var currentQuestion = null;
  var currentOptions = [];

  lines.forEach(function(line) {
    line = line.trim();

    if (line.startsWith('#')) {
      if (currentQuestion !== null) {
        container.appendChild(createQuestionElement(currentQuestion, shuffleOptions(currentOptions)));
        currentOptions = [];
      }
      currentQuestion = line.substring(1);
    } else if (line.startsWith('+')) {
      currentOptions.push({ text: line.substring(1), isCorrect: true });
    } else if (line.startsWith('-')) {
      currentOptions.push({ text: line.substring(1), isCorrect: false });
    }
  });

  if (currentQuestion !== null) {
    container.appendChild(createQuestionElement(currentQuestion, shuffleOptions(currentOptions)));
  }
}

function shuffleOptions(options) {
  var shuffledOptions = options.slice();
  for (var i = shuffledOptions.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffledOptions[i];
    shuffledOptions[i] = shuffledOptions[j];
    shuffledOptions[j] = temp;
  }
  return shuffledOptions;
}

function createQuestionElement(question, options) {
  var questionElement = document.createElement('div');
  questionElement.classList.add('question');
  var questionTextElement = document.createElement('h2');
  questionTextElement.textContent = question;
  questionElement.appendChild(questionTextElement);

  options.forEach(function(option) {
    var optionElement = document.createElement('label');
    var optionInput = document.createElement('input');
    optionInput.type = 'radio';
    optionInput.name = question;
    optionInput.value = option.text;
    optionInput.setAttribute('data-is-correct', option.isCorrect);
    optionElement.appendChild(optionInput);
    optionElement.appendChild(document.createTextNode(option.text));
    questionElement.appendChild(optionElement);
    questionElement.appendChild(document.createElement('br'));
  });

  var submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.addEventListener('click', function() {
    checkAnswer(question, options);
  });
  questionElement.appendChild(submitButton);

  return questionElement;
}

function checkAnswer(question, options) {
  var selectedOption = document.querySelector('input[name="' + question + '"]:checked');
  if (selectedOption === null) {
    alert('Please select an answer.');
    return;
  }

  var isCorrect = selectedOption.getAttribute('data-is-correct') === 'true';

  var resultText = isCorrect ? 'Correct' : 'Incorrect';
  var resultColor = isCorrect ? 'green' : 'red';

  var dialogBox = document.createElement('div');
  dialogBox.style.backgroundColor = resultColor;
  dialogBox.style.color = 'white';
  dialogBox.style.padding = '10px';
  dialogBox.style.marginTop = '10px';
  dialogBox.textContent = 'Your answer is ' + resultText + '.';
  selectedOption.parentNode.parentNode.appendChild(dialogBox);
}
