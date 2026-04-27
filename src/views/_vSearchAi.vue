<script>
import CrudHelpers from '../lib/CrudHelpers';
import _vRecord from './_vRecord.vue';
import _vSearch from './_vSearch.vue';


let finalText = '';

export default {
  name: "_vSearchAi",
  extends: _vSearch,
  emits: ['search'],
  data() {
    let supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    if (this.checkMicAccess().catch(err => {
      console.error('Errore di accesso al microfono:', err);
      supported = false;
    })) {
      supported = false;
    }
    let recognition = null;
    if (supported) {
      let lang = 'it-IT';
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;
      console.debug('recognition', recognition);
      recognition.onresult = (event) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript;
          } else {
            interim += transcript;
          }
        }
        text.value = finalText + (interim ? ' ' + interim : '');
      };
    }
    return {
      s_ai_query: '',
      isRecognizing: false,
      supported: supported,
      recognition: recognition,
      text: '',
      isRecognizing: false,
      finalText: '',
    }
  },

  methods: {
    searchAi() {
      console.log('searchAi', this.s_ai_query);
    },

    start() {
      console.debug('start');
      if (!this.recognition) return;
      this.finalText = this.text || '';
      try {
        console.debug('recognition.start');
        this.recognition.start();
        this.isRecognizing = true;
      } catch (e) {
        // start può lanciare se già avviato; ignora
        console.warn(e);
      }
    },
    stop() {
      if (!this.recognition) return;
      try {
        this.recognition.stop();
        this.isRecognizing = false;
      } catch (e) {
        console.warn(e);
      }
    },
    checkMicAccess() {
      // Contesto non sicuro: HTTPS richiesto (localhost è OK)
      if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        return Promise.reject(new Error('INSECURE_CONTEXT: HTTPS richiesto per accedere al microfono'));
      }

      // API non supportata
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return Promise.reject(new Error('NO_MEDIADEVICES: getUserMedia non supportato'));
      }

      // Prova a richiedere il microfono (chiedere permesso)
      return navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          // accesso consentito; rilascia stream se non serve tenerlo
          stream.getTracks().forEach(t => t.stop());
          return 'OK';
        })
        .catch(err => {
          // gestisci errori: NotAllowedError = permesso negato, NotFoundError = nessun mic, SecurityError = contesto/permessi
          throw err;
        });
    }
  }
}
</script>

<style lang="scss" scoped>

.panel-search-content-both {
  background-color: var(--primary-50);
}

.actionsDivider.p-divider-horizontal:before {
  border-color: var(--primary-100);
}

.actionsDivider {
  :deep(.p-tag) {
    background-color: var(--primary-50);
    color: var(--primary-color)
  }
}

.preSearch {
  width: 100%;
  text-align: center;
  margin-bottom: 2rem;

  :deep(.p-tag) {
    background-color: transparent;
    color: var(--primary-color);
    font-size: 0.95rem;
  }
}

.actionsButtons {
  :deep(.p-button-outlined) {
    border-color: var(--primary-400);
    color: var(--primary-400)
  }
}

label.labelTop {
  font-size: 12px;
  color: var(--surface-text);
  position: relative;
  top: -0.25rem;
  left: 0.25rem;
}


.panel-search-content {

  :deep(.p-accordion-header-text) {
    color: var(--primary-color);
  }

  :deep(.p-accordion-toggle-icon) {
    color: var(--primary-color);
  }

  :deep(.p-accordion-tab a) {
    background-color: white;
    padding: 1rem;
  }

  :deep(.p-accordion-header:hover) {

    //background-color: var(--primary-color);

    .p-panel-title {
      color: var(--primary-color);
    }

    .p-accordion-toggle-icon {
      color: var(--primary-color);
    }
  }


  //
  //.p-accordion-content {
  //    border-color: var(--primary-color);
  //}

  //.p-accordion-header {
  //    border-color: var(--primary-color);
  //}
}


</style>
