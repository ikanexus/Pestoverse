<script setup lang="ts">

const appConfig = useAppConfig();
const colorMode = useColorMode();
const primary = computed(() => appConfig.ui.primary);
const allColors = Object(COLORS);

const navItems = NAV_MENU.flatMap(value => value).filter(value => !['Pesto Around the World', 'Home'].includes(value.label));

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
  return ['', ''];
}

const darkColor = computed((color) => {
  let _colors = getColors();
  if (_colors[1]) {
    return _colors[1];
  }
  return color
})

const lightColor = computed((color) => {
  let _colors = getColors();
  if (_colors[1]) {
    return _colors[0];
  }
  return color
})

const width = 1200;
const height = 1200;
const sun = computed(() => {
    return {
        cx: width / 2,
        cy: height / 2,
        size: 190,
        fill: lightColor.value
    };
})

const planets = ref([] as {
    to?: string,
    click?: () => void,
    label: string,
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

const addPlanets = () => {
    let orbitDistance = sun.value.size + randomNumber(100, 120)
    navItems.forEach(item => {
        const planetSize = randomNumber(20, 50);
        let link = {} as {to?: string, click?: () => void};
        if ('to' in item) {
          link.to = item.to;
        } else if ('click' in item) {
          link.click = item.click;
        }
        planets.value.push({
            ...link,
            label: item.label,
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
    })
}

addPlanets();

</script>

<template>
<!--    <EasterEggSun id="sun" />-->
    <div class="h-96 md:h-128 -mt-1/2">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :viewBox="`0 0 ${width} ${height}`"
            class="w-screen md:h-128 h-96"
            role="img"
            aria-labelledby="solarSystemTitle"
        >
            <title id="solarSystemTitle">
                The Pestoverse Solar System
            </title>

            <defs>
              <radialGradient id="sunGradient">
                <stop offset="0%" :stop-color="lightColor" />
                <stop offset="100%" :stop-color="darkColor" />
              </radialGradient>
            </defs>

            <!-- Sun -->
            <NuxtLink to="/map" class="transition-all duration-300 hover:scale-105 origin-center">
              <title>Start Exploring the Pestoverse</title>
              <circle :cx="sun.cx" :cy="sun.cy" :r="sun.size" fill="url(#sunGradient)"/>
                <text :x="sun.cx" :y="sun.cy + 12" text-anchor="middle" class="text-4xl dark:fill-white">Start Exploring!</text>
            </NuxtLink>

            <!-- Planets -->
            <g v-for="planet in planets">
                <circle :cx="planet.orbit.cx" :cy="planet.orbit.cy" :r="planet.orbit.distance" stroke="#ccc" fill="none" />
                <NuxtLink v-if="planet.to" :to="planet.to">
                    <title v-text="planet.label"></title>
                    <circle :cx="planet.planet.cx" :cy="planet.planet.cy" :r="planet.planet.size" :fill="darkColor" class="animate-orbit origin-center hover:[animation-play-state:_paused]" :style="{'--start-rotation': `${planet.planet.rotationStart}deg`, '--rotation-speed': `${planet.planet.rotationSpeed}ms`}" />
                </NuxtLink>
                <g v-if="planet.click" @click="planet.click" role="button">
                    <title v-text="planet.label"></title>
                    <circle :cx="planet.planet.cx" :cy="planet.planet.cy" :r="planet.planet.size" :fill="darkColor" class="animate-orbit origin-center hover:[animation-play-state:_paused]" :style="{'--start-rotation': `${planet.planet.rotationStart}deg`, '--rotation-speed': `${planet.planet.rotationSpeed}ms`}" />
                </g>
            </g>
        </svg>
    </div>
</template>