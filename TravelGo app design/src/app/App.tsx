import { useState, useMemo } from "react";
import {
  Search, Bell, ChevronLeft, MapPin, Star, Clock, Sun, Compass,
  Heart, User, Globe, TrendingUp, X, Check, Share2, Calendar,
  Thermometer, Wind
} from "lucide-react";
import { DestinationCard } from "./components/DestinationCard";
import { BottomNav, Screen } from "./components/BottomNav";
import { destinations as allDestinations, categories, popularSearches, Destination } from "./components/data";

/* MARKER-MAKE-KIT-INVOKED */

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(["2", "5"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const destinationsWithSaved = allDestinations.map(d => ({
    ...d,
    saved: savedIds.has(d.id),
  }));

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelect = (d: Destination) => {
    setSelectedDestination({ ...d, saved: savedIds.has(d.id) });
    setScreen("detail" as Screen);
  };

  const filteredDestinations = useMemo(() => {
    return destinationsWithSaved.filter(d => {
      const matchesCategory = activeCategory === "All" || d.category === activeCategory;
      const matchesSearch = searchQuery === "" ||
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [savedIds, activeCategory, searchQuery]);

  const savedDestinations = destinationsWithSaved.filter(d => savedIds.has(d.id));
  const featuredDestinations = destinationsWithSaved.filter(d => d.rating >= 4.8);
  const trendingDestinations = destinationsWithSaved.filter(d => d.reviews > 3000);

  const isDetailScreen = screen === ("detail" as Screen);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div
        className="relative flex flex-col overflow-hidden bg-background"
        style={{
          width: "min(420px, 100vw)",
          height: "min(900px, 100vh)",
          borderRadius: "2rem",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        {isDetailScreen && selectedDestination ? (
          <DetailScreen
            destination={{ ...selectedDestination, saved: savedIds.has(selectedDestination.id) }}
            onBack={() => setScreen("home")}
            onToggleSave={toggleSave}
          />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              {screen === "home" && (
                <HomeScreen
                  destinations={destinationsWithSaved}
                  featured={featuredDestinations}
                  trending={trendingDestinations}
                  onSelect={handleSelect}
                  onToggleSave={toggleSave}
                  onSearchOpen={() => setScreen("explore")}
                />
              )}
              {screen === "explore" && (
                <ExploreScreen
                  destinations={filteredDestinations}
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={setActiveCategory}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSelect={handleSelect}
                  onToggleSave={toggleSave}
                />
              )}
              {screen === "saved" && (
                <SavedScreen
                  destinations={savedDestinations}
                  onSelect={handleSelect}
                  onToggleSave={toggleSave}
                />
              )}
              {screen === "profile" && <ProfileScreen />}
            </div>
            <BottomNav active={screen} onChange={setScreen} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── HOME SCREEN ─── */
function HomeScreen({
  destinations,
  featured,
  trending,
  onSelect,
  onToggleSave,
  onSearchOpen,
}: {
  destinations: Destination[];
  featured: Destination[];
  trending: Destination[];
  onSelect: (d: Destination) => void;
  onToggleSave: (id: string) => void;
  onSearchOpen: () => void;
}) {
  return (
    <div className="pb-4">
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: "linear-gradient(160deg, #0f2e4a 0%, #1a4a6e 100%)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/60 text-sm">Good morning 👋</p>
            <h1 className="text-white font-bold text-xl">Where to next?</h1>
          </div>
          <div className="relative">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Bell size={18} className="text-white" />
            </button>
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#1a4a6e]" />
          </div>
        </div>

        <button
          onClick={onSearchOpen}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-white/60 text-sm"
        >
          <Search size={16} />
          <span>Search destinations, activities...</span>
        </button>

        <div className="flex gap-4 mt-5">
          {[
            { icon: Globe, label: "Countries", value: "120+" },
            { icon: Compass, label: "Destinations", value: "850+" },
            { icon: Star, label: "Reviews", value: "50K+" },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex-1 text-center">
              <Icon size={16} className="mx-auto mb-1 text-amber-400" />
              <p className="text-white font-bold text-base">{value}</p>
              <p className="text-white/50 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="mt-5 px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground text-base">Featured</h2>
          <button className="text-xs font-semibold" style={{ color: "var(--primary)" }}>See all</button>
        </div>
        <div className="flex flex-col gap-4">
          {featured.slice(0, 2).map(d => (
            <DestinationCard
              key={d.id}
              destination={d}
              onSelect={onSelect}
              onToggleSave={onToggleSave}
              variant="featured"
            />
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <h2 className="font-bold text-foreground text-base mb-3">Browse by Type</h2>
        <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[
            { label: "Beach", emoji: "🏖️", color: "#0ea5e9" },
            { label: "Adventure", emoji: "🧗", color: "#ff5d3b" },
            { label: "Culture", emoji: "🏛️", color: "#8b5cf6" },
            { label: "City", emoji: "🌆", color: "#10b981" },
            { label: "Wildlife", emoji: "🦁", color: "#fbbf24" },
          ].map(({ label, emoji, color }) => (
            <div key={label} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: color + "18", border: `1.5px solid ${color}30` }}
              >
                {emoji}
              </div>
              <span className="text-xs font-semibold text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 px-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: "var(--primary)" }} />
            <h2 className="font-bold text-foreground text-base">Trending Now</h2>
          </div>
          <button className="text-xs font-semibold" style={{ color: "var(--primary)" }}>See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {trending.map(d => (
            <DestinationCard
              key={d.id}
              destination={d}
              onSelect={onSelect}
              onToggleSave={onToggleSave}
              variant="compact"
            />
          ))}
        </div>
      </section>

      <section className="mt-6 mx-5 rounded-3xl overflow-hidden">
        <div
          className="p-5 relative"
          style={{ background: "linear-gradient(135deg, #ff5d3b 0%, #ff8c42 100%)" }}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20">✈️</div>
          <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Travel Tip</p>
          <p className="text-white font-bold text-base leading-snug">Book 3 months ahead for up to 40% savings on flights!</p>
          <button className="mt-3 px-4 py-1.5 bg-white rounded-full text-xs font-bold" style={{ color: "var(--primary)" }}>
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── EXPLORE SCREEN ─── */
function ExploreScreen({
  destinations,
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSelect,
  onToggleSave,
}: {
  destinations: Destination[];
  categories: string[];
  activeCategory: string;
  onCategoryChange: (c: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (d: Destination) => void;
  onToggleSave: (id: string) => void;
}) {
  return (
    <div className="pb-4">
      <div className="px-5 pt-12 pb-4 bg-white">
        <h1 className="font-bold text-foreground text-xl mb-4">Explore</h1>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted">
          <Search size={16} className="text-muted-foreground flex-shrink-0" />
          <input
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search destinations..."
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange("")}>
              <X size={14} className="text-muted-foreground" />
            </button>
          )}
        </div>
        {!searchQuery && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {popularSearches.map(s => (
              <button
                key={s}
                onClick={() => onSearchChange(s)}
                className="px-3 py-1 rounded-full bg-muted text-xs font-semibold text-muted-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2 px-5 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {categories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                isActive
                  ? { background: "var(--primary)", color: "white" }
                  : { background: "var(--muted)", color: "var(--muted-foreground)" }
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="px-5 mt-4">
        <p className="text-sm text-muted-foreground font-semibold mb-3">
          {destinations.length} destination{destinations.length !== 1 ? "s" : ""} found
        </p>
        <div className="flex flex-col gap-4">
          {destinations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🗺️</p>
              <p className="font-bold text-foreground">No destinations found</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search or category</p>
            </div>
          ) : (
            destinations.map(d => (
              <DestinationCard
                key={d.id}
                destination={d}
                onSelect={onSelect}
                onToggleSave={onToggleSave}
                variant="featured"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── DETAIL SCREEN ─── */
function DetailScreen({
  destination,
  onBack,
  onToggleSave,
}: {
  destination: Destination;
  onBack: () => void;
  onToggleSave: (id: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "highlights" | "plan">("overview");
  const [booked, setBooked] = useState(false);

  return (
    <div className="flex flex-col h-full" style={{ overflowY: "auto", scrollbarWidth: "none" }}>
      <div className="relative flex-shrink-0" style={{ height: 320 }}>
        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="absolute top-12 left-0 right-0 flex items-center justify-between px-5">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={16} className="text-white" />
            </button>
            <button
              onClick={() => onToggleSave(destination.id)}
              className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center"
            >
              <Heart size={16} className={destination.saved ? "fill-red-400 text-red-400" : "text-white"} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-5 left-5">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: "var(--primary)", color: "white" }}
          >
            {destination.category}
          </span>
        </div>
      </div>

      <div className="flex-1 bg-background px-5 pt-5 pb-28">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-4">
            <h1 className="font-bold text-foreground text-xl leading-tight">{destination.name}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={13} className="text-muted-foreground" />
              <span className="text-muted-foreground text-sm">{destination.country}, {destination.region}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-muted-foreground text-xs">from</p>
            <p className="font-bold text-foreground text-xl">${destination.price.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs">{destination.duration}</p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-xl flex-1 justify-center">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="font-bold text-sm text-foreground">{destination.rating}</span>
            <span className="text-muted-foreground text-xs">({destination.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-xl flex-1 justify-center">
            <Thermometer size={13} className="text-blue-500" />
            <span className="text-xs text-foreground font-semibold">{destination.weather}</span>
          </div>
          <div className="flex items-center gap-1 bg-green-50 px-2 py-2 rounded-xl flex-1 justify-center">
            <Calendar size={12} className="text-green-500 flex-shrink-0" />
            <span className="text-xs text-foreground font-semibold">{destination.bestTime}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          {destination.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-1 mt-5 bg-muted p-1 rounded-2xl">
          {(["overview", "highlights", "plan"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all"
              style={
                activeTab === tab
                  ? { background: "white", color: "var(--foreground)", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === "overview" && (
            <p className="text-muted-foreground text-sm leading-relaxed">{destination.description}</p>
          )}
          {activeTab === "highlights" && (
            <div className="flex flex-col gap-3">
              {destination.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "var(--primary)" }}
                  >
                    <Check size={14} className="text-white" />
                  </div>
                  <p className="text-foreground text-sm font-semibold flex-1">{h}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === "plan" && (
            <div className="flex flex-col gap-2">
              {[
                { day: "Day 1–2", title: "Arrival & Orientation", note: "Check in, local area walk, welcome dinner" },
                { day: "Day 3–4", title: "Main Attractions", note: destination.highlights[0] + " & " + destination.highlights[1] },
                { day: "Day 5–6", title: "Deep Dive", note: destination.highlights[2] + " & " + destination.highlights[3] },
                { day: "Day 7", title: "Leisure & Departure", note: "Free morning, souvenir shopping, departure" },
              ].map(({ day, title, note }) => (
                <div key={day} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--primary)" }} />
                    <div className="w-px flex-1 bg-border mt-1" />
                  </div>
                  <div className="pb-3 flex-1">
                    <p className="text-xs font-bold text-muted-foreground">{day}</p>
                    <p className="font-bold text-foreground text-sm mt-0.5">{title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 bg-background border-t border-border">
        <button
          onClick={() => setBooked(b => !b)}
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all"
          style={{
            background: booked
              ? "linear-gradient(135deg, #10b981, #059669)"
              : "linear-gradient(135deg, #ff5d3b, #ff8c42)",
          }}
        >
          {booked ? "✓ Booking Confirmed!" : `Book Now · $${destination.price.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}

/* ─── SAVED SCREEN ─── */
function SavedScreen({
  destinations,
  onSelect,
  onToggleSave,
}: {
  destinations: Destination[];
  onSelect: (d: Destination) => void;
  onToggleSave: (id: string) => void;
}) {
  return (
    <div className="pb-4">
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-bold text-foreground text-xl">Saved Trips</h1>
        <p className="text-muted-foreground text-sm mt-1">{destinations.length} destination{destinations.length !== 1 ? "s" : ""} saved</p>
      </div>
      <div className="px-5 flex flex-col gap-4">
        {destinations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🗺️</p>
            <p className="font-bold text-foreground text-lg">No saved trips yet</p>
            <p className="text-muted-foreground text-sm mt-2">Tap the heart icon on any destination to save it here.</p>
          </div>
        ) : (
          destinations.map(d => (
            <DestinationCard
              key={d.id}
              destination={d}
              onSelect={onSelect}
              onToggleSave={onToggleSave}
              variant="featured"
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── PROFILE SCREEN ─── */
function ProfileScreen() {
  const stats = [
    { label: "Trips Taken", value: "12" },
    { label: "Countries", value: "8" },
    { label: "Reviews", value: "24" },
  ];
  const menuItems = [
    { icon: Globe, label: "My Itineraries", count: 3 },
    { icon: Star, label: "My Reviews", count: 24 },
    { icon: Calendar, label: "Upcoming Trips", count: 2 },
    { icon: Heart, label: "Wishlist", count: 7 },
    { icon: Wind, label: "Travel Preferences", count: null as number | null },
    { icon: Sun, label: "Notifications", count: 5 },
  ];

  return (
    <div className="pb-4">
      <div
        className="px-5 pt-12 pb-8"
        style={{ background: "linear-gradient(160deg, #0f2e4a 0%, #1a4a6e 100%)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
            style={{ background: "var(--primary)" }}
          >
            MJ
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Marco Johnson</h1>
            <p className="text-white/60 text-sm">marco.j@email.com</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span className="text-amber-400 text-xs font-bold">Gold Explorer</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex-1 text-center bg-white/10 rounded-2xl py-3">
              <p className="text-white font-bold text-xl">{value}</p>
              <p className="text-white/60 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 flex flex-col gap-2">
        {menuItems.map(({ icon: Icon, label, count }) => (
          <button
            key={label}
            className="flex items-center gap-4 w-full px-4 py-4 bg-white rounded-2xl text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--muted)" }}>
              <Icon size={18} className="text-foreground" />
            </div>
            <span className="flex-1 font-semibold text-foreground text-sm">{label}</span>
            {count !== null && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "var(--primary)" }}>
                {count}
              </span>
            )}
            <ChevronLeft size={16} className="text-muted-foreground rotate-180" />
          </button>
        ))}
        <button className="mt-2 w-full py-4 rounded-2xl font-bold text-sm border border-border text-muted-foreground">
          Sign Out
        </button>
      </div>
    </div>
  );
}
