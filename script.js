document.addEventListener('DOMContentLoaded', function() {
    // عناصر DOM
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const newPasswordBtn = document.getElementById('newPasswordBtn');
    const resultSection = document.getElementById('resultSection');
    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    
    // تنظیمات اولیه
    lengthValue.textContent = lengthSlider.value;
    
    // رویدادها
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
    
    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    downloadBtn.addEventListener('click', downloadPassword);
    newPasswordBtn.addEventListener('click', resetForm);
    
    // تولید پسورد
    function generatePassword() {
        const siteName = document.getElementById('siteName').value.trim();
        const siteUrl = document.getElementById('siteUrl').value.trim();
        const length = parseInt(lengthSlider.value);
        
        // اعتبارسنجی
        if (!siteName || !siteUrl) {
            alert('لطفاً نام و آدرس سرویس را وارد کنید');
            return;
        }
        
        const uppercase = document.getElementById('uppercase').checked;
        const lowercase = document.getElementById('lowercase').checked;
        const numbers = document.getElementById('numbers').checked;
        const symbols = document.getElementById('symbols').checked;
        
        if (!uppercase && !lowercase && !numbers && !symbols) {
            alert('حداقل یک گزینه باید انتخاب شود');
            return;
        }
        
        // تولید پسورد
        const password = createPassword(length, uppercase, lowercase, numbers, symbols);
        
        // نمایش نتایج
        document.getElementById('resultSiteName').textContent = siteName;
        document.getElementById('resultSiteUrl').textContent = siteUrl;
        document.getElementById('resultPassword').textContent = password;
        
        resultSection.style.display = 'block';
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    // تابع ایجاد پسورد
    function createPassword(length, upper, lower, num, sym) {
        let chars = '';
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (upper) chars += upperChars;
        if (lower) chars += lowerChars;
        if (num) chars += numberChars;
        if (sym) chars += symbolChars;
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        return password;
    }
    
    // کپی کردن پسورد
    function copyPassword() {
        const password = document.getElementById('resultPassword').textContent;
        navigator.clipboard.writeText(password)
            .then(() => {
                alert('پسورد با موفقیت کپی شد!');
            })
            .catch(err => {
                console.error('خطا در کپی کردن:', err);
                alert('خطا در کپی کردن پسورد');
            });
    }
    
    // دانلود پسورد
    function downloadPassword() {
        const siteName = document.getElementById('resultSiteName').textContent;
        const siteUrl = document.getElementById('resultSiteUrl').textContent;
        const password = document.getElementById('resultPassword').textContent;
        
        // ایجاد محتوای فایل
        const content = `سرویس: ${siteName}\nآدرس: ${siteUrl}\nپسورد: ${password}\n\nتاریخ ایجاد: ${new Date().toLocaleString('fa-IR')}\nسازنده: پارسا باقرزاده`;
        
        // ایجاد فایل
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        // ایجاد لینک دانلود
        const a = document.createElement('a');
        a.href = url;
        a.download = `passwords/${sanitizeFileName(siteName)}_password.txt`;
        
        // شبیه‌سازی کلیک برای دانلود
        document.body.appendChild(a);
        a.click();
        
        // تمیزکاری
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
    
    // بازنشانی فرم
    function resetForm() {
        document.getElementById('siteName').value = '';
        document.getElementById('siteUrl').value = '';
        lengthSlider.value = 16;
        lengthValue.textContent = '16';
        document.getElementById('uppercase').checked = true;
        document.getElementById('lowercase').checked = true;
        document.getElementById('numbers').checked = true;
        document.getElementById('symbols').checked = true;
        
        resultSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // پاکسازی نام فایل
    function sanitizeFileName(name) {
        return name.replace(/[^\w\u0600-\u06FF\s-]/g, '')
                   .replace(/\s+/g, '_')
                   .substring(0, 50);
    }
});