<script setup lang="ts">

const appConfig = useAppConfig();
const colorMode = useColorMode();
const primary = computed(() => appConfig.ui.primary);
const allColors = Object(COLORS);

const getColorPreference = (preference: string) => {
    switch (preference) {
        case "white":
            return ["200", "400"];
        default:
            return ["400", "600"];
    }
};

const colors = computed((colors) => {
    const color = primary.value;
    let result = {
        light: '',
        dark: ''
    };
    if (color in allColors) {
        const [lightWeight, darkWeight] = getColorPreference(colorMode.preference);
        const lightColor = allColors[color][lightWeight];
        const darkColor = allColors[color][darkWeight];
        result.light = lightColor;
        result.dark = darkColor;
    } else if (colors) {
        return colors
    }
    return result;
})

const width = 1200;
const height = 1200;
const sun = computed(() => {
    return {
        cx: width / 2,
        cy: height / 2,
        size: 190,
        fill: colors.value.light
    };
})

const planets = ref([] as {
    planet: {
        cx: number,
        cy: number,
        size: number,
        fill: string,
        rotationStart: number,
        rotationSpeed: number
    },
    orbit: {
        cx: number,
        cy: number,
        distance: number
    }
}[]);

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const addPlanets = (count: number) => {
    let orbitDistance = sun.value.size + randomNumber(100, 120)
    for (let i = 0; i < count; i++) {
        const planetSize = randomNumber(20, 50);
        planets.value.push({
            planet: {
                cx: width / 2 + orbitDistance,
                cy: height / 2,
                size: planetSize,
                fill: '#bada55',
                rotationStart: randomNumber(0, 360),
                rotationSpeed: orbitDistance * randomNumber(40, 70),
            },
            orbit: {
                cx: width / 2,
                cy: height / 2,
                distance: orbitDistance,
            }
        })
        orbitDistance += randomNumber(100, 120);
    }
}

addPlanets(3);

</script>

<template>
<!--    <EasterEggSun id="sun" />-->
    <div class="md:128 md:h-128 -mt-4 lg:mt-12">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="`0 0 ${width} ${height}`"
            class="w-screen h-128"
            role="img"
            aria-labelledby="solarSystemTitle"
            aria-describedby="solarSystemDescription"
        >
            <title id="solarSystemTitle">
                A procedurally generated solar system
            </title>
            <desc id="solarSystemDescription">
                A 2D rendering of a solar system,
                with planets orbiting a central star.
            </desc>

            <!-- Sun -->
            <NuxtLink to="/map">
                <circle :cx="sun.cx" :cy="sun.cy" :r="sun.size" :fill="sun.fill" class="transition-all duration-300 hover:scale-105 origin-center"/>
            </NuxtLink>

            <!-- Planets -->
            <g v-for="planet in planets">
                <circle :cx="planet.orbit.cx" :cy="planet.orbit.cy" :r="planet.orbit.distance" stroke="#ccc" fill="none" />
                <NuxtLink to="/test">
                    <circle :cx="planet.planet.cx" :cy="planet.planet.cy" :r="planet.planet.size" :fill="planet.planet.fill" class="animate-orbit origin-center hover:[animation-play-state:_paused]" :style="{'--start-rotation': `${planet.planet.rotationStart}deg`, '--rotation-speed': `${planet.planet.rotationSpeed}ms`}" />
                </NuxtLink>
            </g>
        </svg>
    </div>
</template>