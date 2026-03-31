import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/files/b7ed642f-1932-4780-9fa9-f52e1c114f6b.png";
const INTERIOR_IMG = "https://cdn.poehali.dev/projects/12f928bd-d79e-49a3-9402-01ab190a849b/files/4601bbf2-a1a2-4e49-b943-039fd5ef0728.jpg";
const AERIAL_IMG = "https://cdn.poehali.dev/projects/12f928bd-d79e-49a3-9402-01ab190a849b/files/8a6b2614-9830-42d9-93f6-98ab77a979fc.jpg";

const NAV_ITEMS = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О компании" },
  { id: "project", label: "Проект" },
  { id: "gallery", label: "Галерея" },
  { id: "contacts", label: "Контакты" },
];

const GALLERY_ITEMS = [
  { img: HERO_IMG, title: "Фасад комплекса", year: "2024" },
  { img: INTERIOR_IMG, title: "Интерьер квартиры", year: "2024" },
  { img: AERIAL_IMG, title: "Вид сверху", year: "2024" },
  { img: HERO_IMG, title: "Вечернее освещение", year: "2024" },
  { img: INTERIOR_IMG, title: "Гостиная", year: "2024" },
  { img: AERIAL_IMG, title: "Территория", year: "2024" },
];

const FINISH_OPTIONS = [
  { id: "none", label: "Без отделки", price: 0 },
  { id: "white", label: "Белая отделка", price: 8000 },
  { id: "full", label: "Полная отделка", price: 18000 },
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
  const [area, setArea] = useState(60);
  const [floor, setFloor] = useState(5);
  const [finish, setFinish] = useState("white");
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });

  const BASE_PRICE = 185000;
  const floorCoeff = floor <= 2 ? 0.97 : floor >= 15 ? 1.08 : floor >= 10 ? 1.04 : 1.0;
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

  return (
    <div className="font-body bg-background text-foreground min-h-screen">
      {/* NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="font-display text-2xl font-light tracking-[0.15em] uppercase">
            Монолит
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm tracking-wider uppercase transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-foreground font-medium"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-background border-t border-black/5 py-4">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="block w-full text-left px-6 py-3 text-sm tracking-wider uppercase text-foreground/70 hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative h-screen overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Монолит — жилой комплекс"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 max-w-7xl mx-auto">
          <div className="animate-fade-in">
            <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">Жилой комплекс</p>
            <h1 className="font-display text-white text-7xl md:text-9xl font-light leading-[0.9] mb-6">
              Монолит
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light max-w-md mb-10 leading-relaxed">
              Строим дома, в которых хочется жить. Квартиры в центре города с продуманной архитектурой.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollTo("project")}
                className="bg-white text-foreground px-8 py-3.5 text-sm tracking-widest uppercase font-medium hover:bg-white/90 transition-colors"
              >
                Смотреть проект
              </button>
              <button
                onClick={() => scrollTo("contacts")}
                className="border border-white text-white px-8 py-3.5 text-sm tracking-widest uppercase font-medium hover:bg-white/10 transition-colors"
              >
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2">
          <span className="text-white/40 text-xs tracking-widest uppercase" style={{ writingMode: "vertical-rl" }}>Scroll</span>
          <div className="w-px h-12 bg-white/20" />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-foreground text-background py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "15+", label: "Лет на рынке" },
            { num: "47", label: "Завершённых объектов" },
            { num: "3200", label: "Семей в наших домах" },
            { num: "2026", label: "Год сдачи" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-5xl md:text-6xl font-light mb-2">{stat.num}</div>
              <div className="text-background/50 text-sm tracking-wider uppercase">{stat.label}</div>
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
              Мы строим не квадратные метры — мы создаём среду для жизни
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-6">
              Компания «Монолит» основана в 2009 году. За 15 лет мы возвели 47 жилых комплексов и превратили
              тысячи квартир в настоящие дома. Наш принцип — архитектура, которая работает для людей.
            </p>
            <p className="text-foreground/60 leading-relaxed mb-10">
              Мы проектируем каждый дом с заботой о деталях: продуманные планировки, качественные материалы,
              благоустроенные дворы и развитая инфраструктура в шаговой доступности.
            </p>
            <div className="flex flex-col gap-4">
              {[
                "Собственное производство строительных материалов",
                "Гарантия на конструктив — 30 лет",
                "Эскроу-счета для защиты покупателей",
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
              <img
                src={INTERIOR_IMG}
                alt="Интерьер"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-background p-6 shadow-lg">
                <div className="font-display text-4xl font-light">№1</div>
                <div className="text-foreground/50 text-xs tracking-wider uppercase mt-1">В регионе по качеству</div>
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
                ЖК «Монолит» — новый стандарт городской жизни
              </h2>
              <p className="text-foreground/50 text-sm max-w-xs leading-relaxed">
                Квартиры от 35 до 140 м² в 22-этажном здании в центре города. Сдача — IV квартал 2026 года.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { icon: "Building2", title: "22 этажа", desc: "Монолитное строительство, высота потолков 3 м" },
                { icon: "Car", title: "Паркинг", desc: "Подземный паркинг на 200 машино-мест" },
                { icon: "Trees", title: "Двор-парк", desc: "Закрытая благоустроенная территория 2 га" },
                { icon: "ShoppingBag", title: "Инфраструктура", desc: "Детский сад, школа и магазины в 5 минутах" },
                { icon: "Wifi", title: "Умный дом", desc: "Видеонаблюдение, домофон, учёт ресурсов" },
                { icon: "BadgeCheck", title: "Гарантия", desc: "30 лет на несущие конструкции здания" },
              ].map(card => (
                <div key={card.title} className="bg-background p-8 group hover:shadow-md transition-shadow">
                  <div className="mb-4 text-foreground/40 group-hover:text-foreground transition-colors">
                    <Icon name={card.icon} size={28} />
                  </div>
                  <h3 className="font-display text-2xl font-light mb-2">{card.title}</h3>
                  <p className="text-foreground/50 text-sm leading-relaxed">{card.desc}</p>
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
                      type="range"
                      min={30}
                      max={140}
                      value={area}
                      onChange={e => setArea(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{
                        height: "1px",
                        appearance: "none",
                        WebkitAppearance: "none",
                        background: `linear-gradient(to right, rgba(255,255,255,0.8) ${((area - 30) / 110) * 100}%, rgba(255,255,255,0.15) 0%)`
                      }}
                    />
                    <div className="flex justify-between text-background/30 text-xs mt-2">
                      <span>30 м²</span><span>140 м²</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-3">
                      <label className="text-background/60 text-sm tracking-wider uppercase">Этаж</label>
                      <span className="font-display text-2xl font-light">{floor}-й этаж</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={22}
                      value={floor}
                      onChange={e => setFloor(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{
                        height: "1px",
                        appearance: "none",
                        WebkitAppearance: "none",
                        background: `linear-gradient(to right, rgba(255,255,255,0.8) ${((floor - 1) / 21) * 100}%, rgba(255,255,255,0.15) 0%)`
                      }}
                    />
                    <div className="flex justify-between text-background/30 text-xs mt-2">
                      <span>1 этаж</span><span>22 этаж</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-background/60 text-sm tracking-wider uppercase block mb-3">Отделка</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FINISH_OPTIONS.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setFinish(opt.id)}
                          className={`py-3 px-3 text-xs tracking-wider uppercase transition-all border ${
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
                    onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })}
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
              Фотографии объекта
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
              Оставьте заявку — мы перезвоним
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-12">
              Наши менеджеры помогут подобрать квартиру, рассчитают ипотеку и запишут на экскурсию по объекту.
            </p>
            <div className="space-y-6">
              {[
                { icon: "Phone", label: "Телефон", value: "+7 (800) 000-00-00" },
                { icon: "Mail", label: "Email", value: "info@monolit-dev.ru" },
                { icon: "MapPin", label: "Офис продаж", value: "ул. Центральная, 1, офис 101" },
                { icon: "Clock", label: "Режим работы", value: "Пн–Вс: 9:00 — 20:00" },
              ].map(contact => (
                <div key={contact.label} className="flex items-start gap-4">
                  <div className="text-foreground/30 mt-0.5">
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
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Имя</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full bg-background border border-foreground/10 px-5 py-4 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full bg-background border border-foreground/10 px-5 py-4 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-foreground/50 text-xs tracking-wider uppercase mb-2">Сообщение</label>
                <textarea
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Интересует квартира 2 комнаты, 3-5 этаж..."
                  rows={4}
                  className="w-full bg-background border border-foreground/10 px-5 py-4 text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
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
      <footer className="bg-foreground text-background py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="font-display text-2xl font-light tracking-[0.15em] uppercase mb-1">Монолит</div>
            <p className="text-background/30 text-sm">© 2024 ООО «Монолит». Все права защищены.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-background/40 text-sm">
            <button onClick={() => scrollTo("about")} className="hover:text-background transition-colors text-left">О компании</button>
            <button onClick={() => scrollTo("project")} className="hover:text-background transition-colors text-left">Проект</button>
            <button onClick={() => scrollTo("gallery")} className="hover:text-background transition-colors text-left">Галерея</button>
            <button onClick={() => scrollTo("contacts")} className="hover:text-background transition-colors text-left">Контакты</button>
          </div>
        </div>
      </footer>
    </div>
  );
}