import { useState, useCallback, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { NUMERIC_TO_ALPHA3 } from "../data/isoMapping";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 1;

// When the zoom level is below this threshold the full (or nearly full) world
// map is visible on screen. Panning at this zoom causes empty black areas, so
// we animate the map back to centre after the user lifts their finger.
const SNAP_BACK_ZOOM_THRESHOLD = 1.5;
const SNAP_BACK_DURATION_MS = 400;

interface MapPosition {
  center: [number, number];
  zoom: number;
}

interface MoveEvent {
  coordinates: [number, number];
  zoom: number;
}

interface WorldMapProps {
  visitedCodes: Set<string>;
  onCountryClick: (alpha3: string, name: string) => void;
  visitedColor: string;
  defaultColor: string;
  strokeColor: string;
  hoverColor: string;
}

export function WorldMap({
  visitedCodes,
  onCountryClick,
  visitedColor,
  defaultColor,
  strokeColor,
  hoverColor,
}: WorldMapProps) {
  const [position, setPosition] = useState<MapPosition>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  const snapAnimRef = useRef<number | null>(null);

  const cancelSnap = useCallback(() => {
    if (snapAnimRef.current !== null) {
      cancelAnimationFrame(snapAnimRef.current);
      snapAnimRef.current = null;
    }
  }, []);

  const handleMoveStart = useCallback(() => {
    // Cancel any ongoing snap-back animation when a new gesture begins
    cancelSnap();
  }, [cancelSnap]);

  const handleMoveEnd = useCallback(
    ({ coordinates, zoom }: MoveEvent) => {
      cancelSnap();

      if (zoom < SNAP_BACK_ZOOM_THRESHOLD) {
        // Animate the map centre back to [0, 0] so the screen is never empty
        const startCoords = coordinates;
        const startTime = performance.now();

        const animate = (now: number) => {
          const elapsed = now - startTime;
          const t = Math.min(elapsed / SNAP_BACK_DURATION_MS, 1);
          // Ease-out cubic: decelerates towards the target
          const eased = 1 - Math.pow(1 - t, 3);

          const current: [number, number] = [
            startCoords[0] * (1 - eased),
            startCoords[1] * (1 - eased),
          ];

          setPosition({ center: current, zoom });

          if (t < 1) {
            snapAnimRef.current = requestAnimationFrame(animate);
          } else {
            snapAnimRef.current = null;
          }
        };

        snapAnimRef.current = requestAnimationFrame(animate);
      } else {
        setPosition({ center: coordinates, zoom });
      }
    },
    [cancelSnap],
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "transparent" }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        style={{ flex: 1, width: "100%" }}
      >
        <ZoomableGroup
          center={position.center}
          zoom={position.zoom}
          minZoom={0.8}
          maxZoom={6}
          onMoveStart={handleMoveStart}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const numericId = String(geo.id);
                const alpha3 = NUMERIC_TO_ALPHA3[numericId];
                const countryName = geo.properties.name as string;
                const isVisited = alpha3 ? visitedCodes.has(alpha3) : false;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (alpha3) {
                        onCountryClick(alpha3, countryName);
                      }
                    }}
                    style={{
                      default: {
                        fill: isVisited ? visitedColor : defaultColor,
                        stroke: strokeColor,
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: isVisited ? visitedColor : hoverColor,
                        stroke: strokeColor,
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: "pointer",
                        opacity: 0.85,
                      },
                      pressed: {
                        fill: visitedColor,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}
