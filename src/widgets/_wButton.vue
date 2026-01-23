<script>

import _wBase from "./_wBase.vue"

export default {
  name: '_wButton',
  extends: _wBase,
  methods: {
    getIcon() {
      return typeof (this._icon) === 'function' ? this._icon() : (this.icon);
    },
    isDisabled() {
      return typeof (this._disabled) === 'function' ? this._disabled() : (this.disabled);
    },
    isLink() {
      return typeof (this._link) === 'function' ? this._link() : (this.link);
    },
  }
}
</script>
