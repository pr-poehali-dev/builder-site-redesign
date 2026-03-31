import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/files/b7ed642f-1932-4780-9fa9-f52e1c114f6b.png";
const INTERIOR_IMG = "https://cdn.poehali.dev/projects/12f928bd-d79e-49a3-9402-01ab190a849b/files/4601bbf2-a1a2-4e49-b943-039fd5ef0728.jpg";
const AERIAL_IMG = "https://cdn.poehali.dev/projects/12f928bd-d79e-49a3-9402-01ab190a849b/files/8a6b2614-9830-42d9-93f6-98ab77a979fc.jpg";

const DARK = "#1a2535";
const GOLD = "#9a7d3a";
const CREAM = "#f5f2ec";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О компании" },
  { id: "project", label: 'ЖК "Перспектива"' },
  { id: "gallery", label: "Галерея" },
  { id: "contacts", label: "Контакты" },
];

const GALLERY_ITEMS = [
  { img: HERO_IMG, title: "Архитектурный вид", year: "2025" },
  { img: INTERIOR_IMG, title: "Инфраструктура", year: "2025" },
  { img: AERIAL_IMG, title: "Благоустройство", year: "2025" },
  { img: HERO_IMG, title: "Фасад комплекса", year: "2025" },
  { img: INTERIOR_IMG, title: "Территория", year: "2025" },
  { img: AERIAL_IMG, title: "Зона отдыха", year: "2025" },
];

const FINISH_OPTIONS = [
  { id: "none", label: "Без отделки", price: 0 },
  { id: "clean", label: "Чистовая", price: 8000 },
  { id: "full", label: "Под ключ", price: 18000 },
];

const APARTMENTS = [
  { rooms: "1-комнатная", area: "35–45 м²", price: "от 2 100 000 ₽", features: ["Раздельный санузел", "Балкон 4 м²", "Чистовая отделка"], popular: false },
  { rooms: "2-комнатная", area: "55–65 м²", price: "от 3 200 000 ₽", features: ["Совмещённый санузел", "Лоджия 6 м²", "Вид во двор"], popular: true },
  { rooms: "3-комнатная", area: "75–85 м²", price: "от 4 800 000 ₽", features: ["Два санузла", "Просторная кухня-гостиная", "Вид на парк"], popular: false },
];

