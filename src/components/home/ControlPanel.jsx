import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { WALL_COLORS, WALL_TEXTURES, FLORAL_PATTERNS, FLORAL_TINTS } from '../../theme/wallOptions';
import ColorWheelPicker from '../shared/ColorWheelPicker';

function groupByCategory(colors) {
  const groups = new Map();
  colors.forEach((color) => {
    if (!groups.has(color.category)) groups.set(color.category, []);
    groups.get(color.category).push(color);
  });
  return Array.from(groups.entries());
}

const DARK_SWATCH_IDS = ['charcoal', 'deep-navy', 'poppy-red', 'olive-moss'];

// A rainbow "Custom" swatch button that expands into the circular RGBA
// color wheel. Used by both WallColorPicker (grouped presets) and the flat
// Wallpaper Tint row below, so every wall-color context in every room gets
// the same custom-color capability.
function CustomColorToggle({ isActive, onActivate, customColor, onCustomColorChange }) {
  return (
    <div className="mt-3">
      <button
        onClick={onActivate}
        className={`w-full py-2.5 px-3 rounded-xl border text-[10px] uppercase tracking-wider font-semibold flex items-center gap-2.5 transition-all ${
          isActive ? 'border-[var(--accent)] bg-white shadow-sm' : 'border-stone-200 bg-white hover:border-stone-400'
        }`}
      >
        <span
          className="w-5 h-5 rounded-full border border-stone-300 flex-shrink-0"
          style={{ background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)' }}
        ></span>
        Custom Color (RGBA)
      </button>

      {isActive && (
        <div className="mt-3 flex justify-center bg-white rounded-xl border border-stone-200 p-4">
          <ColorWheelPicker value={customColor} onChange={onCustomColorChange} size={130} />
        </div>
      )}
    </div>
  );
}

// Shared grouped color-swatch grid + custom color wheel toggle - used for
// both the Living Room/Kitchen wall color picker and the Master Bedroom
// side-wall color picker, so all rooms get an identical picker.
function WallColorPicker({ selectedId, onSelect, customColor, onCustomColorChange }) {
  const colorGroups = useMemo(() => groupByCategory(WALL_COLORS), []);
  const activeColor = WALL_COLORS.find((c) => c.id === selectedId);
  const isCustom = selectedId === 'custom';

  return (
    <div>
      <div className="space-y-4">
        {colorGroups.map(([category, colors]) => (
          <div key={category}>
            <span className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-semibold block mb-2">
              {category}
            </span>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => onSelect(color.id)}
                  title={color.label}
                  aria-label={color.label}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                    selectedId === color.id
                      ? 'border-[var(--accent)] scale-110 shadow-md'
                      : 'border-stone-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedId === color.id && (
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: DARK_SWATCH_IDS.includes(color.id) ? '#fff' : '#1C1B18' }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CustomColorToggle
        isActive={isCustom}
        onActivate={() => onSelect('custom')}
        customColor={customColor}
        onCustomColorChange={onCustomColorChange}
      />

      {isCustom ? (
        <p className="text-[11px] text-stone-500 mt-3 font-light">
          Custom · {customColor.hex} · {Math.round(customColor.alpha * 100)}% opacity
        </p>
      ) : (
        activeColor && <p className="text-[11px] text-stone-500 mt-3 font-light">{activeColor.label}</p>
      )}
    </div>
  );
}

export default function ControlPanel({
  activeRoom,
  wallColorId, setWallColorId,
  wallCustomColor, setWallCustomColor,
  wallTexture, setWallTexture,
  floralPattern, setFloralPattern,
  floralTint, setFloralTint,
  floralCustomTint, setFloralCustomTint,
  bedroomSideWallColorId, setBedroomSideWallColorId,
  bedroomSideWallCustomColor, setBedroomSideWallCustomColor,
}) {
  const isMasterBedroom = activeRoom === 'master-bedroom';
  const isFloralCustom = floralTint === 'custom';

  return (
    <div className="lg:col-span-4 flex flex-col justify-between space-y-6 bg-stone-50/80 p-6 md:p-8 rounded-2xl border border-stone-200">
      {isMasterBedroom ? (
        // Master Bedroom: independent wallpaper pattern + tint for the back
        // wall (both with a custom RGBA option), plus a full color picker
        // (same as the Living Room, also with custom RGBA) for the side wall.
        <div className="space-y-6 max-h-[460px] overflow-y-auto pr-1">
          <p className="text-[11px] text-stone-500 font-light leading-relaxed -mt-1">
            Wallpaper applies to the back wall only. Choose a color for the side wall below.
          </p>

          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-3">
              Wallpaper Pattern
            </label>
            <div className="grid grid-cols-1 gap-2">
              {FLORAL_PATTERNS.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => setFloralPattern(pattern.id)}
                  className={`py-3 px-4 text-[11px] uppercase tracking-wider font-semibold rounded-xl border text-left transition-all ${
                    floralPattern === pattern.id
                      ? 'bg-[#1C1B18] text-white border-[#1C1B18] shadow-md'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {pattern.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-3">
              Wallpaper Tint
            </label>
            <div className="flex flex-wrap gap-2.5">
              {FLORAL_TINTS.map((tint) => (
                <button
                  key={tint.id}
                  onClick={() => setFloralTint(tint.id)}
                  title={tint.label}
                  aria-label={tint.label}
                  className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                    floralTint === tint.id ? 'border-[var(--accent)] scale-110 shadow-md' : 'border-stone-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: tint.hex }}
                >
                  {floralTint === tint.id && <span className="text-[10px] font-bold text-[#1C1B18]">✓</span>}
                </button>
              ))}
            </div>

            <CustomColorToggle
              isActive={isFloralCustom}
              onActivate={() => setFloralTint('custom')}
              customColor={floralCustomTint}
              onCustomColorChange={setFloralCustomTint}
            />

            {isFloralCustom ? (
              <p className="text-[11px] text-stone-500 mt-3 font-light">
                Custom · {floralCustomTint.hex} · {Math.round(floralCustomTint.alpha * 100)}% opacity
              </p>
            ) : (
              <p className="text-[11px] text-stone-500 mt-3 font-light">
                {FLORAL_TINTS.find((t) => t.id === floralTint)?.label}
              </p>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-3">
              Side Wall Color
            </label>
            <WallColorPicker
              selectedId={bedroomSideWallColorId}
              onSelect={setBedroomSideWallColorId}
              customColor={bedroomSideWallCustomColor}
              onCustomColorChange={setBedroomSideWallCustomColor}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6 max-h-[460px] overflow-y-auto pr-1">
          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-3">
              Wall Texture
            </label>
            <div className="grid grid-cols-3 gap-2">
              {WALL_TEXTURES.map((tex) => (
                <button
                  key={tex.id}
                  onClick={() => setWallTexture(tex.id)}
                  className={`py-3 px-2 text-[10px] uppercase tracking-wider font-semibold rounded-xl border text-center leading-tight transition-all ${
                    wallTexture === tex.id
                      ? 'bg-[#1C1B18] text-white border-[#1C1B18] shadow-md'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {tex.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold block mb-3">
              Wall Color
            </label>
            <WallColorPicker
              selectedId={wallColorId}
              onSelect={setWallColorId}
              customColor={wallCustomColor}
              onCustomColorChange={setWallCustomColor}
            />
          </div>
        </div>
      )}

      <Link
        to="/contact"
        className="w-full py-4 bg-[#1C1B18] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[var(--accent)] transition-all rounded-xl shadow-lg mt-4 text-center block"
      >
        Inquire Custom Spatial Design
      </Link>
    </div>
  );
}
