import { Heart, Star, MapPin, Clock } from "lucide-react";
import { Destination } from "./data";

interface Props {
  destination: Destination;
  onSelect: (d: Destination) => void;
  onToggleSave: (id: string) => void;
  variant?: "featured" | "compact";
}

export function DestinationCard({ destination, onSelect, onToggleSave, variant = "featured" }: Props) {
  if (variant === "compact") {
    return (
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0 w-44"
        onClick={() => onSelect(destination)}
      >
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <button
          onClick={(e) => { e.stopPropagation(); onToggleSave(destination.id); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <Heart
            size={14}
            className={destination.saved ? "fill-red-400 text-red-400" : "text-white"}
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-white font-semibold text-sm leading-tight">{destination.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={10} className="text-white/70" />
            <span className="text-white/70 text-xs">{destination.country}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-white text-xs font-semibold">{destination.rating}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-3xl overflow-hidden cursor-pointer w-full"
      style={{ height: 280 }}
      onClick={() => onSelect(destination)}
    >
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave(destination.id); }}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center transition-transform active:scale-95"
      >
        <Heart
          size={16}
          className={destination.saved ? "fill-red-400 text-red-400" : "text-white"}
        />
      </button>
      <div className="absolute top-4 left-4">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: "var(--primary)", color: "white" }}
        >
          {destination.category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-bold text-xl leading-tight">{destination.name}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={13} className="text-white/70" />
          <span className="text-white/80 text-sm">{destination.country}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              <span className="text-white font-bold text-sm">{destination.rating}</span>
              <span className="text-white/60 text-xs">({destination.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-white/70" />
              <span className="text-white/80 text-xs">{destination.duration}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-white/60 text-xs">from</span>
            <p className="text-white font-bold text-base">${destination.price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
