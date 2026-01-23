let carsData = [];

const normalize = (text) => text ? text.toString().trim().toUpperCase() : '';

// 1. Load CSV with Loader UI
fetch('data.csv')
    .then(res => res.text())
    .then(data => {
        const rows = data.split('\n').filter(r => r.trim() !== '');
        const headers = rows[0].split(',').map(h => h.replace('\ufeff', '').trim());

        const col = {
            client: headers.indexOf('Client'),
            plate: headers.indexOf('Plate'),
            model: headers.indexOf('Model'),
            color: headers.indexOf('Color'),
            employee: headers.indexOf('Employee Name'),
            status: headers.indexOf('Status')
        };

        carsData = rows.slice(1).map(row => {
            const cols = row.split(',');
            return {
                client: cols[col.client]?.trim() || '-',
                plate: cols[col.plate]?.trim() || '-',
                model: cols[col.model]?.trim() || '-',
                color: cols[col.color]?.trim() || '-',
                employee: cols[col.employee]?.trim() || '-',
                status: cols[col.status]?.trim() || '-'
            };
        });

        // Hide loader and show search box
        document.getElementById('loader').style.display = 'none';
        document.getElementById('searchBox').style.display = 'block';
    })
    .catch(err => {
        console.error('CSV Error:', err);
        document.getElementById('loader').innerHTML = '❌ خطأ في تحميل البيانات';
    });

// 2. Optimized Search function
function runSearch() {
    const plateInput = normalize(document.getElementById('plateInput').value);
    const empInput = normalize(document.getElementById('employeeInput').value);
    const container = document.getElementById('results');

    container.innerHTML = '';
    if (!plateInput && !empInput) return;

    const results = carsData.filter(car => {
        const matchPlate = plateInput ? normalize(car.plate).includes(plateInput) : true;
        const matchEmp = empInput ? normalize(car.employee).includes(empInput) : true;
        return matchPlate && matchEmp;
    });

    if (results.length === 0) {
        container.innerHTML = `<div class="card" style="text-align:center;">لا توجد نتائج مطابقة</div>`;
        return;
    }

    results.forEach(car => {
        const isActive = car.status.toLowerCase().includes('active') || car.status.includes('نشط');
        
        container.innerHTML += `
            <div class="card">
                <div><strong>العميل:</strong> ${car.client}</div>
                <div><strong>اللوحة:</strong> ${car.plate}</div>
                <div><strong>الموديل:</strong> ${car.model}</div>
                <div><strong>اللون:</strong> ${car.color}</div>
                <div><strong>اسم الموظف:</strong> ${car.employee}</div>
                <div class="status-pill ${isActive ? 'active-pill' : 'inactive-pill'}">
                    ${isActive ? '🟢 نشط' : '🔴 غير نشط'}
                </div>
            </div>`;
    });
}

// 3. Theme Toggle logic
function toggleDark() {
    document.body.classList.toggle('dark');
    const btn = document.getElementById('themeToggle');
    btn.innerText = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

// 4. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('plateInput').addEventListener('input', runSearch);
    document.getElementById('employeeInput').addEventListener('input', runSearch);
});
