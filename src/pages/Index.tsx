import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/files/b7ed642f-1932-4780-9fa9-f52e1c114f6b.png";
const INTERIOR_IMG = "https://cdn.poehali.dev/projects/12f928bd-d79e-49a3-9402-01ab190a849b/files/4601bbf2-a1a2-4e49-b943-039fd5ef0728.jpg";
const AERIAL_IMG = "https://cdn.poehali.dev/projects/12f928bd-d79e-49a3-9402-01ab190a849b/files/8a6b2614-9830-42d9-93f6-98ab77a979fc.jpg";

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
  {
    rooms: "1-комнатная",
    area: "35–45 м²",
    price: "от 2 100 000 ₽",
    features: ["Раздельный санузел", "Балкон 4 м²", "Чистовая отделка"],
    popular: false,
  },
  {
    rooms: "2-комнатная",
    area: "55–65 м²",
    price: "от 3 200 000 ₽",
    features: ["Совмещённый санузел", "Лоджия 6 м²", "Вид во двор"],
    popular: true,
  },
  {
    rooms: "3-комнатная",
    area: "75–85 м²",
    price: "от 4 800 000 ₽",
    features: ["Два санузла", "Просторная кухня-гостиная", "Вид на парк"],
    popular: false,
  },
];

function useIntersection(ref: React.RefObject<Element>, threshold = 0.15) {
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

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
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
    <div className="font-body bg-background text-foreground min-h-screen">

      {/* NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <div className="w-[50px] h-[50px] bg-brand text-white rounded-lg flex items-center justify-center text-xl font-extrabold">СЗ</div>
            <div className="hidden sm:block text-left">
              <div className="font-bold text-base text-foreground leading-tight">ООО «СЗ ЦСК»</div>
              <div className="text-foreground/50 text-xs">Специализированный застройщик</div>
            </div>
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  activeSection === item.id ? "text-brand" : "text-foreground hover:text-brand"
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="tel:+79901217046"
              className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-brand-dark transition-colors"
            >
              <Icon name="Phone" size={14} />
              8-990-121-70-46
            </a>
          </nav>
          <button className="md:hidden p-2 text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t py-3">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className="block w-full text-left px-6 py-3 text-sm font-semibold text-foreground hover:text-brand">
                {item.label}
              </button>
            ))}
            <a href="tel:+79901217046" className="block px-6 py-3 text-sm font-bold text-brand">
              📞 8-990-121-70-46
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative h-screen overflow-hidden mt-[70px]">
        <img src={HERO_IMG} alt='ЖК "Перспектива"' className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(44,62,80,0.85) 0%, rgba(231,76,60,0.70) 100%)" }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="animate-fade-in">
            <h1 className="font-display text-white text-5xl md:text-7xl font-extrabold leading-tight mb-5">
              Жилой комплекс <span style={{ color: "#ffd700" }}>«Перспектива»</span><br />в Скадовске
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Современное комфортабельное жильё от проверенного застройщика с 15-летним опытом
            </p>
            <div className="flex justify-center gap-10 md:gap-16 mb-10">
              {[
                { num: "12", label: "жилых домов" },
                { num: "2430", label: "квартир" },
                { num: "15", label: "гектаров" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="font-extrabold text-5xl leading-none mb-1" style={{ color: "#ffd700" }}>{s.num}</div>
                  <div className="text-white/80 text-sm uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => scrollTo("project")}
                className="bg-brand text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-brand-dark transition-all hover:-translate-y-1 shadow-lg">
                Забронировать квартиру
              </button>
              <button onClick={() => scrollTo("project")}
                className="border-2 border-white text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-white hover:text-foreground transition-all">
                Подробнее о проекте
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-4xl font-extrabold text-foreground mb-12">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "ShieldCheck", title: "Надёжность", desc: "Член СРО, все работы по ГОСТам и СНиПам" },
              { icon: "Home", title: "Собственный контроль", desc: "Полный цикл строительства под нашим контролем" },
              { icon: "Banknote", title: "Выгодные условия", desc: "Рассрочка, ипотека от партнёрских банков" },
              { icon: "Trees", title: "Экология", desc: "Зелёная зона, парк, бассейн на территории" },
            ].map(card => (
              <AnimatedSection key={card.title}>
                <div className="text-center p-10 bg-background rounded-xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex justify-center mb-5 text-brand">
                    <Icon name={card.icon} size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{card.title}</h3>
                  <p className="text-foreground/55 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="text-brand text-sm font-bold tracking-[0.3em] uppercase mb-4">О компании</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-6">
              ООО «СЗ ЦСК» — строим с опытом и ответственностью
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-4">
              ООО «Специализированный Застройщик ЦЕНТРСТРОЙКОМПЛЕКС» — компания с 15-летним опытом работы
              на рынке строительства жилой недвижимости в Херсонской области.
            </p>
            <div className="space-y-2 mb-8 text-sm border border-foreground/10 rounded-xl p-5 bg-white">
              {[
                { label: "ОГРН", value: "1259500001529" },
                { label: "ИНН/КПП", value: "9500030539 / 950001001" },
                { label: "В реестре с", value: "04.04.2025" },
                { label: "Генеральный директор", value: "Рычков Максим Николаевич" },
              ].map(d => (
                <div key={d.label} className="flex gap-3">
                  <span className="text-foreground/40 w-44 shrink-0">{d.label}:</span>
                  <span className="text-foreground font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {[
                "Член СРО — все работы по ГОСТам и СНиПам",
                "Полный цикл строительства под собственным контролем",
                "Рассрочка и ипотека от партнёрских банков",
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={16} className="text-brand mt-0.5 shrink-0" />
                  <span className="text-foreground/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="relative">
              <img src={INTERIOR_IMG} alt="О компании" className="w-full h-[480px] object-cover rounded-xl" />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl p-5 shadow-xl">
                <div className="font-display text-4xl font-bold text-brand">15+</div>
                <div className="text-foreground/50 text-xs tracking-wider uppercase mt-1">Лет на рынке</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PROJECT */}
      <section id="project" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-brand text-sm font-bold tracking-[0.3em] uppercase mb-3">Наш проект</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight max-w-xl">
                ЖК «Перспектива» — новый стандарт комфорта
              </h2>
              <p className="text-foreground/50 text-sm max-w-xs leading-relaxed">
                Расположен в северо-восточной части Скадовска на участке 15 гектаров.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-12 mb-14 items-start">
              <div>
                <p className="text-foreground/60 leading-relaxed mb-5">
                  В составе комплекса 12 пятиэтажных домов с современной отделкой фасадов облицовочным кирпичом.
                  2430 квартир различных планировок, подземные и наземные парковки, открытый бассейн,
                  спортивные площадки и детские зоны.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    "2430 квартир различных планировок",
                    "Подземные и наземные парковки",
                    "Открытый бассейн и спортивные площадки",
                    "Детские и игровые зоны",
                    "Зона рекреации с фонтаном и ротондами",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3">
                      <Icon name="CheckCircle" size={16} className="text-brand mt-0.5 shrink-0" />
                      <span className="text-foreground/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "12", label: "жилых домов" },
                  { num: "2430", label: "квартир" },
                  { num: "15", label: "гектаров" },
                  { num: "5", label: "этажей" },
                  { num: "3", label: "типа планировок" },
                  { num: "2025", label: "год продаж" },
                ].map(s => (
                  <div key={s.label} className="bg-background rounded-xl p-5 text-center">
                    <div className="font-display text-3xl font-bold text-brand mb-1">{s.num}</div>
                    <div className="text-foreground/40 text-xs uppercase tracking-wide leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* APARTMENTS */}
          <AnimatedSection>
            <h3 className="text-3xl font-extrabold text-foreground mb-8">Выберите свою квартиру</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {APARTMENTS.map(apt => (
                <div key={apt.rooms}
                  className={`bg-background rounded-xl p-8 relative hover:-translate-y-2 transition-all duration-300 ${apt.popular ? "ring-2 ring-brand shadow-xl" : "hover:shadow-xl"}`}>
                  {apt.popular && (
                    <div className="absolute -top-3 right-5 bg-brand text-white text-xs px-4 py-1.5 rounded-full font-semibold">
                      Популярно
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-1">{apt.rooms}</h3>
                  <p className="text-foreground/40 text-sm mb-5">{apt.area}</p>
                  <div className="space-y-2 mb-5">
                    {apt.features.map(f => (
                      <div key={f} className="flex items-start gap-2 text-sm text-foreground/60">
                        <Icon name="CheckCircle" size={15} className="text-brand mt-0.5 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="text-2xl font-extrabold text-brand mb-5">{apt.price}</div>
                  <button
                    onClick={() => { setBookingApt(apt.rooms); scrollTo("contacts"); }}
                    className="w-full border-2 border-brand text-brand py-3 rounded-full text-sm font-bold hover:bg-brand hover:text-white transition-all"
                  >
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* CALCULATOR */}
          <AnimatedSection>
            <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #2c3e50 0%, #e74c3c 100%)" }}>
              <div className="p-10 md:p-14 text-white">
                <p className="text-white/50 text-sm tracking-[0.3em] uppercase mb-3">Калькулятор</p>
                <h3 className="font-display text-4xl md:text-5xl font-light mb-10">Рассчитайте стоимость квартиры</h3>
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-white/60 text-sm tracking-wider uppercase">Площадь</label>
                        <span className="font-bold text-2xl" style={{ color: "#ffd700" }}>{area} м²</span>
                      </div>
                      <input type="range" min={35} max={85} value={area}
                        onChange={e => setArea(Number(e.target.value))} className="w-full cursor-pointer"
                        style={{ height: "2px", appearance: "none", WebkitAppearance: "none",
                          background: `linear-gradient(to right, #ffd700 ${((area - 35) / 50) * 100}%, rgba(255,255,255,0.2) 0%)` }} />
                      <div className="flex justify-between text-white/30 text-xs mt-2"><span>35 м²</span><span>85 м²</span></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-white/60 text-sm tracking-wider uppercase">Этаж</label>
                        <span className="font-bold text-2xl" style={{ color: "#ffd700" }}>{floor}-й этаж</span>
                      </div>
                      <input type="range" min={1} max={5} value={floor}
                        onChange={e => setFloor(Number(e.target.value))} className="w-full cursor-pointer"
                        style={{ height: "2px", appearance: "none", WebkitAppearance: "none",
                          background: `linear-gradient(to right, #ffd700 ${((floor - 1) / 4) * 100}%, rgba(255,255,255,0.2) 0%)` }} />
                      <div className="flex justify-between text-white/30 text-xs mt-2"><span>1 этаж</span><span>5 этаж</span></div>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm tracking-wider uppercase block mb-3">Отделка</label>
                      <div className="grid grid-cols-3 gap-2">
                        {FINISH_OPTIONS.map(opt => (
                          <button key={opt.id} onClick={() => setFinish(opt.id)}
                            className={`py-3 px-2 text-xs rounded-full font-semibold transition-all border-2 ${
                              finish === opt.id
                                ? "bg-white text-foreground border-white"
                                : "border-white/20 text-white/60 hover:border-white/60 hover:text-white"
                            }`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <p className="text-white/50 text-sm tracking-wider uppercase mb-2">Стоимость квартиры</p>
                    <div className="font-bold text-5xl md:text-6xl mb-2 leading-none" style={{ color: "#ffd700" }}>
                      {(totalPrice / 1_000_000).toFixed(1)} млн ₽
                    </div>
                    <p className="text-white/40 text-sm mb-6">
                      {pricePerMeter.toLocaleString("ru-RU")} ₽ за м² · {area} м² · {floor}-й этаж
                    </p>
                    <div className="space-y-2 mb-8 text-sm">
                      <div className="flex justify-between text-white/50">
                        <span>Базовая цена</span><span>{BASE_PRICE.toLocaleString("ru-RU")} ₽/м²</span>
                      </div>
                      {finishAdd > 0 && (
                        <div className="flex justify-between text-white/50">
                          <span>Отделка</span><span>+{finishAdd.toLocaleString("ru-RU")} ₽/м²</span>
                        </div>
                      )}
                      {floorCoeff !== 1.0 && (
                        <div className="flex justify-between text-white/50">
                          <span>Коэффициент этажа</span><span>×{floorCoeff}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => scrollTo("contacts")}
                      className="bg-brand text-white py-4 rounded-full text-sm font-bold hover:bg-brand-dark transition-colors">
                      Оставить заявку
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-brand text-sm font-bold tracking-[0.3em] uppercase mb-3">Галерея</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-14 max-w-lg">
              ЖК «Перспектива» в деталях
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {GALLERY_ITEMS.map((item, i) => (
              <AnimatedSection key={i}>
                <div className="group relative overflow-hidden rounded-xl cursor-pointer shadow-md hover:-translate-y-2 hover:shadow-2xl transition-all duration-400"
                  style={{ height: "250px" }}>
                  <img src={item.img} alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-white/60 text-xs">{item.year}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 w-9 h-9 rounded-full flex items-center justify-center text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                    <Icon name="ZoomIn" size={16} />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <AnimatedSection>
            <p className="text-brand text-sm font-bold tracking-[0.3em] uppercase mb-4">Контакты</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight mb-6">
              Забронируйте квартиру — мы перезвоним
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-10">
              Наши менеджеры помогут подобрать квартиру, рассчитают рассрочку или ипотеку
              и запишут на экскурсию по объекту.
            </p>
            <div className="space-y-5">
              {[
                { icon: "Phone", label: "Телефон", value: "8-990-121-70-46" },
                { icon: "Mail", label: "Email", value: "ooo.sz-csk@yandex.ru" },
                { icon: "MapPin", label: "Юридический адрес", value: "275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4" },
              ].map(contact => (
                <div key={contact.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-brand/10 text-brand rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name={contact.icon} size={18} />
                  </div>
                  <div>
                    <p className="text-foreground/40 text-xs tracking-wider uppercase mb-0.5">{contact.label}</p>
                    <p className="text-foreground font-semibold">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              {bookingApt && (
                <div className="flex items-center justify-between bg-brand/10 border border-brand/20 rounded-lg px-5 py-3">
                  <span className="text-sm text-foreground font-medium">Выбрана: {bookingApt}</span>
                  <button onClick={() => setBookingApt(null)} className="text-foreground/40 hover:text-foreground ml-3">
                    <Icon name="X" size={16} />
                  </button>
                </div>
              )}
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">ФИО</label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                  className="w-full bg-background border-2 border-foreground/10 rounded-lg px-5 py-3.5 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand transition-colors" />
              </div>
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Телефон *</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (___) ___-__-__" required
                  className="w-full bg-background border-2 border-foreground/10 rounded-lg px-5 py-3.5 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand transition-colors" />
              </div>
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.ru"
                  className="w-full bg-background border-2 border-foreground/10 rounded-lg px-5 py-3.5 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-brand transition-colors" />
              </div>
              <button type="submit"
                className="w-full bg-brand text-white py-4 rounded-full text-sm font-bold hover:bg-brand-dark transition-all hover:-translate-y-1 shadow-md hover:shadow-lg">
                Отправить заявку
              </button>
              <p className="text-foreground/30 text-xs leading-relaxed text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-6" style={{ background: "#2c3e50", color: "white" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-[50px] h-[50px] bg-brand rounded-lg flex items-center justify-center text-white text-xl font-extrabold">СЗ</div>
                <div className="font-bold text-base">ООО «СЗ ЦСК»</div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Специализированный застройщик.<br />
                Строительство жилых комплексов в Херсонской области.
              </p>
            </div>
            <div>
              <h4 className="text-white/60 text-xs tracking-widest uppercase mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-white/50">
                <div className="flex gap-2 items-start"><Icon name="MapPin" size={14} className="mt-0.5 shrink-0" /><span>275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4</span></div>
                <div className="flex gap-2 items-center"><Icon name="Mail" size={14} /><span>ooo.sz-csk@yandex.ru</span></div>
                <div className="flex gap-2 items-center"><Icon name="Phone" size={14} /><span>8-990-121-70-46</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-white/60 text-xs tracking-widest uppercase mb-4">Проекты</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => scrollTo("project")} className="block text-white/50 hover:text-brand transition-colors">ЖК «Перспектива»</button>
                <span className="block text-white/25">Планируемые проекты</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-white/30 text-sm">
            <span>© 2025 ООО «СЗ ЦСК». Все права защищены.</span>
            <span>Генеральный директор: Рычков Максим Николаевич</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
