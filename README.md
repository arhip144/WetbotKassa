# WetbotKassa
Данный сервер + бот позволяют выдавать валюту и предметы за донат
1. Зарегистрировать аккаунт в YooKassa и создаем магазин (https://yookassa.ru)
2. Создать бота Discord (https://discord.com/developers/applications) -> New Application
3. Зайти в раздел "Bot" созданного бота.
4. Выключить "Public bot"
5. Включить Server Members Intent
6. Зайти в раздел "OAuth2"
7. Перейти ниже к "OAuth2 URL Generator" и поставить галочку "bot". Ниже сгенерируется ссылка для приглашения бота. Приглашаем бота на свой сервер. 
8. Установить Node.js (https://nodejs.org/en)
9. Скачать данный репозиторий (https://github.com/arhip144/WetbotKassa.git) (Зеленая кнопка Code > Download ZIP)
10. Распаковать ZIP архив
11. Открыть консоль
12. Ввести "cd <путь к распакованой папке>", нажать Enter
13. Ввести "npm install", нажать Enter. Ждать загрузки файлов.
14. С помощью любого редактора текста (можно блокнотом) открыть botconfig.js
15. В поле serverId в кавычки вставляем ID вашего сервера
16. В поле websiteName в кавычки пишем любое название вашего сервера (запрещены спецсимволы), оно потребуется для ЮКассы для направления уведомлений об оплате (Если у вас есть белый IP, который может принимать запросы из интернета, то оставляем поле пустым)
17. В поле email в кавычки пишем ваш E-mail, куда будут приходить чеки
18. В поле shopId в кавычки вставляем ID вашего магазина ЮКассы
19. Если у вас есть белый IP, который может принимать запросы из интернета, то в поле hasWhiteIp замените false на true, в поле key вставьте путь к вашему файлу ключа сертификата, в поле sert вставьте путь к вашему фалу сертификата, в поле ca вставьте путь к вашему файлу CA сертификату
20. Поле currencyPerRuble отвечает за то, сколько будет выдаваться валюты за каждые пожертванный рубль. Поставьте 0, если не хотите выдавать валюту.
21. Если хотите выдавать предметы, то в поле giveItems замените c false на true
22. В поле items, добавляете предметы, которые хотите выдавать за донат.
23. Откройте файл .env любым редактором.
24. В поле discordToken после равно вставляете токен вашего бота, который можно получить на странице созданного бота в разделе "Bot", кнопка Reset Token
25. В поле yooKassaPrivateKey после равно вставляете приватный ключ вашего магазина YooKassa. Можно получить Интеграция -> Ключи API
26. В поле wetbotApiKey после рано вставляете ключ API WETBOT, который можно получить по команде /manager-settings -> API
27. Если у вас белый IP который может принимать запросы из интернета и вы ранее в пункте 19 указали необходимые поля, то переходите на сайте YooKassa в настройки вашего магазина Интеграция -> HTTP-уведомления -> в URL для уведомлений вставляете: https://ВАШ_IP/donate
28. Если у вас нет белого IP, то запускаете start.bat, бот и сервер должен запуститься. В консоле должно появится "Ваш URL", копируете его и вставляете в настройки вашего магазина Интеграция -> HTTP-уведомления -> URL для уведомлений -> ВАШ_URL/donate. Должно получится что-то вроде https://aboba.local.lt/donate
29. На этой же странице включаем только payment.succeeded
30. Нажимаем сохранить.
31. В дискорде вызываем команду /donate (/донат), вводим необходимое количество рублей. Оплачиваем. После этого бот должен выдать предметы или валюту, которые вы настроили в пункте 20-22.