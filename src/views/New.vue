<template>
  <b-container fluid>
    <b-row
      class="d-flex align-content-center justify-items-center"
    >
      <b-col
        sm="12"
        md="6"
        class="align-content-center justify-items-center mx-auto"
      >
        <h1 class="mb-5">Velkommen til Stand-up Sara!</h1>
        <div class="bg-light p-3 rounded d-flex shadow hero position-relative">
          <div
            v-if="operator"
            :class="operator.class"
            class="operator position-absolute bottom-right"
          >
            <!-- <div class="col-12 sara-dialogue text-center position-absolute">
              <div class="chat-bubble mt-2">
                <h3 class="mt-2">
                  <span :style="sentenceStyle">{{ sentence }}</span>
                  <span class="spin"></span>
                  <span v-if="loading">
                    <span class="spin">🤪</span>
                  </span>
                </h3>
              </div>
              <div class="app-version">
                Versjon <strong>{{ appVersion }}</strong>
              </div>
            </div> -->
          </div>
          <b-col
            sm="12"
            md="7"
            class="d-flex justify-content-center align-items-center"
          >
            <div class="sentence">
              <h4>
                "{{ sentence }}"
                <span class="spin"></span>
                <span v-if="loading">
                  <span class="spin">🤪</span>
                </span>
              </h4>
            </div>
          </b-col>
        </div>
        <b-col class="mt-4">
          <h5>Hvem er med i dag?</h5>
          <p v-if="!participants.length">
            Alle er valgt.
          </p>
          <b-btn
            v-for="(p, i) in participants"
            size="sm"
            variant="primary"
            class="mr-2"
            :key="`participant-${i}`"
            :disabled="loading"
            @click="addUser(p, i)"
          >
            {{ p }}
          </b-btn>
          <b-btn
            v-if="participants.length"
            size="sm"
            variant="success"
            class="mr-2"
            :disabled="loading"
            @click="addAllUsers()"
          >
            Alle!
            <font-awesome-icon
              icon="smile-beam"
              class="ml-1"
              spin
            >
            </font-awesome-icon>
          </b-btn>
        </b-col>
        <b-col v-if="!loading" class="mt-4">
          <h5 v-if="selectedParticipants.length">{{ `${selectedParticipants.length} valgt`}}</h5>
          <b-btn
            v-for="(sp, si) in selectedParticipants"
            class="mr-1"
            size="sm"
            variant="dark"
            :key="`selected-participant-${si}`"
            @click="removeUser(sp, si)"
          >
            {{ sp }}
            <font-awesome-icon icon="times"></font-awesome-icon>
          </b-btn>
          <b-btn
            v-if="selectedParticipants.length"
            size="sm"
            variant="danger"
            @click="removeAllUsers()"
          >
            Fjern alle
          </b-btn>
        </b-col>
        <b-col
          sm="12"
          class="text-center mt-3"
        >
          <b-btn v-if="selectedParticipants.length > 1" class="mt-2" variant="success" size="lg" :disabled="loading === true" @click="selectRandom()">
            Hvem starter, Sara? <font-awesome-icon icon="magic"></font-awesome-icon>
          </b-btn>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
// @ is an alias to /src
import Participants from '@/assets/users.json'
import Sentences from '@/assets/sentences.json'
import Operators from '@/assets/operators.json'
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
      introSentences: Sentences.intro,
      loadingSentences: Sentences.loading,
      addedSentences: Sentences.added,
      operators: Operators,
      loading: false,
      voiceRate: 0.9,
      pitch: 1.0,
      operator: null,
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
    this.operator = this.randomOperator(this.operators)
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
    },
    originalParticipants () {
      return Participants
    }
  },
  watch: {
    // Look for changes in sentence, and speak them
    sentence (d) {
      window.responsiveVoice.speak(this.sentence, this.operator.voice, { rate: this.voiceRate, pitch: this.operator.pitch })
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
    randomOperator (input) {
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
      this.sentence = user + ' er lagt til.'
      const addedSentence = this.fisherYates(this.addedSentences)[0].replace(/{name}/gi, user)
      this.sentence = addedSentence
    },
    addAllUsers () {
      this.selectedParticipants = this.participants.concat(this.selectedParticipants)
      this.participants = []
      this.sentence = 'Søkke ta, hele oppdrettsanlegget er med!'
    },
    random (max = 10) {
      // TODO: Invalid when max is 1
      return ~~(Math.random() * max) + 1
    },
    removeUser (user, index) {
      this.selectedParticipants.splice(index, 1)
      this.participants.push(user)
      this.sentence = `${user} får ikke være med likevel.`
    },
    removeAllUsers () {
      this.participants = this.selectedParticipants.concat(this.participants)
      this.selectedParticipants = []
      this.sentence = 'Hæ, skal ingen være med?'
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

.hero {
  min-height: 30vh;
}

.sentence::first-letter {
  color: #02A5E2;
  font-size: 4rem;
  font-weight: bold;
}

/* .sentence::before {
  content: '"';
  font-size: 8rem;
  position: absolute;
  top: -6%;
  left: -3%;
  color: #ddd;
} */

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(359deg);
  }
}

</style>
