const tableInfo = document.querySelector("#tableInfo");
const textAnswerContainer = document.querySelector("#textAnswer");
const results = [];

// Функція обчислення факторіалу
function factorial(number) {
  if (number == 0) {
    return 1;
  } else {
    return number * factorial(number - 1);
  }
}

// Функція обчислення ймовірності
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

// Функція для побудови графіку
function plotGraph(lambdaValues, PobsValues, PlmbdObsZd) {
  const ctx = document.getElementById("myChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: lambdaValues,
      datasets: [
        {
          label: "P_obs = f(lambda)",
          data: PobsValues,
          borderColor: "blue",
          borderWidth: 1,
          fill: false,
        },
        {
          label: "P^lambda_obs_zd",
          borderColor: "red",
          borderWidth: 1,
          borderDash: [5, 5],
          data: Array(lambdaValues.length).fill(PlmbdObsZd),
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
          min: 0.8,
          max: 1.05,
        },
      },
    },
  });
}

// Функція для виведення результатів у таблицю
function resultsRender() {
  results.forEach((result, index) => {
    if (result[2] == result[3]) {
      const markupResults = `<tr style="background-color: lightcoral; font-weight: 600">
      <td>${result[0]}</td>
      <td>${result[1]}</td>
      <td>${result[2]}</td>
      <td>${result[3]}</td>
      <td>${result[4]}</td>
    </tr>`;
      tableInfo.innerHTML += markupResults;

      const textAnswer = `Відповідь: проаналізувавши отримані дані у вигляді таблиці та графіка, 
  ми можемо зробити висновок, що Pобс (${result[3]}) = λ (${result[2]}) при ітерації 
  номер ${result[0]}, це означає що система може обслужити ${result[0]} задач з 
  ймовірністю обслуговування ${result[1]}.  
 `;
      textAnswerContainer.innerHTML += textAnswer;
    }
    const markupResults = `<tr>
      <td>${result[0]}</td>
      <td>${result[1]}</td>
      <td>${result[2]}</td>
      <td>${result[3]}</td>
      <td>${result[4]}</td>
    </tr>`;
    tableInfo.innerHTML += markupResults;
  });
}

// Головна функція
function main() {
  const t = 0.1;
  const PtObsZd = 0.909;
  const PlmbdObsZd = 0.899;
  const lambdaValues = [];
  const PobsValues = [];

  for (let lmbd = 1; lmbd <= 110; lmbd++) {
    const alfa = lmbd * t;
    const Pobs = calculateProbability(alfa, 12);

    results.push([lmbd, PtObsZd, PlmbdObsZd, Pobs.toFixed(3), t]);

    lambdaValues.push(lmbd);
    PobsValues.push(Pobs);
  }

  plotGraph(lambdaValues, PobsValues, PlmbdObsZd);

  resultsRender();
}

document.addEventListener("DOMContentLoaded", main);
