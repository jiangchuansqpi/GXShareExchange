<template>
  <div id="map" class="map" />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { MapClass } from '@/map'
@Component({
  name: 'MapInit'
})
export default class MapInit extends Vue {
  mounted () {
    const map = new MapClass()
    map.dataSource()
  }
}
</script>

<style lang="scss" scoped>
.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
