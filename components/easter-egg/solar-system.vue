<script setup lang="ts">
const appConfig = useAppConfig();
const colorMode = useColorMode();
const primary = computed(() => appConfig.ui.primary);
const allColors = Object(COLORS);

const navItems = NAV_MENU.flatMap((value) => value).filter((value) => !["Pesto Around the World", "Home"].includes(value.label));

const getColorPreference = (preference: string) => {
    switch (preference) {
        case "white":
            return ["200", "400"];
        default:
            return ["400", "600"];
    }
};

const getColors = () => {
    const color = primary.value;
    if (color in allColors) {
        const [lightWeight, darkWeight] = getColorPreference(colorMode.preference);
        const lightColor = allColors[color][lightWeight];
        const darkColor = allColors[color][darkWeight];
        return [lightColor, darkColor];
    }
    return ["", ""];
};

const darkColor = computed((color) => {
    let _colors = getColors();
    if (_colors[1]) {
        return _colors[1];
    }
    return color;
});

const lightColor = computed((color) => {
    let _colors = getColors();
    if (_colors[1]) {
        return _colors[0];
    }
    return color;
});

const width = 1200;
const height = 1200;
const sun = computed(() => {
    return {
        cx: width / 2,
        cy: height / 2,
        size: 190,
        fill: lightColor.value,
    };
});

const planets = ref(
    [] as {
        to?: string;
        click?: () => void;
        label: string;
        planet: {
            cx: number;
            cy: number;
            size: number;
            rotationStart: number;
            rotationSpeed: number;
        };
        orbit: {
            cx: number;
            cy: number;
            distance: number;
        };
    }[],
);

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const addPlanets = () => {
    let orbitDistance = sun.value.size + randomNumber(100, 120);
    navItems.forEach((item) => {
        const planetSize = randomNumber(30, 60);
        let link = {} as { to?: string; click?: () => void };
        if ("to" in item) {
            link.to = item.to;
        } else if ("click" in item) {
            link.click = item.click;
        }
        planets.value.push({
            ...link,
            label: item.label,
            planet: {
                cx: width / 2 + orbitDistance,
                cy: height / 2,
                size: planetSize,
                rotationStart: randomNumber(0, 360),
                rotationSpeed: orbitDistance * randomNumber(40, 70),
            },
            orbit: {
                cx: width / 2,
                cy: height / 2,
                distance: orbitDistance,
            },
        });
        orbitDistance += randomNumber(100, 120);
    });
};

addPlanets();
</script>

<template>
    <div class="-mt-1/2 h-96 md:h-128">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="`0 0 ${width} ${height}`"
            class="h-96 w-screen md:h-128"
            role="img"
            aria-labelledby="solarSystemTitle"
        >
            <title id="solarSystemTitle">The Pestoverse Solar System</title>

            <defs>
                <radialGradient id="sunGradient">
                    <stop offset="0%" :stop-color="lightColor" />
                    <stop offset="100%" :stop-color="darkColor" />
                </radialGradient>
                <radialGradient id="sunGlowGradient">
                    <stop offset="0%" :stop-color="darkColor" />
                    <stop offset="100%" :stop-color="lightColor" stop-opacity="0.1" />
                </radialGradient>
                <radialGradient id="planetGradient">
                    <stop offset="0%" :stop-color="darkColor" />
                    <stop offset="100%" :stop-color="lightColor" />
                </radialGradient>
            </defs>

            <filter id="sunGlowBlur">
                <feGaussianBlur stdDeviation="20" />
            </filter>

            <!-- Sun -->
            <circle :cx="sun.cx" :cy="sun.cy" :r="sun.size + 20" fill="url(#sunGlowGradient)" filter="url(#sunGlowBlur)">
                <animate attributeName="r" :values="`${sun.size + 20};${sun.size + 70};${sun.size + 20}`" dur="10s" repeatCount="indefinite" />
            </circle>
            <NuxtLink to="/map" class="origin-center transition-all duration-300 hover:scale-105">
                <title>Start Exploring the Pestoverse</title>
                <circle :cx="sun.cx" :cy="sun.cy" :r="sun.size" fill="url(#sunGradient)" />
                <text :x="sun.cx" :y="sun.cy + 12" text-anchor="middle" class="text-4xl dark:fill-white">Start Exploring!</text>
            </NuxtLink>

            <!-- Planets -->
            <g v-for="(planet, index) in planets">
                <circle :id="`orbit-${index}`" :cx="planet.orbit.cx" :cy="planet.orbit.cy" :r="planet.orbit.distance" stroke="#ccc" fill="none" />
                <NuxtLink v-if="planet.to" :to="planet.to" :id="`planet-${index}`" >
                    <title v-text="planet.label"></title>
                    <circle
                        :cx="planet.planet.cx"
                        :cy="planet.planet.cy"
                        :r="planet.planet.size"
                        :fill="darkColor"
                        class="origin-center animate-orbit hover:[animation-play-state:_paused]"
                        :style="{ '--start-rotation': `${planet.planet.rotationStart}deg`, '--rotation-speed': `${planet.planet.rotationSpeed}ms` }"
                    />
                </NuxtLink>
                <g v-if="planet.click" @click="planet.click" role="button" :id="`planet-${index}`" class="origin-center animate-orbit hover:[animation-play-state:_paused]"
                   :style="{ '--start-rotation': `${planet.planet.rotationStart}deg`, '--rotation-speed': `${planet.planet.rotationSpeed}ms` }">
                    <title v-text="planet.label"></title>
                    <circle
                        :cx="planet.planet.cx"
                        :cy="planet.planet.cy"
                        :r="planet.planet.size"
                        :fill="darkColor"
                        filter="url(#planetTexture)"
                    />
                </g>
            </g>
        </svg>
    </div>
</template>
