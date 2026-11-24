import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const pin = new L.DivIcon({
  className: 'custom-pin',
  html: '<div class="pin-dot"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

const jobs = [
  { id: 1, title: 'Мастер-универсал', company: 'СтройГрупп', city: 'Грозный', pay: 'от 3 500 ₽ / день', type: 'Полная занятость', tag: 'Строительство', lat: 43.3178, lng: 45.6987 },
  { id: 2, title: 'Водитель категории B', company: 'ЧеченАвто', city: 'Грозный', pay: 'от 55 000 ₽ / месяц', type: 'Полная занятость', tag: 'Транспорт', lat: 43.325, lng: 45.69 },
  { id: 3, title: 'Электрик', company: 'Частный заказчик', city: 'Аргун', pay: 'от 4 000 ₽ / заказ', type: 'Подработка', tag: 'Ремонт', lat: 43.291, lng: 46.105 },
  { id: 4, title: 'Продавец-консультант', company: 'Магазин техники', city: 'Гудермес', pay: 'от 40 000 ₽ / месяц', type: 'Сменный график', tag: 'Продажи', lat: 43.35, lng: 46.1 }
];

function MapView({ selected }) {
  const center = selected ? [selected.lat, selected.lng] : [43.3, 45.9];
  return <MapContainer center={center} zoom={9} scrollWheelZoom={true} className="map">
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {jobs.map(j => <Marker key={j.id} position={[j.lat, j.lng]} icon={pin}><Popup><b>{j.title}</b><br />{j.city}<br />{j.pay}</Popup></Marker>)}
  </MapContainer>;
}

function App() {
  const [tab, setTab] = useState('home');
  const [lang, setLang] = useState('ru');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Все');
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ title: '', city: 'Грозный', pay: '', phone: '' });

  const t = (ru, ce) => lang === 'ru' ? ru : ce;
  const filtered = useMemo(() => jobs.filter(j =>
    (category === 'Все' || j.tag === category) &&
    `${j.title} ${j.company} ${j.city} ${j.tag}`.toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  const submit = (e) => {
    e.preventDefault();
    setNotice('Заявка подготовлена. Для публикации потребуется подключить сервер и подтверждение номера телефона.');
    setShowCreate(false);
  };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark">B</div><div><strong>BISWORK</strong><small>{t('Работа рядом','Бера рядом')}</small></div></div>
      <button className="lang" onClick={() => setLang(lang === 'ru' ? 'ce' : 'ru')}>{lang === 'ru' ? 'РУС' : 'НОХ'}</button>
    </header>

    <main>
      {tab === 'home' && <section className="hero">
        <div className="eyebrow">{t('ЧЕЧЕНСКАЯ РЕСПУБЛИКА','НОХЧИЙЧОЬ')}</div>
        <h1>{t('Работа и специалисты —','Болх-белхаш а, говзанчаш а —')}<span>{t('рядом с тобой','хьуна герга')}</span></h1>
        <p>{t('Находи работу, нанимай специалистов и договаривайся напрямую.','Болх лаха, говзанча валахьа, цхьаьна дехар до.')}</p>
        <div className="hero-actions"><button className="primary" onClick={() => setTab('jobs')}>{t('Найти работу','Болх лаха')}</button><button className="secondary" onClick={() => setShowCreate(true)}>{t('Разместить объявление','Хаам дӀаязде')}</button></div>
        <div className="stats"><div><b>ЧР</b><small>{t('Регион запуска','Регион')}</small></div><div><b>24/7</b><small>{t('Доступ к объявлениям','Хаамашка ладогӀа')}</small></div><div><b>0 ₽</b><small>{t('На старте бесплатно','Юкъарах аьтто')}</small></div></div>
      </section>}

      {tab === 'home' && <section className="section">
        <div className="section-head"><div><span className="eyebrow">BISWORK</span><h2>{t('Популярные вакансии','Ларйина ваканси')}</h2></div><button className="text-btn" onClick={() => setTab('jobs')}>{t('Все вакансии →','Массо ваканси →')}</button></div>
        <div className="job-list">{jobs.slice(0,3).map(j => <JobCard key={j.id} job={j} onClick={() => {setSelected(j);setTab('map')}} />)}</div>
      </section>}

      {tab === 'jobs' && <section className="section page-section">
        <span className="eyebrow">BISWORK / JOBS</span><h2>{t('Поиск работы','Болх лаха')}</h2>
        <input className="search" placeholder={t('Должность, компания или город','Хьажа долу болх...')} value={query} onChange={e => setQuery(e.target.value)} />
        <div className="chips">{['Все','Строительство','Транспорт','Ремонт','Продажи'].map(c => <button key={c} className={category===c?'chip active':'chip'} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="job-list">{filtered.map(j => <JobCard key={j.id} job={j} onClick={() => {setSelected(j);setTab('map')}} />)}{filtered.length===0 && <p className="muted">Ничего не найдено. Попробуйте изменить запрос.</p>}</div>
      </section>}

      {tab === 'map' && <section className="section map-section">
        <span className="eyebrow">MAP / ЧР</span><h2>{t('Карта вакансий','Вакансийн карта')}</h2>
        <p className="muted">Грозный, Аргун, Гудермес и другие населённые пункты Чеченской Республики.</p>
        <div className="map-wrap"><MapView selected={selected} /></div>
        <div className="map-legend"><span className="pin-dot"></span>{t('Вакансии на карте','Ваканси карта чу')}</div>
        {selected && <div className="selected-job"><b>{selected.title}</b><span>{selected.city} · {selected.pay}</span><button className="text-btn" onClick={() => setSelected(null)}>Сбросить выбор</button></div>}
      </section>}

      {tab === 'profile' && <section className="section page-section">
        <span className="eyebrow">ACCOUNT</span><h2>{t('Личный кабинет','Личный кабинет')}</h2>
        <div className="profile-card"><div className="avatar">U</div><div><b>{t('Добро пожаловать в BISWORK','BISWORK чу марша догӀийла')}</b><p className="muted">{t('Войдите или зарегистрируйтесь по номеру телефона.','Телефонан номерца регистраци йе.')}</p></div></div>
        <div className="settings-row"><span>{t('Подтверждение телефона','Телефон тӀечӀагӀдар')}</span><b className="status">Обязательно</b></div>
        <div className="settings-row"><span>{t('Проверка документов','Документан тӀечӀагӀдар')}</span><b className="muted">Добровольно</b></div>
        <div className="settings-row"><span>{t('Язык приложения','Программин мотт')}</span><button className="text-btn" onClick={() => setLang(lang==='ru'?'ce':'ru')}>{lang==='ru'?'Русский':'Нохчийн'}</button></div>
        <p className="notice">Профили, телефонная авторизация, жалобы, push-уведомления и серверная модерация подключаются на следующем этапе.</p>
      </section>}
    </main>

    {notice && <div className="toast" onClick={() => setNotice('')}>{notice} <b>×</b></div>}
    <nav className="bottom-nav">
      <NavButton active={tab==='home'} icon="⌂" label={t('Главная','Коьрта')} onClick={() => setTab('home')} />
      <NavButton active={tab==='jobs'} icon="▤" label={t('Работа','Болх')} onClick={() => setTab('jobs')} />
      <NavButton active={tab==='map'} icon="⌖" label={t('Карта','Карта')} onClick={() => setTab('map')} />
      <NavButton active={tab==='profile'} icon="◉" label={t('Профиль','Профиль')} onClick={() => setTab('profile')} />
    </nav>

    {showCreate && <div className="modal-backdrop" onClick={() => setShowCreate(false)}><form className="modal" onSubmit={submit} onClick={e => e.stopPropagation()}>
      <button type="button" className="close" onClick={() => setShowCreate(false)}>×</button><span className="eyebrow">NEW LISTING</span><h2>{t('Новое объявление','Керла хаам')}</h2>
      <label>Название<input required value={form.title} onChange={e => setForm({...form,title:e.target.value})} placeholder="Например, нужен электрик" /></label>
      <label>Город<select value={form.city} onChange={e => setForm({...form,city:e.target.value})}><option>Грозный</option><option>Аргун</option><option>Гудермес</option><option>Урус-Мартан</option><option>Шали</option></select></label>
      <label>Оплата<input value={form.pay} onChange={e => setForm({...form,pay:e.target.value})} placeholder="Например, 3 000 ₽ за смену" /></label>
      <label>Телефон<input required type="tel" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="+7 ___ ___-__-__" /></label>
      <button className="primary full" type="submit">Продолжить</button>
      <small className="muted">Демо-форма: объявление пока не отправляется на сервер.</small>
    </form></div>}
  </div>;
}

function JobCard({job,onClick}) {
  return <button className="job-card" onClick={onClick}><div className="job-top"><span className="job-tag">{job.tag}</span><span className="job-city">{job.city}</span></div><b>{job.title}</b><span className="company">{job.company}</span><div className="job-bottom"><strong>{job.pay}</strong><span>{job.type}</span></div></button>;
}
function NavButton({active,icon,label,onClick}) {
  return <button className={active?'nav-item active':'nav-item'} onClick={onClick}><span className="nav-icon">{icon}</span><small>{label}</small></button>;
}

export default App;
