
<script>

import _wBase from "./_wBase.vue"

export default {
    name: '_wChip',
    extends : _wBase,
  methods : {
    add(event) {
      console.log('add event', event)
      this.change(event);
    },
    remove(event) {
      console.log('remove', event);
      this.change(event);
    },
  }
}
</script>
