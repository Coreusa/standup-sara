  <template>
<div class="row no-gutters mx-auto">
  <div class="col-12 mb-5">
    <h1>
    Velkommen til Stand-up Sara!
    </h1>
  </div>
  <b-card class="col-12 col-md-5 bg-light text-left">
    <h5>Hvem som er med i dag?</h5>
      <b-btn
        v-for="(p, i) in participantsSorted"
        size="sm"
        variant="primary"
        class="mb-2 mr-2"
        :key="`participant-${i}`"
        @click="addUser(p, i)"
      >
        {{ p }}
      </b-btn>
    <div class="mt-3">
      <b-btn
        variant="dark"
        size="sm"
        @click="displayCustom = !displayCustom"
      >
        Egendefinert
      </b-btn>
      <b-input-group
        v-if="displayCustom"
        size="sm"
        class="text-right mt-2"
      >
        <b-input
          v-model="customName"
          placeholder="Navn..."
          :state="customName.length > 1"
        >
        </b-input>
        <b-input-group-append>
          <b-btn
            variant="success"
            @click="addCustomUser()"
          >
            Legg til
          </b-btn>
        </b-input-group-append>
      </b-input-group>
      <b-alert
        :show="error"
        size="sm"
        variant="danger"
      >
        {{ error }}
      </b-alert>
    </div>
  </b-card>
  <b-card class="col-12 col-md-5 offset-md-2 text-left">
    <h5 v-if="selectedParticipants.length">Valgt</h5>
      <font-awesome-icon
        v-if="loading"
        icon="circle-notch"
        spin
      >
      </font-awesome-icon>
      <div v-else>
        <b-btn
          v-for="(sp, si) in selectedParticipants"
          class="mx-1"
          size="sm"
          variant="dark"
          :key="`selected-participant-${si}`"
          @click="removeUser(sp, si)"
        >
          {{ sp }}
          <font-awesome-icon icon="times"></font-awesome-icon>
        </b-btn>
      </div>
  </b-card>
  <div class="col-12 text-center">
    <b-btn
      v-if="selectedParticipants.length > 1"
      class="mt-2"
      variant="success"
      size="lg"
      :disabled="loading === true"
      @click="selectRandom()"
    >
        Hvem starter, Sara? <font-awesome-icon icon="magic"></font-awesome-icon>
     </b-btn>
  </div>
  <div
    class="col-12 sara-dialogue position-absolute"
  >
    <div class="chat-bubble mt-2">
      <h3 class="mt-2">
        {{ sentence }}
        <font-awesome-icon
          v-if="loading"
          icon="circle-notch"
          spin
        >
        </font-awesome-icon>
      </h3>
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
        'Har du noen gang sett en oter? Jeg har sett ' + Math.ceil(Math.random() * 50) + '.',
        'I Russland har de et monument til minne om labrotter.',
        'Visste du at Volkswagen ble dannet av Hitler? Rare greier.',
        'Hvor ble det av samleplatene med pan flute moods?',
        'Oi, oi oi! I dag var det mange flotte klesplagg!',
        'Dans, dans, dans oppå bordet. Legg deg ned, på gølvet.',
        'Jeg kan over ' + Math.ceil(Math.random() * 10000) + ' uttrykk!',
        'Å nei! Jeg har mistet tryllestaven min! Neida. Jeg bare tullet.',
        'Jeg tror det er meldt sol og litt skyer i dag. Jaja, det stopper ikke stænd up!'
      ],
      loadingSentences: [
        'La meg spinne tryllestaven min litt, så skal jeg finne ut av det!',
        'Skal vi se! Jeg legger til litt her, trekker fra der. Ok, sånn!',
        'Denne er kjempelett! Klarer du å gjette rekkefølgen?',
        'Visste du at Robert Kearns oppfant vindusviskeren? Jeg sporet av litt, sårri.',
        'Da legger jeg navnene inn i snurremaskinen. Weeeee, rundt og rundt. Spennende.',
        'Hmm. Jeg blir ikke helt enig med meg selv. Kanskje han skal starte...eller henne?',
        'Denne var litt tricky! Her må jeg frem med matteboken, vent litt!',
        'Lottotrekning!',
        'Denne må jeg tenke litt på. Tvinne tomler. Tvinne tomler. Tvinne tomler. Ok, har det!',
      ],
      loading: false,
      voiceRate: 0.9,
      pitch: 1.0,
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
    let selectedIntro = this.fisherYates(this.introSentences)[0]
    this.sentence = selectedIntro
    window.setTimeout(() => {
      window.responsiveVoice.speak(this.sentence, this.voice, { rate: this.voiceRate, pitch: this.pitch })
    }, 1500)
  },
  computed: {
    participantsSorted () {
      // Avoid some unexpected side-effects.
      let temp = this.participants
      temp = temp.sort((a, b) => a.toLowerCase() > b.toLowerCase())
      return temp
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

      let selectedLoadingSentence = this.fisherYates(this.loadingSentences)[0]
      this.sentence = selectedLoadingSentence
      window.responsiveVoice.speak(this.sentence, this.voice, { rate: this.voiceRate, pitch: this.pitch })

      window.setTimeout(() => {
        this.sentence = sentence
        window.responsiveVoice.speak(this.sentence, this.voice, { rate: this.voiceRate, pitch: this.pitch })
        this.loading = false
      }, 7000)
    }
  }
}
</script>
<style scoped>
.chat-bubble {
  position: relative;
  padding: 15px;
  width: 50%;
  margin: 0 0 0 40%;
  border: 5px solid #5a8f00;
  color: #333;
  background: #fff;
  border-radius: 10px;
}
.chat-bubble::before {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 90%;
  border-width: 20px 20px 0;
  border-style: solid;
  border-color: #5a8f00 transparent;
  display: block;
  width: 0;
}
.chat-bubble::after {
  content: "";
  position: absolute;
  bottom: -13px;
  left: 91%;
  border-width: 13px 13px 0;
  border-style: solid;
  border-color: #fff transparent;
  display: block;
  width: 0;
}
.sara-dialogue {
  bottom: 30vh;
  right: 0;
}
</style>
