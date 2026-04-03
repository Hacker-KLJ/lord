async function run(a) {
    const tk = document.getElementById('tk').value;
    const id = document.getElementById('id').value;
    const name = document.getElementById('customName').value;
    const msg = document.getElementById('customMsg').value;

    // أضفت تنبيه عشان تعرف أن الطلب طلع
    console.log("Sending request..."); 

    try {
        const res = await fetch(`${window.location.origin}/execute`, { // تعديل الرابط ليكون ديناميكي
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token: tk, guildId: id, action: a, customName: name, customMsg: msg})
        });
        const d = await res.json();
        alert(d.status);
    } catch (e) {
        alert("⚠️ تعليق في الاتصال: السيرفر مشغول أو تم حظر البوت مؤقتاً من ديسكورد");
    }
}
