import { useState, useCallback } from "react";
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

  const handleMoveEnd = useCallback(({ coordinates, zoom }: MoveEvent) => {
    setPosition({ center: coordinates, zoom });
  }, []);

  return (
    <div style={{ width: "100%", aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
      <ComposableMap
        projection="geoNaturalEarth1"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <ZoomableGroup
          center={position.center}
          zoom={position.zoom}
          minZoom={1}
          maxZoom={6}
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