function useIntersection(ref: React.RefObject<Element>, threshold = 0.12) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="h-px flex-1" style={{ background: GOLD, opacity: 0.3 }} />
      <div className="w-1.5 h-1.5 rotate-45" style={{ background: GOLD }} />
      <div className="h-px flex-1" style={{ background: GOLD, opacity: 0.3 }} />
    </div>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [area, setArea] = useState(55);
  const [floor, setFloor] = useState(3);
  const [finish, setFinish] = useState("clean");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [bookingApt, setBookingApt] = useState<string | null>(null);

  const BASE_PRICE = 58000;
  const floorCoeff = floor <= 1 ? 0.97 : floor >= 4 ? 1.04 : 1.0;
  const finishAdd = FINISH_OPTIONS.find(f => f.id === finish)?.price ?? 0;
  const totalPrice = Math.round(area * (BASE_PRICE + finishAdd) * floorCoeff);
  const pricePerMeter = Math.round((BASE_PRICE + finishAdd) * floorCoeff);

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(n => document.getElementById(n.id));
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.offsetTop <= scrollY) { setActiveSection(NAV_ITEMS[i].id); break; }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="font-body min-h-screen" style={{ background: CREAM, color: DARK }}>

      {/* NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2" style={{ borderColor: GOLD }}>
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center text-white text-base font-bold" style={{ background: DARK }}>
              СЗ
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="font-bold text-sm tracking-wide" style={{ color: DARK }}>ООО «СЗ ЦСК»</div>
              <div className="text-xs tracking-wider" style={{ color: GOLD }}>Специализированный застройщик</div>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="text-sm font-bold tracking-wider uppercase transition-colors duration-200"
                style={{ color: activeSection === item.id ? GOLD : DARK, borderBottom: activeSection === item.id ? `2px solid ${GOLD}` : "2px solid transparent", paddingBottom: "2px" }}>
                {item.label}
              </button>
            ))}
            <a href="tel:+79901217046"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wider text-white transition-opacity hover:opacity-90"
              style={{ background: DARK }}>
              <Icon name="Phone" size={14} />
              8-990-121-70-46
            </a>
          </nav>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t py-3" style={{ borderColor: GOLD }}>
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="block w-full text-left px-6 py-3 text-sm font-bold tracking-wider uppercase"
                style={{ color: activeSection === item.id ? GOLD : DARK }}>
                {item.label}
              </button>
            ))}
            <a href="tel:+79901217046" className="block px-6 py-3 text-sm font-bold" style={{ color: GOLD }}>
              📞 8-990-121-70-46
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden mt-[68px]" style={{ height: "calc(100vh - 68px)" }}>
        <img src={HERO_IMG} alt='ЖК "Перспектива"' className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,37,53,0.75) 0%, rgba(26,37,53,0.90) 100%)" }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="animate-fade-in max-w-4xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: GOLD }}>Жилой комплекс · Скадовск · 2025</span>
              <div className="h-px w-16" style={{ background: GOLD }} />
            </div>
            <h1 className="font-display text-white text-5xl md:text-7xl font-bold leading-tight mb-4" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
              Жилой комплекс<br />
              <span style={{ color: GOLD }}> «Перспектива»</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Современное комфортабельное жильё от проверенного застройщика с 15-летним опытом
            </p>
            <div className="flex justify-center gap-12 md:gap-20 mb-12">
              {[
                { num: "12", label: "жилых домов" },
                { num: "2430", label: "квартир" },
                { num: "15", label: "гектаров" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-display font-bold text-5xl mb-1" style={{ color: GOLD }}>{s.num}</div>
                  <div className="text-white/60 text-xs uppercase tracking-[0.2em]">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo("project")}
                className="px-10 py-4 text-sm font-bold tracking-[0.15em] uppercase text-white transition-opacity hover:opacity-85"
                style={{ background: GOLD }}>
                Забронировать квартиру
              </button>
              <button onClick={() => scrollTo("about")}
                className="px-10 py-4 text-sm font-bold tracking-[0.15em] uppercase text-white border-2 transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.5)" }}>
                О компании
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА — тёмная полоса */}
      <section style={{ background: DARK }}>
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
          {[
            { icon: "ShieldCheck", title: "Надёжность", desc: "Член СРО, все работы по ГОСТам и СНиПам" },
            { icon: "Home", title: "Собственный контроль", desc: "Полный цикл строительства под нашим контролем" },
            { icon: "Banknote", title: "Выгодные условия", desc: "Рассрочка, ипотека от партнёрских банков" },
            { icon: "Trees", title: "Экология", desc: "Зелёная зона, парк, бассейн на территории" },
          ].map(card => (
            <div key={card.title} className="text-center px-8 py-2">
              <div className="flex justify-center mb-3" style={{ color: GOLD }}>
                <Icon name={card.icon} size={32} />
              </div>
              <div className="font-bold text-white text-sm tracking-wide mb-1">{card.title}</div>
              <div className="text-white/40 text-xs leading-relaxed">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* О КОМПАНИИ */}
      <section id="about" className="py-24 px-6" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto">

          {/* Заголовок + фото */}
          <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-0.5" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>О компании</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: DARK }}>
                ООО «СЗ ЦСК»
              </h2>
              <Divider />
              <p className="leading-relaxed mb-4 text-sm" style={{ color: `${DARK}cc` }}>
                ООО «Специализированный Застройщик ЦЕНТРСТРОЙКОМПЛЕКС» — компания с 15-летним опытом работы
                на рынке строительства жилой недвижимости в Херсонской области.
              </p>
              <div className="space-y-3 mt-6 text-sm border-l-2 pl-5" style={{ borderColor: GOLD }}>
                {[
                  "Член СРО — все работы по ГОСТам и СНиПам",
                  "Полный цикл строительства под собственным контролем",
                  "Рассрочка и ипотека от партнёрских банков",
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <Icon name="ChevronRight" size={14} className="mt-0.5 shrink-0" style={{ color: GOLD } as React.CSSProperties} />
                    <span style={{ color: `${DARK}bb` }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="relative">
                <img src={INTERIOR_IMG} alt="О компании" className="w-full h-[420px] object-cover" style={{ borderLeft: `4px solid ${GOLD}` }} />
                <div className="absolute -bottom-4 -left-4 bg-white p-5 border-l-4" style={{ borderColor: GOLD }}>
                  <div className="font-display text-4xl font-bold" style={{ color: GOLD }}>15+</div>
                  <div className="text-xs tracking-wider uppercase mt-1" style={{ color: `${DARK}88` }}>Лет на рынке</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Миссия */}
          <Reveal>
            <div className="border-2 p-10 md:p-14 mb-16 text-center" style={{ borderColor: GOLD, background: DARK }}>
              <div className="flex items-center justify-center gap-4 mb-5">
                <div className="h-px w-12" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-[0.4em] uppercase" style={{ color: GOLD }}>Наша миссия</span>
                <div className="h-px w-12" style={{ background: GOLD }} />
              </div>
              <h3 className="font-display text-3xl font-bold text-white mb-5">
                Качественное жильё для Херсонской области
              </h3>
              <p className="text-white/70 max-w-3xl mx-auto leading-relaxed mb-10 text-sm">
                Мы создаём качественное и доступное жильё для жителей Херсонской области. Наша цель — строить не просто дома,
                а современные жилые комплексы с развитой инфраструктурой, где каждая деталь продумана для комфортной жизни.
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
                {[
                  { num: "15+", label: "лет опыта" },
                  { num: "50+", label: "реализованных проектов" },
                  { num: "2430", label: "квартир в проекте" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="font-display font-bold text-4xl mb-1" style={{ color: GOLD }}>{s.num}</div>
                    <div className="text-white/50 text-xs uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Реквизиты */}
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-0.5" style={{ background: GOLD }} />
              <h3 className="font-display text-2xl font-bold" style={{ color: DARK }}>Реквизиты компании</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: "Building2", title: "Основная информация",
                  rows: [
                    { label: "Полное наименование", value: "ООО «Специализированный Застройщик ЦЕНТРСТРОЙКОМПЛЕКС»" },
                    { label: "Сокращённое", value: "ООО «СЗ ЦСК»" },
                    { label: "ОГРН", value: "1259500001529" },
                    { label: "ИНН/КПП", value: "9500030539 / 950001001" },
                    { label: "Дата регистрации", value: "04.04.2025" },
                  ],
                },
                {
                  icon: "MapPin", title: "Адреса",
                  rows: [
                    { label: "Юридический адрес", value: "275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4" },
                    { label: "Местонахождение", value: "275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4" },
                    { label: "Почтовый адрес", value: "152914, Ярославская обл., г. Рыбинск, ул. Качалова, д. 30, кв/оф. 30" },
                  ],
                },
                {
                  icon: "Users", title: "Руководство",
                  rows: [
                    { label: "Генеральный директор", value: "Рычков Максим Николаевич" },
                    { label: "Главный бухгалтер", value: "Рычков Максим Николаевич" },
                    { label: "Телефон", value: "8-990-121-70-46" },
                    { label: "Основание", value: "Устав компании" },
                  ],
                },
                {
                  icon: "Landmark", title: "Банковские реквизиты",
                  rows: [
                    { label: "Банк", value: 'ПАО "БАНК ПСБ"' },
                    { label: "Расчётный счёт", value: "40702 810 4 0000 0343234" },
                    { label: "Корр. счёт", value: "30101 810 4 0000 0000555" },
                    { label: "БИК", value: "044525555" },
                  ],
                },
              ].map(card => (
                <div key={card.title} className="bg-white border-t-4 p-7" style={{ borderColor: GOLD }}>
                  <div className="flex items-center gap-3 mb-5">
                    <Icon name={card.icon} size={18} style={{ color: GOLD } as React.CSSProperties} />
                    <h4 className="font-bold tracking-wide text-sm uppercase" style={{ color: DARK }}>{card.title}</h4>
                  </div>
                  <div className="space-y-3">
                    {card.rows.map(row => (
                      <div key={row.label} className="flex gap-3 text-sm border-b border-black/5 pb-2">
                        <span className="shrink-0 w-36 text-xs" style={{ color: `${DARK}66` }}>{row.label}:</span>
                        <span className="font-semibold text-xs" style={{ color: DARK }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ПРОЕКТ */}
      <section id="project" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>Наш проект</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight max-w-xl" style={{ color: DARK }}>
                ЖК «Перспектива» —<br />новый стандарт комфорта
              </h2>
              <p className="text-sm max-w-xs leading-relaxed" style={{ color: `${DARK}88` }}>
                Северо-восточная часть Скадовска, участок 15 гектаров.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-2 gap-12 mb-14 items-start">
              <div>
                <p className="leading-relaxed mb-6 text-sm" style={{ color: `${DARK}cc` }}>
                  В составе комплекса 12 пятиэтажных домов с современной отделкой фасадов облицовочным кирпичом.
                  2430 квартир различных планировок, подземные и наземные парковки, открытый бассейн,
                  спортивные площадки и детские зоны.
                </p>
                <ul className="flex flex-col gap-3 border-l-2 pl-5" style={{ borderColor: GOLD }}>
                  {[
                    "2430 квартир различных планировок",
                    "Подземные и наземные парковки",
                    "Открытый бассейн и спортивные площадки",
                    "Детские и игровые зоны",
                    "Зона рекреации с фонтаном и ротондами",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: `${DARK}bb` }}>
                      <Icon name="ChevronRight" size={14} className="mt-0.5 shrink-0" style={{ color: GOLD } as React.CSSProperties} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { num: "12", label: "жилых домов" },
                  { num: "2430", label: "квартир" },
                  { num: "15", label: "гектаров" },
                  { num: "5", label: "этажей" },
                  { num: "3", label: "типа планировок" },
                  { num: "2025", label: "год продаж" },
                ].map(s => (
                  <div key={s.label} className="p-5 text-center border" style={{ borderColor: `${GOLD}44`, background: CREAM }}>
                    <div className="font-display text-3xl font-bold mb-1" style={{ color: GOLD }}>{s.num}</div>
                    <div className="text-xs uppercase tracking-wide leading-tight" style={{ color: `${DARK}66` }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* КВАРТИРЫ */}
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-0.5" style={{ background: GOLD }} />
              <h3 className="font-display text-2xl font-bold" style={{ color: DARK }}>Выберите квартиру</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {APARTMENTS.map(apt => (
                <div key={apt.rooms} className="bg-white border-2 p-8 relative transition-shadow hover:shadow-lg"
                  style={{ borderColor: apt.popular ? GOLD : `${DARK}15` }}>
                  {apt.popular && (
                    <div className="absolute -top-3 left-6 text-white text-xs px-4 py-1 font-bold tracking-wider uppercase"
                      style={{ background: GOLD }}>
                      Популярно
                    </div>
                  )}
                  <h3 className="font-display text-xl font-bold mb-1" style={{ color: DARK }}>{apt.rooms}</h3>
                  <p className="text-xs mb-5 tracking-wide" style={{ color: `${DARK}66` }}>{apt.area}</p>
                  <div className="space-y-2 mb-6 border-l-2 pl-4" style={{ borderColor: `${GOLD}55` }}>
                    {apt.features.map(f => (
                      <div key={f} className="text-xs" style={{ color: `${DARK}99` }}>{f}</div>
                    ))}
                  </div>
                  <div className="font-display text-2xl font-bold mb-6" style={{ color: GOLD }}>{apt.price}</div>
                  <button
                    onClick={() => { setBookingApt(apt.rooms); scrollTo("contacts"); }}
                    className="w-full py-3 text-sm font-bold tracking-wider uppercase border-2 transition-all hover:text-white"
                    style={{ borderColor: DARK, color: DARK }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = DARK; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; }}>
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </Reveal>

          {/* КАЛЬКУЛЯТОР */}
          <Reveal>
            <div className="border-2 p-10 md:p-14" style={{ borderColor: GOLD, background: DARK }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8" style={{ background: GOLD }} />
                <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>Калькулятор стоимости</span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-10">
                Рассчитайте стоимость квартиры
              </h3>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: `${GOLD}cc` }}>Площадь</label>
                      <span className="font-display font-bold text-2xl" style={{ color: GOLD }}>{area} м²</span>
                    </div>
                    <input type="range" min={35} max={85} value={area}
                      onChange={e => setArea(Number(e.target.value))} className="w-full cursor-pointer"
                      style={{ height: "2px", appearance: "none", WebkitAppearance: "none",
                        background: `linear-gradient(to right, ${GOLD} ${((area - 35) / 50) * 100}%, rgba(255,255,255,0.15) 0%)` }} />
                    <div className="flex justify-between text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                      <span>35 м²</span><span>85 м²</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: `${GOLD}cc` }}>Этаж</label>
                      <span className="font-display font-bold text-2xl" style={{ color: GOLD }}>{floor}-й этаж</span>
                    </div>
                    <input type="range" min={1} max={5} value={floor}
                      onChange={e => setFloor(Number(e.target.value))} className="w-full cursor-pointer"
                      style={{ height: "2px", appearance: "none", WebkitAppearance: "none",
                        background: `linear-gradient(to right, ${GOLD} ${((floor - 1) / 4) * 100}%, rgba(255,255,255,0.15) 0%)` }} />
                    <div className="flex justify-between text-xs mt-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                      <span>1 этаж</span><span>5 этаж</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold tracking-[0.2em] uppercase block mb-3" style={{ color: `${GOLD}cc` }}>Отделка</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FINISH_OPTIONS.map(opt => (
                        <button key={opt.id} onClick={() => setFinish(opt.id)}
                          className="py-3 px-2 text-xs font-bold tracking-wider uppercase transition-all border-2"
                          style={{
                            borderColor: finish === opt.id ? GOLD : "rgba(255,255,255,0.15)",
                            background: finish === opt.id ? GOLD : "transparent",
                            color: finish === opt.id ? DARK : "rgba(255,255,255,0.5)"
                          }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 border-2" style={{ borderColor: `${GOLD}40` }}>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: `${GOLD}99` }}>Стоимость квартиры</p>
                  <div className="font-display font-bold text-5xl mb-2 leading-none" style={{ color: GOLD }}>
                    {(totalPrice / 1_000_000).toFixed(1)} млн ₽
                  </div>
                  <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {pricePerMeter.toLocaleString("ru-RU")} ₽ за м² · {area} м² · {floor}-й этаж
                  </p>
                  <div className="space-y-2 mb-8 text-xs" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <span>Базовая цена</span><span>{BASE_PRICE.toLocaleString("ru-RU")} ₽/м²</span>
                    </div>
                    {finishAdd > 0 && (
                      <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <span>Отделка</span><span>+{finishAdd.toLocaleString("ru-RU")} ₽/м²</span>
                      </div>
                    )}
                    {floorCoeff !== 1.0 && (
                      <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <span>Коэффициент этажа</span><span>×{floorCoeff}</span>
                      </div>
                    )}
                  </div>
                  <button onClick={() => scrollTo("contacts")}
                    className="py-4 text-sm font-bold tracking-[0.15em] uppercase text-white transition-opacity hover:opacity-85"
                    style={{ background: GOLD }}>
                    Оставить заявку
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section id="gallery" className="py-24 px-6" style={{ background: CREAM }}>
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>Галерея</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-14" style={{ color: DARK }}>
              ЖК «Перспектива» в деталях
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <Reveal key={i}>
                <div className="group relative overflow-hidden cursor-pointer" style={{ height: "260px", borderTop: `3px solid ${GOLD}` }}>
                  <img src={item.img} alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(26,37,53,0.75)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-bold text-sm tracking-wide">{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: GOLD }}>{item.year}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-0.5" style={{ background: GOLD }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: GOLD }}>Контакты</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: DARK }}>
              Забронируйте квартиру
            </h2>
            <Divider />
            <p className="leading-relaxed mb-10 text-sm" style={{ color: `${DARK}99` }}>
              Наши менеджеры помогут подобрать квартиру, рассчитают рассрочку или ипотеку
              и запишут на экскурсию по объекту.
            </p>
            <div className="space-y-5">
              {[
                { icon: "Phone", label: "Телефон", value: "8-990-121-70-46" },
                { icon: "Mail", label: "Email", value: "ooo.sz-csk@yandex.ru" },
                { icon: "MapPin", label: "Юридический адрес", value: "275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4" },
              ].map(contact => (
                <div key={contact.label} className="flex items-start gap-4 border-l-2 pl-4" style={{ borderColor: `${GOLD}55` }}>
                  <Icon name={contact.icon} size={16} className="mt-0.5 shrink-0" style={{ color: GOLD } as React.CSSProperties} />
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: `${DARK}55` }}>{contact.label}</p>
                    <p className="font-bold text-sm" style={{ color: DARK }}>{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              {bookingApt && (
                <div className="flex items-center justify-between px-5 py-3 border-l-4 bg-amber-50"
                  style={{ borderColor: GOLD }}>
                  <span className="text-sm font-semibold" style={{ color: DARK }}>Выбрана: {bookingApt}</span>
                  <button onClick={() => setBookingApt(null)} className="ml-3" style={{ color: `${DARK}66` }}>
                    <Icon name="X" size={16} />
                  </button>
                </div>
              )}
              {[
                { label: "ФИО", type: "text", value: formData.name, placeholder: "Иванов Иван Иванович", key: "name" },
                { label: "Телефон *", type: "tel", value: formData.phone, placeholder: "+7 (___) ___-__-__", key: "phone" },
                { label: "Email", type: "email", value: formData.email, placeholder: "example@mail.ru", key: "email" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: `${DARK}77` }}>
                    {field.label}
                  </label>
                  <input type={field.type} value={field.value} placeholder={field.placeholder}
                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-5 py-4 text-sm border-2 bg-white focus:outline-none transition-colors"
                    style={{ borderColor: `${DARK}20`, color: DARK }}
                    onFocus={e => (e.target.style.borderColor = GOLD)}
                    onBlur={e => (e.target.style.borderColor = `${DARK}20`)}
                  />
                </div>
              ))}
              <button type="submit"
                className="w-full py-4 text-sm font-bold tracking-[0.15em] uppercase text-white transition-opacity hover:opacity-85"
                style={{ background: DARK }}>
                Отправить заявку
              </button>
              <p className="text-xs text-center" style={{ color: `${DARK}44` }}>
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-6" style={{ background: DARK, borderTop: `3px solid ${GOLD}` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center text-white text-sm font-bold" style={{ background: GOLD }}>СЗ</div>
                <div>
                  <div className="font-bold text-white text-sm">ООО «СЗ ЦСК»</div>
                  <div className="text-xs tracking-wider" style={{ color: `${GOLD}99` }}>Специализированный застройщик</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                Строительство жилых комплексов<br />в Херсонской области.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>Контакты</h4>
              <div className="space-y-2 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                <div className="flex gap-2 items-start">
                  <Icon name="MapPin" size={12} className="mt-0.5 shrink-0" />
                  <span>275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4</span>
                </div>
                <div className="flex gap-2 items-center"><Icon name="Mail" size={12} /><span>ooo.sz-csk@yandex.ru</span></div>
                <div className="flex gap-2 items-center"><Icon name="Phone" size={12} /><span>8-990-121-70-46</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>Проекты</h4>
              <div className="space-y-2 text-xs">
                <button onClick={() => scrollTo("project")} className="block transition-colors hover:opacity-80" style={{ color: "rgba(255,255,255,0.45)" }}>
                  ЖК «Перспектива»
                </button>
                <span className="block" style={{ color: "rgba(255,255,255,0.2)" }}>Планируемые проекты</span>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs" style={{ borderTop: `1px solid rgba(255,255,255,0.1)`, color: "rgba(255,255,255,0.25)" }}>
            <span>© 2025 ООО «СЗ ЦСК». Все права защищены.</span>
            <span>Генеральный директор: Рычков Максим Николаевич</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
