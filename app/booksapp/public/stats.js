// This file is to be imported after books.js in stats.html

function drawChart(ratings) {
    console.log(ratings)
    // Just like in the example
    const ctx = document.getElementById('myChart').getContext('2d');

    // Separate into two separate arrays
    let labels = []
    let values = []
    ratings.forEach(rating => {
        labels.push(rating.rating)
        values.push(rating.value)
    });

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '# of Books per Rating',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function fillChart() {
    // /api/ratings gets back a list 
    // [{ rating: 1, number: 10}, {rating: 2, number 20}]
    fetch("/api/ratings")
        .then(data => data.json())
        .then(ratings => drawChart(ratings))
}


window.onload = () => {
    fillChart()

    installOtherEventHandlers()
}