<template>
<div class="row">
  <div class="col-12 mb-5">
    <h1>
    Velkommen til Stand-up Sara!
    </h1>
  </div>
  <div class="col-12 col-md-6 text-left">
    <h5>Hvem som er med i dag?</h5>
    <ul class="nav">
      <li
        v-for="(p, i) in participants"
        class="nav-item mr-2"
        :key="`participant-${i}`"
       >
        <span
          class="btn btn-primary btn-sm"
          @click="addUser(p, i)"
        >
          {{ p }}
        </span>
      </li>
    </ul>
  </div>
  <div class="col-12 col-md-6 text-left">
    <h5 v-if="selectedParticipants.length">Valgt</h5>
    <ul class="nav">
      <li
        v-for="(sp, si) in selectedParticipants"
        class="nav-item mx-1"
        :key="`selected-participant-${si}`"
      >
        <span
          class="btn btn-dark btn-sm"
          @click="removeUser(sp, si)"
        >
          <font-awesome-icon icon="times"></font-awesome-icon>
          {{ sp }}
        </span>
      </li>
    </ul>
  </div>
  <div
    class="col-12 mt-5"
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
    <div class="mt-5" v-if="selectedParticipants.length > 1">
      <b-btn
        variant="success"
        size="lg"
        @click="selectRandom()"
      >
          Hvem starter, Sara? <font-awesome-icon icon="magic"></font-awesome-icon>
       </b-btn>
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
      sentence: 'Hei, alle sammen og velkommen til stand up!',
      loading: false
    }
  },
  mounted () {
    window.responsiveVoice.speak('Hei, alle sammen og velkommen til stænd up!', 'Norwegian Female', { rate: 0.8 })
  },
  methods: {
    addUser (user, index) {
      this.participants.splice(index, 1)
      this.selectedParticipants.push(user)
    },
    removeUser (user, index) {
      this.selectedParticipants.splice(index, 1)
      this.participants.push(user)
    },
    selectRandom () {
      const randomIndex = [Math.floor(Math.random() * this.selectedParticipants.length)]
      const user = this.selectedParticipants[randomIndex]
      this.sentence = `La meg spinne tryllestaven min litt, så skal jeg finne ut av det!`
      window.responsiveVoice.speak(this.sentence, `Norwegian Female`, { rate: 0.9 })
      this.loading = true
      window.setTimeout(() => {
        const direction = (Math.floor(Math.random() * 2) % 2) ? 'med klokken' : 'mot klokken'
        this.sentence = `I dag tror jeg vi starter med ${user} og går ${direction}.`
        window.responsiveVoice.speak(this.sentence, `Norwegian Female`, { rate: 0.9 })
        this.loading = false
      }, 5000)
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
</style>
