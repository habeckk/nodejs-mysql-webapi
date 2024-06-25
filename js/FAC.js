        // Dados do Gráfico em Pizza
        const pieData = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.3)',
                    'rgba(54, 162, 235, 0.3)',
                    'rgba(255, 206, 86, 0.3)',
                    'rgba(75, 192, 192, 0.3)',
                    'rgba(153, 102, 255, 0.3)',
                    'rgba(255, 159, 64, 0.3)'
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
        };

        // Configuração do Gráfico em Pizza
        const pieConfig = {
            type: 'pie',
            data: pieData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom', // Mostrar legenda à direita
                        align: '300px' // Alinhar legenda à esquerda
                    },
                    title: {
                        display: true,
                        text: 'Exemplo de Gráfico em Pizza'
                    }
                }
            }
        };

        // Renderizando os Gráficos em Pizza
        const pieChartIds = ['pieChart1', 'pieChart2', 'pieChart3', 'pieChart4', 'pieChart5', 'pieChart6'];
        pieChartIds.forEach(id => {
            const ctx = document.getElementById(id).getContext('2d');
            new Chart(ctx, pieConfig);
        });

        // Dados do Gráfico de Barras
        const barData = {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Red',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(255, 99, 132, 0.3)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            }, {
                label: 'Blue',
                data: [15, 10, 5, 8, 3, 6],
                backgroundColor: 'rgba(54, 162, 235, 0.3)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }, {
                label: 'Yellow',
                data: [7, 14, 4, 9, 11, 2],
                backgroundColor: 'rgba(255, 206, 86, 0.3)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2
            }, {
                label: 'Green',
                data: [10, 8, 12, 6, 4, 7],
                backgroundColor: 'rgba(75, 192, 192, 0.3)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2
            }, {
                label: 'Purple',
                data: [3, 5, 2, 7, 9, 11],
                backgroundColor: 'rgba(153, 102, 255, 0.3)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2
            }, {
                label: 'Orange',
                data: [8, 11, 6, 4, 10, 5],
                backgroundColor: 'rgba(255, 159, 64, 0.3)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2
            }]
        };

        // Configuração do Gráfico de Barras
        const barConfig = {
            type: 'bar',
            data: barData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom', // Mostrar legenda à direita
                        align: '300px', // Alinhar legenda à esquerda
                    },
                    title: {
                        display: true,
                        text: 'Exemplo de Gráfico de Barras'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        // Renderizando os Gráficos de Barras
        const barChartIds = ['barChart1', 'barChart2', 'barChart3', 'barChart4', 'barChart5', 'barChart6'];
        barChartIds.forEach((id, index) => {
            const ctx = document.getElementById(id).getContext('2d');
            ctx.canvas.width = 400; // Ajuste da altura do canvas
            ctx.canvas.height = 300; // Ajuste da altura do canvas
            new Chart(ctx, barConfig);
        });