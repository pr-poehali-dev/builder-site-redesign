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
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
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
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", apartment: "" });
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
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const openBooking = (apt: string) => {
    setBookingApt(apt);
    setFormData(f => ({ ...f, apartment: apt }));
  };

  return (
    <div className="font-body bg-background text-foreground min-h-screen">

      {/* NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-3">
            <div className="w-9 h-9 bg-foreground text-background flex items-center justify-center text-sm font-bold tracking-wider">СЗ</div>
            <div className="hidden sm:block text-left">
              <div className="font-body text-sm font-semibold leading-tight">ООО «СЗ ЦСК»</div>
              <div className="text-foreground/40 text-xs">Специализированный застройщик</div>
            </div>
          </button>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm tracking-wide transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-foreground font-medium"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="tel:+79901217046"
              className="flex items-center gap-2 bg-foreground text-background px-4 py-2 text-sm font-medium hover:bg-foreground/85 transition-colors"
            >
              <Icon name="Phone" size={14} />
              8-990-121-70-46
            </a>
          </nav>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-background border-t border-black/5 py-4">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left px-6 py-3 text-sm text-foreground/70 hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
            <a href="tel:+79901217046" className="block px-6 py-3 text-sm font-medium text-foreground">
              📞 8-990-121-70-46
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative h-screen overflow-hidden">
        <img src={HERO_IMG} alt='ЖК "Перспектива"' className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/65" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Жилой комплекс · Скадовск</p>
            <h1 className="font-display text-white text-6xl md:text-8xl font-light leading-[0.9] mb-4">
              «Перспектива»
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light max-w-lg mb-4 leading-relaxed">
              Современное комфортабельное жильё от проверенного застройщика с 15-летним опытом
            </p>
            <div className="flex gap-8 mb-10">
              {[
                { num: "12", label: "жилых домов" },
                { num: "2430", label: "квартир" },
                { num: "15", label: "гектаров" },
              ].map(s => (
                <div key={s.label}>
                  <div className="font-display text-white text-3xl font-light">{s.num}</div>
                  <div className="text-white/50 text-xs tracking-wider uppercase">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("project")}
                className="bg-white text-foreground px-8 py-3.5 text-sm tracking-widest uppercase font-medium hover:bg-white/90 transition-colors"
              >
                Забронировать квартиру
              </button>
              <button
                onClick={() => scrollTo("project")}
                className="border border-white text-white px-8 py-3.5 text-sm tracking-widest uppercase font-medium hover:bg-white/10 transition-colors"
              >
                Подробнее о проекте
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2">
          <span className="text-white/40 text-xs tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>Scroll</span>
          <div className="w-px h-12 bg-white/20" />
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: "ShieldCheck", title: "Надёжность", desc: "Член СРО, все работы по ГОСТам и СНиПам" },
            { icon: "Home", title: "Собственный контроль", desc: "Полный цикл строительства под нашим контролем" },
            { icon: "Banknote", title: "Выгодные условия", desc: "Рассрочка, ипотека от партнёрских банков" },
            { icon: "Trees", title: "Экология", desc: "Зелёная зона, парк, бассейн на территории" },
          ].map(card => (
            <div key={card.title} className="text-center">
              <div className="flex justify-center mb-3 text-background/50">
                <Icon name={card.icon} size={32} />
              </div>
              <div className="font-display text-xl font-light mb-1">{card.title}</div>
              <div className="text-background/40 text-sm leading-relaxed">{card.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <p className="text-foreground/40 text-sm tracking-[0.3em] uppercase mb-6">О компании</p>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-tight mb-8">
              ООО «СЗ ЦСК» — строим с опытом и ответственностью
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-6">
              ООО «Специализированный Застройщик ЦЕНТРСТРОЙКОМПЛЕКС» — компания с 15-летним опытом работы
              на рынке строительства жилой недвижимости. Специализируемся на строительстве современных
              жилых комплексов комфорт-класса в Херсонской области.
            </p>
            <div className="space-y-3 mb-10">
              {[
                { label: "ОГРН", value: "1259500001529" },
                { label: "ИНН/КПП", value: "9500030539 / 950001001" },
                { label: "В реестре с", value: "04.04.2025" },
                { label: "Генеральный директор", value: "Рычков Максим Николаевич" },
              ].map(d => (
                <div key={d.label} className="flex gap-3 text-sm">
                  <span className="text-foreground/40 w-44 shrink-0">{d.label}:</span>
                  <span className="text-foreground font-medium">{d.value}</span>
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
                  <div className="w-1 h-1 rounded-full bg-foreground mt-2 shrink-0" />
                  <span className="text-foreground/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="relative">
              <img src={INTERIOR_IMG} alt="О компании" className="w-full h-[500px] object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-background p-6 shadow-lg">
                <div className="font-display text-4xl font-light">15+</div>
                <div className="text-foreground/50 text-xs tracking-wider uppercase mt-1">Лет на рынке</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* PROJECT */}
      <section id="project" className="py-28 px-6 bg-[hsl(30,15%,94%)]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-foreground/40 text-sm tracking-[0.3em] uppercase mb-4">Наш проект</p>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <h2 className="font-display text-5xl md:text-6xl font-light leading-tight max-w-lg">
                ЖК «Перспектива» — новый стандарт комфорта
              </h2>
              <p className="text-foreground/50 text-sm max-w-xs leading-relaxed">
                Расположен в северо-восточной части Скадовска на участке 15 гектаров.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-10 mb-16 items-start">
              <div>
                <p className="text-foreground/60 leading-relaxed mb-6">
                  В составе комплекса 12 пятиэтажных домов с современной отделкой фасадов облицовочным кирпичом.
                  2430 квартир различных планировок, подземные и наземные парковки, открытый бассейн,
                  спортивные площадки и детские зоны.
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    "2430 квартир различных планировок",
                    "Подземные и наземные парковки",
                    "Открытый бассейн и спортивные площадки",
                    "Детские и игровые зоны",
                    "Зона рекреации с фонтаном и ротондами",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-3">
                      <Icon name="Check" size={16} className="text-foreground/50 mt-0.5 shrink-0" />
                      <span className="text-foreground/70 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { num: "12", label: "жилых домов" },
                  { num: "2430", label: "квартир" },
                  { num: "15", label: "гектаров" },
                  { num: "5", label: "этажей" },
                  { num: "3", label: "типа планировок" },
                  { num: "2025", label: "год начала продаж" },
                ].map(s => (
                  <div key={s.label} className="bg-background p-5 text-center">
                    <div className="font-display text-3xl font-light mb-1">{s.num}</div>
                    <div className="text-foreground/40 text-xs tracking-wide uppercase leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* APARTMENTS */}
          <AnimatedSection>
            <h3 className="font-display text-4xl font-light mb-8">Выберите свою квартиру</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {APARTMENTS.map(apt => (
                <div key={apt.rooms} className={`bg-background p-8 relative ${apt.popular ? "ring-1 ring-foreground" : ""}`}>
                  {apt.popular && (
                    <div className="absolute -top-3 left-6 bg-foreground text-background text-xs px-3 py-1 tracking-widest uppercase">
                      Популярно
                    </div>
                  )}
                  <h3 className="font-display text-2xl font-light mb-1">{apt.rooms}</h3>
                  <p className="text-foreground/40 text-sm mb-4">{apt.area}</p>
                  <div className="space-y-2 mb-6">
                    {apt.features.map(f => (
                      <div key={f} className="flex items-start gap-2 text-sm text-foreground/60">
                        <Icon name="Check" size={14} className="mt-0.5 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="font-display text-2xl font-light mb-6">{apt.price}</div>
                  <button
                    onClick={() => { openBooking(apt.rooms); scrollTo("contacts"); }}
                    className="w-full border border-foreground text-foreground py-3 text-sm tracking-widest uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
                  >
                    Выбрать
                  </button>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* CALCULATOR */}
          <AnimatedSection>
            <div className="bg-foreground text-background p-10 md:p-14">
              <p className="text-background/40 text-sm tracking-[0.3em] uppercase mb-4">Калькулятор</p>
              <h3 className="font-display text-4xl md:text-5xl font-light mb-10">Рассчитайте стоимость квартиры</h3>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-background/60 text-sm tracking-wider uppercase">Площадь</label>
                      <span className="font-display text-2xl font-light">{area} м²</span>
                    </div>
                    <input
                      type="range" min={35} max={85} value={area}
                      onChange={e => setArea(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{
                        height: "1px", appearance: "none", WebkitAppearance: "none",
                        background: `linear-gradient(to right, rgba(255,255,255,0.8) ${((area - 35) / 50) * 100}%, rgba(255,255,255,0.15) 0%)`
                      }}
                    />
                    <div className="flex justify-between text-background/30 text-xs mt-2">
                      <span>35 м²</span><span>85 м²</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-background/60 text-sm tracking-wider uppercase">Этаж</label>
                      <span className="font-display text-2xl font-light">{floor}-й этаж</span>
                    </div>
                    <input
                      type="range" min={1} max={5} value={floor}
                      onChange={e => setFloor(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{
                        height: "1px", appearance: "none", WebkitAppearance: "none",
                        background: `linear-gradient(to right, rgba(255,255,255,0.8) ${((floor - 1) / 4) * 100}%, rgba(255,255,255,0.15) 0%)`
                      }}
                    />
                    <div className="flex justify-between text-background/30 text-xs mt-2">
                      <span>1 этаж</span><span>5 этаж</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-background/60 text-sm tracking-wider uppercase block mb-3">Отделка</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FINISH_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setFinish(opt.id)}
                          className={`py-3 px-2 text-xs tracking-wider uppercase transition-all border ${
                            finish === opt.id
                              ? "bg-white text-foreground border-white font-medium"
                              : "border-background/20 text-background/50 hover:border-background/50 hover:text-background/80"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center border border-background/10 p-8">
                  <p className="text-background/40 text-sm tracking-wider uppercase mb-2">Стоимость квартиры</p>
                  <div className="font-display text-5xl md:text-6xl font-light mb-2 leading-none">
                    {(totalPrice / 1_000_000).toFixed(1)} млн ₽
                  </div>
                  <p className="text-background/40 text-sm mb-8">
                    {pricePerMeter.toLocaleString("ru-RU")} ₽ за м² · {area} м² · {floor}-й этаж
                  </p>
                  <div className="space-y-2 mb-8 text-sm">
                    <div className="flex justify-between text-background/50">
                      <span>Базовая цена</span>
                      <span>{BASE_PRICE.toLocaleString("ru-RU")} ₽/м²</span>
                    </div>
                    {finishAdd > 0 && (
                      <div className="flex justify-between text-background/50">
                        <span>Отделка</span>
                        <span>+{finishAdd.toLocaleString("ru-RU")} ₽/м²</span>
                      </div>
                    )}
                    {floorCoeff !== 1.0 && (
                      <div className="flex justify-between text-background/50">
                        <span>Коэффициент этажа</span>
                        <span>×{floorCoeff}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => scrollTo("contacts")}
                    className="bg-white text-foreground py-4 text-sm tracking-widest uppercase font-medium hover:bg-white/90 transition-colors"
                  >
                    Оставить заявку
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className="text-foreground/40 text-sm tracking-[0.3em] uppercase mb-4">Галерея</p>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-tight mb-16 max-w-lg">
              ЖК «Перспектива» в деталях
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {GALLERY_ITEMS.map((item, i) => (
              <AnimatedSection key={i}>
                <div className="group relative overflow-hidden cursor-pointer aspect-[4/3]">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-white/60 text-xs">{item.year}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-28 px-6 bg-[hsl(30,15%,94%)]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <AnimatedSection>
            <p className="text-foreground/40 text-sm tracking-[0.3em] uppercase mb-4">Контакты</p>
            <h2 className="font-display text-5xl md:text-6xl font-light leading-tight mb-8">
              Забронируйте квартиру — мы перезвоним
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-12">
              Наши менеджеры помогут подобрать квартиру, рассчитают рассрочку или ипотеку
              и запишут на экскурсию по объекту.
            </p>
            <div className="space-y-6">
              {[
                { icon: "Phone", label: "Телефон", value: "8-990-121-70-46" },
                { icon: "Mail", label: "Email", value: "ooo.sz-csk@yandex.ru" },
                { icon: "MapPin", label: "Юридический адрес", value: "275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4" },
              ].map(contact => (
                <div key={contact.label} className="flex items-start gap-4">
                  <div className="text-foreground/30 mt-0.5 shrink-0">
                    <Icon name={contact.icon} size={18} />
                  </div>
                  <div>
                    <p className="text-foreground/40 text-xs tracking-wider uppercase mb-0.5">{contact.label}</p>
                    <p className="text-foreground font-medium">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              {bookingApt && (
                <div>
                  <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Выбранный вариант</label>
                  <div className="w-full bg-foreground/5 border border-foreground/10 px-5 py-4 text-sm text-foreground">
                    {bookingApt}
                    <button onClick={() => setBookingApt(null)} className="ml-2 text-foreground/30 hover:text-foreground">×</button>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">ФИО</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иванов Иван Иванович"
                  className="w-full bg-background border border-foreground/10 px-5 py-4 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Телефон *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (___) ___-__-__"
                  required
                  className="w-full bg-background border border-foreground/10 px-5 py-4 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.ru"
                  className="w-full bg-background border border-foreground/10 px-5 py-4 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-foreground text-background py-4 text-sm tracking-widest uppercase font-medium hover:bg-foreground/85 transition-colors"
              >
                Отправить заявку
              </button>
              <p className="text-foreground/30 text-xs leading-relaxed">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-background/10 text-background flex items-center justify-center text-sm font-bold">СЗ</div>
                <div className="font-body text-sm font-semibold">ООО «СЗ ЦСК»</div>
              </div>
              <p className="text-background/40 text-sm leading-relaxed">
                Специализированный застройщик.<br />
                Строительство жилых комплексов в Херсонской области.
              </p>
            </div>
            <div>
              <h4 className="text-background/60 text-xs tracking-widest uppercase mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-background/50">
                <div className="flex gap-2"><Icon name="MapPin" size={14} className="mt-0.5 shrink-0" /><span>275700, Херсонская обл., г. Скадовск, ул. Александровская, д. 51, оф. 4</span></div>
                <div className="flex gap-2"><Icon name="Mail" size={14} className="mt-0.5 shrink-0" /><span>ooo.sz-csk@yandex.ru</span></div>
                <div className="flex gap-2"><Icon name="Phone" size={14} className="mt-0.5 shrink-0" /><span>8-990-121-70-46</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-background/60 text-xs tracking-widest uppercase mb-4">Проекты</h4>
              <div className="space-y-2 text-sm text-background/50">
                <button onClick={() => scrollTo("project")} className="block hover:text-background transition-colors">ЖК «Перспектива»</button>
                <span className="block text-background/30">Планируемые проекты</span>
              </div>
            </div>
          </div>
          <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-background/30 text-sm">
            <span>© 2025 ООО «СЗ ЦСК». Все права защищены.</span>
            <span>Генеральный директор: Рычков Максим Николаевич</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
