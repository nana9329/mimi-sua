// API Base URLs
const BOT_API_URL = 'http://localhost:5000/api';

// State
let currentEditIndex = null;
let weekChart = null;
let botDataCache = null;
let botDataCacheTime = null;
let lastChartData = null;  // Cache 7-day data
let lastTotal = null;      // Cache total mllet lastInsightsData = null; // Cache insights string
// === DARK MODE ===

function initDarkMode() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode || (prefersDark && localStorage.getItem('darkMode') === null)) {
        document.body.classList.add('dark-mode');
        updateDarkModeButton();
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    updateDarkModeButton();
}

function updateDarkModeButton() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const btn = document.getElementById('darkModeToggle');
    if (btn) {
        btn.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// === BABY INFO ===

function loadBabyInfo() {
    const defaultBaby = {
        name: 'Bé Yêu',
        avatar: '👶',
        age: 0,
        height: null,
        weight: null
    };
    const saved = localStorage.getItem('babyInfo');
    return saved ? { ...defaultBaby, ...JSON.parse(saved) } : defaultBaby;
}

function saveBabyInfoToStorage(babyInfo) {
    localStorage.setItem('babyInfo', JSON.stringify(babyInfo));
}

function displayBabyInfo() {
    const baby = loadBabyInfo();
    
    document.getElementById('babyAvatar').textContent = baby.avatar;
    document.getElementById('babyName').textContent = baby.name;
    document.getElementById('babyAge').textContent = baby.age + ' tháng';
    document.getElementById('babyHeight').textContent = baby.height ? baby.height + ' cm' : '-- cm';
    document.getElementById('babyWeight').textContent = baby.weight ? baby.weight + ' kg' : '-- kg';
}

function openBabyModal() {
    const baby = loadBabyInfo();
    document.getElementById('babyNameInput').value = baby.name;
    document.getElementById('babyAvatarInput').value = baby.avatar;
    document.getElementById('babyAgeInput').value = baby.age;
    document.getElementById('babyHeightInput').value = baby.height || '';
    document.getElementById('babyWeightInput').value = baby.weight || '';
    document.getElementById('babyModal').classList.add('show');
}

function closeBabyModal() {
    document.getElementById('babyModal').classList.remove('show');
}

function saveBabyInfo() {
    const babyInfo = {
        name: document.getElementById('babyNameInput').value || 'Bé Yêu',
        avatar: document.getElementById('babyAvatarInput').value || '👶',
        age: parseInt(document.getElementById('babyAgeInput').value) || 0,
        height: parseInt(document.getElementById('babyHeightInput').value) || null,
        weight: parseFloat(document.getElementById('babyWeightInput').value) || null
    };
    
    saveBabyInfoToStorage(babyInfo);
    displayBabyInfo();
    closeBabyModal();
}

window.addEventListener('click', (e) => {
    const babyModal = document.getElementById('babyModal');
    if (e.target === babyModal) closeBabyModal();
});

// === UTILITIES ===

function formatDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('vi-VN', options);
}

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getDateNDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}

// === DATA FETCHING ===

async function getTodayFromBot() {
    try {
        const response = await fetch(`${BOT_API_URL}/feedings/today`);
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        const feedings = data.feedings || [];
        
        // Cache Bot data
        botDataCache = feedings;
        botDataCacheTime = getTodayDate();
        
        return feedings;
    } catch (error) {
        console.warn('Bot API unavailable');
        return null;
    }
}

function saveFeeding(amount_ml, notes = '') {
    const today = getTodayDate();
    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    let feedings = JSON.parse(localStorage.getItem('feedings') || '[]');
    feedings.push({ date: today, time, amount_ml, breastfeed_minutes: 0, notes });
    localStorage.setItem('feedings', JSON.stringify(feedings));
    renderDashboard();
}

function deleteFeeding(index) {
    if (index < 0 || index >= allTodayFeedingsCache.length) return;
    
    const item = allTodayFeedingsCache[index];
    const today = getTodayDate();
    
    if (item.source === 'bot') {
        // Bot item → hide it (add to hidden list)
        const key = `${item.time}_${item.amount_ml}`;
        let hiddenItems = JSON.parse(localStorage.getItem('hiddenBotFeedings') || '[]');
        if (!hiddenItems.includes(key)) {
            hiddenItems.push(key);
            localStorage.setItem('hiddenBotFeedings', JSON.stringify(hiddenItems));
        }
    } else {
        // Local item → delete from localStorage
        let allFeedings = JSON.parse(localStorage.getItem('feedings') || '[]');
        allFeedings = allFeedings.filter(f => !(f.date === today && f.time === item.time && f.amount_ml === item.amount_ml));
        localStorage.setItem('feedings', JSON.stringify(allFeedings));
    }
    
    renderDashboard();
}

async function getTodayTotal() {
    const botFeedings = await getTodayFromBot();
    const today = getTodayDate();
    const feedings = JSON.parse(localStorage.getItem('feedings') || '[]');
    
    let botTotal = 0;
    if (botFeedings) {
        botTotal = botFeedings.reduce((sum, f) => sum + (f.amount_ml || 0), 0);
    }
    
    let localTotal = feedings.filter(f => f.date === today).reduce((sum, f) => sum + (f.amount_ml || 0), 0);
    
    return botTotal + localTotal;
}

