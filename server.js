const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ==============================
// Middlewares
// ==============================
app.use(cors()); // عشان تقدر تبعت من أي موقع
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// MySQL Connection
// ==============================
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // لو عندك باسورد حطه هنا
    database: 'forms_db'
});

db.connect((err) => {
    if (err) {
        console.log('❌ DB Connection Error:', err);
    } else {
        console.log('✅ Connected to MySQL');
    }
});

// ==============================
// Root Route
// ==============================
app.get('/', (req, res) => {
    res.send('🚀 Server شغال تمام');
});

// ==============================
// API: Submit Form
// ==============================
app.post('/api/form', (req, res) => {
    const { name, email, message } = req.body;

    // validation بسيط
    if (!name || !email || !message) {
        return res.status(400).json({
            status: false,
            message: 'كل الحقول مطلوبة ❌'
        });
    }

    const sql = "INSERT INTO forms (name, email, message) VALUES (?, ?, ?)";

    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.log('DB Error:', err);
            return res.status(500).json({
                status: false,
                message: 'حصل خطأ في السيرفر ❌'
            });
        }

        res.json({
            status: true,
            message: 'تم حفظ البيانات بنجاح ✅',
            id: result.insertId
        });
    });
});

// ==============================
// Start Server
// ==============================
app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
});