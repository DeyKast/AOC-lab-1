const tableInfo = document.querySelector("#tableInfo");
const textAnswerContainer = document.querySelector("#textAnswer");

let results = [[], []];
let allResultsRenderMarkup = "";

// Функція для обчислення факторіалу числа
function factorial(number) {
  if (number === 0) {
    return 1;
  } else {
    return number * factorial(number - 1);
  }
}

function calculateProbability(alfa, n) {
  // Створення масиву ймовірностей та обчислення загальної ймовірності
  const P = Array.from(
    { length: n + 1 },
    (_, i) => alfa ** i / factorial(i)
  ).reduce((acc, val) => acc + val, 0);

  const P0 = 1 / P;
  const Pn = (alfa ** n / factorial(n)) * P0;

  return 1 - Pn;
}

function main() {
  const lmbd = 110;
  const Pt_obs_zd = 0.909;

  const tValues = [];
  const PobsValues = [];

  // Цикл для обходу значень часу та обчислення ймовірностей
  for (let tObs = -0.1, n = 1; tObs <= 1.0; tObs += 0.1, n++) {
    tValues.push(tObs);

    // Обчислення ймовірності
    const alfa = lmbd * tObs;
    const Pobs = calculateProbability(alfa, 9);
    PobsValues.push(Pobs);

    if (!results[n]) {
      results[n] = [];
    }
    results[n].push(n, lmbd, Pobs, tObs.toFixed(1));
  }

  resultsRender();

  // Створення графіку за допомогою бібліотеки Chart.js
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: tValues,
      datasets: [
        {
          label: "P_obs = f(t_obs)",
          data: PobsValues,
          borderColor: "blue",
          borderWidth: 2,
          fill: false,
        },
        {
          label: "P^t_obs_zd",
          data: Array(tValues.length).fill(Pt_obs_zd),
          borderColor: "red",
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
        },
        y: {
          min: 0,
          max: 1,
        },
      },
    },
  });

  // Фільтрація значень часу, які відповідають заданому умові
  const satisfyingTValues = tValues.filter(
    (t, index) => PobsValues[index] >= Pt_obs_zd
  );

  const textAnswer = `Відповідь: проаналізувавши отримані дані у вигляді таблиці та графіка, 
  ми можемо зробити висновок, що 0 це середній час обслуговування однієї задачі, яку виконує 
  один процесор, для того щоб імовірність обслуговування становила 0.909`;
  textAnswerContainer.innerHTML += textAnswer;
}

//функція виведення результатів у таблицю
function resultsRender() {
  for (let i = 1; i < results.length; i++) {
    const markupResults = `<tr>
           <td>${results[i][0]}</td>
           <td>${results[i][1]}</td>
           <td>${results[i][2]}</td>
           <td>${results[i][3]}</td>
         </tr>`;
    allResultsRenderMarkup += markupResults;
  }
  tableInfo.innerHTML += allResultsRenderMarkup;
}

// Обробник подій для виклику основної функції після завантаження DOM
document.addEventListener("DOMContentLoaded", main);