function getTotalForDate(date) {
    const feedings = JSON.parse(localStorage.getItem('feedings') || '[]');
    let localTotal = feedings.filter(f => f.date === date).reduce((sum, f) => sum + (f.amount_ml || 0), 0);
    
    // Thêm Bot data nếu là hôm nay
    if (date === getTodayDate() && botDataCache && botDataCacheTime === date) {
        const botTotal = botDataCache.reduce((sum, f) => sum + (f.amount_ml || 0), 0);
        return localTotal + botTotal;
    }
    
    return localTotal;
}

function get7DaysData() {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = getDateNDaysAgo(i);
        const total = getTotalForDate(date);
        const label = new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        data.push({ date, label, total });
    }
    return data;
}

// === STATE MANAGEMENT ===

let allTodayFeedingsCache = [];  // Cache all feedings (mixed Bot + Local)
let hiddenBotFeedings = [];      // Track hidden Bot items (user deleted them)

async function getAllTodayFeedings() {
    const today = getTodayDate();
    let botFeedings = await getTodayFromBot() || [];
    const localFeedings = JSON.parse(localStorage.getItem('feedings') || '[]')
        .filter(f => f.date === today);
    
    // Load hidden items
    hiddenBotFeedings = JSON.parse(localStorage.getItem('hiddenBotFeedings') || '[]');
    
    // Filter out hidden Bot items
    botFeedings = botFeedings.filter(f => {
        const key = `${f.time}_${f.amount_ml}`;
        return !hiddenBotFeedings.includes(key);
    });
    
    // Merge: Bot items + Local items (tất cả đều có thể edit/delete)
    const botWithSource = botFeedings.map((f, idx) => ({ ...f, source: 'bot', date: today, botIndex: idx }));
    const localWithSource = localFeedings.map(f => ({ ...f, source: 'local' }));
    
    // Sắp xếp theo thời gian mới nhất trước
    const merged = [...localWithSource, ...botWithSource].sort((a, b) => {
        const timeA = a.time ? parseInt(a.time.replace(':', '')) : 0;
        const timeB = b.time ? parseInt(b.time.replace(':', '')) : 0;
        return timeB - timeA;
    });
    
    allTodayFeedingsCache = merged;
    return merged;
}

// === CHART ===

function renderChart(data7days) {
    const ctx = document.getElementById('weekChart');
    if (!ctx) return;

    const labels = data7days.map(d => d.label);
    const totals = data7days.map(d => d.total);
    
    // Check if data changed - if not, skip re-rendering
    const currentDataString = JSON.stringify(totals);
    if (lastChartData === currentDataString && weekChart) {
        return;  // Data unchanged, skip re-render
    }
    
    lastChartData = currentDataString;

    if (weekChart) weekChart.destroy();

    weekChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Lượng sữa (ml)',
                data: totals,
                backgroundColor: '#FFB6C1',
                borderColor: '#FF69B4',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: '#FF69B4'
            }, {
                label: 'Mục tiêu (800ml)',
                data: Array(7).fill(800),
                type: 'line',
                borderColor: '#999',
                borderDash: [5, 5],
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, labels: { color: '#333', font: { size: 12 } } } },
            scales: { y: { beginAtZero: true, max: 1000, ticks: { stepSize: 200 } } }
        }
    });
}

// === INSIGHTS ===

function calculateInsights(data7days, todayTotal) {
    const insights = [];
    const TARGET = 800;

    const avgDaily = Math.round(data7days.reduce((sum, d) => sum + d.total, 0) / 7);
    const achievedDays = data7days.filter(d => d.total >= TARGET).length;
    const successRate = Math.round((achievedDays / 7) * 100);

    // Today insights
    if (todayTotal < 200) {
        insights.push('🔔 Bé vừa thức! Nên cho bú sớm');
    } else if (todayTotal < 400) {
        insights.push('📈 Đã uống nửa mục tiêu, tiếp tục!');
    } else if (todayTotal < 600) {
        insights.push('💪 Gần đạt mục tiêu! Thêm 1 lần nữa');
    } else if (todayTotal < 800) {
        insights.push('⭐ Gần tới! Cho bé uống thêm 1 bữa');
    } else if (todayTotal >= 800) {
        insights.push('🎉 Tuyệt vời! Bé đã đạt mục tiêu hôm nay');
    }

    // Week trends
    if (successRate >= 80) {
        insights.push('🏆 Tuần này rất tốt! Giữ đà đó');
    } else if (successRate < 30) {
        insights.push('⚠️ Lượng sữa tuần này ít hơn bình thường');
    }

    // Daily comparison
    if (data7days.length >= 2) {
        const today = data7days[data7days.length - 1];
        const yesterday = data7days[data7days.length - 2];
        if (today.total > yesterday.total) {
            insights.push('📊 Hôm nay bé uống nhiều hơn hôm qua');
        }
    }

    // Stability
    if (avgDaily >= 750) {
        insights.push('✨ TB/ngày: ' + avgDaily + 'ml - rất ổn định!');
    }

    return { insights: insights.slice(0, 4), avgDaily, successRate };
}

