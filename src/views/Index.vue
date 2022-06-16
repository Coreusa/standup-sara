<template>
  <b-container
    fluid
    class="vh-100"
    :class="operator && operator.name.toLowerCase() === 'shadow' ? 'bg-black text-light' : ''"
  >
    <b-row
      class="d-flex align-content-center justify-items-center"
    >
      <b-col
        sm="12"
        md="8"
        lg="6"
        class="align-content-center justify-items-center mx-auto"
      >
        <!-- Heading -->
        <div class="bg-light p-3 rounded mb-3">
          <div
            v-if="operator && operator.name.toLowerCase() === 'shadow'"
            class="glitch-wrapper"
          >
            <h1 class="glitch" data-text="̗̙̤̞͉̞̰̱̦̠͖̱̯̅̈́͐̈́̓̂̆̀̓͘̚ͅŞ̵̖̜̥̯͋ͅḩ̸̝̺̙̻͙͖͉͍̈́̋͛͌͊͂̊͆͗̅̊à̵̡̛͉̼͚̩̜̻̯͇͓͉͙̖̉̎̔̽̈͗͐̓̊͝͝͝͠ͅd̶̛̘̝͇̺̲͕͎͕͉̩̠̪̳̹͈̱͗̃̑͋͑̅͝o̵̡͈͚̟͕͉̝̰̬̖͗̇̓̔̔̋̽̂ͅw̴̙̤̱̜̣͙̥̗̞̙̜̗̞͒̀͜ͅ ̸̪̉e̸̱͖͖̼̟̤̊͋̆̃̑̃̓͒̃͛̒͑̈̚͝͠ȑ̴̢̜͓̦̇͑̓̀͋̃̄͝ ̸̡̢̦̱͎̪̫̞̤̠̹͚̣̞̗̔̒̚̚h̷̠̝̹̙͚̘̣̓̎̈́̓̏̔̄̆̐͘ͅḙ̸̡̛̭̩͔͓̹̮̳̅̑̓̓̋̿̑̓͒͘͝͝r̸̠̗͉̦̱̊͒̆̿̃͂̑́͑̈́̌͊̀̋͝"></h1>
          </div>
          <div v-else>
            <h1>Velkommen til Stand-up Land!</h1>
          </div>
        </div>
        <!-- Operator block -->
        <div
          class="p-3 rounded d-flex shadow hero position-relative"
          :class="operator && operator.name.toLowerCase() === 'shadow' ? 'bg-black' : 'bg-light'"
        >
          <div
            v-if="operator"
            :class="operator.class"
            class="operator position-absolute bottom-right"
          >
          </div>
          <b-col
            sm="12"
            md="7"
            class="d-flex align-items-center position-relative"
          >
            <div class="sentence">
              "{{ sentence }}"
            </div>
          </b-col>
        </div>
        <div class="d-flex justify-content-between align-items-center bg-light rounded mb-2 p-2">
          <b-btn
            @click="randomLoadingSentence()"
            variant="dark"
            :disabled="loading"
            size="sm"
            title="Ny agent"
            v-b-tooltip.hover
          >
            <font-awesome-icon
              icon="magic"
              class="mr-2"
            >
            </font-awesome-icon>
            Ny agent
          </b-btn>
          <b-form-checkbox
            v-model="modifiersEnabled"
            switch
          >
            Jeg prøver lykken
          </b-form-checkbox>
          <small>Versjon: {{ appVersion }}</small>
        </div>
        <b-row
          no-gutters
          class="bg-light px-3 pb-2 rounded"
        >
          <b-col
            v-if="!loading"
            class="mr-1 mt-4"
          >
            <h5>Hvem er med i dag?</h5>
            <div
              v-if="!users.length"
            >
              Ingen brukere lagt til.
            </div>
            <!-- Display available users to select -->
            <b-list-group
              v-if="users.length"
              class="user-list overflow-y-scroll"
            >
              <b-list-group-item
                v-if="users.length"
                :disabled="loading"
                class="d-flex"
              >
                <div
                  v-if="participantsSorted.length !== selectedParticipants.length"
                  @click="addAllUsers()"
                  class="text-green"
                >
                  Velg alle
                  <font-awesome-icon
                    icon="smile-beam"
                    class="ml-1"
                    spin
                  />
                </div>
                <div
                  v-if="selectedParticipants.length"
                  @click="removeAllUsers()"
                  class="text-red"
                >
                  Fjern alle
                  <font-awesome-icon
                    icon="times"
                    class="ml-1"
                  />
                </div>
              </b-list-group-item>
              <b-list-group-item
                v-for="(p, i) in participantsSorted"
                :key="`user-${i}`"
                :disabled="loading"
                @click="addUser(p, i)"
                class="bg-none text-dark"
              >
                {{ p }}
              </b-list-group-item>
            </b-list-group>
            <!-- Custom name block -->
            <div class="mt-3">
              <b-btn
                variant="dark"
                size="sm"
                :disabled="loading"
                @click="displayCustom = !displayCustom"
              >
                Legg til bruker
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
          </b-col>
          <!-- Selected users block -->
          <b-col
            v-if="!loading"
            class="mt-4"
          >
            <h5
              v-if="selectedParticipants.length"
              :class="[{
                'font-italic': selectedParticipants.length === users.length
              }]"
            >
              {{ selectedParticipants.length > 0 && selectedParticipants.length === users.length ? 'Alle er valgt' : `${selectedParticipants.length} valgt`}}
            </h5>
            <b-list-group
              v-if="selectedParticipants.length"
              class="user-list overflow-y-scroll"
            >
              <b-list-group-item
                v-if="selectedParticipants.length"
                @click="removeAllUsers()"
              >
                <div class="text-red">
                  <font-awesome-icon
                    class="mr-2"
                    icon="times"
                  />
                  Fjern alle
                </div>
              </b-list-group-item>
              <b-list-group-item
                v-for="(sp, si) in selectedParticipants"
                :key="`selected-user-${si}`"
                @click="removeParticipatingUser(sp, si)"
              >
                <div class="text-green">
                  <font-awesome-icon
                    class="mr-2"
                    icon="times"
                  />
                  {{ sp }}
                </div>
              </b-list-group-item>
            </b-list-group>
          </b-col>
        </b-row>
        <!-- Find user sequence block -->
        <b-col
          sm="12"
          class="text-center mt-3"
        >
          <div
            v-if="loading"
          >
            <span class="font-italic">
              {{ `${operator.name} tenker...` }}
            </span>
            <span class="spin">🤪</span>
          </div>
          <b-btn
            v-if="selectedParticipants.length > 1"
            class="mt-3"
            variant="success"
            size="lg"
            :disabled="loading === true"
            @click="selectRandom()"
          >
            {{ operator.name.toLowerCase() === 'shadow' ? 'Hack!' : `Hvem starter, ${operator.name}?` }}
            <font-awesome-icon
              icon="magic"
              spin
            />
          </b-btn>
        </b-col>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
