const tableInfo = document.querySelector("#tableInfo");
const textAnswerContainer = document.querySelector("#textAnswer");
let results = [[], []];
let allResultsRenderMarkup = "";

// Функція для обчислення факторіала числа
function factorial(number) {
  if (number === 0) {
    return 1;
  } else {
    return number * factorial(number - 1);
  }
}

// Функція для обчислення ймовірності обслуговування
function calculateProbability(alfa, n) {
  let P = 0;
  for (let i = 0; i <= n; i++) {
    P += Math.pow(alfa, i) / factorial(i);
  }
  const P0 = 1 / P;
  const Pn = (Math.pow(alfa, n) / factorial(n)) * P0;
  const Pobs = 1 - Pn;
  return Pobs;
}

// Основна функція
function main() {
  const tobs = 0.1;
  const lmbd = 110;
  const Pn_obs_zd = 0.881;
  const n_values = [];
  const Pobs_values = [];

  // Заповнення значень n та ймовірності обслуговування
  for (let n = 1; n <= 15; n++) {
    const alfa = lmbd * tobs;
    const Pobs = calculateProbability(alfa, n);
    n_values.push(n);
    Pobs_values.push(Pobs);

    if (!results[n]) {
      results[n] = [];
    }

    results[n].push(n, lmbd, tobs, Pn_obs_zd, Pobs);
  }
  resultsRender();

  // Побудова графіку за допомогою Chart.js
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: n_values,
      datasets: [
        {
          label: "P_obs = f(n)",
          data: Pobs_values,
          borderColor: "blue",
          borderWidth: 1,
        },
        {
          label: "P^n_obs_zd",
          borderColor: "red",
          borderWidth: 1,
          borderDash: [5, 5],
          data: Array(n_values.length).fill(Pn_obs_zd),
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

  // Знаходження значень, які задовольняють умову P_obs = P^n_obs_zd
  const satisfying_n_values = n_values.filter(
    (n, index) => Pobs_values[index].toFixed(3) == Pn_obs_zd
  );
  const textAnswer = `Відповідь : проаналізувавши отримані дані у вигладі таблиці та графіка 
        ми можемо зробити висновок що в архітектуру потрібно внести зміни для її максимально 
        ефективного функціонування. 
        Оскільки P^n обс зд та Pобс при n = ${satisfying_n_values} мають одинакове 
        значення, необхідно збільшити кількість процесорів на ${
          satisfying_n_values - 9
        } , саме при 13 процесорах система 
        працюватиме найоптимальніше.  `;
  textAnswerContainer.innerHTML += textAnswer;
}

function resultsRender() {
  for (let i = 1; i < results.length; i++) {
    const markupResults = `<tr>
         <td>${results[i][0]}</td>
         <td>${results[i][1]}</td>
         <td>${results[i][2]}</td>
         <td>${results[i][3]}</td>
         <td>${results[i][4]}</td>
       </tr>`;
    allResultsRenderMarkup += markupResults;
  }
  tableInfo.innerHTML += allResultsRenderMarkup;
}

// Виклик основної функції при завантаженні сторінки
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", main);
}
