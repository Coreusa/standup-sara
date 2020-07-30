<template>
<div class="row no-gutters mx-auto">
  <div class="col-12 mb-5 text-center">
    <h1>
      Velkommen til Stand-up Sara!
    </h1>
  </div>
  <b-card class="col-12 col-md-5 bg-light text-left">
    <h5>Hvem som er med i dag?</h5>
    <b-btn v-for="(p, i) in participants" size="sm" variant="primary" class="mb-2 mr-2" :key="`participant-${i}`" @click="addUser(p, i)">
      {{ p }}
    </b-btn>
    <div class="mt-3">
      <b-btn variant="dark" size="sm" @click="displayCustom = !displayCustom">
        Egendefinert
      </b-btn>
      <b-input-group v-if="displayCustom" size="sm" class="text-right mt-2">
        <b-input v-model="customName" placeholder="Navn..." :state="customName.length > 1">
        </b-input>
        <b-input-group-append>
          <b-btn variant="success" @click="addCustomUser()">
            Legg til
          </b-btn>
        </b-input-group-append>
      </b-input-group>
      <b-alert :show="error" size="sm" variant="danger">
        {{ error }}
      </b-alert>
    </div>
  </b-card>
  <b-card class="col-12 col-md-5 offset-md-2 text-left">
    <h5 v-if="selectedParticipants.length">Valgt</h5>
    <font-awesome-icon v-if="loading" icon="circle-notch" spin>
    </font-awesome-icon>
    <div v-else>
      <b-btn v-for="(sp, si) in selectedParticipants" class="mx-1" size="sm" variant="dark" :key="`selected-participant-${si}`" @click="removeUser(sp, si)">
        {{ sp }}
        <font-awesome-icon icon="times"></font-awesome-icon>
      </b-btn>
    </div>
  </b-card>
  <div class="col-12 text-center">
    <b-btn v-if="selectedParticipants.length > 1" class="mt-2" variant="success" size="lg" :disabled="loading === true" @click="selectRandom()">
      Hvem starter, Sara? <font-awesome-icon icon="magic"></font-awesome-icon>
    </b-btn>
  </div>
  <div
    v-if="operator"
    :class="operator.class"
    class="operator position-fixed bottom-right"
  >
    <div class="col-12 sara-dialogue text-center position-absolute">
      <div class="chat-bubble mt-2">
        <h3 class="mt-2">
          <span v-bind:style=sentenceStyle>{{ sentence }}</span><span class="spin"></span>
          <span v-if="loading">
            <span class="spin">🤪</span>
          </span>
        </h3>
      </div>
      <div class="app-version">
        Versjon <strong>{{ appVersion }}</strong>
      </div>
    </div>
  </div>