// @ is an alias to /src
import Sentences from '@/assets/sentences.json'
import { mapGetters, mapActions } from 'vuex'
import Operators from '@/assets/operators.json'
import Functions from '@/core/Functions'
export default {
  name: 'home',
  data () {
    return {
      appVersion: require('../../package.json').version,
      selectedParticipants: [],
      displayCustom: false,
      customName: '',
      error: null,
      timeoutId: null,
      modifiersEnabled: false,
      sentence: 'Hei, alle sammen og velkommen til stand up!',
      introSentences: Sentences.intro,
      loadingSentences: Sentences.loading,
      addedSentences: Sentences.added,
      modifiers: Sentences.modifiers,
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
  created () {
    if (window.responsiveVoice) {
      window.responsiveVoice.enableWindowClickHook()
      window.responsiveVoice.enableEstimationTimeout = false
    }
  },
  mounted () {
    this.randomLoadingSentence()
  },
  computed: {
    ...mapGetters([
      'users'
    ]),
    participantsSorted () {
      // Avoid some unexpected side-effects.
      return this.users
    },
    selectedOperator () {
      if (this.operator) {
        return this.operator
      } else {
        return ''
      }
    },
    originalParticipants () {
      return this.users
    },
    operatorName () {
      if (this.operator) {
        return this.operator.name
      } else {
        return ''
      }
    }
  },
  methods: {
    ...mapActions([
      'storeUser',
      'removeAllUsers',
      'removeUser'
    ]),
    randomLoadingSentence () {
      const selectedIntro = Functions.shuffle(this.introSentences)[0]
      this.operator = Functions.randomEntry(this.operators)
      const operatorName = this.operator.name.toLowerCase()
      if (operatorName !== 'sonja') {
        if (operatorName === 'shadow') {
          const drive = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1).toUpperCase()
          this.sentence = `Endelig! Nå eier jeg PC-en din. Sletter ${drive} kolon....vent litt...`
        } else {
          this.sentence = `Alle er borte, så det er meg, ${this.operator.name}, som får herje!`
          this.sentence += ` ${selectedIntro}`
        }
      } else {
        this.sentence = selectedIntro
      }
      // Cancel any playing audio
      // window.responsiveVoice.cancel()
      window.setTimeout(() => {
        window.responsiveVoice.speak(this.sentence, this.operator.voice, { rate: this.voiceRate, pitch: this.operator.pitch })
      }, 1200)
    },
    speak () {
      if (window.responsiveVoice) {
        window.responsiveVoice.speak(this.sentence, this.operator.voice, { rate: this.voiceRate, pitch: this.operator.pitch })
      }
    },
    addCustomUser () {
      this.error = null
      if (!this.users.some(e => e.trim().toLowerCase() === this.customName.trim().toLowerCase())) {
        // Add only new users that don't already exist in user pool
        this.storeUser(this.customName)
      } else {
        this.error = 'Navnet finnes allerede.'
      }
    },
    addUser (user, index) {
      // this.participants.splice(index, 1)
      // this.removeUser(index)
      this.selectedParticipants.push(user)
      this.sentence = user + ' er lagt til.'
      let addedSentence = ''
      if (this.operator.name.toLowerCase() === 'shadow') {
        addedSentence = `Hacker ${user}. Skaaaal vi se. Der ja! Hacket og Eid! Lett.`
      } else {
        addedSentence = Functions.shuffle(this.addedSentences)[0].replace(/{name}/gi, user)
      }
      this.sentence = addedSentence
      this.speak()
    },
    addAllUsers () {
      this.selectedParticipants = this.users.concat(this.selectedParticipants)
      // this.removeAllUsers()
      // this.participants = []
      this.sentence = 'Søkke ta, hele oppdrettsanlegget er med!'
      this.speak()
    },
    removeParticipatingUser (user, index) {
      this.selectedParticipants.splice(index, 1)
      // this.storeUser(user)
      // this.participants.push(user)
      if (this.operator.name.toLowerCase() === 'shadow') {
        this.sentence = `${user} var ikke så interessant å hacke likevel.`
      } else {
        this.sentence = `${user} får ikke være med likevel.`
      }
      this.speak()
    },
    removeAllUsers () {
      // this.users = this.selectedParticipants.concat(this.participants)
      this.selectedParticipants = []
      this.sentence = 'Hæ, skal ingen være med?'
      this.speak()
    },
    selectRandom () {
      this.loading = true
      // Determine direction and order of users
      const turnType = Functions.shuffle(this.turnTypes)[0]
      const shuffled = Functions.shuffle(this.selectedParticipants)
      // const modifiersEnabled = (Math.random() * 100)
      let sentence = ''
      switch (turnType) {
        case 'direction':
          const direction = (Functions.randomNumber(2) % 2) ? 'med klokken' : 'mot klokken'
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
          sentence = `Denne gangen går vi bakover! Det vil si ${reversed.join(' så ')}. Litt rart, jaja.`
          break
      }

      if (this.modifiersEnabled === true) {
        let modifier = Functions.shuffle(this.modifiers)[0]
        sentence += `Vi gjør det litt annerledes i dag, nemlig ${modifier.type}! ${modifier.text}!`
      }
      const onLoadingSentenceCompleted = () => {
        setTimeout(() => {
          this.sentence = sentence
          window.responsiveVoice.speak(this.sentence, this.operator.voice, { rate: this.voiceRate, pitch: this.operator.pitch })
          this.loading = false
        }, 1000)
      }

      let selectedLoadingSentence = Functions.shuffle(this.loadingSentences)[0]
      this.sentence = selectedLoadingSentence
      try {
        window.responsiveVoice.speak(this.sentence, this.operator.voice, {
          rate: this.voiceRate,
          pitch: this.operator.pitch,
          onend: onLoadingSentenceCompleted,
          onerror: () => {
            this.loading = false
            this.sentence = sentence
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.spin {
  animation: 1.2s rotation infinite linear;
  position: absolute;
}

.hero {
  height: 250px;
}

.sentence {
  font-size: 1.2rem;
  /* min-height: 200px; */
}

.sentence::first-letter {
  color: #02A5E2;
  font-size: 4rem;
  font-weight: bold;
  margin-right: -1px;
  line-height: 1;
}

.overflow-y-scroll {
  overflow-y: scroll;
}

.user-list {
  max-height: 250px;
}

.user-list > div:hover {
  cursor: pointer;
  background: #eee;
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
