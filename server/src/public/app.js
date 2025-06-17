class DashboardApp {
    constructor() {
        this.socket = io();
        this.chart = null;
        this.initializeChart();
        this.setupSocketListeners();
        this.fetchInitialData();
        this.fetchRecentActivities();
    }

    initializeChart() {
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Great', 'Meh', 'Ugh'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    setupSocketListeners() {
        this.socket.on('sentimentUpdate', (data) => {
            this.updateDashboard(data);
            this.updateLastUpdateTime();
        });
    }

    async fetchInitialData() {
        try {
            const response = await fetch('/api/sentiment/counts');
            const data = await response.json();
            console.log('Initial data:', data); // Debug log
            
            // Transform the data into the required format
            const counts = {
                GREAT: 0,
                MEH: 0,
                UGH: 0
            };
            
            data.forEach(item => {
                counts[item.sentiment] = parseInt(item.count);
            });
            
            console.log('Transformed counts:', counts); // Debug log
            this.updateDashboard(counts);
        } catch (error) {
            console.error('Failed to fetch initial data:', error);
        }
    }

    updateDashboard(counts) {
        console.log('Updating dashboard with:', counts); // Debug log
        
        // Update counters
        document.getElementById('greatCount').textContent = counts.GREAT || 0;
        document.getElementById('mehCount').textContent = counts.MEH || 0;
        document.getElementById('ughCount').textContent = counts.UGH || 0;

        // Update chart
        if (this.chart) {
            this.chart.data.datasets[0].data = [
                counts.GREAT || 0,
                counts.MEH || 0,
                counts.UGH || 0
            ];
            this.chart.update();
        }

        // Update last update time
        this.updateLastUpdateTime();
    }

    updateLastUpdateTime() {
        const now = new Date();
        document.getElementById('updateTime').textContent = now.toLocaleTimeString();
    }

    addRecentActivity(sentiment) {
        const container = document.getElementById('recentActivities');
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const emoji = {
            GREAT: '🙂',
            MEH: '😐',
            UGH: '😞'
        }[sentiment];

        item.innerHTML = `
            <span class="activity-emoji">${emoji}</span>
            <span>New ${sentiment.toLowerCase()} sentiment</span>
            <span class="activity-time">${new Date().toLocaleTimeString()}</span>
        `;

        container.insertBefore(item, container.firstChild);
        
        // Keep only last 10 activities
        if (container.children.length > 10) {
            container.removeChild(container.lastChild);
        }
    }

    async fetchRecentActivities() {
        try {
            const response = await fetch('/api/sentiment/recent');
            const activities = await response.json();
            
            const container = document.getElementById('recentActivities');
            container.innerHTML = ''; // Clear existing activities
            
            activities.forEach(activity => {
                const item = document.createElement('div');
                item.className = 'activity-item';
                
                const emoji = {
                    GREAT: '🙂',
                    MEH: '😐',
                    UGH: '😞'
                }[activity.sentiment];

                const time = new Date(activity.timestamp).toLocaleTimeString();
                
                item.innerHTML = `
                    <span class="activity-emoji">${emoji}</span>
                    <span>${activity.sentiment.toLowerCase()}</span>
                    <span class="activity-time">${time}</span>
                `;
                
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Failed to fetch recent activities:', error);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardApp();
}); 