</div>
</template>
<script>
// @ is an alias to /src
import Participants from '@/assets/users.json'
export default {
  name: 'home',
  data () {
    return {
      appVersion: require('../../package.json').version,
      participants: Participants,
      selectedParticipants: [],
      displayCustom: false,
      customName: '',
      error: null,
      timeoutId: null,
      sentence: 'Hei, alle sammen og velkommen til stand up!',
      introSentences: [
        'Hei, alle sammen og velkommen til stænd up!',
        'Hei der. Jeg er Sara! Hvem er med i dag, mon tro?',
        'Tryllestav på veggen der, hvilke triks har du her?',
        'Noen ganger orker jeg ikke å gre håret.',
        'Føkk, har du sett visakortet mitt?',
        'Har du noen gang sett en oter? Jeg har sett ' + Math.ceil(Math.random() * 50) + '.',
        'I Russland har de et monument til minne om labrotter.',
        'Visste du at Volkswagen ble dannet av Hitler? Rare greier.',
        'Ikke lenge igjen til jul!',
        'I dag har jeg det travelt. Jeg skal nemlig på konsert.',
        'Hvor ble det av samleplatene med pan flute moods?',
        'Tenke, tenke tenke! Å nei, jernteppe! Neida, tøysa!',
        'Oi, oi oi! I dag var det mange flotte klesplagg!',
        'Dans, dans, dans oppå bordet. Legg deg ned, på gølvet.',
        'Jeg kan over ' + Math.ceil(Math.random() * 10000) + ' uttrykk!',
        'Å nei! Jeg har mistet tryllestaven min! Neida. Jeg bare tullet.',
        'Jeg tror det er meldt sol og litt skyer i dag. Jaja, det stopper ikke stænd up!',
        { text: 'Cyberpolitiet er inne på inspeksjon, de ber oss fortsette som vanlig', style: { animation: 'cop-lights 1s infinite' } }
      ],
      loadingSentences: [
        'La meg spinne tryllestaven min litt, så skal jeg finne ut av det!',
        'Skal vi se! Jeg legger til litt her, trekker fra der. Ok, sånn!',
        'Denne er kjempelett! Klarer du å gjette rekkefølgen?',
        'Visste du at Robert Kearns oppfant vindusviskeren? Jeg sporet av litt, sårri.',
        'Har du husket å vaske buksene dine?',
        'Don\'t worry, be happy! Som de sier på Bahamas.',
        'Hvor lang tid tror du dette tar?',
        'Oppfinnere min lar meg si mange rare ting. For eksempel: Bak skyene er himmelen alltid blå',
        'Steike, her var det litt å velge blant. Skal vi se, skal vi sjå. Buksa på.',
        'Da legger jeg navnene inn i snurremaskinen. Weeeee, rundt og rundt. Spennende.',
        'Humm. Jeg blir ikke helt enig med meg selv. Kanskje han skal starte...eller henne?',
        'Har ikke disse vært med før?',
        'La meg ringe en venn.',
        'Kan jeg spørre publikum?',
        'Denne var litt tricky! Her må jeg frem med matteboken, vent litt!',
        'Lottotrekning!',
        'Denne må jeg tenke litt på. Tvinne tomler. Tvinne tomler. Tvinne tomler. Ok, har det!',
        'Helt urelatert, men den verdenskjente vitenskapsmannen Neil deGrasse Tyson var en gang en ubeseiret wrestler',
        { text: 'I dag tenk- Oisann beklager, jeg sølte malingsspannet', style: { color: 'green' } }
      ],
      loading: false,
      voiceRate: 0.9,
      pitch: 1.0,
      operator: null,
      operators: [
        {
          name: 'Sara',
          class: 'operator-sara',
          avatar: 'standup-sara.png',
          voice: 'Norwegian Female',
          pitch: 1.0
        },
        {
          name: 'Stand-up Stein',
          class: 'operator-stein',
          avatar: 'standup-stein.png',
          voice: 'Norwegian Male',
          pitch: 1.0
        },
        {
          name: 'Shadow',
          class: 'operator-shadow',
          avatar: 'shadow.png',
          voice: 'Norwegian Male',
          pitch: 0.7
        },
        {
          name: 'Businessmann',
          class: 'operator-business',
          avatar: 'man.png',
          voice: 'Swedish Male',
          pitch: 1.0
        }
      ],
      voice: 'Norwegian Female',
      turnTypes: [
        'direction',
        'random',
        'chosen',
        'backwards'
      ]
    }
  },
  mounted () {
    const selected = this.fisherYates(this.introSentences)[0]
    let selectedIntro = selected.text || selected
    this.operator = this.randomItem(this.operators)
    if (this.operator.name !== 'Sara') {
      this.sentence = `Hei. Sara er dessverre ikke her i dag, så dere må ta til takke med meg, ${this.operator.name}. `
      this.sentence += `Sara bad meg om å si: ${selectedIntro}`
    } else {
      this.sentence = selectedIntro
    }
    this.sentenceStyle = selected.style || {}
    window.setTimeout(() => {
      window.responsiveVoice.speak(this.sentence, this.operator.voice, { rate: this.voiceRate, pitch: this.operator.pitch })
    }, 2000)
  },
  computed: {
    participantsSorted () {
      // Avoid some unexpected side-effects.
      let temp = this.participants
      temp = temp.sort((a, b) => a.toLowerCase() > b.toLowerCase())
      return temp
    },
    selectedOperator () {
      if (this.operator) {
        return this.operator
      } else {
        return ''
      }
    }
  },
  methods: {
    fisherYates (input) {
      let a = input
      var aLength = a.length
      for (var i = aLength - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * (i + 1))
        var itemAtIndex = a[randomIndex]
        a[randomIndex] = a[i]
        a[i] = itemAtIndex
      }
      return a
    },
    randomItem (input) {
      if (input) {
        const seed = Math.random()
        let ix = 0
        // Set Sara probability to 50%
        if (Number.parseFloat(seed) < 0.5) {
          console.log('Sara is here!')
          ix = 0
        } else {
          console.log('Sara is away, using other operator')
          ix = Math.floor(Math.random() * input.length)
        }
        return input[ix]
      }
    },
    addCustomUser () {
      this.error = null
      if (!this.participants.some(e => e.trim().toLowerCase() === this.customName.trim().toLowerCase())) {
        this.participants.push(this.customName)
      } else {
        this.error = 'Navnet finnes allerede.'
      }
    },
    addUser (user, index) {
      this.participants.splice(index, 1)
      this.selectedParticipants.push(user)
    },
    random (max = 10) {
      // TODO: Invalid when max is 1
      return ~~(Math.random() * max) + 1
    },
    removeUser (user, index) {
      this.selectedParticipants.splice(index, 1)
      this.participants.push(user)
    },
    selectRandom () {
      this.loading = true
      // Determine direction and order of users
      const turnType = this.fisherYates(this.turnTypes)[0]
      const shuffled = this.fisherYates(this.selectedParticipants)
      let sentence = ''
      switch (turnType) {
        case 'direction':
          const direction = (this.random(2) % 2) ? 'med klokken' : 'mot klokken'
          sentence = `I dag tror jeg vi starter med ${shuffled[0]} og går ${direction}.`
          break
        case 'chosen':
          sentence = `Allright! I dag bestemmer jeg rekkefølgen! Hva med ${shuffled.join(' så ')}?`
          break
        case 'random':
          sentence = `Bananas! Denne gangen starter vi med ${shuffled[0]} også velger ${shuffled[1]} hvem som er neste, hver gang! Spinnvilt, spør du meg.`
          break
        case 'backwards':
          let reversed = shuffled
          reversed = reversed.reverse()
          sentence = `Denne gangen går vi bakover! Det vil si ${reversed.join(' så ')}. Litt rart, men slik ble det i dag.`
          break
      }

      const onLoadingSentenceCompleted = () => {
        setTimeout(() => {
          this.sentence = sentence
          this.sentenceStyle = {}
          window.responsiveVoice.speak(this.sentence, this.operator.voice, { rate: this.voiceRate, pitch: this.operator.pitch })
          this.loading = false
        }, 1500)
      }

      let selectedLoadingSentence = this.fisherYates(this.loadingSentences)[0]
      this.sentence = selectedLoadingSentence.text || selectedLoadingSentence
      this.sentenceStyle = selectedLoadingSentence.style || {}
      window.responsiveVoice.speak(this.sentence, this.operator.voice, { rate: this.voiceRate, pitch: this.operator.pitch, onend: onLoadingSentenceCompleted })
    }
  }
}
</script>
<style scoped>
.spin {
  animation: 1.2s rotation infinite linear;
  position: absolute;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

</style>
