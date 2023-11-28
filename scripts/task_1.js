const tableInfo = document.querySelector("#tableInfo");
const textAnswerContainer = document.querySelector("#textAnswer");
let results = [[], []];
let allResultsRenderMarkup = "";

document.addEventListener("DOMContentLoaded", function () {
  // Функція для обчислення факторіалу
  function factorial(number) {
    let f = 1;
    for (let i = 1; i <= number; i++) {
      f *= i;
    }
    return f;
  }

  function resultsRender() {
    for (let i = 1; i < results.length; i++) {
      const markupResults = `<tr>
       <td>${results[i][0]}</td>
       <td>${results[i][1]}</td>
       <td>${results[i][2]}</td>
       <td>${results[i][3]}</td>
       <td>${results[i][4]}</td>
       <td>${results[i][5]}</td>
       <td>${results[i][6]}</td>
       <td>${results[i][7]}</td>
       <td>${results[i][8]}</td>
       <td>${results[i][9]}</td>
     </tr>`;
      allResultsRenderMarkup += markupResults;
    }
    tableInfo.innerHTML += allResultsRenderMarkup;
  }

  // Головна функція
  function main() {
    const t = 0.1;
    const lmbd = 110;

    const n_values = [];
    const Pobs_values = [];
    const K3_values = [];

    for (let n = 1; n <= 12; n++) {
      const alfa = lmbd * t;
      let P = 0;

      for (let i = 0; i <= n; i++) {
        P += Math.pow(alfa, i) / factorial(i);
      }

      const P0 = 1 / P;
      const Pn = (Math.pow(alfa, n) / factorial(n)) * P0;
      const Pobs = 1 - Pn;
      const Nk = alfa * (1 - Pn);
      const K3 = Nk / n;

      n_values.push(n);
      Pobs_values.push(Pobs);
      K3_values.push(K3);

      if (!results[n]) {
        results[n] = [];
      }

      results[n].push(
        n,
        lmbd,
        alfa,
        P0.toFixed(10),
        Pn.toFixed(10),
        Pobs.toFixed(10),
        Nk.toFixed(10),
        K3.toFixed(10),
        P0.toFixed(10),
        n
      );

      if (K3 == Pobs) {
        const textAnswer = `Відповідь : проаналізувавши отримані дані у вигладі таблиці та графіка 
        ми можемо зробити висновок що в архітектуру потрібно внести зміни для її максимально 
        ефективного функціонування. 
        Оскільки K3=${K3} та Pобс=${Pobs} при n=${n} мають одинакове 
        значення, необхідно збільшити кількість процесорів на ${
          n - 9
        }, саме при ${n} процесорах система 
        працюватиме найоптимальніше.  `;
        textAnswerContainer.innerHTML += textAnswer;
      }
    }
    resultsRender();
    // Побудова графіка за допомогою Chart.js
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: n_values,
        datasets: [
          {
            label: "P_obs",
            data: Pobs_values,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            fill: false,
          },
          {
            label: "K_3",
            data: K3_values,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: "Залежності P_obs і K_3 від n",
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "n",
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Значення",
              },
            },
          ],
        },
        legend: {
          display: true,
          position: "top",
        },
        elements: {
          line: {
            tension: 0,
          },
        },
      },
    });
  }

  // Виклик головної функції при завантаженні сторінки
  main();
});