function renderInsights(insights, avgDaily, successRate) {
    // Check if insights data changed
    const currentInsightsString = JSON.stringify({ insights, avgDaily, successRate });
    if (lastInsightsData === currentInsightsString) {
        return;  // Data unchanged, skip re-render
    }
    lastInsightsData = currentInsightsString;
    
    const statAvg = document.getElementById('avgDaily');
    const statSuccess = document.getElementById('successRate');
    const listContainer = document.getElementById('insightsList');

    if (statAvg) statAvg.textContent = avgDaily + 'ml';
    if (statSuccess) statSuccess.textContent = successRate + '%';

    if (listContainer) {
        listContainer.innerHTML = insights.map(insight => `<div class="insight-item">${insight}</div>`).join('');
    }
}

// === MODAL ===

let currentEditItem = null;  // Store full item object instead of just index

function openEditModal(index) {
    if (index < 0 || index >= allTodayFeedingsCache.length) return;
    
    const feeding = allTodayFeedingsCache[index];
    currentEditItem = { ...feeding, index };  // Store item + index
    
    document.getElementById('editTime').value = feeding.time;
    document.getElementById('editAmount').value = feeding.amount_ml || 0;
    document.getElementById('editNotes').value = feeding.notes || '';
    document.getElementById('editModal').classList.add('show');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('show');
    currentEditItem = null;
}

function saveEdit() {
    if (!currentEditItem) return;
    
    const newTime = document.getElementById('editTime').value;
    const newAmount = parseInt(document.getElementById('editAmount').value) || 0;
    const newNotes = document.getElementById('editNotes').value;

    if (newAmount <= 0) {
        alert('⚠️ Lượng sữa phải lớn hơn 0');
        return;
    }
    
    const today = getTodayDate();
    let allFeedings = JSON.parse(localStorage.getItem('feedings') || '[]');
    
    if (currentEditItem.source === 'bot') {
        // Bot item → copy to local storage
        allFeedings.push({
            date: today,
            time: newTime,
            amount_ml: newAmount,
            breastfeed_minutes: 0,
            notes: newNotes,
            source: 'local'
        });
    } else {
        // Local item → update existing
        const localToday = allFeedings.filter(f => f.date === today);
        let found = false;
        allFeedings = allFeedings.map(f => {
            if (f.date === today && !found && f.time === currentEditItem.time && f.amount_ml === currentEditItem.amount_ml) {
                f.time = newTime;
                f.amount_ml = newAmount;
                f.notes = newNotes;
                found = true;
            }
            return f;
        });
    }
    
    localStorage.setItem('feedings', JSON.stringify(allFeedings));
    renderDashboard();
    closeEditModal();
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('editModal');
    if (e.target === modal) closeEditModal();
});

// === UI FUNCTIONS ===

function addQuickFeeding(amount) {
    saveFeeding(amount);
}

function showInputDialog() {
    const amount = prompt('Nhập lượng sữa (ml):', '100');
    if (amount && parseInt(amount) > 0) {
        saveFeeding(parseInt(amount));
    }
}

// === MAIN RENDER ===

async function renderDashboard() {
    const total = await getTodayTotal();
    const allFeedings = await getAllTodayFeedings();
    const percentage = Math.round((total / 800) * 100);

    document.getElementById('date-today').textContent = formatDate();
    document.getElementById('total-ml').textContent = total;
    document.getElementById('progress-fill').style.width = Math.min(percentage, 100) + '%';
    document.getElementById('percentage').textContent = percentage + '%';

    const timeline = document.getElementById('timeline-container');
    if (allFeedings.length === 0) {
        timeline.innerHTML = '<div class="empty"><div class="empty-icon">😴</div>Chưa có bản ghi nào hôm nay</div>';
    } else {
        timeline.innerHTML = allFeedings.map((f, idx) => {
            const sourceLabel = f.source === 'bot' ? '📡 Bot' : '📝 Local';
            
            return `
            <div class="timeline-item">
                <div class="timeline-time">${f.time}</div>
                <div class="timeline-amount">🍼 ${f.amount_ml}ml</div>
                ${f.notes ? `<div class="timeline-notes">${f.notes}</div>` : ''}
                <div class="timeline-actions">
                    <button class="btn-small" onclick="openEditModal(${idx})">✏️ Sửa</button>
                    <button class="btn-small btn-delete" onclick="deleteFeeding(${idx})">🗑️ Xoá</button>
                    <span style="font-size: 10px; color: #999; padding: 4px 6px;">${sourceLabel}</span>
                </div>
            </div>
        `;}
        ).join('');
    }

    // Render chart & insights
    const data7days = get7DaysData();
    renderChart(data7days);
    const { insights, avgDaily, successRate } = calculateInsights(data7days, total);
    renderInsights(insights, avgDaily, successRate);
}

// === INITIALIZATION ===

setInterval(() => {
    renderDashboard();
}, 1000);  // Optimized: 1 second instead of 3 seconds for faster updates

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    displayBabyInfo();
    renderDashboard();
});
