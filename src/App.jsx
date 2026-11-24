import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const STORAGE = { jobs: 'biswork.jobs.v2', favorites: 'biswork.favorites.v2', language: 'biswork.language.v2' };
const districts = ['Ачхой-Мартановский район','Веденский район','Грозненский район','Гудермесский район','Итум-Калинский район','Курчалоевский район','Надтеречный район','Наурский район','Ножай-Юртовский район','Серноводский район','Урус-Мартановский район','Шалинский район','Шаройский район','Шатойский район','Шелковской район'];
const urbanPlaces = ['Аргун','Грозный','Гудермес','Ачхой-Мартан','Курчалой','Наурская','Ойсхара','Серноводское','Урус-Мартан','Шали','Шелковская'];
const suggestedPlaces = [...urbanPlaces,'Верхний Наур','Знаменское','Толстой-Юрт','Алхан-Кала','Самашки','Ведено','Итум-Кали','Шатой','Ножай-Юрт','Бачи-Юрт','Автуры','Гойты','Гехи','Ассиновская','Бамут','Бено-Юрт','Гвардейское','Надтеречное'];
const cityCoords = {
  'Грозный': [43.3178, 45.6987], 'Аргун': [43.291, 46.105], 'Гудермес': [43.35, 46.1], 'Ойсхара': [43.13, 46.24], 'Шелковская': [43.51, 46.34],
  'Урус-Мартан': [43.128, 45.54], 'Шали': [43.148, 45.9], 'Курчалой': [43.2, 46.1],
  'Ачхой-Мартан': [43.19, 45.28], 'Наурская': [43.65, 45.31], 'Знаменское': [43.68, 45.14],
  'Шелковская': [43.51, 46.34], 'Итум-Кали': [42.76, 45.69], 'Шатой': [42.87, 45.69],
  'Ведено': [42.97, 46.1], 'Ножай-Юрт': [43.09, 46.38], 'Серноводское': [43.31, 45.16]
};
const seedRows = [
  ['Каменщик', 'Строительство', 'Грозный', 'от 4 000 ₽ / день', 'Подработка'],
  ['Штукатур', 'Строительство', 'Грозный', 'от 3 500 ₽ / день', 'Полная занятость'],
  ['Плиточник', 'Строительство', 'Аргун', 'от 4 500 ₽ / день', 'Подработка'],
  ['Сварщик', 'Строительство', 'Гудермес', 'от 5 000 ₽ / смена', 'Полная занятость'],
  ['Разнорабочий', 'Строительство', 'Урус-Мартан', 'от 2 500 ₽ / день', 'Подработка'],
  ['Электромонтажник', 'Ремонт', 'Шали', 'от 4 000 ₽ / заказ', 'Разовый заказ'],
  ['Сантехник', 'Ремонт', 'Грозный', 'от 3 500 ₽ / заказ', 'Подработка'],
  ['Мастер по кондиционерам', 'Ремонт', 'Гудермес', 'от 4 000 ₽ / заказ', 'Подработка'],
  ['Автомеханик', 'Транспорт', 'Аргун', 'от 50 000 ₽ / месяц', 'Полная занятость'],
  ['Автоэлектрик', 'Транспорт', 'Грозный', 'от 45 000 ₽ / месяц', 'Полная занятость'],
  ['Водитель категории C', 'Транспорт', 'Шали', 'от 60 000 ₽ / месяц', 'Полная занятость'],
  ['Курьер', 'Транспорт', 'Грозный', 'от 2 500 ₽ / день', 'Частичная занятость'],
  ['Водитель такси', 'Транспорт', 'Гудермес', 'от 3 000 ₽ / день', 'Свободный график'],
  ['Продавец-консультант', 'Продажи', 'Грозный', 'от 40 000 ₽ / месяц', 'Сменный график'],
  ['Кассир', 'Продажи', 'Аргун', 'от 35 000 ₽ / месяц', 'Сменный график'],
  ['Менеджер по продажам', 'Продажи', 'Грозный', 'от 45 000 ₽ + бонусы', 'Полная занятость'],
  ['Администратор магазина', 'Продажи', 'Гудермес', 'от 42 000 ₽ / месяц', 'Полная занятость'],
  ['Повар', 'Общепит', 'Грозный', 'от 45 000 ₽ / месяц', 'Сменный график'],
  ['Помощник повара', 'Общепит', 'Шали', 'от 32 000 ₽ / месяц', 'Сменный график'],
  ['Официант', 'Общепит', 'Грозный', 'от 30 000 ₽ + чаевые', 'Частичная занятость'],
  ['Бариста', 'Общепит', 'Аргун', 'от 35 000 ₽ / месяц', 'Сменный график'],
  ['Швея', 'Производство', 'Урус-Мартан', 'от 40 000 ₽ / месяц', 'Полная занятость'],
  ['Мастер по ремонту телефонов', 'Ремонт', 'Грозный', 'от 45 000 ₽ / месяц', 'Полная занятость'],
  ['Сборщик мебели', 'Ремонт', 'Гудермес', 'от 3 500 ₽ / день', 'Подработка'],
  ['Парикмахер', 'Услуги', 'Шали', 'от 40 000 ₽ / месяц', 'Сменный график'],
  ['Мастер маникюра', 'Услуги', 'Грозный', 'от 50 000 ₽ / месяц', 'Сменный график'],
  ['Фотограф', 'Услуги', 'Грозный', 'от 5 000 ₽ / съёмка', 'Свободный график'],
  ['Уборщик помещений', 'Услуги', 'Гудермес', 'от 30 000 ₽ / месяц', 'Частичная занятость'],
  ['Охранник', 'Безопасность', 'Аргун', 'от 35 000 ₽ / месяц', 'Сменный график'],
  ['Бухгалтер', 'Офис', 'Грозный', 'от 55 000 ₽ / месяц', 'Полная занятость'],
  ['Оператор ПК', 'Офис', 'Гудермес', 'от 38 000 ₽ / месяц', 'Полная занятость'],
  ['Учитель математики', 'Образование', 'Шали', 'от 45 000 ₽ / месяц', 'Частичная занятость'],
  ['Репетитор английского языка', 'Образование', 'Грозный', 'от 1 000 ₽ / урок', 'Свободный график'],
  ['Воспитатель', 'Образование', 'Аргун', 'от 38 000 ₽ / месяц', 'Полная занятость'],
  ['Медицинская сестра', 'Медицина', 'Грозный', 'от 42 000 ₽ / месяц', 'Полная занятость'],
  ['Фармацевт', 'Медицина', 'Гудермес', 'от 45 000 ₽ / месяц', 'Сменный график'],
  ['Помощник ветеринара', 'Сельское хозяйство', 'Наурская', 'от 35 000 ₽ / месяц', 'Полная занятость'],
  ['Работник фермы', 'Сельское хозяйство', 'Знаменское', 'от 2 500 ₽ / день', 'Полная занятость'],
  ['Тракторист', 'Сельское хозяйство', 'Шелковская', 'от 50 000 ₽ / месяц', 'Сезонная работа'],
  ['Упаковщик товара', 'Производство', 'Курчалой', 'от 35 000 ₽ / месяц', 'Сменный график'],
  ['Грузчик', 'Склад', 'Грозный', 'от 2 800 ₽ / смена', 'Подработка'],
  ['Кладовщик', 'Склад', 'Гудермес', 'от 40 000 ₽ / месяц', 'Полная занятость'],
  ['Менеджер по работе с клиентами', 'Офис', 'Аргун', 'от 40 000 ₽ / месяц', 'Полная занятость'],
  ['Дизайнер', 'IT и дизайн', 'Грозный', 'от 50 000 ₽ / месяц', 'Удалённая работа'],
  ['Специалист по SMM', 'IT и дизайн', 'Грозный', 'от 35 000 ₽ / проект', 'Частичная занятость'],
  ['Разработчик сайтов', 'IT и дизайн', 'Грозный', 'от 70 000 ₽ / месяц', 'Удалённая работа'],
  ['Мойщик автомобилей', 'Услуги', 'Серноводское', 'от 2 500 ₽ / день', 'Сменный график'],
  ['Мастер шиномонтажа', 'Транспорт', 'Ачхой-Мартан', 'от 40 000 ₽ / месяц', 'Сезонная работа'],
  ['Сторож', 'Безопасность', 'Итум-Кали', 'от 30 000 ₽ / месяц', 'Сменный график'],
  ['Пекарь', 'Общепит', 'Шатой', 'от 38 000 ₽ / месяц', 'Полная занятость'],
  ['Мастер по изготовлению дверей', 'Производство', 'Ведено', 'от 45 000 ₽ / месяц', 'Полная занятость'],
  ['Помощник по хозяйству', 'Услуги', 'Ножай-Юрт', 'от 2 500 ₽ / день', 'Подработка']
];
const seedJobs = seedRows.map((row, index) => {
  const [title, tag, city, pay, type] = row;
  const coords = cityCoords[city] || cityCoords['Грозный'];
  return { id: 'sample-' + (index + 1), title, tag, city, pay, type, company: 'Пример объявления', phone: '', description: 'Демонстрационный пример для показа возможностей BISWORK. Это не подтверждённая вакансия. Условия, оплату и наличие места необходимо проверить у реального работодателя.', lat: coords[0], lng: coords[1], demo: true };
});
const pin = new L.DivIcon({ className: 'custom-pin', html: '<div class="pin-dot"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
const readStore = (key, fallback) => { try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };

function MapFocus({ selected }) {
  const map = useMap();
  useEffect(() => { if (selected) map.flyTo([selected.lat, selected.lng], 13, { duration: 0.6 }); }, [selected, map]);
  return null;
}

function MapView({ jobs, onSelect, selected }) {
  return <MapContainer center={[43.25, 45.75]} zoom={8} minZoom={8} maxZoom={17} maxBounds={[[42.45, 44.65], [43.95, 46.95]]} maxBoundsViscosity={1} scrollWheelZoom className="map">
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MapFocus selected={selected} />
    {jobs.map(job => <Marker key={job.id} position={[job.lat, job.lng]} icon={pin} eventHandlers={{ click: () => onSelect(job) }}>
      <Popup><b>{job.title}</b><br />{job.city}<br />{job.pay}</Popup>
    </Marker>)}
  </MapContainer>;
}

function App() {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState(() => readStore(STORAGE.language, 'ru'));
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Все');
  const [city, setCity] = useState('Все города');
  const [jobs, setJobs] = useState(() => { const saved = readStore(STORAGE.jobs, []); const savedIds = new Set(saved.map(job => job.id)); return [...seedJobs.filter(job => !savedIds.has(job.id)), ...saved]; });
  const [favorites, setFavorites] = useState(() => readStore(STORAGE.favorites, []));
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ title: '', company: '', city: 'Грозный', district: 'Грозненский район', tag: 'Строительство', type: 'Полная занятость', pay: '', phone: '', description: '' });

  useEffect(() => { localStorage.setItem(STORAGE.jobs, JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem(STORAGE.favorites, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(STORAGE.language, JSON.stringify(lang)); }, [lang]);

  const t = (ru, ce) => lang === 'ru' ? ru : ce;
  const categories = ['Все', 'Строительство', 'Транспорт', 'Ремонт', 'Продажи', 'Общепит', 'Производство', 'Услуги', 'Безопасность', 'Офис', 'Образование', 'Медицина', 'Сельское хозяйство', 'Склад', 'IT и дизайн', 'Другое'];
  const filtered = useMemo(() => jobs.filter(j =>
    (category === 'Все' || j.tag === category) &&
    (city === 'Все города' || j.city === city) &&
    (tab !== 'favorites' || favorites.includes(j.id)) &&
    (j.title + ' ' + j.company + ' ' + j.city + ' ' + j.tag + ' ' + (j.description || '')).toLowerCase().includes(query.toLowerCase().trim())
  ), [jobs, query, category, city, tab, favorites]);

  const toggleFavorite = (id) => setFavorites(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const openJob = (job) => setSelected(job);
  const submit = (e) => {
    e.preventDefault();
    const coords = cityCoords[form.city] || cityCoords['Грозный'];
    const newJob = { ...form, id: 'local-' + Date.now(), lat: coords[0], lng: coords[1], createdAt: new Date().toISOString(), localOnly: true };
    setJobs(current => [newJob, ...current]);
    setShowCreate(false);
    setForm({ title: '', company: '', city: 'Грозный', district: 'Грозненский район', tag: 'Строительство', type: 'Полная занятость', pay: '', phone: '', description: '' });
    setNotice('Объявление сохранено на этом телефоне. Для публикации всем пользователям нужен сервер BISWORK.');
    setTab('jobs');
    setQuery('');
    setCategory('Все');
  };

  const switchTab = (next) => { setTab(next); setSelected(null); setQuery(''); };
  const title = tab === 'home' ? t('Главная', 'Коьрта') : tab === 'jobs' ? t('Поиск работы', 'Болх лаха') : tab === 'map' ? t('Карта вакансий', 'Вакансийн карта') : tab === 'favorites' ? t('Избранное', 'Деза') : t('Профиль', 'Профиль');

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><img className="brand-mark" src="/biswork-icon.svg" alt="BISWORK" /><div><strong>BISWORK</strong><small>{t('Работа рядом', 'Бера герга')}</small></div></div>
      <button className="lang" onClick={() => setLang(lang === 'ru' ? 'ce' : 'ru')}>{lang === 'ru' ? 'РУС' : 'НОХ'}</button>
    </header>

    <main>
      {tab === 'home' && <>
        <section className="hero">
          <div className="eyebrow">{t('ЧЕЧЕНСКАЯ РЕСПУБЛИКА', 'НОХЧИЙЧОЬ')}</div>
          <h1>{t('Работа и специалисты —', 'Болх-белхаш а, говзанчаш а —')}<span>{t('рядом с тобой', 'хьуна герга')}</span></h1>
          <p>{t('Находи работу, нанимай специалистов и договаривайся напрямую.', 'Болх лаха, говзанча валахьа.')}</p>
          <div className="hero-actions"><button className="primary" onClick={() => switchTab('jobs')}>{t('Найти работу', 'Болх лаха')}</button><button className="secondary" onClick={() => setShowCreate(true)}>{t('Разместить объявление', 'Хаам дӀаязде')}</button></div>
          <div className="stats"><div><b>ЧР</b><small>{t('Регион запуска', 'Регион')}</small></div><div><b>{jobs.length}</b><small>{t('Объявлений в приложении', 'Хаамаш')}</small></div><div><b>0 ₽</b><small>{t('На старте бесплатно', 'Бесплатно')}</small></div></div>
        </section>
        <section className="section">
          <div className="section-head"><div><span className="eyebrow">BISWORK</span><h2>{t('Свежие вакансии', 'Керла ваканси')}</h2></div><button className="text-btn" onClick={() => switchTab('jobs')}>{t('Все вакансии →', 'Массо ваканси →')}</button></div>
          <div className="sample-note">Демонстрационные примеры вакансий. Они не являются подтверждёнными предложениями работодателей.</div><div className="job-list">{jobs.slice(0, 4).map(j => <JobCard key={j.id} job={j} onClick={() => openJob(j)} favorite={favorites.includes(j.id)} onFavorite={() => toggleFavorite(j.id)} />)}</div>
          <div className="quick-actions"><button className="quick-card" onClick={() => switchTab('map')}><span>⌖</span><b>{t('Открыть карту', 'Карта')}</b><small>{t('Вакансии по районам ЧР', 'Ваканси')}</small></button><button className="quick-card" onClick={() => switchTab('favorites')}><span>♡</span><b>{t('Избранное', 'Деза')}</b><small>{t('Сохранённые вакансии', 'ДӀасахь')}</small></button></div>
        </section>
      </>}

      {(tab === 'jobs' || tab === 'favorites') && <section className="section page-section">
        <span className="eyebrow">BISWORK / {tab.toUpperCase()}</span><h2>{title}</h2>
        <input className="search" placeholder={t('Должность, компания или город', 'Болх, фирма я города')} value={query} onChange={e => setQuery(e.target.value)} />
        <div className="filter-row"><input className="search" list="biswork-places" placeholder="Все города и сёла — введите населённый пункт" value={city === 'Все города' ? '' : city} onChange={e => setCity(e.target.value || 'Все города')} /><datalist id="biswork-places">{suggestedPlaces.map(p => <option key={p} value={p} />)}</datalist><small className="muted">15 районов · 11 городских населённых пунктов. Любое село или посёлок можно ввести вручную.</small></div>
        <div className="chips">{categories.map(c => <button key={c} className={category === c ? 'chip active' : 'chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="sample-note">В каталоге есть демонстрационные примеры. Реальные вакансии появятся после публикации работодателями.</div><div className="job-list">{filtered.map(j => <JobCard key={j.id} job={j} onClick={() => openJob(j)} favorite={favorites.includes(j.id)} onFavorite={() => toggleFavorite(j.id)} />)}
          {filtered.length === 0 && <div className="empty-state"><b>{t('Ничего не найдено', 'Цхьа а хаам бац')}</b><p>{t('Измените запрос или выберите другой город.', 'Хьажа хьажа.')}</p></div>}
        </div>
        <button className="primary full create-inline" onClick={() => setShowCreate(true)}>＋ {t('Разместить объявление', 'Хаам дӀаязде')}</button>
      </section>}

      {tab === 'map' && <section className="section map-section">
        <span className="eyebrow">MAP / CHECHNYA</span><h2>{title}</h2>
        <p className="muted">{t('Карта ограничена территорией Чеченской Республики. Нажмите на метку, чтобы открыть объявление.', 'Карта Нохчийчоьнан. Метка тӀе хьажа.')} </p>
        <div className="map-wrap"><MapView jobs={jobs} selected={selected} onSelect={openJob} /></div>
        <div className="map-legend"><span className="pin-dot"></span>{t('Объявления на карте', 'Карта чу хаамаш')} <span className="map-count">{jobs.length}</span></div>
        <button className="primary full create-inline" onClick={() => setShowCreate(true)}>＋ {t('Добавить объявление', 'Хаам дӀаязде')}</button>
      </section>}

      {tab === 'profile' && <section className="section page-section">
        <span className="eyebrow">ACCOUNT</span><h2>{title}</h2>
        <div className="profile-card"><div className="avatar">B</div><div><b>{t('Добро пожаловать в BISWORK', 'BISWORK чу марша догӀийла')}</b><p className="muted">{t('Личный кабинет будет активирован после подключения безопасной авторизации.', 'Телефонан номерца регистраци.')}</p></div></div>
        <div className="settings-row"><span>{t('Подтверждение телефона', 'Телефон тӀечӀагӀдар')}</span><b className="status">{t('Обязательно', 'Деза')}</b></div>
        <div className="settings-row"><span>{t('Проверка документов', 'Документан тӀечӀагӀдар')}</span><b className="muted">{t('Добровольно', 'Деза ма ду')}</b></div>
        <div className="settings-row"><span>{t('Язык приложения', 'Программин мотт')}</span><button className="text-btn" onClick={() => setLang(lang === 'ru' ? 'ce' : 'ru')}>{lang === 'ru' ? 'Русский' : 'Нохчийн'}</button></div>
        <div className="settings-row"><span>{t('Избранные объявления', 'Деза хаамаш')}</span><b>{favorites.length}</b></div>
        <div className="settings-row"><span>{t('Мои объявления на этом телефоне', 'Хьан хаамаш')}</span><b>{jobs.filter(j => j.localOnly).length}</b></div>
        <p className="notice">{t('Безопасный вход по SMS, синхронизация объявлений, чат, жалобы и push-уведомления требуют серверной части. Мы не имитируем подтверждение телефона до её подключения.', 'Сервер хила деза.')}</p>
      </section>}
    </main>

    {notice && <div className="toast" role="status" onClick={() => setNotice('')}>{notice} <b>×</b></div>}
    <nav className="bottom-nav">
      <NavButton active={tab === 'home'} icon="⌂" label={t('Главная', 'Коьрта')} onClick={() => switchTab('home')} />
      <NavButton active={tab === 'jobs'} icon="▤" label={t('Работа', 'Болх')} onClick={() => switchTab('jobs')} />
      <NavButton active={tab === 'map'} icon="⌖" label={t('Карта', 'Карта')} onClick={() => switchTab('map')} />
      <NavButton active={tab === 'favorites'} icon="♡" label={t('Избранное', 'Деза')} onClick={() => switchTab('favorites')} />
      <NavButton active={tab === 'profile'} icon="◉" label={t('Профиль', 'Профиль')} onClick={() => switchTab('profile')} />
    </nav>

    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><div className="modal detail-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
      <button type="button" className="close" onClick={() => setSelected(null)}>×</button>
      <span className="eyebrow">{selected.tag} · {selected.city}</span><h2>{selected.title}</h2>
      <p className="company">{selected.company || t('Частный заказчик', 'Частный заказчик')}</p>
      <div className="detail-pay">{selected.pay || t('Оплата обсуждается', 'Оплата обсуждается')}</div>
      <div className="detail-row"><span>{t('Занятость', 'Занятость')}</span><b>{selected.type}</b></div>
      <p className="detail-description">{selected.description || t('Подробности уточняйте у работодателя.', 'Подробности уточняйте.')}</p>
      {selected.demo && <p className="local-warning">Это демонстрационный пример, не подтверждённая вакансия.</p>}{selected.localOnly && <p className="local-warning">{t('Это объявление сохранено только на вашем телефоне и пока не видно другим пользователям.', 'Локальное объявление.')}</p>}
      <button className="secondary full" onClick={() => toggleFavorite(selected.id)}>{favorites.includes(selected.id) ? '♥ ' + t('Убрать из избранного', 'Убрать') : '♡ ' + t('В избранное', 'В избранное')}</button>
      {selected.phone ? <a className="primary full call-link" href={'tel:' + selected.phone}>{t('Позвонить работодателю', 'Позвонить')}</a> : <p className="muted">{t('Контактный номер для этой демонстрационной вакансии не указан.', 'Контакт не указан.')}</p>}
    </div></div>}

    {showCreate && <div className="modal-backdrop" onClick={() => setShowCreate(false)}><form className="modal create-modal" onSubmit={submit} onClick={e => e.stopPropagation()}>
      <button type="button" className="close" onClick={() => setShowCreate(false)}>×</button><span className="eyebrow">NEW LISTING</span><h2>{t('Новое объявление', 'Керла хаам')}</h2>
      <label>{t('Название вакансии или услуги', 'Хааман цӀе')}<input required maxLength="70" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={t('Например, нужен электрик', 'Например, нужен электрик')} /></label>
      <label>{t('Работодатель / организация', 'Организация')}<input maxLength="60" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder={t('Имя или название компании', 'Имя или название компании')} /></label>
      <div className="form-grid"><label>Район<select value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}>{districts.map(d => <option key={d}>{d}</option>)}</select></label><label>{t('Город / село / посёлок', 'Город / село')}<input list="biswork-form-places" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required placeholder="Введите населённый пункт" /><datalist id="biswork-form-places">{suggestedPlaces.map(p => <option key={p} value={p} />)}</datalist></label>
      <label>{t('Категория', 'Категория')}<select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })}>{categories.filter(c => c !== 'Все').map(c => <option key={c}>{c}</option>)}</select></label></div>
      <label>{t('Оплата', 'Оплата')}<input maxLength="50" value={form.pay} onChange={e => setForm({ ...form, pay: e.target.value })} placeholder="Например, 3 000 ₽ за смену" /></label>
      <label>{t('Тип занятости', 'Тип занятости')}<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Полная занятость</option><option>Частичная занятость</option><option>Подработка</option><option>Сменный график</option><option>Разовый заказ</option></select></label>
      <label>{t('Телефон для связи', 'Телефон')}<input required type="tel" maxLength="20" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+7 ___ ___-__-__" /></label>
      <label>{t('Описание', 'Описание')}<textarea rows="3" maxLength="500" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder={t('Расскажите подробнее об условиях и требованиях', 'Описание')} /></label>
      <button className="primary full" type="submit">{t('Сохранить объявление', 'Сохранить')}</button>
      <small className="muted">{t('Пока объявление сохраняется только на этом устройстве. Для общей публикации и проверки номера потребуется сервер BISWORK.', 'Локальное сохранение.')}</small>
    </form></div>}
  </div>;
}

function JobCard({ job, onClick, favorite, onFavorite }) {
  return <div className="job-card-wrap"><button className="job-card" onClick={onClick}>
    <div className="job-top"><span className="job-tag">{job.tag}</span><span className="job-city">{job.city}</span></div>
    <b>{job.title}</b><span className="company">{job.company || 'Частный заказчик'}</span>
    <div className="job-bottom"><strong>{job.pay || 'Оплата обсуждается'}</strong><span>{job.type}</span></div>
    {job.demo && <small className="local-label">Пример · не проверено</small>}{job.localOnly && <small className="local-label">Сохранено на этом устройстве</small>}
  </button><button className={favorite ? 'favorite-btn saved' : 'favorite-btn'} aria-label={favorite ? 'Убрать из избранного' : 'В избранное'} onClick={onFavorite}>{favorite ? '♥' : '♡'}</button></div>;
}
function NavButton({ active, icon, label, onClick }) {
  return <button className={active ? 'nav-item active' : 'nav-item'} onClick={onClick}><span className="nav-icon">{icon}</span><small>{label}</small></button>;
}
export default App;
